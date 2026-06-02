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

function get_weather(city) {
  const fakeData = {
    Hyderabad: { temp: 38, condition: "Sunny" },
    Mumbai: { temp: 32, condition: "Humid" },
    Delhi: { temp: 41, condition: "Hot" },
  };
  return fakeData[city] ?? { temp: "unknown", condition: "unknown" };
}

const tools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get current weather for a city",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "The city name, e.g. Hyderabad",
          },
        },
        required: ["city"],
      },
    },
  },
];

async function chat(userMessage) {
  messages.push({ role: "user", content: userMessage });
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile", // free, very capable model
    messages: messages,
    tool_choice: "auto",
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
