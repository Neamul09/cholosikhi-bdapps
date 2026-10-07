import type { Lesson } from '../../schema';

// Unit 9: Spell Casting — lessonIds: ['p9-func', 'p9-args', 'p9-exam']
export const unit9Lessons: Lesson[] = [
  {
    id: 'p9-func',
    sectionId: 'p-unit9',
    order: 1,
    title: { en: 'The Magic Spell: Functions with Nini', bn: 'নিনির সাথে জাদুকরী মন্ত্র: ফাংশন' },
    description: {
      en: 'Learn how def and return allow you to write reusable code blocks with Nini.',
      bn: 'নিনির সাথে def ও return দিয়ে একবার কোড লিখে বারবার ব্যবহার করার কৌশল শেখো।'
    },
    difficulty: 'advanced',
    xpReward: 160,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'What is a Function?', bn: 'ফাংশন কী?' },
        body: {
          en: 'Nini says: "A function is like a magical spell you invent once! Instead of writing 10 lines of calculation again and again, you give the spell a name using \'def\', and cast it whenever you need with parentheses ( )!"',
          bn: 'নিনি বলছে: "ফাংশন হলো তোমার নিজের তৈরি একটি জাদুকরী মন্ত্র! একই হিসাব বারবার ১০ লাইন করে না লিখে, তুমি \'def\' দিয়ে মন্ত্রটির একটা সুন্দর নাম দিয়ে দেবে, আর যখনই দরকার হবে নাম ধরে ব্র্যাকেট ( ) দিয়ে ডেকে কাজ করিয়ে নেবে!"'
        },
        code: {
          code: 'def greet():\n    print("স্বাগতম, কোডিং হিরো!")\n\ngreet()  # একবার কল হলো\ngreet()  # আবার কল হলো',
          language: 'python',
          explanation: {
            en: 'Define once with def, then invoke anytime using greet().',
            bn: 'def দিয়ে একবার তৈরি করে যত খুশি ততবার greet() কল করা যায়।'
          }
        }
      },
      {
        heading: { en: 'The return Statement', bn: 'ফলাফল ফেরত আনা: return' },
        body: {
          en: 'Nini\'s Tip: print() just shows words on the screen, but \'return\' actually delivers the computed answer back into your hands so you can use it in other calculations!',
          bn: 'নিনির টিপস: print() কেবল স্ক্রিনে ছবি বা লেখা দেখায়, কিন্তু \'return\' হিসাব করা আসল মানটি তোমার হাতে তুলে দেয় যাতে তুমি সেটি অন্য ভেরিয়েবলে জমা রেখে কাজ করতে পারো!'
        },
        code: {
          code: 'def square(x):\n    return x * x\n\nans = square(6)\nprint(ans)  # 36',
          language: 'python',
          explanation: {
            en: 'return passes 36 back to be stored in the variable ans.',
            bn: 'return এর মাধ্যমে ৩৬ মানটি ফিরে এসে ans ভেরিয়েবলে জমা হয়।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p9-func-e1',
        question: {
          en: 'Which Python keyword is used to define a new function?',
          bn: 'পাইথনে নতুন ফাংশন সংজ্ঞায়িত করতে কোন কি-ওয়ার্ডটি ব্যবহার করা হয়?'
        },
        options: ['def', 'func', 'function', 'define'],
        correctIndex: 0,
        explanation: {
          en: 'The "def" keyword (short for "define") creates a function.',
          bn: 'নিনি বলছে: সাবাশ! পাইথনে ফাংশন বানাতে def (define এর সংক্ষিপ্ত রূপ) কি-ওয়ার্ড লিখতে হয়।'
        },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'p9-func-e2',
        question: {
          en: 'Define a function named "say_hello":',
          bn: '"say_hello" নামে একটি ফাংশন তৈরি করতে কি-ওয়ার্ডটি লেখো:'
        },
        codeTemplate: '___ say_hello():\n    print("হ্যালো চলোশিখি!")',
        blanks: ['def'],
        explanation: {
          en: 'Every function definition starts with the lowercase "def" keyword.',
          bn: 'নিনি বলছে: চমৎকার! ছোট হাতের def দিয়ে ফাংশন শুরু করতে হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p9-func-e3',
        question: {
          en: 'What will be printed when result is displayed?',
          bn: 'নিচের কোডটি চালালে result এর মান কী প্রিন্ট হবে?'
        },
        code: 'def add_ten(n):\n    return n + 10\n\nresult = add_ten(15)\nprint(result)',
        options: ['25', '15', '10', 'None'],
        correctIndex: 0,
        explanation: {
          en: '15 + 10 evaluates to 25, which is returned and printed.',
          bn: 'নিনির টিপস: ১৫ + ১০ = ২৫ মানটি return হয়ে result-এ জমা হওয়ায় ২৫ প্রিন্ট হবে।'
        },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p9-func-e4',
        question: {
          en: 'What does a Python function return by default if it has no return statement?',
          bn: 'যদি কোনো ফাংশনে কোনো return স্টেটমেন্ট না থাকে, তবে সেটি স্বয়ংক্রিয়ভাবে কী ফেরত দেয়?'
        },
        options: ['None', '0', 'False', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'If return is omitted, Python implicitly returns None.',
          bn: 'নিনি বলছে: সবসময় মনে রাখবে! পাইথন ফাংশনে return না দিলে স্বয়ংক্রিয়ভাবে None ফেরত আসে।'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p9-func-e5',
        question: {
          en: 'Find the case-sensitivity bug in this function definition:',
          bn: 'এই কোডের কোন লাইনে বড় হাতের অক্ষরের ভুলের কারণে সিনট্যাক্স এরর হবে?'
        },
        code: 'Def greet():\n    print("স্বাগতম!")\n\ngreet()',
        buggyLine: 1,
        explanation: {
          en: 'Line 1 uses "Def" with a capital D. Python keywords are strictly lowercase: "def".',
          bn: 'নিনির টিপস: ১ নম্বর লাইনে বড় হাতের "Def" লেখা হয়েছে! পাইথনে কি-ওয়ার্ড সবসময় ছোট হাতের "def" হতে হয়।'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p9-func-e6',
        question: {
          en: 'Send the computed answer back to the caller using return:',
          bn: 'হিসাব করা মানটি ফেরত পাঠাতে সঠিক কি-ওয়ার্ডটি লেখো:'
        },
        codeTemplate: 'def double(x):\n    ___ x * 2',
        blanks: ['return'],
        explanation: {
          en: 'return passes the value back to wherever the function was called.',
          bn: 'নিনি বলছে: সাবাশ! ফলাফল ফেরত পাঠাতে return ব্যবহার করা হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p9-func-e7',
        question: {
          en: 'What is printed by this function with early return?',
          bn: 'নিচের ফাংশনটির আউটপুট কী হবে?'
        },
        code: 'def check_num(x):\n    if x > 0:\n        return "পজিটিভ"\n    return "অন্য সংখ্যা"\n\nprint(check_num(5))',
        options: ['পজিটিভ', 'অন্য সংখ্যা', 'পজিটিভ\nঅন্য সংখ্যা', 'Error'],
        correctIndex: 0,
        explanation: {
          en: '5 > 0 is True, so it immediately returns "পজিটিভ" and exits the function!',
          bn: 'নিনির টিপস: ৫ > ০ সত্য হওয়ায় সাথে সাথে "পজিটিভ" রিটার্ন করে ফাংশন থেকে বের হয়ে যায়।'
        },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p9-func-e8',
        question: {
          en: 'Arrange the code to define a cube function, call it with 3, and print the output:',
          bn: 'ঘনের (cube) ফাংশন তৈরি করে ৩ দিয়ে কল করার কোড সাজাও:'
        },
        blocks: [
          'def cube(n):',
          '    return n ** 3',
          'result = cube(3)',
          'print(result)'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Define function, compute n ** 3, call with 3 (result: 27), and print.',
          bn: 'নিনির টিপস: প্রথমে ফাংশন ডিফাইন করো, n ** 3 রিটার্ন করো, ৩ দিয়ে কল করো এবং ২৭ প্রিন্ট করো।'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p9-func-e9',
        question: {
          en: 'What happens to any code written directly after a return statement inside a function?',
          bn: 'ফাংশনের ভেতরে return স্টেটমেন্টের ঠিক পরের লাইনে কোনো কোড লিখলে কী ঘটবে?'
        },
        options: [
          'কোডটি কখনো চলবে না (আনরিচেবল কোড)',
          'কোডটি সবার আগে চলবে',
          'পাইথন SyntaxError দেবে',
          'কোডটি দ্বিগুণ গতিতে চলবে'
        ],
        correctIndex: 0,
        explanation: {
          en: 'return immediately exits the function! Any lines after it in that block are unreachable and ignored.',
          bn: 'নিনি বলছে: মনে রাখবে, return পাওয়া মাত্রই ফাংশন শেষ হয়ে যায়! তাই return এর পরের কোড কখনোই রান করে না।'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p9-func-e10',
        question: {
          en: 'Find the missing colon bug in this function:',
          bn: 'ফাংশন সংজ্ঞায়িত করার কোন লাইনে কোলন (:) বাদ পড়েছে?'
        },
        code: 'def shout(word)\n    return word + "!!!"\n\nprint(shout("হুররে"))',
        buggyLine: 1,
        explanation: {
          en: 'Line 1 is missing the trailing colon: "def shout(word):".',
          bn: 'নিনির টিপস: ১ নম্বর লাইনে def shout(word) এর শেষে কোলন (:) দিতে ভুলে গেছে!'
        },
        xpReward: 25
      }
    ]
  },
  {
    id: 'p9-args',
    sectionId: 'p-unit9',
    order: 2,
    title: { en: 'Passing Messages: Arguments with Nini', bn: 'নিনির সাথে আর্গুমেন্ট ও প্যারামিটার' },
    description: {
      en: 'Feed data into functions using parameters and default values with Nini.',
      bn: 'প্যারামিটার ও ডিফল্ট আর্গুমেন্ট দিয়ে ফাংশনকে বহুমুখী ও শক্তিশালী করে তোলো।'
    },
    difficulty: 'advanced',
    xpReward: 160,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Parameters vs Arguments', bn: 'প্যারামিটার বনাম আর্গুমেন্ট' },
        body: {
          en: 'Nini says: "Parameters are the variables defined in def func(a, b). Arguments are the real values you pass in when calling func(5, 10). You can also set default values like rate=0.0185!"',
          bn: 'নিনি বলছে: "ফাংশন বানানোর সময় def func(a, b)-তে a এবং b হলো প্যারামিটার। আর কল করার সময় func(5, 10)-তে ৫ এবং ১০ হলো আসল আর্গুমেন্ট। চাইলে rate=0.0185 এর মতো ডিফল্ট মানও ঠিক করে রাখা যায়!"'
        },
        code: {
          code: 'def bkash_fee(amount, rate=0.0185):\n    return amount * rate\n\nprint(bkash_fee(1000))        # 18.5 টাকা (ডিফল্ট রেট)\nprint(bkash_fee(1000, 0.015)) # 15.0 টাকা (স্পেশাল রেট)',
          language: 'python',
          explanation: {
            en: 'Uses the default rate of 1.85% unless the caller supplies their own rate.',
            bn: 'কোনো রেট না দিলে ডিফল্ট ১.৮৫% খরচ হিসাব করে, আর নতুন রেট দিলে সেটি ব্যবহার করে।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'fill_blank',
        id: 'p9-args-e1',
        question: {
          en: 'Pass "সাদিয়া" as the argument to the greet function:',
          bn: '"সাদিয়া" নামটি আর্গুমেন্ট হিসেবে দিয়ে greet ফাংশনটি কল করো:'
        },
        codeTemplate: 'def greet(name):\n    print(f"স্বাগতম {name}!")\n\ngreet(___)',
        blanks: ['"সাদিয়া"'],
        explanation: {
          en: 'Pass string arguments inside quotes: greet("সাদিয়া").',
          bn: 'নিনি বলছে: সাবাশ! টেক্সট আর্গুমেন্ট পাঠাতে কোটেশনের ভেতর "সাদিয়া" লিখতে হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p9-args-e2',
        question: {
          en: 'What is printed by this multiple argument sum?',
          bn: 'নিচের কোডের আউটপুট কী হবে?'
        },
        code: 'def multiply(a, b, c):\n    return a * b * c\n\nprint(multiply(2, 3, 4))',
        options: ['24', '9', '234', 'Error'],
        correctIndex: 0,
        explanation: {
          en: '2 * 3 * 4 = 24.',
          bn: 'নিনির টিপস: ২ × ৩ = ৬, ৬ × ৪ = ২৪!'
        },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p9-args-e3',
        question: {
          en: 'What is printed when the default argument is used?',
          bn: 'ডিফল্ট আর্গুমেন্ট ব্যবহার করায় আউটপুট কী আসবে?'
        },
        code: 'def intro(name, city="ঢাকা"):\n    print(f"{name}, {city}")\n\nintro("নিনি")',
        options: ['নিনি, ঢাকা', 'নিনি', 'ঢাকা', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'Because city wasn\'t passed, it uses the default "ঢাকা"!',
          bn: 'নিনি বলছে: দারুণ! city না পাঠানোয় ডিফল্ট মান "ঢাকা" নিয়ে "নিনি, ঢাকা" প্রিন্ট হয়েছে।'
        },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p9-args-e4',
        question: {
          en: 'In Python, what must be the order of parameters with default values?',
          bn: 'পাইথনে ডিফল্ট মানযুক্ত প্যারামিটার কোন স্থানে লিখতে হয়?'
        },
        options: [
          'ডিফল্ট প্যারামিটার সবসময় সাধারণ প্যারামিটারের শেষে থাকতে হবে',
          'ডিফল্ট প্যারামিটার সবার শুরুতে থাকতে হবে',
          'যেখানে খুশি সেখানে দেওয়া যায়',
          'একই ফাংশনে ডিফল্ট ও সাধারণ প্যারামিটার রাখা যায় না'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Non-default arguments cannot follow default arguments! E.g. def func(a, b=2) is valid, but def func(a=2, b) is a SyntaxError.',
          bn: 'নিনির টিপস: ডিফল্ট প্যারামিটার সবসময় ডানপাশে (শেষে) বসাতে হয়, যেমন def f(x, y=10)।'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p9-args-e5',
        question: {
          en: 'Find the parameter order syntax error:',
          bn: 'এই ফাংশনের কোন লাইনে প্যারামিটারের ক্রমানুসারে ভুল আছে?'
        },
        code: 'def calculate(discount=10, price):\n    return price - discount\n\nprint(calculate(100))',
        buggyLine: 1,
        explanation: {
          en: 'Line 1 places default parameter (discount=10) BEFORE non-default parameter (price)! It should be "def calculate(price, discount=10):".',
          bn: 'নিনির টিপস: ১ নম্বর লাইনে ডিফল্ট প্যারামিটার আগে চলে এসেছে! সাধারণ প্যারামিটার (price) আগে বসতে হবে।'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p9-args-e6',
        question: {
          en: 'Complete the discount calculation: price minus (price * discount_pct / 100):',
          bn: 'ডিসকাউন্ট হিসাবের জন্য বিয়োগ চিহ্নটি বসাও:'
        },
        codeTemplate: 'def apply_discount(price, pct):\n    return price ___ (price * pct / 100)',
        blanks: ['-'],
        explanation: {
          en: 'Subtract the discount amount from the original price.',
          bn: 'নিনি বলছে: সাবাশ! আসল দাম থেকে ছাড়ের পরিমাণ বিয়োগ করতে - অপারেটর দেওয়া হয়েছে।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p9-args-e7',
        question: {
          en: 'What is printed by passing keyword arguments in reverse order?',
          bn: 'কীওয়ার্ড আর্গুমেন্ট উল্টো করে পাঠালেও আউটপুট কী হবে?'
        },
        code: 'def describe(name, age):\n    return f"{name} এর বয়স {age}"\n\nprint(describe(age=12, name="নিনি"))',
        options: ['নিনি এর বয়স 12', '12 এর বয়স নিনি', 'Error', 'None'],
        correctIndex: 0,
        explanation: {
          en: 'Named keyword arguments can be passed in any order and still match correctly!',
          bn: 'নিনির টিপস: নাম উল্লেখ করে (keyword arguments) পাঠালে আগে পিছে হলেও পাইথন সঠিক ভেরিয়েবলে মান বসিয়ে নেয়।'
        },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p9-args-e8',
        question: {
          en: 'Arrange a VAT calculator function (5% default VAT) and test it on a 200 taka meal:',
          bn: 'ভ্যাট ক্যালকুলেটর ফাংশন (ডিফল্ট ৫% ভ্যাট) তৈরি ও ২০০ টাকার খাবারে হিসাবের কোড সাজাও:'
        },
        blocks: [
          'def add_vat(price, vat_rate=0.05):',
          '    return price + (price * vat_rate)',
          'total = add_vat(200)',
          'print(f"ভ্যাটসহ বিল: {total} টাকা")'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Define function with default vat_rate, calculate 200 + 10 = 210, and print.',
          bn: 'নিনির টিপস: ফাংশনে ডিফল্ট ভ্যাট ৫% দিয়ে ২০০ টাকার বিল ২১০ টাকা হিসাব করে প্রিন্ট করো।'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p9-args-e9',
        question: {
          en: 'What happens if you call a function with FEWER arguments than required non-default parameters?',
          bn: 'প্রয়োজনীয় প্যারামিটারের চেয়ে কম আর্গুমেন্ট দিয়ে ফাংশন কল করলে কী ঘটবে?'
        },
        options: [
          'TypeError (মিসিং আর্গুমেন্ট এরর)',
          'স্বয়ংক্রিয়ভাবে ০ বসে যাবে',
          'ফাংশনটি কাজ করবে না কিন্তু কোনো এরর দেবে না',
          'None আউটপুট দেবে'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Python raises a TypeError stating that positional arguments are missing.',
          bn: 'নিনি বলছে: পাইথন তখন একটি TypeError ছুঁড়ে দিয়ে বলবে যে প্রয়োজনীয় আর্গুমেন্ট মিসিং রয়েছে।'
        },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p9-args-e10',
        question: {
          en: 'What will this custom power function return?',
          bn: 'নিচের পাওয়ার ফাংশনটির আউটপুট কী হবে?'
        },
        code: 'def power(base, exp=2):\n    return base ** exp\n\nprint(power(4, 3))',
        options: ['64', '16', '12', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'Because exp=3 was provided, it overrides default 2: 4 ** 3 = 64!',
          bn: 'নিনির টিপস: exp এর মান ৩ পাঠানোয় ডিফল্ট ২ ওভাররাইড হয়ে ৪ এর কিউব = ৬৪ হবে!'
        },
        xpReward: 20
      }
    ]
  },
  {
    id: 'p9-exam',
    sectionId: 'p-unit9',
    order: 3,
    isProject: true,
    title: { en: 'Unit 9 Checkpoint: Spell Caster Exam', bn: 'ইউনিট ৯ চেকপয়েন্ট: স্পেল কাস্টার পরীক্ষা' },
    description: {
      en: 'Master functions, scope, return values, and composition in battle-ready challenges!',
      bn: 'ফাংশন, স্কোপ, রিটার্ন মান ও ফাংশন কম্পোজিশন দিয়ে বাস্তব সমস্যার সমাধান করো!'
    },
    difficulty: 'advanced',
    xpReward: 400,
    estimatedMinutes: 18,
    theory: [
      {
        heading: { en: 'The Master Sorcerer', bn: 'মাস্টার জাদুকর' },
        body: {
          en: 'Nini says: "You are casting legendary Python spells now! Functions allow programs to scale from 10 lines to 10 million lines cleanly. Let\'s put all your function skills to the test!"',
          bn: 'নিনি বলছে: "তুমি এখন পাইথনের জাদুকর হয়ে গেছো! ফাংশনের সাহায্যেই সাধারণ ১০ লাইনের কোড বড় হয়ে কোটি লাইনের সফটওয়্যারে পরিণত হয়। আত্মবিশ্বাসের সাথে পরীক্ষাটি দাও!"'
        }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'p9-exam-e1',
        question: {
          en: 'What is the output of nested function calls: square(square(2))?',
          bn: 'square(square(2)) এই নেস্টেড ফাংশন কলের আউটপুট কত হবে?'
        },
        code: 'def square(n):\n    return n * n\n\nprint(square(square(2)))',
        options: ['16', '4', '8', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'Inner call: square(2) = 4. Outer call: square(4) = 16!',
          bn: 'নিনি বলছে: সাবাশ! ভেতরের square(2) দেয় ৪, আর বাইরের square(4) দেয় ৪ × ৪ = ১৬!'
        },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'p9-exam-e2',
        question: {
          en: 'Return the larger of two numbers:',
          bn: 'দুটি সংখ্যার মধ্যে বড় সংখ্যাটি ফেরত দিতে কি-ওয়ার্ডটি লেখো:'
        },
        codeTemplate: 'def maximum(a, b):\n    if a > b:\n        ___ a\n    else:\n        ___ b',
        blanks: ['return', 'return'],
        explanation: {
          en: 'Use "return" to send the winning value back.',
          bn: 'নিনি বলছে: চমৎকার! উভয় শাখার ফলাফল ফেরত পাঠাতে return লিখতে হয়।'
        },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'p9-exam-e3',
        question: {
          en: 'Find the missing parentheses bug in this function call:',
          bn: 'ফাংশন কলের কোন লাইনে বন্ধনী () বাদ পড়েছে?'
        },
        code: 'def cast(spell):\n    print("জাদু করা হলো: " + spell)\n\ncast "অগ্নিবাণ"',
        buggyLine: 4,
        explanation: {
          en: 'Line 4 is missing parentheses! In Python you must call functions with: cast("অগ্নিবাণ").',
          bn: 'নিনির টিপস: ৪ নম্বর লাইনে প্যারেন্থেসিস বাদ পড়েছে! পাইথনে cast("অগ্নিবাণ") এভাবে ব্র্যাকেট দিয়ে কল করতে হয়।'
        },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'p9-exam-e4',
        question: {
          en: 'What does this boolean-returning function output?',
          bn: 'বুলিয়ান ফেরত দেওয়া এই ফাংশনটির আউটপুট কী হবে?'
        },
        code: 'def is_even(n):\n    return n % 2 == 0\n\nprint(is_even(8))',
        options: ['True', 'False', '0', '8'],
        correctIndex: 0,
        explanation: {
          en: '8 % 2 is 0. 0 == 0 evaluates to True! So the function returns True.',
          bn: 'নিনির টিপস: ৮ কে ২ দিয়ে ভাগ করলে ভাগশেষ ০ হয়। ০ == ০ সত্য (True), তাই ফাংশনটি True ফেরত দেবে।'
        },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'p9-exam-e5',
        question: {
          en: 'Arrange a grade scoring function and test it with 85 marks:',
          bn: 'নম্বর দেখে গ্রেড ফেরত দেওয়া ফাংশন তৈরি ও ৮৫ নম্বর টেস্ট করার কোড সাজাও:'
        },
        blocks: [
          'def get_grade(marks):',
          '    if marks >= 80:',
          '        return "A+"',
          '    elif marks >= 70:',
          '        return "A"',
          '    else:',
          '        return "B"',
          'print(get_grade(85))'
        ],
        correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
        explanation: {
          en: 'Define function, branch with return values, and call with 85 to print "A+".',
          bn: 'নিনির টিপস: ফাংশন ডিফাইন করে গ্রেডগুলো return করো, তারপর ৮৫ দিয়ে কল করলে "A+" পাওয়া যাবে।'
        },
        xpReward: 35
      },
      {
        type: 'mcq',
        id: 'p9-exam-e6',
        question: {
          en: 'What is variable scope in Python functions?',
          bn: 'পাইথনে ভেরিয়েবলের স্কোপ (Scope) বলতে কী বোঝায়?'
        },
        options: [
          'ফাংশনের ভেতরে তৈরি ভেরিয়েবল কেবল সেই ফাংশনের ভেতরেই সক্রিয় থাকে (Local Scope)',
          'ফাংশনের ভেতরের ভেরিয়েবল পুরো কম্পিউটারের যেকোনো জায়গায় ব্যবহার করা যায়',
          'স্কোপ কেবল সংখ্যার ক্ষেত্রে প্রযোজ্য',
          'ভেরিয়েবল কখনো মুছে যায় না'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Variables created inside a function are local to that function and cannot be accessed from the outside!',
          bn: 'নিনির টিপস: ফাংশনের ভেতরে তৈরি ভেরিয়েবল লোকাল (লোকাল স্কোপ), বাইরে থেকে এদের সরাসরি ছোঁয়া যায় না।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p9-exam-e7',
        question: {
          en: 'What is printed after calling this list-processing function?',
          bn: 'লিস্ট নিয়ে কাজ করা এই ফাংশনটির আউটপুট কী হবে?'
        },
        code: 'def count_positives(nums):\n    count = 0\n    for x in nums:\n        if x > 0:\n            count += 1\n    return count\n\nprint(count_positives([-2, 5, -1, 8, 3]))',
        options: ['3', '5', '2', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'The positive numbers are 5, 8, and 3 (total 3 numbers)!',
          bn: 'নিনি বলছে: সাবাশ! ধনাত্মক সংখ্যাগুলো হলো ৫, ৮ ও ৩—মোট ৩টি! তাই আউটপুট ৩।'
        },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'p9-exam-e8',
        question: {
          en: 'What is a "pure function" in software engineering?',
          bn: 'সফটওয়্যার ইঞ্জিনিয়ারিংয়ে "পিওর ফাংশন" (Pure Function) বলতে কী বোঝায়?'
        },
        options: [
          'একই ইনপুটের জন্য সবসময় একই আউটপুট দেয় এবং বাইরের কোনো ভেরিয়েবল পরিবর্তন করে না',
          'যে ফাংশনে কোনো প্যারামিটার থাকে না',
          'যে ফাংশন শুধুমাত্র টেক্সট প্রিন্ট করে',
          'যে ফাংশনে কোনো লুপ ব্যবহার করা যায় না'
        ],
        correctIndex: 0,
        explanation: {
          en: 'A pure function produces predictable results solely from its inputs with zero side effects!',
          bn: 'নিনি বলছে: পিওর ফাংশন কোনো সাইড-ইফেক্ট ছাড়া একই ইনপুটের জন্য সবসময় একই নির্ভুল উত্তর দেয়।'
        },
        xpReward: 25
      }
    ]
  }
];

