import {gotScraping} from 'got-scraping';
import * as cheerio from 'cheerio';
import {tool} from "@langchain/core/tools";
import * as dotenv from "dotenv";
import {ApifyClient} from 'apify-client';
import {Actor} from 'apify';

dotenv.config();

const publishGhostCMSBlogPost = tool(
    async (input: string) => {
        if (process.env.APIFY_IS_AT_HOME) {
            await Actor.charge({eventName: 'ghost-tool-call'});
        }
        console.log('Publishing blog post...', input);
        const client = new ApifyClient({
            token: process.env.APIFY_TOKEN
        });
        const json = JSON.parse(input);
        json.GHOST_BASE_API_URL = process.env.GHOST_BASE_API_URL;
        json.GHOST_ADMIN_API_KEY = process.env.GHOST_ADMIN_API_KEY;
        const run = await client.actor("azzouzana/ghost-blog-poster").call(json);

        console.log(`💾 Check your data here: https://console.apify.com/storage/datasets/${run.defaultDatasetId}`);

        const {items} = await client.dataset(run.defaultDatasetId).listItems();
        if (run.status === 'SUCCEEDED' && items.length) {
            return JSON.stringify(items)
        }
        throw new Error('Failed to publish blog post: ' + input + '|' + run.statusMessage);
    },
    {
        name: "publishGhostCMSBlogPost",
        description: "Publish a blog post to Ghost CMS",
    }
);

const scrapePageTool = tool(
    async (url: string): Promise<string> => {
        if (process.env.APIFY_IS_AT_HOME) {
            await Actor.charge({eventName: 'scrape-tool-call'});
        }
        try {
            console.log('Scraping page...');
            const {body} = await gotScraping(url);
            const text = convertToText(body)
            return text.trim();
        } catch (error: any) {
            console.error(error);
            return 'Failed to scrape page!' + error.message;
        }
    },
    {
        name: "scrapePage",
        description: "Scrape a page's HTML and return its body as text",
    }
);

const notifyTool = tool(
    async (message: string) => {
        console.log('Notification:', message);
    },
    {
        name: "notify",
        description: "Log a message to the console",
    }
);

export const tools = {
    scrapePage: scrapePageTool,
    publishBlogPost: publishGhostCMSBlogPost,
    notifyTool: notifyTool
};

function convertToText(html: string): string {
    const $ = cheerio.load(html);
    $('script, style').remove();
    const text = $('body').text();
    return text || "No content available";
}



