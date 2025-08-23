export const agents = [
  {
    id: "instagram",
    name: "Instagram Scraper",
    description:
      "Scrapes Instagram data such as posts, followers, hashtags, and engagement metrics using n8n. Ideal for marketing insights and trend analysis.",
    apiEndpoint: "/agents/instagram",
    webhookUrl: "https://backend.fawks.ai/webhook/instagram-scraper",
    icon: "/icons/instagram-logo.png",
  },
  {
    id: "twitter",
    name: "Twitter Keyword Monitor",
    description: "Track tweets containing specific keywords or hashtags",
    apiEndpoint: "https://your-n8n-domain.com/webhook/twitter-monitor",
    icon: "/icons/twitter-logo.png",
  },
  {
    id: "youtube",
    name: "YouTube Video Data Extractor",
    description: "Fetch video stats, titles, and transcripts",
    apiEndpoint: "https://your-n8n-domain.com/webhook/youtube-extractor",
    icon: "/icons/youtube-logo.png",
  },
  {
    id: "price-tracker",
    name: "E-commerce Price Tracker",
    description: "Monitor product price changes and send alerts",
    apiEndpoint: "https://your-n8n-domain.com/webhook/price-tracker",
    icon: "/icons/price-tag.png",
  },
  {
    id: "news",
    name: "News Aggregator",
    description: "Get latest headlines from multiple sources",
    apiEndpoint: "https://your-n8n-domain.com/webhook/news-aggregator",
    icon: "/icons/news.png",
  },
];
