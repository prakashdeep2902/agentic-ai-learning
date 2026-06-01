// import "dotenv/config";
// import readline from "readline";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({
//   model: "gemini-3.1-flash",
//   generationConfig: {
//     temperature: 0.3,
//     maxOutputTokens: 1024,
//   },
// });

// const history = [];

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// const askQuestion = (query) =>
//   new Promise((resolve) => rl.question(query, resolve));

// while (true) {
//   const question = await askQuestion("ask any thing with gemnai: ");
//   if (question == "exit") {
//     rl.close();
//     break;
//   }

//   await chat(question);
// }

// async function chat(userMessage) {
//   history.push({ role: "user", parts: [{ text: userMessage }] });
//   const chat = model.startChat({ history: history.slice(0, -1) });
//   const result = await chat.sendMessage(userMessage);
//   const reply = result.response.text();
//   history.push({ role: "model", parts: [{ text: reply }] });
//   console.log("Gemini:", reply);
// }

import "dotenv/config";
import readline from "readline";
import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// message history - same concept as before
const messages = [
  {
    role: "system",
    content: `You are a helpful assistant teaching agentic AI.
              The user is a JS developer. Keep answers short.`,
  },
];

async function chat(userMessage) {
  // add user message to history
  messages.push({ role: "user", content: userMessage });

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile", // free, very capable model
    messages: messages,
    temperature: 0.3,
    max_tokens: 1024,
  });

  const reply = response.choices[0].message.content;

  // save reply back to history
  messages.push({ role: "assistant", content: reply });

  console.log("\nGroq:", reply);
  console.log("Messages in history:", messages.length);
  console.log("---");
}

// CLI interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

console.log('Chat started (Groq). Type "exit" to quit.\n');

while (true) {
  const question = await askQuestion("You: ");

  if (question.trim() === "exit") {
    console.log("Bye!");
    rl.close();
    break;
  }

  if (question.trim() === "") continue;

  await chat(question);
}
