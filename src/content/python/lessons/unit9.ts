import type { Lesson } from '../../schema';

// Unit 9: Spell Casting — lessonIds: ['p9-func', 'p9-args', 'p9-exam']
export const unit9Lessons: Lesson[] = [
  {
    id: 'p9-func',
    sectionId: 'p-unit9',
    order: 1,
    title: { en: 'The Magic Spell', bn: 'জাদুকরী মন্ত্র' },
    description: { en: 'Define reusable blocks with def.', bn: 'def দিয়ে পুনরায় ব্যবহারযোগ্য ব্লক তৈরি করুন।' },
    difficulty: 'advanced',
    xpReward: 150,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Defining Functions', bn: 'ফাংশন সংজ্ঞায়িত করা' },
        body: { en: 'Use def to create reusable blocks of code. Call them by name with parentheses. Functions avoid repeating code.', bn: 'পুনরায় ব্যবহারযোগ্য কোডের ব্লক তৈরি করতে def ব্যবহার করুন। বন্ধনী সহ নাম ধরে কল করুন। ফাংশন কোড পুনরাবৃত্তি এড়ায়।' },
        code: {
          code: 'def greet():\n    print("Hello, adventurer!")\n    print("Welcome to the quest!")\n\ngreet()  # call it\ngreet()  # call again',
          language: 'python',
          explanation: { en: 'Define once, call many times.', bn: 'একবার সংজ্ঞায়িত করুন, অনেকবার কল করুন।' }
        }
      },
      {
        heading: { en: 'Return Values', bn: 'রিটার্ন মান' },
        body: { en: 'Functions can return values using return. The caller receives the result.', bn: 'ফাংশন return ব্যবহার করে মান ফেরত দিতে পারে। কলার ফলাফল পায়।' },
        code: {
          code: 'def double(n):\n    return n * 2\n\nresult = double(5)\nprint(result)  # 10',
          language: 'python',
          explanation: { en: 'return sends the computed value back.', bn: 'return গণনা করা মান ফেরত পাঠায়।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p9-func-e1',
        question: { en: 'Which keyword defines a function?', bn: 'কোন কিওয়ার্ড ফাংশন সংজ্ঞায়িত করে?' },
        options: ['def', 'func', 'function', 'define'],
        correctIndex: 0,
        explanation: { en: 'def is short for "define".', bn: 'def হলো "define" এর সংক্ষিপ্ত রূপ।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p9-func-e2',
        question: { en: 'Define a function named "launch":', bn: '"launch" নামে একটি ফাংশন সংজ্ঞায়িত করুন:' },
        codeTemplate: '___ launch():\n    print("Launching!")',
        blanks: ['def'],
        explanation: { en: 'def keyword starts the function definition.', bn: 'def কিওয়ার্ড ফাংশন সংজ্ঞা শুরু করে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p9-func-e3',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'def shout():\n    return "YEAH!"\n\nmsg = shout()\nprint(msg)',
        options: ['YEAH!', 'shout()', 'Nothing'],
        correctIndex: 0,
        explanation: { en: 'return passes "YEAH!" back, stored in msg.', bn: 'return "YEAH!" ফেরত পাঠায়, msg এ জমা হয়।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p9-func-e4',
        question: { en: 'What happens if a function has no return statement?', bn: 'ফাংশনে return না থাকলে কী হয়?' },
        options: ['Returns None', 'Returns 0', 'Raises Error', 'Returns the last variable'],
        correctIndex: 0,
        explanation: { en: 'Python functions without return implicitly return None.', bn: 'return ছাড়া পাইথন ফাংশন স্বাভাবিকভাবে None ফেরত দেয়।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p9-func-e5',
        question: { en: 'Fix the function definition:', bn: 'ফাংশন সংজ্ঞা ঠিক করুন:' },
        code: 'Def say_hi():\n    print("Hi!")\n\nsay_hi()',
        buggyLine: 1,
        explanation: { en: 'def must be lowercase. Python is case-sensitive.', bn: 'def অবশ্যই ছোট হাতের হবে। পাইথন কেস-সংবেদনশীল।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p9-args',
    sectionId: 'p-unit9',
    order: 2,
    title: { en: 'Passing Messages', bn: 'বার্তা পাঠানো' },
    description: { en: 'Pass data into functions with arguments.', bn: 'আর্গুমেন্টের মাধ্যমে ফাংশনে ডাটা পাঠান।' },
    difficulty: 'advanced',
    xpReward: 150,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Parameters & Arguments', bn: 'প্যারামিটার ও আর্গুমেন্ট' },
        body: { en: 'Parameters are the names inside def(). Arguments are the actual values you pass when calling.', bn: 'প্যারামিটার হলো def() এর ভেতরের নাম। আর্গুমেন্ট হলো কল করার সময় দেওয়া আসল মান।' },
        code: {
          code: 'def greet(name, level):\n    print(f"Hello {name}, level {level}!")\n\ngreet("Zara", 5)',
          language: 'python',
          explanation: { en: '"Zara" and 5 are passed as name and level.', bn: '"Zara" এবং 5 name এবং level হিসেবে পাঠানো হয়।' }
        }
      },
      {
        heading: { en: 'Default Arguments', bn: 'ডিফল্ট আর্গুমেন্ট' },
        body: { en: 'Give parameters a default value. If caller skips it, the default is used.', bn: 'প্যারামিটারকে ডিফল্ট মান দিন। কলার না দিলে ডিফল্ট ব্যবহার হয়।' },
        code: {
          code: 'def power(base, exp=2):\n    return base ** exp\n\nprint(power(3))    # 9\nprint(power(3, 3)) # 27',
          language: 'python',
          explanation: { en: 'exp defaults to 2 if not provided.', bn: 'প্রদান না করলে exp ডিফল্ট ২।' }
        }
      }
    ],
    exercises: [
      {
        type: 'fill_blank',
        id: 'p9-args-e1',
        question: { en: 'Call greet with "Joy":', bn: '"Joy" দিয়ে greet কল করুন:' },
        codeTemplate: 'def greet(name):\n    print("Hi " + name)\n\ngreet(___)',
        blanks: ['"Joy"'],
        explanation: { en: 'Pass the string "Joy" as the argument.', bn: '"Joy" স্ট্রিং আর্গুমেন্ট হিসেবে পাঠান।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p9-args-e2',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'def add(a, b):\n    return a + b\n\nresult = add(3, 4)\nprint(result)',
        options: ['7', '34', 'Error'],
        correctIndex: 0,
        explanation: { en: '3 + 4 = 7.', bn: '৩ + ৪ = ৭।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p9-args-e3',
        question: { en: 'How many arguments can a function take?', bn: 'একটি ফাংশন কতটি আর্গুমেন্ট নিতে পারে?' },
        options: ['As many as needed', 'Only 1', 'Only 2', 'Max 10'],
        correctIndex: 0,
        explanation: { en: 'Python functions can accept any number of parameters.', bn: 'পাইথন ফাংশন যেকোনো সংখ্যক প্যারামিটার গ্রহণ করতে পারে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p9-args-e4',
        question: { en: 'What is printed using default?', bn: 'ডিফল্ট ব্যবহার করলে কী প্রিন্ট হবে?' },
        code: 'def greet(name, msg="Hello"):\n    print(msg + " " + name)\n\ngreet("Riya")',
        options: ['Hello Riya', 'Riya Hello', 'Error'],
        correctIndex: 0,
        explanation: { en: 'msg defaults to "Hello" when not provided.', bn: 'প্রদান না করলে msg ডিফল্ট "Hello"।' },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'p9-args-e5',
        question: { en: 'Build a discount calculator function:', bn: 'একটি ডিসকাউন্ট ক্যালকুলেটর ফাংশন তৈরি করুন:' },
        blocks: ['def discount(price, pct):', '    return price - (price * pct / 100)', 'final = discount(200, 10)', 'print(final)'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Define, compute discount, call, print.', bn: 'সংজ্ঞায়িত করুন, ডিসকাউন্ট হিসাব করুন, কল করুন, প্রিন্ট করুন।' },
        xpReward: 35
      }
    ]
  },
  {
    id: 'p9-exam',
    sectionId: 'p-unit9',
    order: 3,
    isProject: true,
    title: { en: 'Unit Exam: Spell Caster', bn: 'ইউনিট পরীক্ষা: স্পেল কাস্টার' },
    description: { en: 'Master functions with arguments and return values.', bn: 'আর্গুমেন্ট ও রিটার্ন মান সহ ফাংশন আয়ত্ত করুন।' },
    difficulty: 'advanced',
    xpReward: 400,
    estimatedMinutes: 18,
    theory: [
      {
        heading: { en: 'Functions Summary', bn: 'ফাংশনের সারসংক্ষেপ' },
        body: { en: 'def name(params): defines. return sends value back. Call with name(args). Use defaults when appropriate.', bn: 'def name(params): সংজ্ঞায়িত করে। return মান ফেরত পাঠায়। name(args) দিয়ে কল করুন। প্রযোজ্য হলে ডিফল্ট ব্যবহার করুন।' }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'p9-exam-e1',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'def square(n):\n    return n * n\n\nprint(square(square(2)))',
        options: ['16', '4', '8'],
        correctIndex: 0,
        explanation: { en: 'square(2) = 4. square(4) = 16.', bn: 'square(2) = 4। square(4) = 16।' },
        xpReward: 40
      },
      {
        type: 'fill_blank',
        id: 'p9-exam-e2',
        question: { en: 'Return a value from the function:', bn: 'ফাংশন থেকে একটি মান ফেরত দিন:' },
        codeTemplate: 'def max_two(a, b):\n    if a > b:\n        ___ a\n    else:\n        ___ b',
        blanks: ['return', 'return'],
        explanation: { en: 'return sends the larger value back.', bn: 'return বড় মানটি ফেরত পাঠায়।' },
        xpReward: 35
      },
      {
        type: 'bug_hunt',
        id: 'p9-exam-e3',
        question: { en: 'Fix the missing call:', bn: 'অনুপস্থিত কল ঠিক করুন:' },
        code: 'def cast(spell):\n    print("Casting " + spell)\n\ncast "Fireball"',
        buggyLine: 4,
        explanation: { en: 'Need parentheses: cast("Fireball").', bn: 'বন্ধনী লাগবে: cast("Fireball")।' },
        xpReward: 35
      },
      {
        type: 'mcq',
        id: 'p9-exam-e4',
        question: { en: 'What is a "pure function"?', bn: '"pure function" কী?' },
        options: ['Returns same output for same input, no side effects', 'A function with no parameters', 'A function that prints output', 'A function inside a class'],
        correctIndex: 0,
        explanation: { en: 'Pure functions are predictable and safe.', bn: 'Pure function পূর্বানুমানযোগ্য এবং নিরাপদ।' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'p9-exam-e5',
        question: { en: 'Build a function to grade scores:', bn: 'স্কোর গ্রেড করার ফাংশন তৈরি করুন:' },
        blocks: ['def grade(score):', '    if score >= 90:', '        return "A"', '    elif score >= 70:', '        return "B"', '    else:', '        return "C"', 'print(grade(75))'],
        correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
        explanation: { en: 'Function with if/elif/else returning grade strings.', bn: 'if/elif/else সহ গ্রেড স্ট্রিং ফেরত দেওয়া ফাংশন।' },
        xpReward: 60
      }
    ]
  }
];
