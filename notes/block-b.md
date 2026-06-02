# Block B, Topic 1: Tools / Function Calling

## The core idea

So far, your AI only knows what's in its training data. It can't check today's weather, run code, or look up a database. **Tools change that.**

Tools let you define JavaScript functions, tell the AI they exist, and the AI can _decide_ to call them when it needs real data.

**The flow looks like this:**

```
You → "What's the weather in Hyderabad?"
         ↓
AI thinks: "I need real weather data. I have a get_weather tool. I'll call it."
         ↓
AI returns: { tool: "get_weather", args: { city: "Hyderabad" } }
         ↓
YOUR CODE runs the actual function
         ↓
You send the result back to the AI
         ↓
AI gives the final answer to the user
```

The AI doesn't run your code — it just _requests_ a call. **You** run it and report back.

---

## Real working example

```js
import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Step 1: Define your actual JS function
function get_weather(city) {
  // Pretend this calls a real weather API
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

const messages = [
  { role: "user", content: "What's the weather like in Hyderabad?" },
];

const firstResponse = await client.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages,
  tools,
  tool_choice: "auto",
});

const aiMessage = firstResponse.choices[0].message;

if (aiMessage.tool_calls) {
  const toolCall = aiMessage.tool_calls[0];
  const args = JSON.parse(toolCall.function.arguments);

  console.log("AI wants to call:", toolCall.function.name);
  console.log("With args:", args);

  const result = get_weather(args.city);

  const secondResponse = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      ...messages,
      aiMessage,
      {
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      },
    ],
    tools,
  });

  console.log("Final answer:", secondResponse.choices[0].message.content);
} else {
  console.log("Direct answer:", aiMessage.content);
}
```

---

## Key things to notice

| Thing                  | Why it matters                                                     |
| ---------------------- | ------------------------------------------------------------------ |
| `tools` array          | Describes what tools exist — name, purpose, what args they take    |
| `tool_choice: "auto"`  | AI decides when to use a tool (you can also force it)              |
| `aiMessage.tool_calls` | How you detect the AI is requesting a function call                |
| `role: "tool"`         | A new message role — how you return the function result            |
| Two round trips        | First call → AI asks for tool. Second call → AI gives final answer |

---

## The mental model

Think of yourself as a **middleman**:

```
User ──→ AI ──→ "call get_weather(Hyderabad)" ──→ YOUR CODE
                                                        ↓
User ←── AI ←── final answer     ←──── result: {temp:38}
```

The AI is the brain that decides _what_ to call. You're the hands that actually _do_ it.

---

Run that code, see the two-step flow in action, then say **"next"** when ready for Topic 2 (parallel tool calls + multiple tools).
