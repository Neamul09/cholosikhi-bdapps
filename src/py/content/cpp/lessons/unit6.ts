import type { Lesson } from '../../schema';

// C++ Unit 6: Cycle Master — lessonIds: ['c6-for', 'c6-while', 'c6-exam']
export const unit6Lessons: Lesson[] = [
  {
    id: 'c6-for',
    sectionId: 'c-unit6',
    order: 1,
    title: { en: 'The Assembly Line', bn: 'অ্যাসেম্বলি লাইন' },
    description: { en: 'Master the C++ for loop.', bn: 'C++ for লুপ আয়ত্ত করুন।' },
    difficulty: 'intermediate',
    xpReward: 130,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'C++ For Loop', bn: 'C++ For লুপ' },
        body: { en: 'The for loop has 3 parts: initialization; condition; update. All inside the parentheses, separated by semicolons.', bn: 'for লুপের ৩টি অংশ: initialization; condition; update। সব বন্ধনীর ভেতরে, সেমিকোলন দিয়ে আলাদা।' },
        code: {
          code: 'for (int i = 0; i < 5; i++) {\n  cout << "Item " << i << endl;\n}',
          language: 'cpp',
          explanation: { en: 'Prints Item 0 through Item 4.', bn: 'Item 0 থেকে Item 4 পর্যন্ত প্রিন্ট করে।' }
        }
      },
      {
        heading: { en: 'Range-Based For (C++11)', bn: 'রেঞ্জ-ভিত্তিক For (C++11)' },
        body: { en: 'Iterate directly over arrays: for (int x : arr). Cleaner for simple iteration.', bn: 'সরাসরি অ্যারেতে ইটারেট করুন: for (int x : arr)। সাধারণ ইটারেশনের জন্য পরিষ্কার।' },
        code: {
          code: 'int scores[] = {90, 85, 92};\nfor (int s : scores) {\n  cout << s << endl;\n}',
          language: 'cpp',
          explanation: { en: 'Loops over each element in scores.', bn: 'scores এর প্রতিটি উপাদানে লুপ করে।' }
        }
      }
    ],
    exercises: [
      {
        type: 'fill_blank',
        id: 'c6-for-e1',
        question: { en: 'Complete the for loop header:', bn: 'for লুপ হেডার সম্পূর্ণ করুন:' },
        codeTemplate: 'for (int i = 0; i < 10; ___)  { }',
        blanks: ['i++'],
        explanation: { en: 'i++ increments i by 1 each iteration.', bn: 'i++ প্রতিটি ইটারেশনে i 1 বাড়ায়।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c6-for-e2',
        question: { en: 'What is the sum?', bn: 'যোগফল কত?' },
        code: 'int sum = 0;\nfor (int i = 1; i <= 4; i++) {\n  sum += i;\n}\ncout << sum;',
        options: ['10', '4', '6'],
        correctIndex: 0,
        explanation: { en: '1+2+3+4 = 10.', bn: '১+২+৩+৪ = ১০।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'c6-for-e3',
        question: { en: 'What separates the 3 parts of a for loop in C++?', bn: 'C++ এ for লুপের ৩টি অংশ কী দিয়ে আলাদা?' },
        options: ['Semicolons ;', 'Commas ,', 'Colons :', 'Pipes |'],
        correctIndex: 0,
        explanation: { en: 'for (init; condition; update) — always semicolons.', bn: 'for (init; condition; update) — সবসময় সেমিকোলন।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'c6-for-e4',
        question: { en: 'Fix the loop syntax:', bn: 'লুপ সিনট্যাক্স ঠিক করুন:' },
        code: 'for (int i = 0, i < 5, i++) {\n  cout << i;\n}',
        buggyLine: 1,
        explanation: { en: 'Commas should be semicolons: for (int i=0; i<5; i++).', bn: 'কমা হওয়া উচিত সেমিকোলন: for (int i=0; i<5; i++)।' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'c6-for-e5',
        question: { en: 'Print multiplication table of 5:', bn: '৫ এর গুণ ছক প্রিন্ট করুন:' },
        blocks: ['for (int i = 1; i <= 10; i++) {', '  cout << 5 * i << endl;', '}'],
        correctOrder: [0, 1, 2],
        explanation: { en: 'Multiply 5 by each i from 1 to 10.', bn: '1 থেকে 10 পর্যন্ত প্রতিটি i দিয়ে 5 গুণ করুন।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'c6-while',
    sectionId: 'c-unit6',
    order: 2,
    title: { en: 'The Watch Tower', bn: 'পর্যবেক্ষণ টাওয়ার' },
    description: { en: 'C++ while and do-while loops.', bn: 'C++ while এবং do-while লুপ।' },
    difficulty: 'intermediate',
    xpReward: 130,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'while Loop', bn: 'while লুপ' },
        body: { en: 'while (condition) repeats as long as condition is true. Like Python\'s while, but with parentheses.', bn: 'while (condition) শর্ত সত্য থাকা পর্যন্ত পুনরাবৃত্তি করে। Python এর while এর মতো, কিন্তু বন্ধনী সহ।' },
        code: {
          code: 'int fuel = 3;\nwhile (fuel > 0) {\n  cout << "Driving!" << endl;\n  fuel--;\n}',
          language: 'cpp',
          explanation: { en: 'Loops until fuel runs out.', bn: 'জ্বালানি শেষ না হওয়া পর্যন্ত লুপ করে।' }
        }
      },
      {
        heading: { en: 'do-while Loop', bn: 'do-while লুপ' },
        body: { en: 'do { ... } while (condition); runs at least once THEN checks the condition.', bn: 'do { ... } while (condition); অন্তত একবার চলে তারপর শর্ত পরীক্ষা করে।' }
      }
    ],
    exercises: [
      {
        type: 'fill_blank',
        id: 'c6-while-e1',
        question: { en: 'Complete the while condition:', bn: 'while শর্ত সম্পূর্ণ করুন:' },
        codeTemplate: '___ (hp > 0) {\n  defend();\n  hp -= 10;\n}',
        blanks: ['while'],
        explanation: { en: 'while keyword with condition in parentheses.', bn: 'বন্ধনীতে শর্ত সহ while কিওয়ার্ড।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c6-while-e2',
        question: { en: 'What is the final value of x?', bn: 'x এর চূড়ান্ত মান কত?' },
        code: 'int x = 1;\nwhile (x < 10) {\n  x *= 2;\n}\ncout << x;',
        options: ['16', '8', '10'],
        correctIndex: 0,
        explanation: { en: 'x goes 1→2→4→8→16. 16 is not <10, loop stops.', bn: 'x যায় 1→2→4→8→16। 16 <10 নয়, লুপ থামে।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'c6-while-e3',
        question: { en: 'What makes do-while unique?', bn: 'do-while কে অনন্য করে কী?' },
        options: ['Runs at least once before checking', 'Runs at most once', 'Faster than while', 'Checks condition at start'],
        correctIndex: 0,
        explanation: { en: 'do-while is a post-condition loop — runs then checks.', bn: 'do-while হলো পোস্ট-শর্ত লুপ — চলে তারপর পরীক্ষা করে।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'c6-while-e4',
        question: { en: 'Fix the infinite loop:', bn: 'অসীম লুপ ঠিক করুন:' },
        code: 'int i = 10;\nwhile (i > 0) {\n  cout << i;\n  i++;\n}',
        buggyLine: 4,
        explanation: { en: 'i++ increases i, making it always >0. Use i--.', bn: 'i++ i বাড়ায়, সবসময় >0 রাখে। i-- ব্যবহার করুন।' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'c6-while-e5',
        question: { en: 'Arrange do-while menu:', bn: 'do-while মেনু সাজান:' },
        blocks: ['int choice;', 'do {', '  cout << "Play(1) Quit(0): ";', '  cin >> choice;', '} while (choice != 0);'],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: { en: 'Show menu at least once, keep going until 0.', bn: 'মেনু অন্তত একবার দেখান, 0 না হওয়া পর্যন্ত চালিয়ে যান।' },
        xpReward: 35
      }
    ]
  },
  {
    id: 'c6-exam',
    sectionId: 'c-unit6',
    order: 3,
    isProject: true,
    title: { en: 'Unit Exam: Cycle Master', bn: 'ইউনিট পরীক্ষা: সাইকেল মাস্টার' },
    description: { en: 'Prove C++ loop mastery.', bn: 'C++ লুপ দক্ষতা প্রমাণ করুন।' },
    difficulty: 'intermediate',
    xpReward: 300,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Loops Summary', bn: 'লুপের সারসংক্ষেপ' },
        body: { en: 'for (known count), while (unknown count), do-while (run at least once). break exits, continue skips.', bn: 'for (জানা গণনা), while (অজানা গণনা), do-while (অন্তত একবার চলে)। break বের হয়, continue বাদ দেয়।' }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'c6-exam-e1',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'for (int i = 1; i <= 5; i++) {\n  if (i % 2 == 0) continue;\n  cout << i;\n}',
        options: ['135', '12345', '24'],
        correctIndex: 0,
        explanation: { en: 'continue skips even numbers (2, 4). Prints 1, 3, 5.', bn: 'continue জোড় সংখ্যা বাদ দেয় (2, 4)। 1, 3, 5 প্রিন্ট করে।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'c6-exam-e2',
        question: { en: 'Exit when target found:', bn: 'টার্গেট পাওয়া গেলে বের হোন:' },
        codeTemplate: 'for (int i = 0; i < 10; i++) {\n  if (arr[i] == target) ___;\n}',
        blanks: ['break'],
        explanation: { en: 'break exits the loop immediately.', bn: 'break তাৎক্ষণিকভাবে লুপ থেকে বের করে দেয়।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'c6-exam-e3',
        question: { en: 'Which loop guarantees at least one run?', bn: 'কোন লুপ অন্তত একবার চলা নিশ্চিত করে?' },
        options: ['do-while', 'while', 'for', 'All of them'],
        correctIndex: 0,
        explanation: { en: 'do-while checks condition AFTER the first run.', bn: 'do-while প্রথম রানের পরে শর্ত পরীক্ষা করে।' },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'c6-exam-e4',
        question: { en: 'Fix the do-while syntax:', bn: 'do-while সিনট্যাক্স ঠিক করুন:' },
        code: 'do {\n  x++;\n} while (x < 5)',
        buggyLine: 3,
        explanation: { en: 'do-while needs a semicolon: } while (x < 5);', bn: 'do-while এ সেমিকোলন লাগবে: } while (x < 5);' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'c6-exam-e5',
        question: { en: 'Arrange factorial calculation (5!):', bn: 'ফ্যাক্টোরিয়াল হিসাব সাজান (5!):' },
        blocks: ['int result = 1;', 'for (int i = 1; i <= 5; i++) {', '  result *= i;', '}', 'cout << result;'],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: { en: '1×2×3×4×5 = 120.', bn: '১×২×৩×৪×৫ = ১২০।' },
        xpReward: 50
      }
    ]
  }
];
