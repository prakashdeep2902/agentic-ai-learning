import "dotenv/config";
import readline from "readline";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

const history = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

while (true) {
  const question = await askQuestion("ask any thing with gemnai: ");
  if (question == "exit") {
    rl.close();
    break;
  }

  await chat(question);
}

async function chat(userMessage) {
  history.push({ role: "user", parts: [{ text: userMessage }] });

  const chat = model.startChat({ history: history.slice(0, -1) });
  const result = await chat.sendMessage(userMessage);
  const reply = result.response.text();

  history.push({ role: "model", parts: [{ text: reply }] });

  console.log("Gemini:", reply);
}
