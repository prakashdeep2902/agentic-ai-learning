**Topic 1: What is a token?**

This is the foundation. Before you write a single line of agent code, you need to understand how LLMs actually "see" text.

## The core idea

An LLM doesn't read words or letters — it reads _tokens_. A token is roughly a chunk of text. Sometimes it's a whole word, sometimes part of a word, sometimes punctuation.

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

That's Topic 1 — genuinely 10 minutes of reading + 5 minutes playing with the tokenizer. No code yet.

Say "next" when ready for Topic 2 (context window) — it builds directly on this.
