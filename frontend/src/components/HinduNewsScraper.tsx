import React, { useState } from 'react';

interface FinalResponse {
  success: boolean;
  news: {
    headline: string;
    content: string;
    timestamp: string;
  };
}

const HinduNewsScraper: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [finalResponse, setFinalResponse] = useState<FinalResponse | null>(null);
  const [error, setError] = useState<string>('');

  // Fetch news from backend API
  const fetchLatestNews = async (): Promise<FinalResponse | null> => {
    try {
      // Replace the below IP with your machine IP - backend connection
      const response = await fetch('http://192.168.29.226:5000/api/scrape-news', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch news');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  };

  const handleScrapeAndReframe = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Call backend API directly
      console.log("Fetching latest news from backend...");
      const response = await fetchLatestNews();

      if (!response) {
        setError('Failed to fetch news from backend');
        return;
      }

      setFinalResponse(response);

    } catch (error) {
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">News Intelligence</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">          
          <button
            onClick={handleScrapeAndReframe}
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isLoading ? 'Fetching News...' : 'Fetch Latest News'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error occurred</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Article Display */}
        {finalResponse && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              {/* Article Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Latest Article</h2>
                  <time className="text-sm text-gray-500">
                    {new Date(finalResponse.news.timestamp).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </time>
                </div>
              </div>
              
              {/* Article Content */}
              <article className="px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-6 sm:text-4xl text-left">
                  {finalResponse.news.headline}
                </h1>
                
                <div className="prose prose-lg max-w-none text-left">
                  <div 
                    className="text-gray-700 leading-relaxed text-left [&>p]:mb-4 [&>p]:text-left [&>strong]:text-gray-900 [&>strong]:font-semibold [&>em]:italic"
                    dangerouslySetInnerHTML={{ __html: finalResponse.news.content }}
                  />
                </div>
              </article>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!finalResponse && !error && !isLoading && (
          <div className="text-center py-12 max-w-md mx-auto">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No articles loaded</h3>
            <p className="mt-1 text-sm text-gray-500">Click "Fetch Latest News" to load the latest article from The Hindu.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HinduNewsScraper;