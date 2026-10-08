export const config = {
  runtime: 'edge',
};

const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
];

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
];

const CLOUDFLARE_AI_MODELS = [
  '@cf/meta/llama-3.2-3b-instruct',
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-3.1-8b-fast-v2',
  '@cf/meta/llama-3-8b-instruct',
  '@cf/mistral/mistral-7b-instruct-v0.2',
];

/**
 * Intelligent domain-aware pedagogical fallback response when external APIs are unavailable.
 */
function generateFallbackResponse(userPrompt: string, systemPrompt?: string): string {
  const isBangla = /[\u0980-\u09FF]/.test(userPrompt) || (systemPrompt && /[\u0980-\u09FF]/.test(systemPrompt) && !/[a-zA-Z]{4,}/.test(userPrompt));
  
  const isSatContext = 
    Boolean(systemPrompt?.toLowerCase().includes('sat') || systemPrompt?.toLowerCase().includes('college board')) ||
    /\b(sat|desmos|algebra|quadratic|discriminant|geometry|trigonometry|roots|intercepts?|circle|transitions?|reading|writing|vocab|evidence)\b/i.test(userPrompt) ||
    /স্যাট|ডেসমস|দ্বিঘাত|নিশ্চায়ক|সমীকরণ/.test(userPrompt);

  // --- SAT DOMAIN FALLBACKS ---
  if (isSatContext) {
    // Desmos / Graphing / Systems & Roots
    if (/\b(desmos|graph|roots?|systems?|intersection|intercept|calculator|trick|tricks)\b/i.test(userPrompt) || /ডেসমস|গ্রাফ|রুট|ছেদবিন্দু/.test(userPrompt)) {
      if (isBangla) {
        return `🎯 **ডিজিটাল SAT ডেসমস (Desmos) ক্যালকুলেটরের সেরা ৩টি মাস্টার ট্রিক:**

১. **Systems of Equations (সমীকরণ জোট সমাধান):**
   - দুটি সমীকরণ সরাসরি Desmos-এ টাইপ করো (যেমন: $y = 2x + 3$ এবং $y = x^2 - 4x + 8$)।
   - তাদের ছেদবিন্দুতে (Intersection Point) ক্লিক করলেই সরাসরি $(x, y)$ সমাধান পেয়ে যাবে।

২. **Finding Zeros / Roots & Extrema (মূল ও শীর্ষবিন্দু নির্ণয়):**
   - $ax^2 + bx + c = 0$ সমীকরণ সমাধানের জন্য $y = ax^2 + bx + c$ গ্রাফ করো।
   - x-অক্ষের ছেদবিন্দুগুলোতে ক্লিক করলেই সমীকরণের রুট (Roots/Zeros) এবং শীর্ষবিন্দুতে (Vertex) ক্লিক করলেই Maximum/Minimum মান দেখা যাবে।

৩. **Sliders ও Regression দিয়ে ধ্রুবক ($k, a, b$) নির্ণয়:**
   - কোনো সমীকরণে অজানা ধ্রুবক থাকলে (যেমন: $y = mx + k$) Desmos-এ *Slider* যুক্ত করে শর্ত মেলাও।
   - অথবা টেবিল ডেটার ক্ষেত্রে $y_1 \\sim m x_1 + b$ বা $y_1 \\sim a(x_1 - h)^2 + k$ রিগ্রেশন টাইপ করে ১ সেকেন্ডে সহগ বের করে নাও।

💡 *প্র্যাকটিস টিপ: ডিজিটাল SAT Math সেকশনে প্রায় ৩০-৪০% প্রশ্ন Desmos গ্রাফিং দিয়ে মুখে মুখে সমাধান করা সম্ভব!*`;
      }

      return `🎯 **Top 3 Digital SAT Desmos Calculator Ninja Tricks:**

1. **Solving Systems of Equations Instantly:**
   - Type both equations directly into Desmos (e.g., $y = 2x + 3$ and $y = x^2 - 4x + 8$).
   - Click directly on the intersection point(s) to read the exact $(x, y)$ solution pair without algebraic elimination.

2. **Finding Zeros / Roots & Vertex Extrema:**
   - To solve any equation $ax^2 + bx + c = 0$, graph $y = ax^2 + bx + c$.
   - Click the x-intercepts to find the roots/solutions, and click the parabola's vertex to get the minimum or maximum value $(h, k)$.

3. **Unknown Constants via Sliders & Regression:**
   - If an equation has an unknown constant $k$ (e.g., $2x + ky = 12$), add a slider for $k$ to visually inspect conditions like "no solution" (parallel lines) or "tangent line".
   - For coordinate points from tables, use Desmos regression: $y_1 \\sim mx_1 + b$ or $y_1 \\sim ax_1^2 + bx_1 + c$ to get parameters instantly.

💡 *Pro Tip: Desmos eliminates algebraic manipulation errors on 35%+ of Module 1 & Module 2 Math questions!*`;
    }

    // Quadratic / Discriminant / Vertex
    if (/\b(quadratic|discriminant|vertex|parabola|maximum|minimum)\b/i.test(userPrompt) || /দ্বিঘাত|নিশ্চায়ক|প্যারাবোলা/.test(userPrompt)) {
      if (isBangla) {
        return `📐 **দ্বিঘাত সমীকরণ ও নিশ্চয়ক (Discriminant) মাস্টার রুল:**

$ax^2 + bx + c = 0$ সমীকরণের জন্য:
- **নিশ্চায়ক (Discriminant):** $\\Delta = b^2 - 4ac$
  - $\\Delta > 0$: ২টি ভিন্ন বাস্তব সমাধান (2 distinct real solutions)
  - $\\Delta = 0$: ঠিক ১টি বাস্তব সমাধান (1 real solution / tangent to x-axis)
  - $\\Delta < 0$: কোনো বাস্তব সমাধান নেই (0 real solutions)

- **শীর্ষবিন্দু (Vertex Form):** $y = a(x - h)^2 + k$
  - শীর্ষবিন্দুর $x$-স্থানাঙ্ক: $h = -\\frac{b}{2a}$
  - সর্বোচ্চ বা সর্বনিম্ন মান: $k = f(h)$
- **মূলদ্বয়ের যোগফল ও গুণফল (Vieta's Formulas):**
  - $\\text{Sum of roots} = -\\frac{b}{a}$
  - $\\text{Product of roots} = \\frac{c}{a}$`;
      }

      return `📐 **Quadratic Equations & Discriminant Rules:**

For $ax^2 + bx + c = 0$:
- **Discriminant:** $\\Delta = b^2 - 4ac$
  - $\\Delta > 0$: 2 distinct real solutions (2 x-intercepts)
  - $\\Delta = 0$: Exactly 1 real solution (vertex touches x-axis)
  - $\\Delta < 0$: 0 real solutions (no real x-intercepts)
- **Vertex & Extrema:** $y = a(x - h)^2 + k$
  - $h = -\\frac{b}{2a}$, $k = c - \\frac{b^2}{4a}$
- **Vieta's Shortcuts:**
  - $\\text{Sum of roots} = -\\frac{b}{a}$
  - $\\text{Product of roots} = \\frac{c}{a}$`;
    }

    // Reading & Writing Transitions
    if (/\b(transitions?|however|furthermore|therefore|nevertheless|consequently)\b/i.test(userPrompt) || /ট্রানজিশন/.test(userPrompt)) {
      if (isBangla) {
        return `✍️ **SAT Reading & Writing: ট্রানজিশন (Transitions) স্ট্র্যাটেজি:**

১. **একই ধারার যুক্তি (Addition/Continuers):** *Furthermore, Moreover, Additionally, In addition*
২. **কারণ ও ফলাফল (Cause/Effect):** *Therefore, Consequently, As a result, Thus*
৩. **বিপরীত যুক্তি (Contrast):** *However, Nevertheless, In contrast, On the other hand*
৪. **উদাহরণ ও বিশদকরণ (Example/Restatement):** *Specifically, For instance, In fact, Indeed*

🎯 **সমাধানের নিয়ম:**
১ম বাক্য ও ২য় বাক্যের পারস্পরিক সম্পর্ক নির্ণয় করো (একই অভিমুখ vs বিপরীত অভিমুখ)। তারপর সঠিক ক্যাটাগরির ট্রানজিশন নির্বাচন করো।`;
      }

      return `✍️ **SAT Reading & Writing: Transitions Cheat Sheet:**

1. **Continuers / Addition:** *Furthermore, Moreover, Additionally, In addition*
2. **Cause & Effect:** *Therefore, Consequently, As a result, Thus*
3. **Contrast / Contradiction:** *However, Nevertheless, In contrast, Conversely, Nonetheless*
4. **Restatement / Specifics:** *Specifically, For example, In fact, Indeed*

🎯 **Execution Strategy:**
Read Sentence 1 $\\rightarrow$ Read Sentence 2 $\\rightarrow$ Identify the relationship (Agreement, Causation, or Contrast) $\\rightarrow$ Pick the matching category.`;
    }

    // Default SAT Welcome/Response
    if (isBangla) {
      return `🦉 **নিনি (Nini) - ডিজিটাল SAT এআই মাস্টার কোচ:**

ডিজিটাল SAT Math ও Reading/Writing প্রস্তুতিতে আমি তোমাকে সাহায্য করতে প্রস্তুত!
- **Math:** Desmos ট্রিকস, Algebra, Quadratics, Circle Equations, Trigonometry
- **Reading & Writing:** Transitions, Grammar Boundaries, Words in Context, Command of Evidence

তোমার নির্দিষ্ট কোনো প্রশ্ন বা সমস্যা থাকলে নিচে লিখে জানাও!`;
    }

    return `🦉 **Nini — Digital SAT AI Master Coach:**

I specialize in College Board Digital SAT strategies for both Math and Reading & Writing:
- **SAT Math:** Desmos shortcuts, Linear systems, Quadratic discriminant $\\Delta = b^2 - 4ac$, Circle equations $(x-h)^2 + (y-k)^2 = r^2$, and Trigonometry.
- **Reading & Writing:** Rhetorical synthesis, Transitions, Punctuation boundaries, Words in Context, and Evidence analysis.

Feel free to paste any question or topic you'd like to master!`;
  }

  // --- PYTHON & CODING DOMAIN FALLBACKS ---
  if (/\b(loops?|while|iteration|iterating)\b/i.test(userPrompt) || /\bfor\s+\w+\s+in\b/i.test(userPrompt) || /\bfor\s+loop\b/i.test(userPrompt) || /লুপ/.test(userPrompt)) {
    if (isBangla) {
      return `💡 **লুপ (Loop) এর মূল ধারণা:**

Python-এ যখন একই কাজ বারবার করতে হয়, তখন আমরা লুপ ব্যবহার করি।

- \`for\` লুপ: নির্দিষ্ট সংখ্যক বার বা সিকোয়েন্সের উপর ঘোরার জন্য:
\`\`\`python
for i in range(5):
    print(f"ধাপ নম্বর: {i}")
\`\`\`
- \`while\` লুপ: কোনো শর্ত সত্য থাকা পর্যন্ত চলার জন্য:
\`\`\`python
count = 0
while count < 3:
    print(count)
    count += 1
\`\`\`

তুমি কি কোনো নির্দিষ্ট লুপ বা কোড নিয়ে জানতে চাও?`;
    }

    return `💡 **Loops in Python:**

Loops let you repeat code efficiently:
- \`for\` loop: Iterates over ranges, lists, or sequences:
\`\`\`python
for i in range(5):
    print(i)
\`\`\`
- \`while\` loop: Executes as long as a condition evaluates to \`True\`:
\`\`\`python
count = 0
while count < 3:
    print(count)
    count += 1
\`\`\`

Do you have a specific problem or loop pattern you'd like to explore?`;
  }

  if (/\b(def|functions?|methods?|parameters?|arguments?|return)\b/i.test(userPrompt) || /ফাংশন/.test(userPrompt)) {
    if (isBangla) {
      return `💡 **ফাংশন (Function) কী?**

ফাংশন হলো কোডের একটি রিইউজেবল ব্লক যা নির্দিষ্ট কোনো কাজ সম্পাদন করে।

\`\`\`python
def greet(name):
    return f'হ্যালো, {name}!'

print(greet('শিক্ষার্থী'))
\`\`\`

\`def\` কিওয়ার্ড দিয়ে ফাংশন ডিফাইন করা হয় এবং \`return\` দিয়ে মান ফেরত দেওয়া হয়।`;
    }

    return `💡 **Python Functions:**

Functions are reusable blocks of code executed when called:

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

print(greet("Scholar"))
\`\`\`

Use \`def\` to define functions and \`return\` to pass back values.`;
  }

  if (/\b(variables?|data\s*types?|integers?|strings?|boolean|float)\b/i.test(userPrompt) || /ভেরিয়েবল|ভেরিয়েবল|ডেটা\s*টাইপ/.test(userPrompt)) {
    if (isBangla) {
      return `💡 **ভেরিয়েবল (Variable) ও ডেটা টাইপ:**

ভেরিয়েবল হলো ডেটা জমা রাখার পাত্র বা মেমরি বক্স:
\`\`\`python
name = 'CholoSikhi'   # str (Text)
score = 100            # int (Number)
rating = 4.9          # float (Decimal)
is_active = True      # bool (Boolean)
\`\`\`
Python-এ ডেটা টাইপ নিজে থেকেই নির্ধারিত হয় (Dynamic Typing)।`;
    }

    return `💡 **Variables & Data Types:**

Variables store values in memory:
\`\`\`python
name = "CholoSikhi"   # str
score = 100           # int
pi = 3.14159          # float
is_active = True      # bool
\`\`\``;
  }

  if (isBangla) {
    return "👋 আমি **নিনি (Nini)**, চলোশিখির এআই টিউটর! প্রোগ্রামিং সমস্যা, কোডিং প্রশ্ন বা ডিজিটাল SAT প্রস্তুতি নিয়ে যেকোনো কিছু আমাকে জিজ্ঞাসা করতে পারো!";
  }

  return "👋 I am **Nini**, your AI Tutor on CholoSikhi! Ask me anything about Python programming, algorithms, debugging, or Digital SAT strategies!";
}

/**
 * 1. Google Gemini API with timeout
 */
async function tryGemini(apiKey: string, messages: any[], systemPrompt?: string): Promise<string | null> {
  const recentMessages = (messages || []).slice(-6);
  const formattedMessages = recentMessages.map((msg: any) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  const requestBody: any = {
    contents: formattedMessages,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 750,
    }
  };

  if (systemPrompt) {
    requestBody.systemInstruction = {
      parts: [{ text: systemPrompt }]
    };
  }

  for (const model of GEMINI_MODELS) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(4500),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.warn(`[Gemini API] Error calling model ${model}:`, e);
    }
  }
  return null;
}

/**
 * 2. Cloudflare Workers AI API (Free Tier or Custom Worker URL)
 */
async function tryCloudflareAI(
  accountId?: string,
  apiToken?: string,
  customWorkerUrl?: string,
  messages: any[] = [],
  systemPrompt?: string
): Promise<string | null> {
  const recentMessages = (messages || []).slice(-6);

  // Custom Cloudflare Worker proxy if specified
  if (customWorkerUrl) {
    try {
      const response = await fetch(customWorkerUrl, {
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
      console.warn('[Cloudflare Custom Worker] Call failed:', e);
    }
  }

  // Cloudflare Workers AI direct API if account ID + token provided
  if (accountId && apiToken) {
    const formattedMessages: any[] = [];
    if (systemPrompt) {
      formattedMessages.push({ role: 'system', content: systemPrompt });
    }
    for (const msg of recentMessages) {
      formattedMessages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    }

    for (const model of CLOUDFLARE_AI_MODELS) {
      // 1. Try Authorization: Bearer
      try {
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: formattedMessages,
            max_tokens: 750,
          }),
          signal: AbortSignal.timeout(4500),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.result?.response || data.result?.choices?.[0]?.message?.content || data.response;
          if (text) return text;
        }
      } catch (e) {
        console.warn(`[Cloudflare Workers AI] Bearer attempt on ${model} failed:`, e);
      }

      // 2. Try X-Auth-Key
      try {
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`, {
          method: 'POST',
          headers: {
            'X-Auth-Key': apiToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: formattedMessages,
            max_tokens: 750,
          }),
          signal: AbortSignal.timeout(4500),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.result?.response || data.result?.choices?.[0]?.message?.content || data.response;
          if (text) return text;
        }
      } catch (e) {
        console.warn(`[Cloudflare Workers AI] X-Auth-Key attempt on ${model} failed:`, e);
      }
    }
  }

  return null;
}

/**
 * 3. Groq Free Tier API with timeout
 */
async function tryGroq(groqKey: string, messages: any[], systemPrompt?: string): Promise<string | null> {
  const recentMessages = (messages || []).slice(-6);
  const formattedMessages: any[] = [];
  if (systemPrompt) {
    formattedMessages.push({ role: 'system', content: systemPrompt });
  }
  for (const msg of recentMessages) {
    formattedMessages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    });
  }

  for (const model of GROQ_MODELS) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 750,
        }),
        signal: AbortSignal.timeout(4500),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text;
      }
    } catch (e) {
      console.warn(`[Groq API] Model ${model} failed:`, e);
    }
  }
  return null;
}

/**
 * 4. Free Open LLM Gateway (Pollinations OpenAI Endpoint — 100% free, zero key required)
 */
async function tryPollinationsFreeLLM(messages: any[], systemPrompt?: string): Promise<string | null> {
  try {
    const formattedMessages: any[] = [];
    if (systemPrompt) {
      formattedMessages.push({ role: 'system', content: systemPrompt });
    }
    for (const msg of messages) {
      formattedMessages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    }

    const response = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: formattedMessages,
        model: 'openai',
        seed: 42,
      }),
      signal: AbortSignal.timeout(4500),
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) return text;
    }
  } catch (e) {
    console.warn('[Pollinations Free LLM] POST call failed:', e);
  }

  // Backup simple GET fallback on Pollinations
  try {
    const lastUserMsg = messages?.filter((m: any) => m.role === 'user').pop()?.content || '';
    if (lastUserMsg) {
      const url = `https://text.pollinations.ai/${encodeURIComponent(lastUserMsg)}?model=openai&system=${encodeURIComponent(systemPrompt || '')}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4500) });
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 5 && !text.includes('Error')) {
          return text;
        }
      }
    }
  } catch (e) {
    console.warn('[Pollinations Free LLM] GET backup failed:', e);
  }

  return null;
}

export default async function handler(req: Request) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const { messages, systemPrompt } = await req.json();

    const geminiKey = 
      process.env.GEMINI_API_KEY || 
      process.env.VITE_GEMINI_API_KEY || 
      process.env.GOOGLE_API_KEY || 
      process.env.VITE_GOOGLE_API_KEY;

    const groqKey = 
      process.env.GROQ_API_KEY || 
      process.env.VITE_GROQ_API_KEY;

    const cfAccountId = 
      process.env.CLOUDFLARE_ACCOUNT_ID || 
      process.env.VITE_CLOUDFLARE_ACCOUNT_ID;

    const cfApiToken = 
      process.env.CLOUDFLARE_API_TOKEN || 
      process.env.VITE_CLOUDFLARE_API_TOKEN || 
      process.env.CLOUDFLARE_API_KEY;

    const cfWorkerUrl = 
      process.env.CLOUDFLARE_WORKER_URL || 
      process.env.VITE_CLOUDFLARE_WORKER_URL;

    const lastUserMessage = messages?.filter((m: any) => m.role === 'user').pop()?.content || '';

    let textResponse: string | null = null;

    // 1. Try Cloudflare Workers AI if configured (User preference)
    if (cfWorkerUrl || (cfAccountId && cfApiToken)) {
      textResponse = await tryCloudflareAI(cfAccountId, cfApiToken, cfWorkerUrl, messages, systemPrompt);
    }

    // 2. Try Gemini API if key is available
    if (!textResponse && geminiKey) {
      textResponse = await tryGemini(geminiKey, messages, systemPrompt);
    }

    // 3. Try Groq Free Tier if Gemini wasn't available or failed
    if (!textResponse && groqKey) {
      textResponse = await tryGroq(groqKey, messages, systemPrompt);
    }

    // 4. Try Free Open LLM Gateway (Pollinations OpenAI Endpoint — 100% free, zero key required)
    if (!textResponse) {
      textResponse = await tryPollinationsFreeLLM(messages, systemPrompt);
    }

    // 5. Intelligent pedagogical fallback if network or all endpoints fail
    if (!textResponse) {
      console.warn('[AI Service] All remote LLMs unreachable; using domain-aware local pedagogical fallback.');
      textResponse = generateFallbackResponse(lastUserMessage, systemPrompt);
    }

    return new Response(JSON.stringify({ response: textResponse }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      response: "👋 I am **Nini**, your AI Tutor! There was a momentary network latency. Please ask your question again in a moment." 
    }), {
      status: 200,
      headers: corsHeaders,
    });
  }
}
