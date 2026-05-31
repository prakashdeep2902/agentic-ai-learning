import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const messages: any[] = [
  {
    role: "system",
    content: `You are a helpful assistant teaching agentic AI.
              The user is a JS developer. Keep answers short.`
  }
]

async function chat(userMessage: string) {
  messages.push({ role: "user", content: userMessage })

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: messages[0].content,
    messages: messages.slice(1), // anthropic SDK takes system separately
  })

  const reply = response.content[0].type === "text"
    ? response.content[0].text
    : ""

  messages.push({ role: "assistant", content: reply })
  console.log("Claude:", reply)
  console.log("Total messages in history:", messages.length)
}

await chat("My name is Arjun and I am learning agentic AI")
await chat("What is my name and what am I learning?") // tests memory