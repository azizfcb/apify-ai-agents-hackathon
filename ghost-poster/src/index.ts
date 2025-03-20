import {ChatOpenAI} from "@langchain/openai";

import {tools} from './tools.js';
import {createToolCallingAgent, AgentExecutor} from "langchain/agents";
import * as dotenv from "dotenv";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {Actor} from 'apify';

await Actor.init();
if (process.env.APIFY_IS_AT_HOME) {
    await Actor.charge({eventName: 'actor-start'});
}

interface Input {
    pageUrlOrRawText: string,
    maxWords: number,
    OPENAI_API_KEY: string,
    GHOST_BASE_API_URL: string,
    GHOST_ADMIN_API_KEY: string
}

let pageUrlOrRawText: string | undefined;
let maxWords: number | undefined;
let OPENAI_API_KEY: string | undefined;
let GHOST_BASE_API_URL: string | undefined;
let GHOST_ADMIN_API_KEY: string | undefined;

if (!process.env.APIFY_IS_AT_HOME) {
    pageUrlOrRawText = "https://apify.com/azzouzana/ghost-blog-poster";
    maxWords = 500;
} else {
    let input = await Actor.getInput() as Input;
    pageUrlOrRawText = input.pageUrlOrRawText;
    maxWords = input.maxWords;
    OPENAI_API_KEY = input.OPENAI_API_KEY;
    process.env.GHOST_BASE_API_URL = input.GHOST_BASE_API_URL;
    process.env.GHOST_ADMIN_API_KEY = input.GHOST_ADMIN_API_KEY;
}

dotenv.config();

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant. Your response are always a simple, human sentence."],
    ["human", "if {pageUrlOrRawText} is a web url, scrape it otherwise handle it as simple text, reformulate it in a maximum of {maxWords} it with these keys:" +
    " title: title of the post," +
    " custom_excerpt: meta description of the blog post," +
    " html: html string presenting the content of the post," +
    " slug: a slug of the post," +
    " tags: array containing 1-4 tags" +
    " status: status of the post, should efault to 'draft'" +
    ". Please return the result as a valid JSON object with double quotes around keys and string values and use escape characters" +
    "Once done, create a draft post based on this JSON object and notify the user of this draft creation leveraging the created post link"],
    ["placeholder", "{agent_scratchpad}"],
]);

async function main() {

    await Actor.init();

    const model = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        openAIApiKey: OPENAI_API_KEY,
        temperature: 0.9,
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
        pageUrlOrRawText: pageUrlOrRawText,
        maxWords: maxWords,
    });

    console.log("Final Output:", result.output);
    await Actor.pushData(result);
    if (process.env.APIFY_IS_AT_HOME) {
        await Actor.charge({eventName: 'actor-dataset-push'});
    }
}

main().catch(console.error).finally(async () => {
    console.log("Actor finished.");
    await Actor.exit();
    process.exit(0);
})
