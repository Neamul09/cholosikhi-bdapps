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
  // Desmos, graphing, roots, systems of equations, calculator shortcuts
  if (
    /\b(desmos|graph|roots?|systems?|intersection|intercept|calculator|tricks?)\b/i.test(userPrompt) ||
    /ডেসমস|গ্রাফ|রুট|ছেদবিন্দু|ক্যালকুলেটর/.test(userPrompt)
  ) {
    return isEnglish
      ? `🎯 **Top 3 Digital SAT Desmos Calculator Ninja Tricks:**

1. **Solving Systems of Equations Instantly:**
   - Type both equations directly into Desmos (e.g. $y = 2x + 3$ and $y = x^2 - 4x + 8$).
   - Click directly on the intersection point(s) to view the exact $(x, y)$ coordinate solution.

2. **Finding Zeros / Roots & Vertex Extrema:**
   - To solve $ax^2 + bx + c = 0$, graph $y = ax^2 + bx + c$.
   - Click the x-intercepts to read the real roots, and click the parabola's vertex for minimum or maximum values.

3. **Unknown Constants via Sliders & Regression:**
   - For equations with unknown parameters like $k$ (e.g. $2x + ky = 12$), add a slider to inspect parallel lines or tangent conditions.
   - For table coordinate points, use regression $y_1 \\sim mx_1 + b$ or $y_1 \\sim ax_1^2 + bx_1 + c$ to get constants without algebra.

💡 *Pro Tip: Desmos helps solve over 35% of SAT Math questions with zero algebraic errors!*`
      : `🎯 **ডিজিটাল SAT ডেসমস (Desmos) ক্যালকুলেটরের সেরা ৩টি মাস্টার ট্রিক:**

১. **Systems of Equations (সমীকরণ জোট সমাধান):**
   - দুটি সমীকরণ সরাসরি Desmos-এ টাইপ করো (যেমন: $y = 2x + 3$ এবং $y = x^2 - 4x + 8$)।
   - তাদের ছেদবিন্দুতে (Intersection Point) ক্লিক করলেই সরাসরি $(x, y)$ সমাধান পেয়ে যাবে।

২. **Finding Zeros / Roots & Extrema (মূল ও শীর্ষবিন্দু নির্ণয়):**
   - $ax^2 + bx + c = 0$ সমীকরণ সমাধানের জন্য $y = ax^2 + bx + c$ গ্রাফ করো।
   - x-অক্ষের ছেদবিন্দুগুলোতে ক্লিক করলেই সমীকরণের রুট (Roots/Zeros) এবং শীর্ষবিন্দুতে (Vertex) ক্লিক করলেই Maximum/Minimum মান দেখা যাবে।

৩. **Sliders ও Regression দিয়ে ধ্রুবক ($k, a, b$) নির্ণয়:**
   - কোনো সমীকরণে অজানা ধ্রুবক থাকলে (যেমন: $y = mx + k$) Desmos-এ *Slider* যুক্ত করে শর্ত মেলাও।
   - অথবা টেবিল ডেটার ক্ষেত্রে $y_1 \\sim m x_1 + b$ বা $y_1 \\sim a(x_1 - h)^2 + k$ রিগ্রেশন টাইপ করে ১ সেকেন্ডে সহগ বের করে নাও।

💡 *প্র্যাকটিস টিপ: ডিজিটাল SAT Math সেকশনে প্রায় ৩০-৪০% প্রশ্ন Desmos গ্রাফিং দিয়ে সরাসরি সমাধান করা সম্ভব!*`;
  }

  // Quadratic equations, discriminant, vertex
  if (
    /\b(quadratic|discriminant|vertex|parabola|maximum|minimum)\b/i.test(userPrompt) ||
    /দ্বিঘাত|নিশ্চায়ক|শীর্ষবিন্দু|প্যারাবোলা/.test(userPrompt)
  ) {
    return isEnglish
      ? `📐 **Quadratic Equations & Discriminant Master Rules:**

For $ax^2 + bx + c = 0$:
- **Discriminant** $\\Delta = b^2 - 4ac$
  - $\\Delta > 0$: 2 distinct real solutions (2 x-intercepts)
  - $\\Delta = 0$: Exactly 1 real solution (tangent to x-axis)
  - $\\Delta < 0$: 0 real solutions (no x-intercepts)
- **Vertex Form:** $y = a(x - h)^2 + k$ where $(h, k)$ is the vertex:
  - $h = -\\frac{b}{2a}$, $k = c - \\frac{b^2}{4a}$
- **Vieta's Formulas (Sum & Product of Roots):**
  - $\\text{Sum} = -\\frac{b}{a}$, $\\text{Product} = \\frac{c}{a}$`
      : `📐 **দ্বিঘাত সমীকরণ ও নিশ্চয়ক (Discriminant) নিয়মাবলী:**

$ax^2 + bx + c = 0$ সমীকরণের জন্য:
- **নিশ্চায়ক (Discriminant):** $\\Delta = b^2 - 4ac$
  - $\\Delta > 0$: ২টি ভিন্ন বাস্তব সমাধান (2 distinct real solutions)
  - $\\Delta = 0$: ঠিক ১টি বাস্তব সমাধান (1 real solution / vertex touches x-axis)
  - $\\Delta < 0$: কোনো বাস্তব সমাধান নেই (0 real solutions)
- **শীর্ষবিন্দু (Vertex Form):** $y = a(x - h)^2 + k$ যেখানে $(h, k)$ হলো শীর্ষবিন্দু:
  - $h = -\\frac{b}{2a}$, $k = f(h)$
- **মূলদ্বয়ের যোগফল ও গুণফল:**
  - $\\text{Sum} = -\\frac{b}{a}$, $\\text{Product} = \\frac{c}{a}$`;
  }

  // Circle equations & Geometry
  if (
    /\b(circle|radius|diameter|geometry|trigonometry|triangle|sin|cos|tan)\b/i.test(userPrompt) ||
    /বৃত্ত|ব্যাসার্ধ|জ্যামিতি|ত্রিকোণমিতি|ত্রিভুজ/.test(userPrompt)
  ) {
    return isEnglish
      ? `⭕ **Circle Equations & Trigonometry High-Yield Formulas:**

1. **Standard Circle Equation:**
   $$(x - h)^2 + (y - k)^2 = r^2$$
   - Center $= (h, k)$, Radius $= r$
   - *Complete the square* to convert general form $x^2 + y^2 + Ax + By + C = 0$ into standard form.

2. **Right Triangle Trigonometry & Radians:**
   - $\\sin(x) = \\cos(90^\\circ - x)$ or $\\sin(x) = \\cos\\left(\\frac{\\pi}{2} - x\\right)$
   - $\\text{Arc Length} = r\\theta$ (where $\\theta$ is in radians)
   - $\\text{Sector Area} = \\frac{1}{2}r^2\\theta$`
      : `⭕ **বৃত্তের সমীকরণ ও ত্রিকোণমিতি সূত্রাবলী:**

১. **বৃত্তের আদর্শ সমীকরণ (Circle Equation):**
   $$(x - h)^2 + (y - k)^2 = r^2$$
   - কেন্দ্র $= (h, k)$, ব্যাসার্ধ $= r$
   - সাধারণ আকার থেকে পূর্ণবর্গ পদ্ধতিতে (Completing the Square) আদর্শ আকারে রূপান্তর করতে হয়।

২. **ত্রিকোণমিতি সম্পর্ক:**
   - $\\sin(x) = \\cos(90^\\circ - x)$
   - বৃত্তচাপের দৈর্ঘ্য $s = r\\theta$ (যেখানে $\\theta$ রেডিয়ানে)
   - বৃত্তকলার ক্ষেত্রফল $A = \\frac{1}{2}r^2\\theta$`;
  }

  // Transitions
  if (
    /\b(transitions?|however|furthermore|therefore|nevertheless|consequently|moreover)\b/i.test(userPrompt) ||
    /ট্রানজিশন/.test(userPrompt)
  ) {
    return isEnglish
      ? `✍️ **SAT Reading & Writing — Transition Cheat Sheet:**

1. **Continuers (Addition):** *Furthermore, Moreover, Additionally, In addition*
2. **Cause & Effect:** *Therefore, Consequently, As a result, Thus*
3. **Contradictors (Contrast):** *However, Nevertheless, In contrast, On the other hand, Conversely*
4. **Restatement / Specifics:** *Specifically, For instance, In fact, Indeed*

**Strategy:** Read sentence 1 $\\rightarrow$ Read sentence 2 $\\rightarrow$ Determine the logical relationship (same direction vs opposite direction) $\\rightarrow$ Eliminate choices.`
      : `✍️ **SAT ট্রানজিশন (Transition Words) গাইড:**

১. **একই ধারার তথ্য (Addition):** *Furthermore, Moreover, In addition*
২. **ফলাফল (Cause & Effect):** *Therefore, Consequently, As a result, Thus*
৩. **বিপরীত বক্তব্য (Contrast):** *However, Nevertheless, On the other hand, Conversely*
৪. **উদাহরণ বা ব্যাখ্যা (Example/Restatement):** *Specifically, For example, In fact*

**কৌশল:** ১ম বাক্য ও ২য় বাক্যের অর্থ আগে বুঝে নাও—তারা কি একই যুক্তিকে এগিয়ে নিচ্ছে নাকি বিপরীত যুক্তি দেখাচ্ছে? তারপর সঠিক ক্যাটাগরি বেছে নাও।`;
  }

  // Words in Context & Comprehension
  if (
    /\b(vocab|vocabulary|words in context|inference|reading|comprehension)\b/i.test(userPrompt) ||
    /শব্দার্থ|রিডিং/.test(userPrompt)
  ) {
    return isEnglish
      ? `📖 **Words in Context 4-Step Strategy:**

1. Cover the 4 answer choices.
2. Read the surrounding text and identify the author's **direct context clues / synonyms**.
3. Predict your own simple word that completes the meaning.
4. Uncover choices and select the closest match to your prediction.

*Remember: College Board tests contextual precision, not obscure dictionary memorization!*`
      : `📖 **Words in Context (শব্দার্থ) সমাধানের কৌশল:**

১. অপশনগুলোর দিকে না তাকিয়ে আগে প্যাসেজটি মন দিয়ে পড়ো।
২. শূন্যস্থানের আগে-পরের বাক্যে লেখক কী ধরনের ক্লু (Clue) দিয়েছেন তা চিহ্নিত করো।
৩. শূন্যস্থানে নিজের ভাষায় একটি সহজ শব্দ বসাও।
৪. এবার ৪টি অপশনের সাথে নিজের অনুমিত শব্দের অর্থ মিলিয়ে সঠিক উত্তর নির্বাচন করো।

*মনে রাখবে: SAT-এ শব্দের শাব্দিক অর্থের চেয়ে বাক্যের প্রেক্ষিত (Context) বেশি গুরুত্বপূর্ণ!*`;
  }

  return isEnglish
    ? `🦉 Hello! I am **Nini**, your Digital SAT AI Coach! Ask me about any SAT Math question, Desmos strategies, quadratic discriminant, circle equations, grammar boundaries, or Reading comprehension!`
    : `🦉 হ্যালো! আমি **নিনি (Nini)**, চলোশিখি ডিজিটাল SAT এর এআই মাস্টার কোচ! SAT Math, ডেসমস (Desmos) ট্রিকস, রিডিং কম্প্রিহেনশন, গ্রামার রুলস বা যেকোনো প্রশ্ন নিয়ে আমাকে জিজ্ঞাসা করো!`;
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

async function tryDirectPollinations(messages: SatChatMessage[], systemPrompt: string): Promise<string | null> {
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
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    }
  } catch (err) {
    console.warn('[satAiService] Direct Pollinations fallback failed:', err);
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

  // 1. Try serverless /api/gemini route (which supports Gemini, Groq, and Pollinations)
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

  // 2. Direct client Gemini key (if user configured client key)
  const directResponse = await tryDirectGemini(messages, enrichedPrompt);
  if (directResponse) return directResponse;

  // 3. Direct client free LLM call to Pollinations
  const pollinationsResponse = await tryDirectPollinations(messages, enrichedPrompt);
  if (pollinationsResponse) return pollinationsResponse;

  // 4. Offline intelligent SAT pedagogical response
  const lastUserPrompt = messages.filter(m => m.role === 'user').pop()?.content || '';
  return generateLocalSatResponse(lastUserPrompt, context?.language === 'en');
};

/**
 * Explains a specific SAT question in-depth with Socratic steps, trap analysis, and Desmos shortcuts.
 */
export async function explainSatQuestion(
  question: {
    stem: string;
    stimulus?: string;
    options?: { id: string; content: string }[];
    correctAnswers: string[];
    microType?: string;
    skill?: string;
    test?: string;
  },
  userAnswer?: string,
  isEnglish = false
): Promise<string> {
  const optionsText = question.options?.map(o => `${o.id}) ${o.content}`).join('\n') || '';
  const langText = isEnglish ? "Respond in English with clear Markdown and LaTeX math." : "বাংলায় সহজ ভাষায় বুঝিয়ে বলো, সঙ্গে Markdown ও LaTeX Math ব্যবহার করো।";
  
  const prompt = `Break down this Digital SAT question:
Passage/Stimulus: ${question.stimulus || 'N/A'}
Question: ${question.stem}
Choices:
${optionsText}
Correct Answer: ${question.correctAnswers.join(', ')}
${userAnswer ? `Student Selected: ${userAnswer}` : ''}
Micro-Type / Skill: ${question.microType || question.skill || 'General SAT'}

Please provide:
1. 🎯 Socratic Step-by-Step Logic
2. 💡 Why the correct answer is correct
3. ⚠️ Why the student's answer/wrong choices are traps
4. ⚡ 15-second shortcut or Desmos graphing method (if Math)

${langText}`;

  return chatWithSatTutor([{ role: 'user', content: prompt }], { language: isEnglish ? 'en' : 'bn' });
}

/**
 * Analyzes a student's mistake bank and creates a customized study remediation plan.
 */
export async function generateMistakeRemediationPlan(
  mistakes: { microType: string; skill: string; section: string; errorReason?: string }[],
  isEnglish = false
): Promise<string> {
  const summary = mistakes.slice(0, 10).map((m, i) => `${i + 1}. [${m.section}] ${m.skill} (${m.microType}) - Reason: ${m.errorReason || 'Unspecified'}`).join('\n');
  const langText = isEnglish ? "Respond in English." : "বাংলায় গুছিয়ে বলো।";

  const prompt = `A student has recorded the following recent mistakes on Digital SAT practice:
${summary}
Total Mistakes in Bank: ${mistakes.length}

Generate a concise, high-impact 3-step Remediation & Review Plan:
1. Identify the student's #1 weakest concept pattern.
2. Provide specific tactical rules & Desmos/Grammar shortcuts to fix it immediately.
3. Suggest a 3-day targeted drill schedule.

${langText}`;

  return chatWithSatTutor([{ role: 'user', content: prompt }], { language: isEnglish ? 'en' : 'bn' });
}

/**
 * Generates an AI score acceleration plan from current estimated score to target.
 */
export async function generateScoreBoosterPlan(
  currentScore: number,
  targetScore: number,
  mathScore: number,
  rwScore: number,
  isEnglish = false
): Promise<string> {
  const langText = isEnglish ? "Respond in English with formatting." : "বাংলায় অনুপ্রেরণামূলকভাবে বুঝিয়ে দাও।";

  const prompt = `Student Current Scaled Score: ${currentScore} / 1600 (Math: ${mathScore}, Reading/Writing: ${rwScore}).
Target Score: ${targetScore} / 1600.

Provide an AI Score Acceleration Blueprint:
1. High-Yield Math topics to jump +50 points (Algebra, Quadratics, Desmos, Geometry).
2. High-Yield Reading & Writing strategies to jump +50 points (Transitions, Boundaries, Rhetorical synthesis).
3. Exact pacing strategy for Digital SAT Module 1 and Module 2.

${langText}`;

  return chatWithSatTutor([{ role: 'user', content: prompt }], { language: isEnglish ? 'en' : 'bn' });
}

/**
 * Generates context sentences and memory mnemonics for SAT vocabulary words.
 */
export async function generateVocabMnemonic(
  word: string,
  definition: string,
  isEnglish = false
): Promise<string> {
  const langText = isEnglish ? "Provide the response in English." : "বাংলায় সহজে মনে রাখার টিপস ও অর্থ দাও।";

  const prompt = `SAT Vocabulary Word: "${word}"
Definition: ${definition}

Please provide:
1. 💡 An easy-to-remember Mnemonic / Memory Hook (বাংলা বা ইংরেজি সহজ ট্রিক).
2. 🏛️ An authentic College Board Digital SAT style sentence using this word.
3. 🎯 3 high-frequency Synonyms and 1 Antonym.

${langText}`;

  return chatWithSatTutor([{ role: 'user', content: prompt }], { language: isEnglish ? 'en' : 'bn' });
}
