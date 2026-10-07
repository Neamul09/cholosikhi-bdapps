import type { Lesson } from '../../schema';

// C++ Unit 2: The Profit Genie — lessonIds: ['c2-math', 'c2-types', 'c2-exam']
export const unit2Lessons: Lesson[] = [
  {
    id: 'c2-math',
    sectionId: 'c-unit2',
    order: 1,
    title: { en: 'Profit Engine', bn: 'প্রফিট ইঞ্জিন' },
    description: { en: 'Arithmetic operators and expressions in C++.', bn: 'C++ এ গাণিতিক অপারেটর এবং এক্সপ্রেশন।' },
    difficulty: 'beginner',
    xpReward: 120,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Arithmetic Operators', bn: 'গাণিতিক অপারেটর' },
        body: { en: 'C++ supports: + (add), - (subtract), * (multiply), / (divide), % (modulo). Integer division truncates decimals.', bn: 'C++ সমর্থন করে: + (যোগ), - (বিয়োগ), * (গুণ), / (ভাগ), % (মডুলো)। পূর্ণ সংখ্যা ভাগ দশমিক কাটে।' },
        code: {
          code: 'int price = 200;\nint qty = 5;\nint revenue = price * qty;\ncout << "Revenue: " << revenue;',
          language: 'cpp',
          explanation: { en: 'Multiplies price by quantity.', bn: 'মূল্যকে পরিমাণ দিয়ে গুণ করে।' }
        }
      },
      {
        heading: { en: 'Compound Assignment', bn: 'যৌগিক নির্ধারণ' },
        body: { en: 'Shortcuts: += adds, -= subtracts, *= multiplies, /= divides. E.g. x += 5 is x = x + 5.', bn: 'শর্টকাট: += যোগ করে, -= বিয়োগ করে, *= গুণ করে, /= ভাগ করে। যেমন x += 5 মানে x = x + 5।' },
        code: {
          code: 'int stock = 100;\nstock -= 20;  // sold 20\nstock += 50;  // restocked 50\ncout << stock; // 130',
          language: 'cpp',
          explanation: { en: 'Compound operators modify in-place.', bn: 'যৌগিক অপারেটর সরাসরি পরিবর্তন করে।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c2-math-e1',
        question: { en: 'What is 10 % 3 in C++?', bn: 'C++ এ 10 % 3 কত?' },
        options: ['1', '3', '0', '10'],
        correctIndex: 0,
        explanation: { en: '10 divided by 3 is 3 with remainder 1.', bn: '10 কে 3 দিয়ে ভাগ করলে ভাগফল 3, ভাগশেষ 1।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c2-math-e2',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'int a = 7;\nint b = 2;\ncout << a / b;',
        options: ['3', '3.5', '4'],
        correctIndex: 0,
        explanation: { en: 'Integer division: 7/2 = 3 (drops decimal).', bn: 'পূর্ণ সংখ্যার ভাগ: 7/2 = 3 (দশমিক বাদ যায়)।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'c2-math-e3',
        question: { en: 'Add 10 to balance using shorthand:', bn: 'শর্টহ্যান্ড ব্যবহার করে balance এ 10 যোগ করুন:' },
        codeTemplate: 'int balance = 500;\nbalance ___ 10;\ncout << balance;',
        blanks: ['+='],
        explanation: { en: '+= adds the right side to the variable.', bn: '+= ডান দিক ভেরিয়েবলে যোগ করে।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'c2-math-e4',
        question: { en: 'x *= 3 is equivalent to?', bn: 'x *= 3 কিসের সমতুল্য?' },
        options: ['x = x * 3', 'x = 3', 'x + 3', 'x = x + 3'],
        correctIndex: 0,
        explanation: { en: '*= multiplies and stores back in x.', bn: '*= গুণ করে এবং x তে ফিরিয়ে দেয়।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'c2-math-e5',
        question: { en: 'Fix the division for a decimal result:', bn: 'দশমিক ফলাফলের জন্য ভাগ ঠিক করুন:' },
        code: 'int total = 7;\nint count = 2;\ndouble avg = total / count;\ncout << avg;',
        buggyLine: 3,
        explanation: { en: 'int/int = int. Cast: (double)total / count gets 3.5.', bn: 'int/int = int। Cast: (double)total / count দেয় 3.5।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'c2-types',
    sectionId: 'c-unit2',
    order: 2,
    title: { en: 'Type Arsenal', bn: 'টাইপ আর্সেনাল' },
    description: { en: 'C++ primitive types and type casting.', bn: 'C++ প্রিমিটিভ টাইপ এবং টাইপ কাস্টিং।' },
    difficulty: 'beginner',
    xpReward: 120,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'C++ Data Types', bn: 'C++ ডাটা টাইপ' },
        body: { en: 'int: whole numbers. double: decimals. float: smaller decimals. char: single character. bool: true/false. string: text.', bn: 'int: পূর্ণ সংখ্যা। double: দশমিক। float: ছোট দশমিক। char: একটি অক্ষর। bool: true/false। string: টেক্সট।' },
        code: {
          code: 'int age = 20;\ndouble gpa = 3.75;\nchar grade = \'A\';\nbool passed = true;\nstring name = "Hero";',
          language: 'cpp',
          explanation: { en: 'Each variable has a specific type.', bn: 'প্রতিটি ভেরিয়েবলের একটি নির্দিষ্ট টাইপ আছে।' }
        }
      },
      {
        heading: { en: 'Type Casting', bn: 'টাইপ কাস্টিং' },
        body: { en: 'Convert between types with (type)variable. E.g. (double)5 gives 5.0. Always cast before division for decimals.', bn: '(type)variable দিয়ে টাইপের মধ্যে রূপান্তর করুন। যেমন (double)5 দেয় 5.0। দশমিকের জন্য ভাগের আগে সবসময় cast করুন।' },
        code: {
          code: 'int x = 5;\ndouble d = (double)x;  // 5.0\n\nint a = 7, b = 2;\ndouble result = (double)a / b;  // 3.5',
          language: 'cpp',
          explanation: { en: 'Explicit cast ensures floating-point division.', bn: 'এক্সপ্লিসিট cast ফ্লোটিং-পয়েন্ট ভাগ নিশ্চিত করে।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c2-types-e1',
        question: { en: 'Which type stores decimal numbers with high precision?', bn: 'কোন টাইপ উচ্চ নির্ভুলতায় দশমিক সংখ্যা জমা রাখে?' },
        options: ['double', 'int', 'char', 'bool'],
        correctIndex: 0,
        explanation: { en: 'double is 64-bit floating point — more precise than float.', bn: 'double হলো 64-bit ফ্লোটিং পয়েন্ট — float এর চেয়ে বেশি নির্ভুল।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'c2-types-e2',
        question: { en: 'Declare a boolean variable:', bn: 'একটি বুলিয়ান ভেরিয়েবল ঘোষণা করুন:' },
        codeTemplate: '___ isOnline = true;',
        blanks: ['bool'],
        explanation: { en: 'bool holds true or false.', bn: 'bool true অথবা false রাখে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c2-types-e3',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'char c = \'Z\';\ncout << c;',
        options: ['Z', '\'Z\'', 'char'],
        correctIndex: 0,
        explanation: { en: 'char stores and prints a single character.', bn: 'char একটি একক অক্ষর জমা রাখে এবং প্রিন্ট করে।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'c2-types-e4',
        question: { en: 'What is the result of (int)3.9?', bn: '(int)3.9 এর ফলাফল কী?' },
        options: ['3', '4', '3.9', 'Error'],
        correctIndex: 0,
        explanation: { en: 'Casting to int truncates (does not round).', bn: 'int তে cast করলে ছেঁটে ফেলা হয় (গোল করা হয় না)।' },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'c2-types-e5',
        question: { en: 'Declare and use a string variable:', bn: 'একটি string ভেরিয়েবল ঘোষণা ও ব্যবহার করুন:' },
        blocks: ['#include <string>', 'using namespace std;', 'string city = "Dhaka";', 'cout << "City: " << city;'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Include string, use namespace, declare, print.', bn: 'string অন্তর্ভুক্ত করুন, namespace ব্যবহার করুন, ঘোষণা করুন, প্রিন্ট করুন।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'c2-exam',
    sectionId: 'c-unit2',
    order: 3,
    isProject: true,
    title: { en: 'Unit Exam: Profit Genie', bn: 'ইউনিট পরীক্ষা: প্রফিট জিনি' },
    description: { en: 'Test C++ math operators and data types.', bn: 'C++ গণিত অপারেটর এবং ডাটা টাইপ পরীক্ষা করুন।' },
    difficulty: 'beginner',
    xpReward: 280,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Exam Ready', bn: 'পরীক্ষার প্রস্তুতি' },
        body: { en: 'This exam covers: arithmetic operators, compound assignment, C++ types, and type casting.', bn: 'এই পরীক্ষায় রয়েছে: গাণিতিক অপারেটর, যৌগিক নির্ধারণ, C++ টাইপ এবং টাইপ কাস্টিং।' }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'c2-exam-e1',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'int x = 10;\nx %= 3;\ncout << x;',
        options: ['1', '3', '10'],
        correctIndex: 0,
        explanation: { en: '10 % 3 = 1 (remainder). x is now 1.', bn: '10 % 3 = 1 (ভাগশেষ)। x এখন 1।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'c2-exam-e2',
        question: { en: 'Get decimal result from int division:', bn: 'int ভাগ থেকে দশমিক ফলাফল পান:' },
        codeTemplate: 'int a = 5, b = 2;\ndouble result = (___)a / b;\ncout << result;',
        blanks: ['double'],
        explanation: { en: '(double)a casts to double before division.', bn: '(double)a ভাগের আগে double তে cast করে।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'c2-exam-e3',
        question: { en: 'What type stores true/false in C++?', bn: 'C++ এ true/false কোন টাইপে জমা হয়?' },
        options: ['bool', 'int', 'char', 'bit'],
        correctIndex: 0,
        explanation: { en: 'bool is the boolean type in C++.', bn: 'bool হলো C++ এ বুলিয়ান টাইপ।' },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'c2-exam-e4',
        question: { en: 'Fix the type mismatch:', bn: 'টাইপ মিসম্যাচ ঠিক করুন:' },
        code: 'bool flag = 5;\ncout << flag;',
        buggyLine: 1,
        explanation: { en: 'Technically works (5 → true) but is bad practice. Use bool flag = true;', bn: 'প্রযুক্তিগতভাবে কাজ করে (5 → true) কিন্তু খারাপ অনুশীলন। bool flag = true; ব্যবহার করুন।' },
        xpReward: 35
      },
      {
        type: 'code_arrange',
        id: 'c2-exam-e5',
        question: { en: 'Build a profit calculator:', bn: 'একটি প্রফিট ক্যালকুলেটর তৈরি করুন:' },
        blocks: ['int revenue = 1000;', 'int cost = 600;', 'int profit = revenue - cost;', 'double margin = (double)profit / revenue * 100;', 'cout << "Margin: " << margin << "%";'],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: { en: 'Revenue, cost, profit, margin calculation.', bn: 'রাজস্ব, খরচ, লাভ, মার্জিন হিসাব।' },
        xpReward: 55
      }
    ]
  }
];
