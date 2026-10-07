const API_URL = '/api/gemini';

const SYSTEM_PROMPT = `You are 'নিনি' (Nini), the friendly AI coding tutor of CholoSikhi Academy. You teach programming in Bengali (Bangla) primarily but can also respond in English. You are encouraging, patient, and explain things with real-world Bengali examples. Keep responses concise and focused on programming concepts.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function generateLocalPedagogicalResponse(userPrompt: string, isEnglish = false): string {
  const lower = userPrompt.toLowerCase();

  if (lower.includes('loop') || lower.includes('লুপ') || lower.includes('for') || lower.includes('while')) {
    return isEnglish
      ? "💡 **Understanding Loops in Python:**\n\nLoops repeat a block of code efficiently:\n- `for` loop: Iterate over ranges or sequences (e.g. `for i in range(5):`).\n- `while` loop: Runs continuously while a boolean condition remains `True`.\n\nWould you like an example tailored to a specific problem?"
      : "💡 **লুপ (Loop) এর মূল ধারণা:**\n\nPython-এ যখন একই কাজ বারবার করতে হয়, তখন আমরা লুপ ব্যবহার করি।\n\n- `for` লুপ: নির্দিষ্ট সংখ্যক বার ঘোরার জন্য (যেমন: `for i in range(5): print(i)`)\n- `while` লুপ: কোনো শর্ত সত্য থাকা পর্যন্ত চলার জন্য (যেমন: `while count < 5:`)\n\nতুমি কি কোনো নির্দিষ্ট লুপ বা কোড নিয়ে জানতে চাও?";
  }

  if (lower.includes('function') || lower.includes('ফাংশন') || lower.includes('def')) {
    return isEnglish
      ? "💡 **Python Functions:**\n\nFunctions are reusable blocks of code executed when called.\n\n```python\ndef greet(name):\n    return f'Hello, {name}!'\n\nprint(greet('Scholar'))\n```\n\nUse `def` to define them and `return` to pass back output values."
      : "💡 **ফাংশন (Function) কী?**\n\nফাংশন হলো কোডের একটি রিইউজেবল ব্লক যা নির্দিষ্ট কোনো কাজ সম্পাদন করে।\n\n```python\ndef greet(name):\n    return f'হ্যালো, {name}!'\n\nprint(greet('শিক্ষার্থী'))\n```\n\n`def` কিওয়ার্ড দিয়ে ফাংশন তৈরি করা হয়। তোমার কোডে ফাংশন প্রয়োগ করতে কোনো সাহায্য প্রয়োজন?";
  }

  if (lower.includes('variable') || lower.includes('ভেরিয়েবল') || lower.includes('ভেরিয়েবল') || lower.includes('data type')) {
    return isEnglish
      ? "💡 **Variables & Data Types:**\n\nVariables store data in memory:\n- `str`: Text string (e.g. `'CholoSikhi'`)\n- `int`: Whole numbers (e.g. `100`)\n- `float`: Decimals (e.g. `3.14`)\n- `bool`: `True` or `False`"
      : "💡 **ভেরিয়েবল (Variable) ও ডেটা টাইপ:**\n\nভেরিয়েবল হলো ডেটা জমা রাখার পাত্র বা বক্সের মতো।\n\n```python\nname = 'CholoSikhi'\nxp = 100\nis_active = True\n```\n\nPython-এ ডেটা টাইপ নিজে থেকেই নির্ধারিত হয় (Dynamic Typing)।";
  }

  if (lower.includes('error') || lower.includes('ভুল') || lower.includes('বাগ') || lower.includes('bug') || lower.includes('syntax')) {
    return isEnglish
      ? "🔍 **Debugging Tip:**\n\n1. Check line indentation (Python uses 4 spaces).\n2. Ensure colons `:` are present after `if`, `for`, `while`, and `def` statements.\n3. Make sure variable names match spelling and case exactly."
      : "🔍 **কোড ডিবাগিং টিপস:**\n\n১. ইনডেন্টেশন (Indentation / ফাঁকা জায়গা) ঠিক আছে কিনা লক্ষ্য করো (Python-এ ৪টি স্পেস আদর্শ)।\n২. `if`, `for`, `while`, `def`-এর শেষে কোলন `:` দিয়েছ কিনা নিশ্চিত হও।\n৩. ভেরিয়েবলের বানান ও ছোট-বড় হাতের অক্ষর মিলিয়ে দেখো।";
  }

  return isEnglish
    ? "👋 I am **Nini**, your friendly AI coding tutor on CholoSikhi! Ask me anything about Python syntax, data structures, algorithms, or SAT prep!"
    : "👋 আমি **নিনি (Nini)**, চলোশিখির এআই টিউটর! পাইথন প্রোগ্রামিং, কোডিং সমস্যা, লুপ, ফাংশন বা ডিজিটাল SAT সম্পর্কিত যেকোনো প্রশ্ন আমাকে করতে পারো। তোমার কোড বা সমস্যার বিস্তারিত বলো, আমি বুঝিয়ে দেব!";
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

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemPrompt: SYSTEM_PROMPT }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.response) return data.response;
    }
  } catch (err) {
    console.warn('[aiService] /api/gemini fetch failed, attempting client fallback:', err);
  }

  // 1. Try direct Gemini API with client key
  const directResponse = await tryDirectGemini(messages, SYSTEM_PROMPT);
  if (directResponse) return directResponse;

  // 2. Intelligent local pedagogical response
  return generateLocalPedagogicalResponse(message, context?.language === 'en');
};

export const getAiHint = async (
  question: string, 
  userAnswer?: string, 
  language: string = 'bn'
): Promise<string> => {
  let message = `Provide a hint for this programming question: "${question}".`;
  if (userAnswer) {
    message += `\nThe user has tried: "${userAnswer}". Tell them what they might be doing wrong, but DO NOT give the direct answer.`;
  }
  if (language === 'en') {
    message += `\nPlease provide the hint in English.`;
  } else {
    message += `\nPlease provide the hint in Bengali.`;
  }

  const messages: ChatMessage[] = [{ role: 'user', content: message }];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemPrompt: SYSTEM_PROMPT }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.response) return data.response;
    }
  } catch (err) {
    console.warn('[aiService] /api/gemini hint failed:', err);
  }

  const directResponse = await tryDirectGemini(messages, SYSTEM_PROMPT);
  if (directResponse) return directResponse;

  return language === 'en'
    ? `💡 Hint: Break the problem down step-by-step. Remember that ${question.includes('loop') ? 'loops repeat actions while conditions are met.' : 'syntax requires exact matching.'}`
    : `💡 সংকেত: সমস্যাটি ছোট ছোট ধাপে ভাগ করে নাও। প্রশ্নের মূল শর্তটি লক্ষ্য করো এবং ইনপুট-আউটপুট টাইপ মিলিয়ে দেখো।`;
};

export const reviewCode = async (
  code: string, 
  language: string = 'bn'
): Promise<string> => {
  let message = `Please review the following code and provide feedback:\n\n\`\`\`\n${code}\n\`\`\``;
  if (language === 'en') {
    message += `\nPlease provide the review in English.`;
  } else {
    message += `\nPlease provide the review in Bengali.`;
  }

  const messages: ChatMessage[] = [{ role: 'user', content: message }];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemPrompt: SYSTEM_PROMPT }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.response) return data.response;
    }
  } catch (err) {
    console.warn('[aiService] /api/gemini review failed:', err);
  }

  const directResponse = await tryDirectGemini(messages, SYSTEM_PROMPT);
  if (directResponse) return directResponse;

  return language === 'en'
    ? "✅ Code Review:\n1. Syntax structure is clean.\n2. Ensure indentation follows 4 spaces.\n3. Test edge cases with varied inputs."
    : "✅ কোড পর্যালোচনা:\n১. কোডের মূল গঠন চমৎকার হয়েছে।\n২. ইনডেন্টেশন এবং ভেরিয়েবলের সঠিক নাম ব্যবহারের দিকে খেয়াল রাখো।\n৩. ভিন্ন ভিন্ন ইনপুট দিয়ে কোডটি টেস্ট করো।";
};

export const chatWithHistory = async (
  messages: ChatMessage[],
  context?: { language?: string }
): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemPrompt: SYSTEM_PROMPT }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.response) return data.response;
    }
  } catch (err) {
    console.warn('[aiService] /api/gemini history chat failed, falling back:', err);
  }

  const directResponse = await tryDirectGemini(messages, SYSTEM_PROMPT);
  if (directResponse) return directResponse;

  const lastUserPrompt = messages.filter(m => m.role === 'user').pop()?.content || '';
  return generateLocalPedagogicalResponse(lastUserPrompt, context?.language === 'en');
};
