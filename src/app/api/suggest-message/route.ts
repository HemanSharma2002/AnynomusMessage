// import OpenAI from 'openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';
// import { NextResponse } from 'next/server';

// // Create an OpenAI API client
// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: Request) {
//     try {
//         const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
//         // Extract the `prompt` from the body of the request
//         // const { prompt } = await req.json();

//         // Ask OpenAI for a streaming completion given the prompt
//         const response = await openai.completions.create({
//             model: 'gpt-3.5-turbo-16k',
//             max_tokens: 400,
//             stream: true,
//             prompt,
//         });

//         // Convert the response into a friendly text-stream
//         const stream = OpenAIStream(response);

//         // Respond with the stream
//         return new StreamingTextResponse(stream);
//     } catch (error) {
//         if (error instanceof OpenAI.APIError) {
//             const { name, status, headers, message } = error
//             return NextResponse.json({
//                 name, status, headers, message
//             }, {
//                 status
//             })
//         } else {
//             console.error("An Unexpected errro occured")
//             throw error
//         }
//     }
// }


// import { openai } from '@ai-sdk/openai';
// import { StreamingTextResponse, streamText } from 'ai';

// export async function POST(req: Request) {
//   const { messages } = await req.json();
//   const prompt= "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
//   const result = await streamText({
//     model: openai('gpt-4-turbo'),
//     prompt:"Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
//   });

//   return new StreamingTextResponse(result.toAIStream());
// }