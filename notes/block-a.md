**Topic 1: What is a token?**

This is the foundation. Before you write a single line of agent code, you need to understand how LLMs (Large Language Model) actually "see" text.

## The core idea

An LLM (Large Language Model) doesn't read words or letters — it reads _tokens_. A token is roughly a chunk of text. Sometimes it's a whole word, sometimes part of a word, sometimes punctuation.

```
"Hello world"  →  ["Hello", " world"]         = 2 tokens
"I'm learning" →  ["I", "'m", " learning"]    = 3 tokens
"API"          →  ["API"]                     = 1 token
"unbelievable" →  ["un", "believ", "able"]    = 3 tokens
```

A rough rule: **1 token ≈ 0.75 words**, or about 4 characters.

## Why it matters for agents

Two practical reasons you'll hit immediately:

1. **Cost** — Anthropic charges per token (input + output). If your agent runs a loop 10 times and each loop passes the full conversation history, token count adds up fast.

2. **Context window** — Claude has a limit (200k tokens for Claude 3). If your agent's conversation + tools + history exceeds this, it starts forgetting earlier parts. Agents with long loops or big tool outputs hit this sooner than you'd expect.

## Try it yourself

Go to **platform.openai.com/tokenizer** or search "Tiktokenizer" — paste some text and watch it split. Try:

- A normal sentence
- Some code
- A long JSON object (you'll be surprised how many tokens JSON burns)

Note this in `notes/block-a.md`:

```md
## Topic 1: Tokens

- LLMs read tokens, not words. ~0.75 words per token.
- Cost and context window are both measured in tokens.
- JSON and code are token-heavy — be careful in tool responses.
- Tried: [paste something you found interesting from the tokenizer]
```

---

# Topic 2: Context Window

## The core idea

Remember tokens? The context window is just the **maximum number of tokens the model can "see" at once** — both your input AND its output combined.

Think of it like the model's working memory. Whatever fits in the window = it knows. Whatever falls outside = it has no idea it exists.

```
┌─────────────────────────────────────────┐
│           Context Window                │
│                                         │
│  System prompt       ~500 tokens        │
│  Conversation so far ~3,000 tokens      │
│  Tool definitions    ~800 tokens        │
│  Tool results        ~1,200 tokens      │
│  ─────────────────────────────────      │
│  Total used:         ~5,500 tokens      │
│  Claude's limit:     200,000 tokens     │
│  Remaining:          ~194,500 tokens    │
└─────────────────────────────────────────┘
```

Claude 3.5 Sonnet = 200k token context. That sounds huge — and for a chatbot it is. For agents, it fills up faster than you think.

## Why agents specifically struggle with this

A normal chatbot: user sends 1 message, model replies. Done.

An agent loop looks like this:

```
Turn 1: user message + system prompt
Turn 2: + model's reasoning
Turn 3: + tool call + tool result
Turn 4: + model's reasoning again
Turn 5: + another tool call + another tool result
Turn 6: + final answer
```

Every turn, you pass the **entire history** again (because the model has no memory — more on that in Topic 4). So the context window grows with every loop iteration. A 20-step agent on a complex task can burn through tokens fast.

## The two things that will bite you

**1. Large tool outputs** — if your search tool returns a full webpage, that's thousands of tokens added every call. You'll learn to truncate tool results.

**2. Forgetting** — if you do exceed the limit and don't handle it, the model just starts ignoring the oldest messages. Your agent can forget what the original task even was.

## Note it down

Add to `notes/block-a.md`:

```md
## Topic 2: Context Window

- Max tokens the model can see at once (input + output combined).
- Claude 3.5 Sonnet = 200k tokens.
- Agents fill it faster than chatbots because history grows every loop turn.
- Two dangers: large tool outputs, and forgetting old context.
- Fix: truncate tool results, summarise old history if needed.
```

---

That's Topic 2 — directly connected to Topic 1. You now understand why token count is something you actively manage in agent code, not just a billing detail.

Say **next** for Topic 3 — system prompt vs user message vs assistant message. This is where you write your first actual code snippet.

# Topic 3: System prompt vs user message vs assistant message

## The core idea

Every conversation with an LLM is just an array of messages. Each message has a **role** and **content**. There are exactly 3 roles:

```js
const messages = [
  { role: "system", content: "You are a helpful assistant..." },
  { role: "user", content: "What is a token?" },
  { role: "assistant", content: "A token is a chunk of text..." },
  { role: "user", content: "Give me an example" },
];
```

That array is literally everything you send to the API. No magic — just a list of turns.

## What each role does

**`system`** — Your instructions to the model. Runs before everything. This is where you define the agent's personality, rules, and task. Only one per conversation, always first.

```js
{ role: "system", content: `
  You are an AI research assistant.
  Always search before answering questions about current events.
  Keep responses under 200 words.
  The user is a JS developer learning agentic AI.
` }
```

**`user`** — What the human sends. Can also be tool results (you'll see this in Block C).

**`assistant`** — What the model replied. When you build an agent loop, you save every model response back into this array so the model remembers what it said.

## This is why the model has no memory

The model doesn't store anything between API calls. Every single call you make, you pass the full array again from scratch:

```js
// Call 1
const messages = [
  { role: "system", content: "You are a helpful agent" },
  { role: "user", content: "My name is Arjun" },
];
const reply1 = await callAPI(messages);

// Call 2 — you MUST include previous turns
messages.push({ role: "assistant", content: reply1 });
messages.push({ role: "user", content: "What is my name?" });
const reply2 = await callAPI(messages);
// reply2: "Your name is Arjun" ✅

// If you forgot to include history:
const badMessages = [
  { role: "system", content: "You are a helpful agent" },
  { role: "user", content: "What is my name?" },
];
const reply3 = await callAPI(badMessages);
// reply3: "I don't know your name" ❌
```

## Your first real code — try this now

Create `project/topic3.ts` and actually run this:

```ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const messages: any[] = [
  {
    role: "system",
    content: `You are a helpful assistant teaching agentic AI.
              The user is a JS developer. Keep answers short.`,
  },
];

async function chat(userMessage: string) {
  messages.push({ role: "user", content: userMessage });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: messages[0].content,
    messages: messages.slice(1), // anthropic SDK takes system separately
  });

  const reply =
    response.content[0].type === "text" ? response.content[0].text : "";

  messages.push({ role: "assistant", content: reply });
  console.log("Claude:", reply);
  console.log("Total messages in history:", messages.length);
}

await chat("My name is Arjun and I am learning agentic AI");
await chat("What is my name and what am I learning?"); // tests memory
```

Run it with:

```bash
npx ts-node project/topic3.ts
```

The second question should correctly answer both — proving the history array is working. That's memory, manually implemented.

## Note it down

Add to `notes/block-a.md`:

```md
## Topic 3: System / User / Assistant messages

- Every API call is just an array of {role, content} objects.
- system = instructions (first, survives longest in context).
- user = human input or tool results.
- assistant = model's replies — you save these back into the array.
- Model has ZERO memory — you pass full history every call.
- Memory = just growing the messages array and re-sending it.
```

---

# Topic 4: Temperature and top-p

## The core idea

When the model generates a response, it doesn't just pick the single "best" word every time. It picks from a probability distribution — and temperature controls how random that pick is.

Think of it like this:

```
Next word after "The sky is..."

"blue"      → 60% probability
"clear"     → 20% probability
"beautiful" → 10% probability
"purple"    → 5%  probability
"delicious" → 1%  probability
```

**Temperature 0** → always picks the highest probability word ("blue"). Predictable, consistent, boring.

**Temperature 1** → picks based on the actual distribution. Sometimes "clear", occasionally "beautiful".

**Temperature 2** → makes low-probability words more likely. "purple", "delicious" start showing up. Creative but unreliable.

---

## The practical range

```
0.0  ──────────────────────────────  2.0
 │                                    │
 │  Agents, tool calling,          Creative
 │  data extraction,               writing,
 │  structured output              brainstorming
 │
 └─ Use 0–0.3 for agents
```

For agents specifically you almost always want low temperature — you need the model to reliably call the right tool, return valid JSON, follow instructions exactly. A creative agent is a broken agent.

---

## What is top-p?

Top-p is a second way to control randomness. Instead of scaling all probabilities, it cuts off the "long tail" of unlikely words.

```
top-p = 0.9 means:
Only consider words that together make up 90% of probability mass.
Ignore everything else, no matter how creative.
```

In practice — **just set temperature and leave top-p at default (1.0)**. You rarely need to touch both. Most developers only ever touch temperature.

---

## Add it to your code

Open your `topic3.js` / chat file and add `generationConfig`:

```js
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.3, // low = consistent, good for agents
    maxOutputTokens: 1024,
  },
});
```

---

## Try this experiment

Run your chat with temperature 0 and ask the same question 3 times:

```
"Give me one word to describe the sky"
"Give me one word to describe the sky"
"Give me one word to describe the sky"
```

Then change to temperature 1.5 and ask the same question 3 times. You'll see the difference immediately.

---

## Note it down

Add to `notes/block-a.md`:

```md
## Topic 4: Temperature and top-p

- Temperature controls randomness in output (0 = deterministic, 2 = chaotic).
- For agents: always use 0–0.3. Need reliability not creativity.
- top-p = cuts off unlikely words. Rarely need to touch it.
- Rule of thumb: set temperature low, leave everything else default.
```

---

Short topic intentionally — this is a dial you set once and forget for agent work.

Say **next** for Topic 5 — prompt engineering basics. Last topic in Block A, then we move to Block B which is where agents actually start taking shape.
