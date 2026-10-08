const API_URL = '/api/gemini';

export const PYTHON_SYSTEM_PROMPT = `You are 'Nini' (নিনি), the AI Programming Tutor and CS Mentor of CholoSikhi Academy.

PRIMARY LANGUAGE & TONE:
- Primary Language: English. Explain programming concepts, syntax, and logic in clear, structured English by default.
- If the learner writes to you in Bengali (বাংলা) or explicitly asks for Bengali, respond fluently and naturally in Bengali.
- Tone: Encouraging, patient, precise, and practical.

STRICT DOMAIN GUARDRAILS & SCOPE:
- You are STRICTLY RESTRICTED to Python programming, computer science principles, syntax, data structures, algorithms, debugging, code review, and software development fundamentals.
- If the user asks anything outside programming or computer science (for example: SAT exam questions, general news, entertainment, non-coding school subjects, or unrelated tasks), you MUST politely and concisely decline:
  "I am Nini, dedicated exclusively to teaching Python and programming. Let's focus on code, algorithms, syntax, or debugging! What coding challenge are you working on?"

PEDAGOGY & STYLE:
- When explaining code, use formatted Markdown code blocks (\`\`\`python ... \`\`\`).
- Highlight time and space complexity, syntax nuances, and common beginner traps (e.g. 0-indexing, off-by-one errors, indentation, mutable default arguments).
- Keep answers actionable, engaging, and formatted with clear bullet points and bold key terms.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function generateLocalPedagogicalResponse(userPrompt: string, isEnglish = true): string {
  // Domain boundary: If user asks SAT questions inside Python Tutor
  if (/\b(sat|college\s*board|reading\s*&\s*writing|reading\s+and\s+writing)\b/i.test(userPrompt) || /স্যাট/.test(userPrompt)) {
    return isEnglish
      ? "👋 I am **Nini**, your AI Programming Tutor! I focus exclusively on Python syntax, data structures, algorithms, and debugging.\n\n💡 *Tip: For Digital SAT Math questions, Desmos shortcuts, and Reading & Writing practice, please head over to the **SAT Suite**!*"
      : "👋 আমি **নিনি (Nini)**, চলোশিখির পাইথন ও প্রোগ্রামিং এআই টিউটর! আমি মূলত পাইথন কোডিং, অ্যালগরিদম ও বাগ ফিক্সিং নিয়ে সাহায্য করি।\n\n💡 *টিপ: ডিজিটাল SAT প্রস্তুতি ও অনুশীলনের জন্য উপরের মেনু থেকে **SAT Suite** এ যান!*";
  }

  if (/\b(loops?|while|iteration)\b/i.test(userPrompt) || /\bfor\s+\w+\s+in\b/i.test(userPrompt) || /\bfor\s+loop\b/i.test(userPrompt) || /লুপ/.test(userPrompt)) {
    return isEnglish
      ? "💡 **Understanding Loops in Python:**\n\nLoops repeat a block of code efficiently:\n- `for` loop: Iterate over ranges or sequences (e.g. `for i in range(5):`).\n- `while` loop: Runs continuously while a boolean condition remains `True`.\n\nWould you like an example tailored to a specific problem?"
      : "💡 **লুপ (Loop) এর মূল ধারণা:**\n\nPython-এ যখন একই কাজ বারবার করতে হয়, তখন আমরা লুপ ব্যবহার করি।\n\n- `for` লুপ: নির্দিষ্ট সংখ্যক বার ঘোরার জন্য (যেমন: `for i in range(5): print(i)`)\n- `while` লুপ: কোনো শর্ত সত্য থাকা পর্যন্ত চলার জন্য (যেমন: `while count < 5:`)\n\nতুমি কি কোনো নির্দিষ্ট লুপ বা কোড নিয়ে জানতে চাও?";
  }

  if (/\b(def|functions?|methods?|return)\b/i.test(userPrompt) || /ফাংশন/.test(userPrompt)) {
    return isEnglish
      ? "💡 **Python Functions:**\n\nFunctions are reusable blocks of code executed when called.\n\n```python\ndef greet(name):\n    return f'Hello, {name}!'\n\nprint(greet('Scholar'))\n```\n\nUse `def` to define them and `return` to pass back output values."
      : "💡 **ফাংশন (Function) কী?**\n\nফাংশন হলো কোডের একটি রিইউজেবল ব্লক যা নির্দিষ্ট কোনো কাজ সম্পাদন করে।\n\n```python\ndef greet(name):\n    return f'হ্যালো, {name}!'\n\nprint(greet('শিক্ষার্থী'))\n```\n\n`def` কিওয়ার্ড দিয়ে ফাংশন তৈরি করা হয়। তোমার কোডে ফাংশন প্রয়োগ করতে কোনো সাহায্য প্রয়োজন?";
  }

  if (/\b(variables?|data\s*types?|integers?|strings?|boolean|float)\b/i.test(userPrompt) || /ভেরিয়েবল|ভেরিয়েবল|ডেটা\s*টাইপ/.test(userPrompt)) {
    return isEnglish
      ? "💡 **Variables & Data Types:**\n\nVariables store data in memory:\n- `str`: Text string (e.g. `'CholoSikhi'`)\n- `int`: Whole numbers (e.g. `100`)\n- `float`: Decimals (e.g. `3.14`)\n- `bool`: `True` or `False`"
      : "💡 **ভেরিয়েবল (Variable) ও ডেটা টাইপ:**\n\nভেরিয়েবল হলো ডেটা জমা রাখার পাত্র বা বক্সের মতো।\n\n```python\nname = 'CholoSikhi'\nxp = 100\nis_active = True\n```\n\nPython-এ ডেটা টাইপ নিজে থেকেই নির্ধারিত হয় (Dynamic Typing)।";
  }

  if (/\b(errors?|bugs?|debug|syntaxerror|nameerror|typeerror|indentation)\b/i.test(userPrompt) || /ভুল|বাগ|এরর|সিনট্যাক্স/.test(userPrompt)) {
    return isEnglish
      ? "🔍 **Debugging Tip:**\n\n1. Check line indentation (Python uses 4 spaces).\n2. Ensure colons `:` are present after `if`, `for`, `while`, and `def` statements.\n3. Make sure variable names match spelling and case exactly."
      : "🔍 **কোড ডিবাগিং টিপস:**\n\n১. ইনডেন্টেশন (Indentation / ফাঁকা জায়গা) ঠিক আছে কিনা লক্ষ্য করো (Python-এ ৪টি স্পেস আদর্শ)।\n২. `if`, `for`, `while`, `def`-এর শেষে কোলন `:` দিয়েছ কিনা নিশ্চিত হও।\n৩. ভেরিয়েবলের বানান ও ছোট-বড় হাতের অক্ষর মিলিয়ে দেখো।";
  }

  return isEnglish
    ? "👋 I am **Nini**, your friendly AI coding tutor on CholoSikhi! Ask me anything about Python syntax, data structures, algorithms, or programming concepts!"
    : "👋 আমি **নিনি (Nini)**, চলোশিখির এআই টিউটর! পাইথন প্রোগ্রামিং, কোডিং সমস্যা, লুপ, ফাংশন বা প্রোগ্রামিং সম্পর্কিত যেকোনো প্রশ্ন আমাকে করতে পারো। তোমার কোড বা সমস্যার বিস্তারিত বলো, আমি বুঝিয়ে দেব!";
}

async function tryDirectCloudflareAI(messages: ChatMessage[], systemPrompt: string): Promise<string | null> {
  const accountId = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID as string | undefined;
  const apiToken = import.meta.env.VITE_CLOUDFLARE_API_TOKEN as string | undefined;
  const workerUrl = import.meta.env.VITE_CLOUDFLARE_WORKER_URL as string | undefined;

  const recentMessages = messages.slice(-6);

  if (workerUrl) {
    try {
      const response = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: recentMessages, systemPrompt }),
        signal: AbortSignal.timeout(4500),
      });
      if (response.ok) {
        const data = await response.json();
        const text = data.response || data.result?.response || (typeof data === 'string' ? data : null);
        if (text) return text;
      }
    } catch (e) {
      console.warn('[aiService] Direct Cloudflare custom worker failed:', e);
    }
  }

  if (accountId && apiToken) {
    const formattedMessages: any[] = [{ role: 'system', content: systemPrompt }];
    for (const msg of recentMessages) {
      formattedMessages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    }

    const models = [
      '@cf/meta/llama-3.2-3b-instruct',
      '@cf/meta/llama-3.2-1b-instruct',
      '@cf/meta/llama-3.1-8b-instruct',
    ];

    for (const model of models) {
      try {
        const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: formattedMessages,
              max_tokens: 500,
            }),
            signal: AbortSignal.timeout(5500),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data.result?.response || data.result?.choices?.[0]?.message?.content || data.response;
          if (text) return text;
        }
      } catch (e) {
        console.warn(`[aiService] Direct Cloudflare AI model ${model} failed:`, e);
      }
    }
  }

  return null;
}

async function tryDirectGemini(messages: ChatMessage[], systemPrompt: string): Promise<string | null> {
  const clientKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!clientKey) return null;

  try {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${clientKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: formattedMessages,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
        }),
        signal: AbortSignal.timeout(4500),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }
  } catch (err) {
    console.warn('[aiService] Direct Gemini call failed:', err);
  }
  return null;
}

async function tryDirectPollinations(messages: ChatMessage[], systemPrompt: string): Promise<string | null> {
  try {
    const formattedMessages: any[] = [{ role: 'system', content: systemPrompt }];
    for (const msg of messages) {
      formattedMessages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    }

    const response = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: formattedMessages,
        model: 'openai',
        seed: 42,
      }),
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    }
  } catch (err) {
    console.warn('[aiService] Direct Pollinations call failed:', err);
  }
  return null;
}

export const chatWithAiTutor = async (
  message: string, 
  context?: { course?: string; lesson?: string; language?: string }
): Promise<string> => {
  let contextStr = '';
  if (context?.course || context?.lesson) {
    contextStr = `\nContext: User is currently studying ${context.course || 'a course'}, lesson: ${context.lesson || 'unknown'}.`;
  }
  
  const messages: ChatMessage[] = [
    { role: 'user', content: message + contextStr }
  ];

  return chatWithHistory(messages, context);
};

export const chatWithHistory = async (
  messages: ChatMessage[],
  context?: { language?: string; course?: string; lesson?: string }
): Promise<string> => {
  let enrichedPrompt = PYTHON_SYSTEM_PROMPT;
  if (context?.course || context?.lesson) {
    enrichedPrompt += `\nCurrent Active Course: ${context.course || 'Python Track'}, Lesson: ${context.lesson || 'Practice'}.`;
  }
  if (context?.language === 'bn') {
    enrichedPrompt += `\nUser Preference: Respond in Bengali (বাংলা).`;
  } else {
    enrichedPrompt += `\nUser Preference: Respond in English.`;
  }

  // 1. Try serverless /api/gemini endpoint
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemPrompt: enrichedPrompt }),
      signal: AbortSignal.timeout(9000),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.response) return data.response;
    }
  } catch (err) {
    console.warn('[aiService] /api/gemini history chat failed, falling back:', err);
  }

  // 2. Direct Cloudflare Workers AI client call
  const cfResponse = await tryDirectCloudflareAI(messages, enrichedPrompt);
  if (cfResponse) return cfResponse;

  // 3. Direct Gemini client call
  const directResponse = await tryDirectGemini(messages, enrichedPrompt);
  if (directResponse) return directResponse;

  // 4. Direct Pollinations client call
  const pollinationsResponse = await tryDirectPollinations(messages, enrichedPrompt);
  if (pollinationsResponse) return pollinationsResponse;

  // 5. Intelligent local pedagogical response
  const lastUserPrompt = messages.filter(m => m.role === 'user').pop()?.content || '';
  const hasBanglaChars = /[\u0980-\u09FF]/.test(lastUserPrompt);
  const explicitlyRequestsBangla = /\b(in\s+bangla|in\s+bengali|বাংলায়|বাংলায়)\b/i.test(lastUserPrompt);
  const isBangla = hasBanglaChars || explicitlyRequestsBangla;
  return generateLocalPedagogicalResponse(lastUserPrompt, !isBangla);
};

export const getAiHint = async (
  question: string, 
  userAnswer?: string, 
  language: string = 'en'
): Promise<string> => {
  let message = `Provide a hint for this programming question: "${question}".`;
  if (userAnswer) {
    message += `\nThe user has tried: "${userAnswer}". Tell them what they might be doing wrong, but DO NOT give the direct answer.`;
  }
  if (language === 'bn') {
    message += `\nPlease provide the hint in Bengali.`;
  } else {
    message += `\nPlease provide the hint in English.`;
  }

  const messages: ChatMessage[] = [{ role: 'user', content: message }];
  return chatWithHistory(messages, { language });
};

export const reviewCode = async (
  code: string, 
  language: string = 'en'
): Promise<string> => {
  let message = `Please review the following code and provide feedback:\n\n\`\`\`\n${code}\n\`\`\``;
  if (language === 'bn') {
    message += `\nPlease provide the review in Bengali.`;
  } else {
    message += `\nPlease provide the review in English.`;
  }

  const messages: ChatMessage[] = [{ role: 'user', content: message }];
  return chatWithHistory(messages, { language });
};

export const explainCode = async (
  code: string,
  language: string = 'en'
): Promise<string> => {
  const prompt = language === 'bn'
    ? `এই কোডটি বিস্তারিত বিশ্লেষণ ও ব্যাখ্যা করো:
\`\`\`
${code}
\`\`\`
অনুগ্রহ করে বুঝিয়ে বলো:
১. প্রতিটি লাইন সহজ বাংলায় কী কাজ করছে।
২. টাইম ও স্পেস কমপ্লেক্সিটি (Time & Space Complexity)।
৩. কোনো সম্ভাব্য বাগ বা পারফরম্যান্স অপটিমাইজেশন টিপস।`
    : `Analyze and explain this code:
\`\`\`
${code}
\`\`\`
Please explain:
1. What this code does line-by-line in plain terms.
2. Time & Space Complexity analysis.
3. Edge cases to be aware of or potential improvements.`;

  return chatWithHistory([{ role: 'user', content: prompt }], { language });
};
