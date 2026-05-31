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
