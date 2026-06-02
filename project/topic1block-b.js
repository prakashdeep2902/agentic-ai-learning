import "dotenv/config";
import readline from "readline";
import Groq from "groq-sdk";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

const messages = [
  {
    role: "system",
    content: `I am your assistant`,
  },
];

function get_weather(city) {
  const fakeData = {
    Hyderabad: { temp: 38, condition: "Sunny" },
    Mumbai: { temp: 32, condition: "Humid" },
    Delhi: { temp: 41, condition: "Hot" },
  };

  return (
    fakeData[city] || {
      temp: "unknown",
      condition: "unknown",
    }
  );
}

const tools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "get the temperture of city",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "City name",
          },
        },
        required: ["city"],
      },
    },
  },
];

async function AgentCallFn(userMessage) {
  messages.push({
    role: "user",
    content: userMessage,
  });

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const LLMres = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    tools,
    tool_choice: "auto",
    temperature: 0.3,
  });

  const answer = LLMres.choices[0].message;

  console.log("\nAssistant Raw:");
  console.log(JSON.stringify(answer, null, 2));

  if (answer.tool_calls?.length) {
    const toolCall = answer.tool_calls[0];
    const functionName = toolCall.function.name;
    const arg = JSON.parse(toolCall.function.arguments);
    let result;
    if (functionName == "get_weather") {
      result = get_weather(arg.city);
    }

    messages.push(answer);
    messages.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: JSON.stringify(result),
    });

    const finalResponse = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
    });

    const finalAnswer = finalResponse.choices[0].message.content;

    messages.push({
      role: "assistant",
      content: finalAnswer,
    });

    console.log("\nAssistant:");
    console.log(finalAnswer);
  } else {
    const finalAnswer = answer.content;
    messages.push({
      role: "assistant",
      content: answer,
    });
    console.log("\nAssistant: \n");
    console.log(finalAnswer);
  }
}

while (true) {
  const question = await askQuestion("User: ");
  if (question === "exit") {
    rl.close();
    break;
  }
  await AgentCallFn(question);
}

console.log("Bye ! 👋");
