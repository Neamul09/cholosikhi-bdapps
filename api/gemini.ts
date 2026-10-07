export const config = {
  runtime: 'edge',
};

const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

function generateFallbackResponse(userPrompt: string, systemPrompt?: string): string {
  const lower = userPrompt.toLowerCase();
  
  if (lower.includes('loop') || lower.includes('লুপ') || lower.includes('for') || lower.includes('while')) {
    return "💡 **লুপ (Loop) এর মূল ধারণা:**\n\nPython-এ যখন একই কাজ বারবার করতে হয়, তখন আমরা লুপ ব্যবহার করি।\n\n- `for` লুপ: নির্দিষ্ট সংখ্যক বার ঘোরার জন্য (যেমন: `for i in range(5): print(i)`)\n- `while` লুপ: কোনো শর্ত সত্য থাকা পর্যন্ত চলার জন্য (যেমন: `while count < 5:`)\n\nতুমি কি কোনো নির্দিষ্ট লুপ বা কোড নিয়ে জানতে চাও?";
  }

  if (lower.includes('function') || lower.includes('ফাংশন') || lower.includes('def')) {
    return "💡 **ফাংশন (Function) কী?**\n\nফাংশন হলো কোডের একটি রিইউজেবল ব্লক যা নির্দিষ্ট কোনো কাজ সম্পাদন করে।\n\n```python\ndef greet(name):\n    return f'হ্যালো, {name}!'\n\nprint(greet('শিক্ষার্থী'))\n```\n\n`def` কিওয়ার্ড দিয়ে ফাংশন তৈরি করা হয়। তোমার কোডে ফাংশন প্রয়োগ করতে কোনো সাহায্য প্রয়োজন?";
  }

  if (lower.includes('variable') || lower.includes('ভেরিয়েবল') || lower.includes('ভেরিয়েবল')) {
    return "💡 **ভেরিয়েবল (Variable):**\n\nভেরিয়েবল হলো ডেটা জমা রাখার পাত্র বা বক্সের মতো।\n\n```python\nname = 'CholoSikhi'\nxp = 100\nis_active = True\n```\n\nPython-এ ডেটা টাইপ নিজে থেকেই নির্ধারিত হয় (Dynamic Typing)।";
  }

  if (lower.includes('sat') || lower.includes('math') || lower.includes('vocab')) {
    return "📚 **নিনি SAT কোচ গাইডেন্স:**\n\nডিজিটাল SAT প্রস্তুতিতে সময় ব্যবস্থাপনা এবং প্রতিটি মাইক্রো-টাইপের মূল নিয়ম বোঝা সবচেয়ে গুরুত্বপূর্ণ।\n\n1. প্রশ্নটি মনোযোগ দিয়ে পড়ে কী বের করতে বলা হয়েছে তা চিহ্নিত করো।\n2. অপশন এলিমিনেশন কৌশল ব্যবহার করো।\n3. Math সেকশনে Desmos ক্যালকুলেটরের সর্বোচ্চ ব্যবহার নিশ্চিত করো।";
  }

  return "👋 আমি **নিনি (Nini)**, চলোশিখির এআই টিউটর! প্রোগ্রামিং, কোডিং সমস্যা বা ডিজিটাল SAT সম্পর্কিত যেকোনো প্রশ্ন আমাকে করতে পারো। তোমার কোড বা সমস্যার বিস্তারিত বলো, আমি বুঝিয়ে দেব!";
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

    const apiKey = 
      process.env.GEMINI_API_KEY || 
      process.env.VITE_GEMINI_API_KEY || 
      process.env.GOOGLE_API_KEY || 
      process.env.VITE_GOOGLE_API_KEY;

    const lastUserMessage = messages?.filter((m: any) => m.role === 'user').pop()?.content || '';

    if (!apiKey) {
      console.warn('[Gemini API] No GEMINI_API_KEY set on server; using intelligent fallback.');
      return new Response(JSON.stringify({ response: generateFallbackResponse(lastUserMessage, systemPrompt) }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Format messages for Gemini API
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const requestBody: any = {
      contents: formattedMessages,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    if (systemPrompt) {
      requestBody.systemInstruction = {
        parts: [{ text: systemPrompt }]
      };
    }

    let textResponse = '';
    let lastError: any = null;

    // Try models in cascade order
    for (const model of MODELS) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const data = await response.json();
          textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (textResponse) break;
        } else {
          lastError = await response.text();
          console.warn(`[Gemini API] Model ${model} failed (${response.status}):`, lastError);
        }
      } catch (callErr) {
        lastError = callErr;
      }
    }

    if (!textResponse) {
      console.warn('[Gemini API] All models returned empty or failed. Using fallback response. Last error:', lastError);
      textResponse = generateFallbackResponse(lastUserMessage, systemPrompt);
    }

    return new Response(JSON.stringify({ response: textResponse }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      response: "👋 আমি **নিনি (Nini)**, তোমার এআই টিউটর! সাময়িক নেটওয়ার্ক সমস্যার কারণে সংযোগ ব্যাহত হয়েছে। দয়া করে কিছুক্ষণ পর আবার প্রশ্ন করো।" 
    }), {
      status: 200,
      headers: corsHeaders,
    });
  }
}
