// create async function that I'll export in typescript: post article to ghost & fetch posts lists (in valid typescript)
import {tool} from "@langchain/core/tools";
import * as dotenv from "dotenv";
import {ApifyClient} from 'apify-client';
import {Actor} from 'apify';

dotenv.config();

const scrapeRumblePages = tool(
    async (rumbleUrls: string) => {
        if (!process.env.APIFY_IS_AT_HOME) {
            await Actor.charge({eventName: 'rumble-tool-call'});
        }

        const client = new ApifyClient({
            token: process.env.APIFY_TOKEN,
        });

        const query = {
            "startUrls": JSON.parse(rumbleUrls)
        }

        const actorRun = await client.actor('azzouzana/rumble-all-inclusive-scraper').call(query);
        console.log(actorRun.statusMessage);
        const {items} = await client.dataset(actorRun.defaultDatasetId).listItems();
        if (actorRun.status === 'SUCCEEDED' && items.length) {
            return JSON.stringify(items)
        }
        throw new Error('Failed to scrape rumble page: ' + rumbleUrls + '|' + actorRun.statusMessage);
    },
    {
        name: "scrapeRumblePagesList",
        description: "Accepts a simple js array of rumble urls, scrape them in one go and return the results as a JSON string",
    }
);

export const tools = {
    scrapeRumblePage: scrapeRumblePages
};



