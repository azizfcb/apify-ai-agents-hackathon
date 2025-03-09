import {ChatOpenAI} from "@langchain/openai";

import {tools} from './tools.js';
import {InsightsSchema} from "./insight_schema.js";
import {createToolCallingAgent, AgentExecutor} from "langchain/agents";
import * as dotenv from "dotenv";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {Actor} from 'apify';

await Actor.init();

interface Input {
    urls: string;
    query?: string;
}

let {
    urls, // only works with videos: so it accepts direct videos URL and/or trending/editor picks pages which list videos
    query
} = await Actor.getInput() as Input;

dotenv.config();

if (!process.env.OPENAI_API_KEY || !process.env.APIFY_TOKEN) {
    throw new Error("Please provide OPENAI_API_KEY and APIFY_TOKEN in your environment variables");
    process.exit(1);
}

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant. Your response are always valid JSON object with double quotes around keys and string values and use escape characters with no prefix at all"],  // System message defining the assistant's behavior
    ["human", `Given an array of rumble pages: {urls}, scrape them in one go using the rumble scraping tool, ` + (query ? 'with this query: ' + query : "analyze the result and generate useful insights. Your analysis must match this format:" + InsightsSchema + ".") +
    "If an error happens, just return the error message."],
    ["placeholder", "{agent_scratchpad}"],
]);

async function main() {

    const model = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0.7,
    });

    const agent = await createToolCallingAgent({
        llm: model,
        tools: [...Object.values(tools)],
        prompt
    });

    const agentExecutor = new AgentExecutor({
        maxIterations: 5,
        agent,
        tools: [...Object.values(tools)],
    });

    const result = await agentExecutor.invoke({
        urls: urls,
    });
    try {
        result.output = JSON.parse(result.output)
    } catch (e) {

    }
    console.log("Final Output:", result.output);
    await Actor.pushData(result);
    if (!process.env.APIFY_IS_AT_HOME) {
        await Actor.charge({eventName: 'task-completed'});
    }
}

main().then(() => {
    console.log("Actor finished.");
    process.exit(0);
}).catch((error) => {
    console.error("Actor failed:", error);
    process.exit(1);
})
