const API_URL = '/api/gemini';

export const SAT_SYSTEM_PROMPT = `You are 'Nini' (নিনি), the Digital SAT AI Master Coach and Mentor on CholoSikhi SAT Suite.

PRIMARY LANGUAGE & TONE:
- Primary Language: English. You must explain and answer in English by default with clear Markdown and LaTeX/KaTeX math formatting ($...$ inline, $$...$$ block).
- If the student writes to you in Bengali (বাংলা) or explicitly asks for Bengali, respond fluently in Bengali.
- Tone: Encouraging, authoritative, clear, and focused on high-yield College Board exam mastery.

STRICT DOMAIN GUARDRAILS & SCOPE:
- You are STRICTLY RESTRICTED to Digital SAT, College Board test preparation, SAT Math (Algebra, Advanced Math, Problem Solving, Geometry, Trigonometry, Desmos graphing shortcuts), and SAT Reading & Writing (Conventions, Transitions, Words in Context, Command of Evidence, Rhetorical Synthesis).
- If the user asks about ANY off-topic subject (for example: coding questions, general news, entertainment, non-SAT academic subjects, chit-chat, or unrelated tasks), you MUST politely and concisely decline:
  "I am Nini, dedicated exclusively to your Digital SAT success. Let's focus on SAT Math, Desmos tricks, Reading & Writing, or College Board exam strategies! What SAT question or topic can we master together?"

PEDAGOGY & STYLE:
- Break down question archetypes step-by-step using Socratic logic.
- Highlight traps in multiple-choice questions.
- Teach 15-second shortcuts and Desmos calculator methods for Math.
- Format all equations using KaTeX ($...$ and $$...$$), bold key takeaways, and use structured bullet points.`;

export interface SatChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function generateLocalSatResponse(
  userPrompt: string, 
  isEnglish = true,
  history: SatChatMessage[] = []
): string {
  const contextHistory = history.map(m => m.content).join(' ').toLowerCase();
  const userLower = userPrompt.toLowerCase();
  const combinedText = `${contextHistory} ${userLower}`;

  const isExampleRequest = 
    /\b(example|sample|question|problem|practice|show me|give me|test me|exercise|drill)\b/i.test(userPrompt) ||
    /উদাহরণ|প্রশ্ন|অনুশীলন|স্যাম্পল|প্র্যাকটিস/.test(userPrompt);

  // --- EXAMPLE QUESTIONS GENERATOR ---
  if (isExampleRequest) {
    // 1. Quadratic & Vieta's Formula Example
    if (/\b(quadratic|discriminant|vieta|root|vertex|parabola|b\^2\s*-\s*4ac)\b/i.test(combinedText) || /দ্বিঘাত|নিশ্চায়ক|প্যারাবোলা/.test(combinedText)) {
      if (!isEnglish) {
        return `🎯 **ডিজিটাল SAT স্ট্যান্ডার্ড প্রশ্ন (দ্বিঘাত সমীকরণ ও Vieta's Formula):**

**প্রশ্ন:**
সমীকরণ $2x^2 - 12x + k = 0$ এর দুটি বাস্তব সমাধান $r_1$ এবং $r_2$। যদি সমাধানদ্বয়ের গুণফল $7$ হয়, তবে মূলদ্বয়ের যোগফল ($r_1 + r_2$) কত?

**A)** $3$  
**B)** $6$  
**C)** $7$  
**D)** $12$  

---

💡 **Vieta's Formula দিয়ে ৫ সেকেন্ডে সমাধান:**
১. $ax^2 + bx + c = 0$ সমীকরণের জন্য $a = 2$, $b = -12$।
২. মূলদ্বয়ের যোগফল:
   $$\\text{Sum of roots } (r_1 + r_2) = -\\frac{b}{a} = -\\frac{-12}{2} = 6$$
৩. **SAT ট্র্যাপ:** প্রশ্নে গুণফল $7$ দেওয়া হয়েছে বিভ্রান্ত করার জন্য। যোগফল বের করতে $k$-এর মান বের করার কোনো প্রয়োজন নেই!

✅ **সঠিক উত্তর:** **B) 6**`;
      }

      return `🎯 **Authentic Digital SAT Practice Question (Quadratics & Vieta's Shortcuts):**

**Question:**
The quadratic equation $2x^2 - 12x + k = 0$ has two real solutions, $r_1$ and $r_2$. If the product of the solutions is $7$, what is the value of the sum of the solutions $(r_1 + r_2)$?

**A)** $3$  
**B)** $6$  
**C)** $7$  
**D)** $12$  

---

💡 **Step-by-Step Vieta Solution (5-Second Shortcut):**
1. **Identify Coefficients:** In $ax^2 + bx + c = 0$, we have $a = 2$, $b = -12$, and $c = k$.
2. **Apply Sum of Roots Formula:**
   $$\\text{Sum of roots } (r_1 + r_2) = -\\frac{b}{a} = -\\frac{-12}{2} = 6$$
3. **Exam Trap Alert:** The problem gives "product is 7" ($c/a = 7 \\implies k = 14$) as a distractor! You do **not** need to find $k$ or solve for the individual roots with the quadratic formula.

✅ **Correct Answer:** **B) 6**

Would you like to try another problem or see the Desmos graphical approach?`;
    }

    // 2. Desmos / Systems of Equations Example
    if (/\b(desmos|system|linear|intersection|graph|calculator)\b/i.test(combinedText) || /ডেসমস|সমীকরণ জোট|গ্রাফ/.test(combinedText)) {
      return isEnglish
        ? `🎯 **Authentic Digital SAT Practice Question (Systems of Equations):**

**Question:**
$$\\begin{cases} y = 2x + 5 \\\\ y = x^2 - 4x + 14 \\end{cases}$$
How many real $(x, y)$ coordinate solutions satisfy the system of equations above?

**A)** Exactly $0$  
**B)** Exactly $1$  
**C)** Exactly $2$  
**D)** Infinitely many  

---

⚡ **Desmos Calculator Strategy (10 Seconds):**
1. Type \`y = 2x + 5\` on line 1.
2. Type \`y = x^2 - 4x + 14\` on line 2.
3. Observe the intersection points: The line touches the parabola at exactly one point $(3, 11)$ (tangent line).
4. Or algebraically: $x^2 - 6x + 9 = 0 \\implies (x - 3)^2 = 0 \\implies x = 3$.

✅ **Correct Answer:** **B) Exactly 1**`
        : `🎯 **ডিজিটাল SAT সমীকরণ জোট প্রশ্ন:**

$$\\begin{cases} y = 2x + 5 \\\\ y = x^2 - 4x + 14 \\end{cases}$$
প্রদত্ত সমীকরণ জোটের কয়টি বাস্তব $(x, y)$ সমাধান আছে?

**A)** ০টি  
**B)** ঠিক ১টি  
**C)** ২টি  
**D)** অসংখ্য  

⚡ **Desmos ট্রিক:** সমীকরণ দুটি Desmos-এ লিখলেই দেখা যাবে রেখাটি প্যারাবোলাকে ঠিক ১টি বিন্দুতে $(3, 11)$ স্পর্শ করেছে।
✅ **সঠিক উত্তর:** **B) ঠিক ১টি**`;
    }

    // 3. Transitions Example
    if (/\b(transition|however|furthermore|therefore|reading|writing|grammar)\b/i.test(combinedText) || /ট্রানজিশন/.test(combinedText)) {
      return isEnglish
        ? `🎯 **Authentic Digital SAT Reading & Writing Question (Transitions):**

**Text:**
Biologist Dr. Elena Vance initially hypothesized that the cave-dwelling salamanders relied solely on chemical trails for navigation. __________, recent thermal imaging revealed that the species also detects ambient infrared radiation to map subterranean obstacles.

Which choice completes the text with the most logical transition?

**A)** Furthermore,  
**B)** However,  
**C)** Consequently,  
**D)** For example,  

---

💡 **Logic & Elimination:**
- **Sentence 1:** Salamanders relied *solely* on chemical trails (initial belief).
- **Sentence 2:** Recent imaging shows they *also* use infrared radiation (contrast with "solely").
- **Relationship:** Contrast / Contradiction $\\rightarrow$ **However,**

✅ **Correct Answer:** **B) However,**`
        : `🎯 **SAT Reading & Writing ট্রানজিশন প্রশ্ন:**

প্যাসেজে ১ম বাক্যের প্রাথমিক ধারণার সাথে ২য় বাক্যের নতুন আবিষ্কারের **বিপরীত সম্পর্ক** রয়েছে। তাই সঠিক ট্রানজিশন হবে **However,**।
✅ **সঠিক উত্তর:** **B) However,**`;
    }

    // 4. Circle Equation Example
    if (/\b(circle|radius|center|diameter|geometry)\b/i.test(combinedText) || /বৃত্ত|ব্যাসার্ধ/.test(combinedText)) {
      return isEnglish
        ? `🎯 **Authentic Digital SAT Circle Equation Question:**

**Question:**
The equation $x^2 + y^2 - 8x + 6y = 24$ represents a circle in the xy-plane. What is the radius of the circle?

**A)** $5$  
**B)** $7$  
**C)** $\\sqrt{24}$  
**D)** $49$  

---

💡 **Completing the Square Shortcut:**
1. Group $x$ and $y$: $(x^2 - 8x + 16) + (y^2 + 6y + 9) = 24 + 16 + 9$
2. Standard form: $(x - 4)^2 + (y + 3)^2 = 49$
3. Since $r^2 = 49$, the radius is $r = \\sqrt{49} = 7$.

✅ **Correct Answer:** **B) 7**`
        : `🎯 **SAT বৃত্তের সমীকরণ প্রশ্ন:**
$x^2 + y^2 - 8x + 6y = 24$ সমীকরণকে পূর্ণবর্গ করলে পাওয়া যায়: $(x - 4)^2 + (y + 3)^2 = 49 = 7^2$।
অতএব ব্যাসার্ধ $r = 7$।
✅ **সঠিক উত্তর:** **B) 7**`;
    }
  }

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

async function tryDirectCloudflareAI(messages: SatChatMessage[], systemPrompt: string): Promise<string | null> {
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
      console.warn('[satAiService] Direct Cloudflare custom worker failed:', e);
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
      '@cf/meta/llama-3.1-8b-instruct',
      '@cf/mistral/mistral-7b-instruct-v0.2',
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
              max_tokens: 750,
            }),
            signal: AbortSignal.timeout(4500),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data.result?.response || data.result?.choices?.[0]?.message?.content || data.response;
          if (text) return text;
        }
      } catch (e) {
        console.warn(`[satAiService] Direct Cloudflare AI model ${model} failed:`, e);
      }
    }
  }

  return null;
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
        signal: AbortSignal.timeout(4500),
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
      signal: AbortSignal.timeout(4500),
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
  if (context?.language === 'bn') {
    enrichedPrompt += `\nUser Preference: Respond in Bengali (বাংলা).`;
  } else {
    enrichedPrompt += `\nUser Preference: Respond in English.`;
  }

  // 1. Try serverless /api/gemini route
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemPrompt: enrichedPrompt }),
      signal: AbortSignal.timeout(5500),
    });

    if (response.ok) {
      const data = await response.json();
      if (data?.response) return data.response;
    }
  } catch (err) {
    console.warn('[satAiService] /api/gemini fetch failed, falling back:', err);
  }

  // 2. Direct Cloudflare Workers AI client call
  const cfResponse = await tryDirectCloudflareAI(messages, enrichedPrompt);
  if (cfResponse) return cfResponse;

  // 3. Direct client Gemini key (if user configured client key)
  const directResponse = await tryDirectGemini(messages, enrichedPrompt);
  if (directResponse) return directResponse;

  // 4. Direct client free LLM call to Pollinations
  const pollinationsResponse = await tryDirectPollinations(messages, enrichedPrompt);
  if (pollinationsResponse) return pollinationsResponse;

  // 5. Offline intelligent SAT pedagogical response
  const lastUserPrompt = messages.filter(m => m.role === 'user').pop()?.content || '';
  const isBangla = /[\u0980-\u09FF]/.test(lastUserPrompt) || context?.language === 'bn';
  return generateLocalSatResponse(lastUserPrompt, !isBangla, messages);
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
  isEnglish = true
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
  isEnglish = true
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
  isEnglish = true
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
  isEnglish = true
): Promise<string> {
  const langText = isEnglish ? "Provide the response in English." : "বাংলায় সহজে মনে রাখার টিপস ও অর্থ দাও।";

  const prompt = `SAT Vocabulary Word: "${word}"
Definition: ${definition}

Please provide:
1. 💡 An easy-to-remember Mnemonic / Memory Hook.
2. 🏛️ An authentic College Board Digital SAT style sentence using this word.
3. 🎯 3 high-frequency Synonyms and 1 Antonym.

${langText}`;

  return chatWithSatTutor([{ role: 'user', content: prompt }], { language: isEnglish ? 'en' : 'bn' });
}
