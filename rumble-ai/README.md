# Rumble Videos Insights AI Agent
This AI agent is designed to provide insights on videos from the Rumble Videos dataset, by leveraging the powerful [Rumble All-Inclusive Scraper](https://apify.com/azzouzana/rumble-all-inclusive-scraper)

The agent uses gpt-4o-mini model, and it expects a valid OPENAI API key to be set in the environment variable `OPENAI_API_KEY`.

## Input
The agent has two inputs:
- `url`: (required): directs videos URLs and/or editor links and/or trending pages as input
- `query`: (optional): a custom query used to generate insights. If not set, the agent will generate insights based on the default insights schema detailed described below.

Note that this was developed as a part of Apify AI agents hackathon.

## Default Insights Schema
If `query` is not set, the agent will generate insights based on the following schema:

```json
{
  "commentsAnalysis": {
    "comment_sentiments": {
      "positive": "number",
      "neutral": "number",
      "negative": "number"
    },
    "topComments": [
      {
        "user": "string",
        "comment": "string",
        "score": "number",
        "sentiments": "'positive' | 'neutral' | 'negative'"
      }
    ]
  },
  "revenueAnalysis": {
    "totalRevenue": "number",
    "averageRevenuePerVideo": "number",
    "videosWithHighestRevenue": [
      {
        "title": "string",
        "revenue": "number",
        "videoUrl": "string"
      }
    ]
  },
  "videoOverAllStatistics": {
    "totalViews": "number",
    "totalLikes": "number",
    "totalDislikes": "number",
    "totalComments": "number",
    "averageCommentsPerVideo": "number",
    "averageLikesPerVideo": "number",
    "averageDuration": "string"
  },
  "topVideos": [
    {
      "videoUrl": "string",
      "title": "string",
      "views": "number",
      "likes": "number",
      "dislikes": "number",
      "comments_count": "number",
      "publishedAt": "string",
      "thumbnail": "string",
      "isStreaming": "boolean",
      "repost": "number",
      "embedUrl": "string"
    }
  ],
  "topTopics": [
    {
      "topic": "string",
      "views": "number",
      "likes": "number",
      "dislikes": "number",
      "comments_count": "number"
    }
  ],
  "topChannelAnalysis": [
    {
      "followers": "number",
      "members": "number",
      "url": "string",
      "name": "string",
      "isVerified": "boolean",
      "views": "number"
    }
  ]
}
