# Automate your Ghost CMS blogging using AI!

This agent allows you to create a new post in your Ghost CMS blog using AI (V4). The actor uses the OpenAI GPT-4o-mini model to transform or summarize a given input source and uses the 🔗 [Ghost Blog Poster on Apify](https://apify.com/azzouzana/ghost-blog-poster) tool 🚀.

To operate the agent, you need to:

- Set up the required environment variables for `ghost-blog-poster` **before** running the actor:
    - `GHOST_BASE_API_URL`: The base API URL of your Ghost blog (Format: `https://your-blog-domain/ghost/api/v4`).
    - `GHOST_ADMIN_API_KEY`: The admin API key for your Ghost blog, which can be found or created in the Ghost admin panel under **Integrations** (Format: `xxxxx:yyyyy`).
- Set your `OPENAI_API_KEY` in the agent's input.

## Input

The actor expects the following inputs:

- `pageUrlOrRawText` - string - the URL of the page or the raw text/HTML to summarize/reformulate
- `maxWords` - number - the maximum number of words to generate. Default is `500`

Note that the blog post would be saved as a `draft` by default.

## Output

Successful post creation will return a similar output:
`A draft post has been created successfully. You can view it [here](https://your-blog-domain/p/e9ff44d6-ffe6-4ef2-9e11-6787e50c407f/).`

## Pricing

The actor uses the Pay-Per-Event pricing model, detailed below:

- `actor-start` - Price for Actor start: $0.02
- `ghost-tool-call` - Flat fee for calling ghost CMS tool: $0.03
- `scrape-tool-call` - Flat fee for scraping a page: $0.03
- `actor-dataset-push` - Price for making a Ghost API call: $0.02

## Updates

Please note that this tool is in its early stages and might not cover all the features of automated blog creation using AI. If you need more features, please contact us or create an issue. Thank you, and happy blogging! 😊
We'll be adding support for more CMS platforms soon (WordPress, Ghost V5, Wix, and more). Stay tuned! 🚀
