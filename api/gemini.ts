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
  '@cf/meta/llama-3.2-1b-instruct',
  '@cf/meta/llama-3.1-8b-instruct',
];

/**
 * Intelligent domain-aware pedagogical fallback response when external APIs are unavailable.
 */
function generateFallbackResponse(userPrompt: string, systemPrompt?: string, messages: any[] = []): string {
  const hasBanglaChars = /[\u0980-\u09FF]/.test(userPrompt);
  const explicitlyRequestsBangla = /\b(in\s+bangla|in\s+bengali|বাংলায়|বাংলায়)\b/i.test(userPrompt);
  const isBangla = hasBanglaChars || explicitlyRequestsBangla;
  const isEnglish = !isBangla;
  
  const sysLower = (systemPrompt || '').toLowerCase();
  const userLower = userPrompt.toLowerCase();
  const contextHistory = messages.map(m => m.content || '').join(' ').toLowerCase();
  const combinedText = `${contextHistory} ${userLower}`;

  const isExplicitPythonSys = sysLower.includes('python') || sysLower.includes('programming tutor') || sysLower.includes('cs mentor');
  const isExplicitSatSys = sysLower.includes('sat') || sysLower.includes('college board');

  let isPythonContext = isExplicitPythonSys;
  let isSatContext = isExplicitSatSys;

  if (!isExplicitPythonSys && !isExplicitSatSys) {
    const satScore = (combinedText.match(/\b(sat|desmos|algebra|quadratic|discriminant|geometry|trigonometry|roots|vertex|parabola|circle|transitions?|reading|writing|vocab|evidence|college\s*board)\b/g) || []).length +
      (/স্যাট|ডেসমস|দ্বিঘাত|নিশ্চায়ক|সমীকরণ|বৃত্ত/.test(combinedText) ? 2 : 0);
    
    const pyScore = (combinedText.match(/\b(python|coding|programming|code|debug|debugging|syntax|loop|loops|function|functions|def|return|variable|variables|list|dict|array|algorithm|complexity)\b/g) || []).length +
      (/পাইথন|প্রোগ্রামিং|কোড|লুপ|ফাংশন|ভেরিয়েবল|বাগ|ডিবাগ/.test(combinedText) ? 2 : 0);

    if (pyScore > satScore) {
      isPythonContext = true;
    } else if (satScore > 0) {
      isSatContext = true;
    } else {
      isPythonContext = true;
    }
  }

  const isExampleRequest = 
    /\b(example|sample|question|questions|problem|problems|practice|show me|give me|test me|exercise|drill)\b/i.test(userPrompt) ||
    /উদাহরণ|প্রশ্ন|অনুশীলন|স্যাম্পল|প্র্যাকটিস/.test(userPrompt);

  // --- PYTHON & CODING DOMAIN FALLBACKS ---
  if (isPythonContext && !isExplicitSatSys) {
    // SAT off-topic question asked in Python tutor
    if (/\b(sat|college\s*board|reading\s*&\s*writing|reading\s+and\s+writing)\b/i.test(userPrompt) || /স্যাট/.test(userPrompt)) {
      return isEnglish
        ? "👋 I am **Nini**, your AI Programming Tutor! I specialize exclusively in Python code, data structures, algorithms, and debugging.\n\n💡 *Tip: For Digital SAT Math, Desmos shortcuts, and Reading & Writing practice, please head over to the **SAT Suite**!*"
        : "👋 আমি **নিনি (Nini)**, চলোশিখির পাইথন ও প্রোগ্রামিং এআই টিউটর! আমি মূলত পাইথন কোডিং, অ্যালগরিদম ও বাগ ফিক্সিং নিয়ে সাহায্য করি।\n\n💡 *টিপ: ডিজিটাল SAT প্রস্তুতি ও অনুশীলনের জন্য উপরের মেনু থেকে **SAT Suite** এ যান!*";
    }
    // Debugging / Errors / Syntax
    if (/\b(debug|debugging|errors?|bugs?|syntaxerror|nameerror|typeerror|indentation|fix|broken)\b/i.test(combinedText) || /ভুল|বাগ|ডিবাগ|এরর|সিনট্যাক্স/.test(combinedText)) {
      if (isBangla) {
        return `🔍 **কোড ডিবাগিং (Debugging) ও সাধারণ ভুল সংশোধনের ৩টি সেরা নিয়ম:**

১. **সিনট্যাক্স ও কোলন (Syntax & Colons):**
   - \`if\`, \`elif\`, \`else\`, \`for\`, \`while\`, \`def\`, \`class\` লাইনের শেষে কোলন (\`:\`) দিয়েছ কিনা লক্ষ্য করো।
২. **ইনডেন্টেশন (Indentation):**
   - Python-এ ট্যাব এবং স্পেস মেশানো যাবে না। প্রতিটি ব্লকের জন্য সমান ৪টি স্পেস ব্যবহার করো (\`IndentationError\` এড়াতে)।
৩. **ভেরিয়েবল নাম ও টাইপ (Variables & Types):**
   - ছোট-বড় হাতের অক্ষরের অমিল (\`NameError\`) বা সংখ্যার সাথে স্ট্রিং যোগ করার চেষ্টা (\`TypeError\`) হচ্ছে কিনা চেক করো।

💡 *টিপ: তোমার কোডটি এখানে পেস্ট করো, আমি ঠিক কোথায় ভুল আছে দেখিয়ে দেব!*`;
      }

      return `🔍 **Python Debugging & Common Error Checklist:**

1. **Syntax & Missing Colons (\`SyntaxError\`):**
   - Ensure a colon (\`:\`) is at the end of every \`if\`, \`for\`, \`while\`, \`def\`, and \`class\` statement.
2. **Indentation Consistency (\`IndentationError\`):**
   - Never mix tabs and spaces. Use a consistent 4 spaces per indentation level.
3. **Name & Type Consistency (\`NameError\` / \`TypeError\`):**
   - Verify variable spelling and case-sensitivity.
   - Avoid adding strings directly to numbers without conversion (use \`str(val)\` or f-strings \`f"{val}"\`).

💡 *Pro Tip: Paste your buggy code snippet here and I will help isolate and fix the bug step-by-step!*`;
    }

    // Loops / Iteration
    if (/\b(loops?|while|iteration|iterating|for\s+loop)\b/i.test(combinedText) || /\bfor\s+\w+\s+in\b/i.test(combinedText) || /লুপ/.test(combinedText)) {
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

    // Functions / Methods / Return
    if (/\b(def|functions?|methods?|parameters?|arguments?|return)\b/i.test(combinedText) || /ফাংশন/.test(combinedText)) {
      if (isBangla) {
        return `💡 **ফাংশন (Function) কী?**

ফাংশন হলো কোডের একটি রিইউজেবল ব্লক যা নির্দিষ্ট কোনো কাজ সম্পাদন করে।

\`\`\`python
def greet(name):
    return f"হ্যালো, {name}!"

print(greet("শিক্ষার্থী"))
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

    // Variables & Data Types
    if (/\b(variables?|data\s*types?|integers?|strings?|boolean|float|lists?|dictionar(?:y|ies))\b/i.test(combinedText) || /ভেরিয়েবল|ভেরিয়েবল|ডেটা\s*টাইপ|লিস্ট|ডিকশনারি/.test(combinedText)) {
      if (isBangla) {
        return `💡 **ভেরিয়েবল (Variable) ও ডেটা টাইপ:**

ভেরিয়েবল হলো ডেটা জমা রাখার পাত্র বা মেমরি বক্স:
\`\`\`python
name = "CholoSikhi"   # str (Text)
score = 100            # int (Number)
rating = 4.9          # float (Decimal)
is_active = True      # bool (Boolean)
skills = ["Python", "Algorithms"]  # list
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
items = ["Python", "Algorithms"]  # list
\`\`\``;
    }

    // Default Python Welcome
    if (isBangla) {
      return "👋 আমি **নিনি (Nini)**, চলোশিখির পাইথন এআই টিউটর! প্রোগ্রামিং সমস্যা, কোডিং প্রশ্ন বা অ্যালগরিদম নিয়ে যেকোনো কিছু আমাকে জিজ্ঞাসা করতে পারো!";
    }

    return "👋 I am **Nini**, your AI Programming Tutor on CholoSikhi! Ask me anything about Python syntax, data structures, algorithms, or debugging!";
  }

  // --- SAT DOMAIN FALLBACKS ---
  if (isSatContext) {
    // SAT Example Question Follow-up
    if (isExampleRequest) {
      if (/\b(quadratic|discriminant|vieta|root|vertex|parabola|b\^2\s*-\s*4ac)\b/i.test(combinedText) || /দ্বিঘাত|নিশ্চায়ক|প্যারাবোলা/.test(combinedText)) {
        if (isBangla) {
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
3. Observe the intersection point: The line is tangent to the parabola at exactly $(3, 11)$.
4. Algebraically: $x^2 - 6x + 9 = 0 \\implies (x - 3)^2 = 0 \\implies x = 3$.

✅ **Correct Answer:** **B) Exactly 1**`
          : `🎯 **ডিজিটাল SAT সমীকরণ জোট প্রশ্ন:**
$$\\begin{cases} y = 2x + 5 \\\\ y = x^2 - 4x + 14 \\end{cases}$$
প্রদত্ত সমীকরণ জোটের ঠিক ১টি বাস্তব সমাধান বিন্দু রয়েছে $(3, 11)$।
✅ **সঠিক উত্তর:** **B) ঠিক ১টি**`;
      }

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

      // General Hard SAT Practice Challenge (default if no specific topic specified)
      return isEnglish
        ? `🎯 **Authentic Digital SAT Hard Challenge Set:**

### 📐 Math Challenge (Advanced Algebra & Constants):
**Question 1:**
The quadratic equation $x^2 - 6x + c = 0$ has exactly one real solution. What is the value of the constant $c$?

**A)** $-9$  
**B)** $3$  
**C)** $6$  
**D)** $9$  

💡 **Discriminant Method (10 Seconds):**
For exactly one real solution, the discriminant $\\Delta = b^2 - 4ac$ must equal $0$:
$$(-6)^2 - 4(1)(c) = 0 \\implies 36 = 4c \\implies c = 9$$
✅ **Correct Answer:** **D) 9**

---

### ✍️ Reading & Writing Challenge (Logical Transitions):
**Question 2:**
Researchers initially suspected that nocturnal moths relied exclusively on celestial visual cues for nocturnal navigation. __________, subsequent controlled laboratory experiments in absolute darkness proved that the species utilizes geomagnetic inclination to orient their flight paths.

Which choice completes the text with the most logical transition?

**A)** In addition,  
**B)** However,  
**C)** Consequently,  
**D)** For instance,  

💡 **Logic:** Sentence 1 states the initial exclusive assumption; Sentence 2 provides contradictory evidence. Hence, a contrast transition (**However,**) is required.
✅ **Correct Answer:** **B) However,**

---
Which SAT section or micro-type would you like to master next?`
        : `🎯 **ডিজিটাল SAT হার্ড প্র্যাকটিস চ্যালেঞ্জ:**

### 📐 Math প্রশ্ন (দ্বিঘাত সমীকরণ ও নিশ্চয়ক):
$x^2 - 6x + c = 0$ সমীকরণের ঠিক ১টি বাস্তব সমাধান থাকলে ধ্রুবক $c$-এর মান কত?
**উত্তর:** নিশ্চয়ক $b^2 - 4ac = 0 \\implies 36 - 4c = 0 \\implies c = 9$।

### ✍️ Reading/Writing প্রশ্ন (Transitions):
প্রাথমিক ধারণার সাথে নতুন প্রমাণের বৈপরীত্য থাকলে সঠিক ট্রানজিশন হবে **However,**।`;
    }

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

    // Quadratic / Discriminant / Vertex / Vieta
    if (/\b(quadratic|discriminant|vieta|roots?|vertex|parabola|maximum|minimum)\b/i.test(userPrompt) || /দ্বিঘাত|নিশ্চায়ক|প্যারাবোলা|ভিয়েতা/.test(userPrompt)) {
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
2. **কারণ ও ফলাফল (Cause/Effect):** *Therefore, Consequently, As a result, Thus*
3. **বিপরীত যুক্তি (Contrast):** *However, Nevertheless, In contrast, On the other hand*
4. **উদাহরণ ও বিশদকরণ (Example/Restatement):** *Specifically, For instance, In fact, Indeed*

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

  // Fallback if neither context specifically matched
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
 * 2. Cloudflare Workers AI API (Direct Workers AI Gateway)
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
        signal: AbortSignal.timeout(5500),
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
      try {
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: formattedMessages,
            max_tokens: 500,
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.result?.response || data.result?.choices?.[0]?.message?.content || data.response;
          if (text) return text;
        }
      } catch (e) {
        console.warn(`[Cloudflare Workers AI] Attempt on ${model} failed:`, e);
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
          max_tokens: 500,
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
      signal: AbortSignal.timeout(3000),
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
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
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

export default async function handler(req: any, res?: any) {
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  const isNode = Boolean(res && typeof res.status === 'function');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    if (isNode) {
      Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
      return res.status(204).end();
    }
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    if (isNode) {
      Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
      return res.status(405).json({ error: 'Method not allowed' });
    }
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  let lastUserMessage = '';
  let messages: any[] = [];
  let systemPrompt: string | undefined = undefined;

  try {
    let bodyData: any = {};
    if (typeof req.json === 'function') {
      try {
        bodyData = await req.json();
      } catch {
        bodyData = {};
      }
    } else if (req.body) {
      bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }

    messages = bodyData.messages || [];
    systemPrompt = bodyData.systemPrompt;
    lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || '';

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
      textResponse = generateFallbackResponse(lastUserMessage, systemPrompt, messages);
    }

    if (isNode) {
      Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
      return res.status(200).json({ response: textResponse });
    }

    return new Response(JSON.stringify({ response: textResponse }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('API Error:', error);
    const fallbackText = generateFallbackResponse(lastUserMessage, systemPrompt, messages);
    if (isNode) {
      Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
      return res.status(200).json({ response: fallbackText });
    }

    return new Response(JSON.stringify({ 
      response: fallbackText 
    }), {
      status: 200,
      headers: corsHeaders,
    });
  }
}
