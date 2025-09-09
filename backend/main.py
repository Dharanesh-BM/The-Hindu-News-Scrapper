import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
import markdown
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class HinduNewsScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

    def scrape_latest_news(self):
        """Scrape the latest news article from The Hindu"""
        try:
            # creating session for main page
            homepage_url = "https://www.thehindu.com/topic/live-news/" #used live-news page to get the latest news which is live
            response = self.session.get(homepage_url)
            response.raise_for_status()
            homepage_html = response.text

            # latest article link extraction
            soup = BeautifulSoup(homepage_html, 'html.parser')
            article_link_element = soup.select_one('div.col-xl-6.col-lg-5.after-border-right div.element.main-row-element h3 > a[href]')

            if not article_link_element:
                raise Exception("Could not find latest article link")

            article_url = article_link_element.get('href')
            if not article_url.startswith('http'):
                article_url = 'https://www.thehindu.com' + article_url

            #getting the article page and extracting them
            article_response = self.session.get(article_url)
            article_response.raise_for_status()
            article_html = article_response.text
            article_soup = BeautifulSoup(article_html, 'html.parser')

            # headline
            headline_element = article_soup.select_one('h1[itemprop="name"]')
            headline = headline_element.get_text(strip=True) if headline_element else "No headline found"

            # main content
            main_content_element = article_soup.select_one('div[itemprop="articleBody"]')
            main_content = main_content_element.get_text(strip=True) if main_content_element else "No content found"

            # author
            author_element = article_soup.select_one('.author-name, .byline')
            author = author_element.get_text(strip=True) if author_element else "Unknown author"

            # date
            date_element = article_soup.select_one('body > section.mt-4 > div > div > div.col-xl-9.col-lg-8.col-md-12.col-sm-12.col-12.event > div.update-publish-time > p > span')
            date = date_element.get_text(strip=True) if date_element else "Unknown date"

            # expanded content (for future use if needed)
            expanded_content_element = article_soup.select_one('.articlebodycontent, .story-element-text')
            expanded_content = expanded_content_element.get_text(strip=True) if expanded_content_element else ""

            return {
                "headline": headline,
                "main_content": main_content,
                "author": author,
                "date": date,
                "expanded_content": expanded_content,
                "url": article_url
            }

        except Exception as e:
            print(f"Error scraping news: {e}")
            return None

    def reframe_with_gemini(self, headline, content, api_key):
        """Use Gemini API to reframe the news article"""
        try:
            url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }

            prompt = f"""Transform this formal news article into a casual, conversational style. Make the headline engaging and informal. The headline should contain brief information of the news. Rewrite the entire content to be user-friendly while keeping all important facts.

                Article Headline:
                {headline}

                Article Content:
                {content}

                Please provide the output STRICTLY in a valid JSON format with exactly two keys: "headline_reframed" and "content_reframed"."""

            payload = {
                "model": "gemini-2.5-flash", 
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "max_tokens": 3000,
                "temperature": 0.7
            }

            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()

            # response parsing
            result = response.json()
            raw_content = result['choices'][0]['message']['content']

            # removing markdown
            cleaned_content = re.sub(r'^```json\s*', '', raw_content)
            cleaned_content = re.sub(r'\s*```$', '', cleaned_content)

            # Parsing JSON
            parsed_data = json.loads(cleaned_content)

            return parsed_data

        except Exception as e:
            print(f"Error with Gemini API: {e}")
            return None

    def markdown_to_html(self, markdown_text):
        """Convert markdown to HTML"""
        return markdown.markdown(markdown_text)

    def generate_response(self, headline_reframed, content_reframed):
        """Generate the final response in the same format as the n8n workflow"""
        content_html = self.markdown_to_html(content_reframed)

        return {
            "success": True,
            "news": {
                "headline": headline_reframed,
                "content": content_html,
                "timestamp": datetime.now().isoformat()
            }
        }

#scrapper initalization
scraper = HinduNewsScraper()

@app.route('/api/scrape-news', methods=['GET'])
def scrape_news_endpoint():
    """API endpoint to scrape and reframe news"""
    try:
        # Get API key from environment
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            return jsonify({
                "success": False,
                "error": "Gemini API key not configured"
            }), 500

        # Step 1 - Scrape the latest news
        print("Scraping latest news...")
        news_data = scraper.scrape_latest_news()

        if not news_data:
            return jsonify({
                "success": False,
                "error": "Failed to scrape news"
            }), 500

        print(f"Found article: {news_data['headline']}")

        # Step 2 - Reframe the content with Gemini
        print("Reframing content with Gemini...")
        reframed_data = scraper.reframe_with_gemini(
            news_data['headline'],
            news_data['main_content'],
            api_key
        )

        if not reframed_data:
            return jsonify({
                "success": False,
                "error": "Failed to reframe content"
            }), 500

        # Step 3 - Generate the final response
        final_response = scraper.generate_response(
            reframed_data['headline_reframed'],
            reframed_data['content_reframed']
        )

        return jsonify(final_response)

    except Exception as e:
        print(f"Error in API endpoint: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Hindu News Scraper API is running"
    })

@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    return jsonify({
        "name": "Hindu News Scraper API",
        "version": "1.0.0",
        "endpoints": {
            "/api/scrape-news": "GET - Scrape and reframe latest news",
            "/api/health": "GET - Health check"
        }
    })

if __name__ == "__main__":
    print("Starting Hindu News Scraper API...")
    print("Available endpoints:")
    print("  GET /api/scrape-news - Scrape and reframe latest news")
    print("  GET /api/health - Health check")
    print("  GET / - API information")

    app.run(host='0.0.0.0', port=5000, debug=True)
