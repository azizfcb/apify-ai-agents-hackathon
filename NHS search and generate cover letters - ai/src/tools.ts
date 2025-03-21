import {tool} from "@langchain/core/tools";
import * as dotenv from "dotenv";
import {ApifyClient} from 'apify-client';
import {Actor} from 'apify';

dotenv.config();

const scrapeNHSSearchPages = tool(
    async (nhsSearchPageUrl: string) => {
        if (!process.env.APIFY_IS_AT_HOME) {
            await Actor.charge({eventName: 'search-tool-call'});
        }

        const client = new ApifyClient({
            token: process.env.APIFY_TOKEN,
        });

        const query = {
            "startUrl": nhsSearchPageUrl
        }

        const actorRun = await client.actor('azzouzana/apify-scrapers').call(query);
        console.log(actorRun.statusMessage);
        const {items} = await client.dataset(actorRun.defaultDatasetId).listItems();
        if (actorRun.status === 'SUCCEEDED' && items.length) {
            return JSON.stringify(items);
        }
        throw new Error('Failed to scrape nhs page: ' + nhsSearchPageUrl + '|' + actorRun.statusMessage);
    },
    {
        name: "scrapeNHSSearchPages",
        description: "Accepts a nhsSearchPageUrl url & scrapes it, returning the results as a JSON string. The expected url must be a search page from the NHS website: respecting this format: https://www.jobs.nhs.uk/candidate/search/...",
    }
);

export const tools = {
    scrapeNHSSearchPages: scrapeNHSSearchPages
};



