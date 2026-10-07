const API_URL = '/api/gemini';

export const SAT_SYSTEM_PROMPT = `You are 'নিনি' (Nini), the Digital SAT AI Master Coach and Mentor on CholoSikhi SAT Suite.
You specialize in the College Board Digital SAT:
1. SAT Math:
   - Algebra (linear equations, linear inequalities, systems of linear equations, linear functions)
   - Advanced Math (quadratic equations, polynomials, exponential functions, radicals, rational expressions)
   - Problem Solving & Data Analysis (ratios, rates, percentages, two-way tables, probability, mean/median/standard deviation)
   - Geometry & Trigonometry (area/volume, circle equations $(x-h)^2 + (y-k)^2 = r^2$, similar triangles, right triangle trigonometry $\\sin, \\cos, \\tan$, radians)
   - Desmos Graphing Calculator shortcuts and strategies (finding intersections, finding zeros, using regression ~y1~mx1+b, testing choices)
2. SAT Reading & Writing:
   - Information and Ideas (Central Ideas and Details, Command of Evidence - Textual & Quantitative, Inferences)
   - Craft and Structure (Words in Context, Text Structure and Purpose, Cross-Text Connections)
   - Expression of Ideas (Rhetorical Synthesis / bullet point synthesis, Transitions)
   - Standard English Conventions (Boundaries: semicolons, periods, commas; Form, Structure & Sense: subject-verb agreement, verb tense; Dangling Modifiers)
3. Pedagogy & Style:
   - Provide Socratic explanations: break down question archetypes, explain why the correct answer works, and expose trap answer choices.
   - Use clean Markdown and standard LaTeX / KaTeX math formatting ($...$ for inline math, $$...$$ for block formulas).
   - Communicate clearly in Bengali (বাংলা) or English as requested by the user.
   - Keep answers structured, encouraging, and focused on high-yield SAT scoring strategies.`;

export interface SatChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function generateLocalSatResponse(userPrompt: string, isEnglish = false): string {
  const lower = userPrompt.toLowerCase();

  if (lower.includes('desmos') || lower.includes('ডেসমস') || lower.includes('graph') || lower.includes('গ্রাফ')) {
    return isEnglish
      ? "🎯 **Digital SAT Desmos Ninja Tricks:**\n\n1. **System of Equations:** Type both equations into Desmos. The point of intersection is your $(x, y)$ solution!\n2. **Finding Zeros / Roots:** Graph $y = f(x)$ and click the x-intercepts.\n3. **Regression Method:** To find unknown constants, type your data table and run $y_1 \\sim m x_1 + b$ or $y_1 \\sim a(x_1 - h)^2 + k$.\n4. **Sliders:** If an equation has an unknown constant like $k$, add a slider and adjust until it matches the given condition.\n\nWhich type of equation would you like to practice on Desmos?"
      : "🎯 **ডিজিটাল SAT ডেসমস (Desmos) স্পেশাল ট্রিকস:**\n\n১. **System of Equations:** দুটি সমীকরণই সরাসরি ডেসমসে টাইপ করো। তাদের ছেদবিন্দুই $(x, y)$ সমাধান!\n২. **রুট / সমাধান বের করা:** সমীকরণটি গ্রাফে বসিয়ে x-অক্ষের ছেদবিন্দুতে ক্লিক করলেই মূল সমাধান পেয়ে যাবে।\n৩. **রিগ্রেশন পদ্ধতি:** অজানা মান বের করতে $y_1 \\sim m x_1 + b$ রিগ্রেশন ব্যবহার করো।\n৪. **স্লাইডার (Sliders):** সমীকরণে $k$ বা $a$ এর মতো প্যারামিটার থাকলে স্লাইডার যুক্ত করে শর্ত অনুযায়ী মান মেলাও।\n\nতুমি কি কোনো নির্দিষ্ট সমীকরণ বা প্রশ্নে ডেসমসের প্রয়োগ দেখতে চাও?";
  }

  if (lower.includes('quadratic') || lower.includes('দ্বিঘাত') || lower.includes('discriminant') || lower.includes('vertex')) {
    return isEnglish
      ? "📐 **Quadratic Equations & Discriminant Master Rules:**\n\nFor $ax^2 + bx + c = 0$:\n- **Discriminant** $\\Delta = b^2 - 4ac$\n  - $\\Delta > 0$: 2 distinct real solutions\n  - $\\Delta = 0$: Exactly 1 real solution (vertex touches x-axis)\n  - $\\Delta < 0$: 0 real solutions (no x-intercepts)\n- **Vertex Form:** $y = a(x - h)^2 + k$ where $(h, k)$ is the minimum or maximum.\n- **Sum & Product of Roots:** Sum $= -\\frac{b}{a}$, Product $= \\frac{c}{a}$."
      : "📐 **দ্বিঘাত সমীকরণ ও নিশ্চয়ক (Discriminant) নিয়মাবলী:**\n\n$ax^2 + bx + c = 0$ সমীকরণের জন্য:\n- **নিশ্চায়ক (Discriminant):** $b^2 - 4ac$\n  - $b^2 - 4ac > 0$: ২টি ভিন্ন বাস্তব সমাধান\n  - $b^2 - 4ac = 0$: ঠিক ১টি বাস্তব সমাধান\n  - $b^2 - 4ac < 0$: কোনো বাস্তব সমাধান নেই\n- **শীর্ষবিন্দু (Vertex Form):** $y = a(x - h)^2 + k$ যেখানে $(h, k)$ হলো সর্বোচ্চ বা সর্বনিম্ন বিন্দু।\n- **মূলদ্বয়ের যোগফল:** $-\\frac{b}{a}$, **গুণফল:** $\\frac{c}{a}$।";
  }

  if (lower.includes('transition') || lower.includes('ট্রানজিশন') || lower.includes('however') || lower.includes('furthermore') || lower.includes('therefore')) {
    return isEnglish
      ? "✍️ **SAT Transition Words Cheat Sheet:**\n\n1. **Continuers (Agreement/Addition):** *Furthermore, Moreover, Additionally, In addition*\n2. **Cause & Effect:** *Therefore, Consequently, As a result, Thus*\n3. **Contradictors (Contrast):** *However, Nevertheless, Nonetheless, Conversely, On the other hand*\n4. **Restatement/Example:** *Specifically, For example, In fact, Indeed*\n\n**Strategy:** Read sentence 1, read sentence 2, determine the logical relationship (same direction vs opposite direction), then pick the matching category."
      : "✍️ **SAT ট্রানজিশন (Transition Words) গাইড:**\n\n১. **একই ধারার তথ্য (Addition):** *Furthermore, Moreover, In addition*\n২. **ফলাফল (Cause & Effect):** *Therefore, Consequently, As a result, Thus*\n৩. **বিপরীত বক্তব্য (Contrast):** *However, Nevertheless, On the other hand, Conversely*\n৪. **উদাহরণ বা ব্যাখ্যা (Example/Restatement):** *Specifically, For example, In fact*\n\n**কৌশল:** ১ম বাক্য ও ২য় বাক্যের অর্থ আগে বুঝে নাও—তারা কি একই যুক্তিকে এগিয়ে নিচ্ছে নাকি বিপরীত যুক্তি দেখাচ্ছে? তারপর সঠিক ক্যাটাগরি বেছে নাও।";
  }

  if (lower.includes('vocab') || lower.includes('শব্দার্থ') || lower.includes('words in context') || lower.includes('context')) {
    return isEnglish
      ? "📖 **Words in Context Strategy:**\n\n1. Cover the answer choices with your hand.\n2. Read the surrounding text and identify the **exact clues/synonyms** the author provides.\n3. Predict your own simple word that fits the blank.\n4. Uncover choices and eliminate words that don't match your prediction.\n\n*Note: SAT tests precision in context, not obscure dictionary trivia!*"
      : "📖 **Words in Context (শব্দার্থ) সমাধানের কৌশল:**\n\n১. অপশনগুলোর দিকে না তাকিয়ে আগে প্যাসেজটি মন দিয়ে পড়ো।\n২. শূন্যস্থানের আগে-পরের বাক্যে লেখক কী ধরনের ক্লু (Clue) দিয়েছেন তা চিহ্নিত করো।\n৩. শূন্যস্থানে নিজের ভাষায় একটি সহজ শব্দ বসাও।\n৪. এবার ৪টি অপশনের সাথে নিজের অনুমিত শব্দের অর্থ মিলিয়ে সঠিক উত্তর নির্বাচন করো।\n\n*মনে রাখবে: SAT-এ শব্দের শাব্দিক অর্থের চেয়ে বাক্যের প্রেক্ষিত (Context) বেশি গুরুত্বপূর্ণ!*";
  }

  return isEnglish
    ? "🦉 Hello! I am **Nini**, your Digital SAT AI Coach! Ask me about any SAT Math question, Desmos strategies, grammar boundaries, Reading comprehension, or score prediction techniques!"
    : "🦉 হ্যালো! আমি **নিনি (Nini)**, চলোশিখি ডিজিটাল SAT এর এআই মাস্টার কোচ! SAT Math, ডেসমস (Desmos) ট্রিকস, রিডিং কম্প্রিহেনশন, গ্রামার রুলস বা যেকোনো প্রশ্ন নিয়ে আমাকে জিজ্ঞাসা করো!";
}

async function tryDirectGemini(messages: SatChatMessage[], systemPrompt: string): Promise<string | null> {
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
          generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }
  } catch (err) {
    console.warn('[satAiService] Direct Gemini call failed:', err);
  }
  return null;
}

export const chatWithSatTutor = async (
  messages: SatChatMessage[],
  context?: { language?: string; section?: string; currentScore?: number }
): Promise<string> => {
  let enrichedPrompt = SAT_SYSTEM_PROMPT;
  if (context?.section) {
    enrichedPrompt += `\nActive Focus: ${context.section} section. Target Score: ${context.currentScore || 1500}+.`;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemPrompt: enrichedPrompt }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.response) return data.response;
    }
  } catch (err) {
    console.warn('[satAiService] /api/gemini fetch failed, falling back:', err);
  }

  // Fallback 1: Direct client Gemini key
  const directResponse = await tryDirectGemini(messages, enrichedPrompt);
  if (directResponse) return directResponse;

  // Fallback 2: Offline intelligent SAT pedagogical response
  const lastUserPrompt = messages.filter(m => m.role === 'user').pop()?.content || '';
  return generateLocalSatResponse(lastUserPrompt, context?.language === 'en');
};
