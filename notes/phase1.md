# Phase 1.1 — What is an LLM?

Before learning agents, you need to understand the "brain" that agents use.

## Simple Definition

An **LLM (Large Language Model)** is a model trained on huge amounts of text that predicts the next token (word piece).

Example:

Input:

```text
The capital of India is
```

LLM predicts:

```text
Delhi
```

It does this repeatedly until it generates a complete response.

---

## Think Like a Full-Stack Developer

Imagine:

```text
Frontend = Chat UI

Backend = Agent Logic

Database = Knowledge Sources

LLM = Brain
```

Without an LLM:

```text
User
 ↓
API
 ↓
Database
 ↓
Response
```

With an LLM:

```text
User
 ↓
LLM
 ↓
Response
```

With an Agent:

```text
User
 ↓
LLM
 ↓
Tools
 ↓
Database/API/Web
 ↓
LLM
 ↓
Response
```

This last architecture is what Agentic AI is built on.

---

## Why LLMs Feel Intelligent

LLMs are very good at:

- Writing
- Summarizing
- Coding
- Translation
- Reasoning (to some extent)

Example:

Prompt:

```text
Write a Node.js function to reverse a string.
```

The LLM has seen millions of coding examples and can generate:

```javascript
function reverseString(str) {
  return str.split("").reverse().join("");
}
```

---

## What LLMs Cannot Do Alone

Suppose you ask:

```text
What's my current Stripe subscription?
```

The LLM does NOT know.

Why?

Because it cannot:

- Access your database
- Call Stripe
- Access private APIs
- Read your CRM

unless you give it tools.

This limitation is exactly why Agents exist.

---

## LLM vs Agent

### LLM

```text
Question
 ↓
Answer
```

Example:

```text
What is React?
```

---

### Agent

```text
Question
 ↓
Reason
 ↓
Choose Tool
 ↓
Execute Tool
 ↓
Reason Again
 ↓
Answer
```

Example:

```text
How many active customers signed up this month?
```

Agent:

```text
1. Query database
2. Count customers
3. Generate report
4. Return answer
```

---

## Popular LLMs in 2026

Some examples:

- OpenAI GPT models
- Anthropic Claude models
- Google Gemini models
- Meta Llama models
- Mistral AI Mistral models

The concepts you'll learn apply to all of them.

---

## Key Interview Question

**Q: Is an LLM an Agent?**

Answer:

> No.
>
> An LLM is the reasoning engine (brain).
>
> An Agent is a system that uses an LLM together with tools, memory, workflows, and decision-making.

---

## Real Example From Your Background

Suppose you're building AceSales.

Without Agent:

```text
User:
Create a follow-up email.
```

LLM:

```text
Returns email text.
```

With Agent:

```text
User:
Create follow-up email for Acme Corp.
```

Agent:

```text
1. Fetch Acme from MongoDB
2. Read last interactions
3. Analyze opportunity stage
4. Generate personalized email
5. Save draft
6. Return result
```

That's Agentic AI.

---

# Quick Check

Answer these 3 questions in your own words:

1. What is an LLM?
2. What is the difference between an LLM and an Agent?
3. Why can't an LLM directly read your MongoDB database?

Reply with your answers, and I'll review them before moving to **Phase 1.2 — Prompt Engineering Fundamentals**.

Excellent. You understood the core idea.

Review

1. What is an LLM?

Your answer:

LLM is trained on huge data to predict next token.

✅ Correct.

A slightly more interview-ready answer:

An LLM is a Large Language Model trained on massive amounts of text data that generates responses by predicting the next token based on the context it receives.

2. Difference between LLM and Agent

Your answer:

Agent uses LLM, tools, workflow to automate work.

✅ Correct.

A stronger answer:

An LLM is the reasoning engine, while an Agent is a system that uses an LLM together with tools, memory, workflows, and decision-making to complete tasks.

3. Why can't an LLM read MongoDB?

Your answer:

It cannot access databases or private APIs.

✅ Exactly right.

This is one of the most important concepts in Agentic AI.

Excellent. You understood the core idea.

### Review

#### 1. What is an LLM?

Your answer:

> LLM is trained on huge data to predict next token.

✅ Correct.

A slightly more interview-ready answer:

> An LLM is a Large Language Model trained on massive amounts of text data that generates responses by predicting the next token based on the context it receives.

---

#### 2. Difference between LLM and Agent

Your answer:

> Agent uses LLM, tools, workflow to automate work.

✅ Correct.

A stronger answer:

> An LLM is the reasoning engine, while an Agent is a system that uses an LLM together with tools, memory, workflows, and decision-making to complete tasks.

---

#### 3. Why can't an LLM read MongoDB?

Your answer:

> It cannot access databases or private APIs.

✅ Exactly right.

This is one of the most important concepts in Agentic AI.

---

# Phase 1.2 — Prompt Engineering Fundamentals

Before agents can use tools, you must learn how to communicate with the LLM effectively.

Think of prompts as APIs for the model.

Bad prompt:

```text
Write email
```

Good prompt:

```text
Write a professional sales follow-up email.

Recipient: CTO of Acme Corp
Tone: Friendly
Length: 150 words
Goal: Schedule demo call
```

The better the prompt, the better the output.

---

## Types of Prompts

### 1. Zero-Shot Prompting

You simply ask.

Example:

```text
Explain React hooks.
```

No examples provided.

---

### 2. Few-Shot Prompting

You give examples first.

Example:

```text
Input: Hello
Output: Greeting

Input: Goodbye
Output: Farewell

Input: Thanks
Output:
```

The model learns the pattern.

---

### 3. Role Prompting

Assign a role.

Example:

```text
You are a senior Node.js architect.

Review this code and suggest improvements.
```

This often improves quality significantly.

---

## The 4-Part Prompt Formula

For production AI apps, use:

```text
ROLE
TASK
CONTEXT
OUTPUT FORMAT
```

Example:

```text
You are a senior sales representative.

Write a follow-up email.

Context:
The prospect attended a product demo yesterday.

Output:
Return only the email body.
```

---

## Why This Matters for Agents

Imagine your agent has a tool:

```javascript
getCustomerData(customerId);
```

The tool returns:

```json
{
  "name": "Acme Corp",
  "industry": "SaaS",
  "lastMeeting": "Interested in pricing"
}
```

Bad prompt:

```text
Write an email.
```

Good prompt:

```text
You are a sales executive.

Customer Information:
Name: Acme Corp
Industry: SaaS
Last Meeting: Interested in pricing

Write a follow-up email encouraging the customer to schedule another meeting.
```

Huge difference.

---

## System Prompt vs User Prompt

This is heavily used in Agentic AI.

### System Prompt

Defines behavior.

Example:

```text
You are an AI sales assistant.

Always be professional.
Never invent customer information.
```

### User Prompt

Actual request.

Example:

```text
Generate a follow-up email for Acme Corp.
```

---

## Real Agent Example

System Prompt:

```text
You are a CRM agent.

Rules:
- Use tools when needed
- Never make up customer data
- Ask for clarification if customer does not exist
```

User:

```text
Draft an email for customer 123
```

This pattern is used in almost every production agent.

---

## Common Prompt Engineering Mistakes

### Too vague

Bad:

```text
Write code
```

Good:

```text
Write a TypeScript Express middleware that validates JWT tokens.
```

---

### Missing output format

Bad:

```text
Analyze customer data
```

Good:

```text
Analyze customer data and return JSON:

{
  "sentiment": "",
  "risk": "",
  "recommendation": ""
}
```

Structured outputs are critical for agents.

---

## Mini Assignment

Improve this prompt using the 4-part formula (Role, Task, Context, Output Format):

```text
Write an email to customer.
```

Write your improved version, and I'll review it before we move to **Phase 1.3 — Function Calling & Tool Calling (the foundation of Agentic AI).**
