import {ChatOpenAI} from "@langchain/openai";

import {tools} from './tools.js';
import {createToolCallingAgent, AgentExecutor} from "langchain/agents";
import * as dotenv from "dotenv";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {Actor} from 'apify';

await Actor.init();

interface Input {
    url: string;
    aboutMe?: string;
    OPENAI_API_KEY?: string;
}

let {
    url, // only works with videos: so it accepts direct videos URL and/or trending/editor picks pages which list videos
    aboutMe,
    OPENAI_API_KEY
} = await Actor.getInput() as Input;

dotenv.config();

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant. Your response are always valid JSON object with double quotes around keys and string values and use escape characters with no prefix at all"],  // System message defining the assistant's behavior
    ["human", 'Given a URL of jobs search results {url}, scrape it, analyze the results, combine them with user debrief [{aboutMe}] and generate a personalized cover letter for each one. Output format is a valid json for each job: with key "job_url" & value "cover_letter" .' +
    "If an error happens, just return the error message." +
    'Important notice: Run the tool to scrape only the search results url and do not scrape individual job pages!!!! PLease!!! ONLY scrape URL in this format "https://www.jobs.nhs.uk/candidate/search/..." ' +
    'EXTREMELY IMPORTANT: DO NOT TRY TO SCRAPE individual jobs details (which includes the "jobadvert" keyword). DON\'T SCRAPE THEM!!!!!!!!' +
    "The cover letter should not include any special character like \\n etc." +
    "Include pertinent information from the job listing in the cover letter (hiring manager name, job title, skills etc.)" +
    "return a simple array of objects with keys job_url and cover_letter"],
    ["placeholder", "{agent_scratchpad}"],
]);

async function main() {

    const model = new ChatOpenAI({
        modelName: "gpt-4o-mini",
        openAIApiKey: OPENAI_API_KEY,
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
        verbose: true,
        tools: [...Object.values(tools)],
    });

    const result = await agentExecutor.invoke({
        url: url,
        aboutMe: aboutMe
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
