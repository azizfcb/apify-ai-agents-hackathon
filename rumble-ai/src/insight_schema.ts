export const InsightsSchema = `
(
    "commentsAnalysis": (
        "comment_sentiments": (
            "positive": "number",
            "neutral": "number",
            "negative": "number"
        ),
        "topComments": [
            (
                "user": "string",
                "comment": "string",
                "score": "number",
                "sentiments": "'positive' | 'neutral' | 'negative'"
            )
        ]
    ),
    "revenueAnalysis": (
        "totalRevenue": "number",
        "averageRevenuePerVideo": "number",
        "videosWithHighestRevenue": [ // 3 videos at most
            (
                "title": "string",
                "revenue": "number",
                "videoUrl": "string"
            )
        ]
    ),
    "videoOverAllStatistics": (
        "totalViews": "number",
        "totalLikes": "number",
        "totalDislikes": "number",
        "totalComments": "number",
        "averageCommentsPerVideo": "number",
        "averageLikesPerVideo": "number",
        "averageDuration": "string"
    ),
    "topVideos": [ // 3 at most
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
        )
    ],
    "topTopics": [ // try to identify a 3 detailed topic based on the top videos attributes
        (
            "topic": "string",
            "views": "number",
            "likes": "number",
            "dislikes": "number",
            "comments_count": "number"
        )
    ],
    "topChannelAnalysis": [ // Users/channels who posted the video. 3 at most
        (
        "followers": "number",
        "members": "number",
        "url": "string",
        "name": "string",
        "isVerified": "boolean",
        "views": "number"
        )
    ]
)
`;
