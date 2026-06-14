import type { Lesson } from '../../schema';

// C++ Unit 9: Machine Modules — lessonIds: ['c9-func', 'c9-params', 'c9-exam']
export const unit9Lessons: Lesson[] = [
  {
    id: 'c9-func',
    sectionId: 'c-unit9',
    order: 1,
    title: { en: 'The Function Factory', bn: 'ফাংশন ফ্যাক্টরি' },
    description: { en: 'Define and call functions in C++.', bn: 'C++ এ ফাংশন সংজ্ঞায়িত করুন এবং কল করুন।' },
    difficulty: 'advanced',
    xpReward: 160,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'C++ Functions', bn: 'C++ ফাংশন' },
        body: { en: 'returnType functionName(params) { body }. Must declare return type. void means no return value.', bn: 'returnType functionName(params) { body }। রিটার্ন টাইপ ঘোষণা করতে হবে। void মানে কোনো রিটার্ন মান নেই।' },
        code: {
          code: 'void greet() {\n  cout << "Hello, C++!" << endl;\n}\n\nint main() {\n  greet();\n  return 0;\n}',
          language: 'cpp',
          explanation: { en: 'void means nothing is returned. Call with greet().', bn: 'void মানে কিছু ফেরত দেওয়া হয় না। greet() দিয়ে কল করুন।' }
        }
      },
      {
        heading: { en: 'Return Values', bn: 'রিটার্ন মান' },
        body: { en: 'State the return type before function name. Use return to send value back. Type must match!', bn: 'ফাংশন নামের আগে রিটার্ন টাইপ উল্লেখ করুন। মান ফেরত পাঠাতে return ব্যবহার করুন। টাইপ মিলতে হবে!' },
        code: {
          code: 'int square(int n) {\n  return n * n;\n}\n\nint result = square(5);\ncout << result;  // 25',
          language: 'cpp',
          explanation: { en: 'square() takes int and returns int.', bn: 'square() int নেয় এবং int ফেরত দেয়।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c9-func-e1',
        question: { en: 'What return type means "no value returned"?', bn: 'কোন রিটার্ন টাইপ মানে "কোনো মান ফেরত দেওয়া হয় না"?' },
        options: ['void', 'null', 'none', 'int'],
        correctIndex: 0,
        explanation: { en: 'void functions do not return a value.', bn: 'void ফাংশন কোনো মান ফেরত দেয় না।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'c9-func-e2',
        question: { en: 'Define a function that returns double:', bn: 'double ফেরত দেওয়া ফাংশন সংজ্ঞায়িত করুন:' },
        codeTemplate: '___ getArea(double r) {\n  return 3.14 * r * r;\n}',
        blanks: ['double'],
        explanation: { en: 'Return type must be double as it returns a decimal value.', bn: 'রিটার্ন টাইপ double হতে হবে কারণ এটি দশমিক মান ফেরত দেয়।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c9-func-e3',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'int add(int a, int b) {\n  return a + b;\n}\ncout << add(3, 4) + add(1, 2);',
        options: ['10', '7', '3'],
        correctIndex: 0,
        explanation: { en: 'add(3,4)=7, add(1,2)=3. 7+3=10.', bn: 'add(3,4)=7, add(1,2)=3। 7+3=10।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'c9-func-e4',
        question: { en: 'Must you declare function BEFORE using it in C++?', bn: 'C++ এ কি ব্যবহারের আগে ফাংশন ঘোষণা করতে হবে?' },
        options: ['Yes, or use a prototype', 'No, order does not matter', 'Only for void functions', 'Only for int functions'],
        correctIndex: 0,
        explanation: { en: 'C++ needs function declaration before use, or a forward declaration (prototype).', bn: 'C++ এ ব্যবহারের আগে ফাংশন ঘোষণা, অথবা ফরওয়ার্ড ডিক্লারেশন (প্রোটোটাইপ) লাগে।' },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'c9-func-e5',
        question: { en: 'Fix the return type mismatch:', bn: 'রিটার্ন টাইপ মিসম্যাচ ঠিক করুন:' },
        code: 'int getName() {\n  return "Alice";\n}',
        buggyLine: 1,
        explanation: { en: 'String cannot be returned as int. Use string getName() instead.', bn: 'স্ট্রিং int হিসেবে ফেরত দেওয়া যাবে না। পরিবর্তে string getName() ব্যবহার করুন।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'c9-params',
    sectionId: 'c-unit9',
    order: 2,
    title: { en: 'The Configurator', bn: 'কনফিগারেটর' },
    description: { en: 'Pass data to functions with parameters.', bn: 'প্যারামিটারের মাধ্যমে ফাংশনে ডাটা পাঠান।' },
    difficulty: 'advanced',
    xpReward: 160,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Parameters in C++', bn: 'C++ এ প্যারামিটার' },
        body: { en: 'Each parameter needs its type declared: int, double, string, bool. Values are copies by default (pass-by-value).', bn: 'প্রতিটি প্যারামিটারের টাইপ ঘোষণা করতে হবে: int, double, string, bool। ডিফল্টভাবে মান কপি হয় (pass-by-value)।' },
        code: {
          code: 'double power(double base, int exp) {\n  double result = 1;\n  for (int i = 0; i < exp; i++) {\n    result *= base;\n  }\n  return result;\n}\n\ncout << power(2, 8);  // 256',
          language: 'cpp',
          explanation: { en: 'Two parameters of different types: double and int.', bn: 'বিভিন্ন টাইপের দুটি প্যারামিটার: double এবং int।' }
        }
      },
      {
        heading: { en: 'Default Parameters', bn: 'ডিফল্ট প্যারামিটার' },
        body: { en: 'Give defaults: int func(int x, int y = 10). Caller can skip y.', bn: 'ডিফল্ট দিন: int func(int x, int y = 10)। কলার y বাদ দিতে পারে।' }
      }
    ],
    exercises: [
      {
        type: 'fill_blank',
        id: 'c9-params-e1',
        question: { en: 'Declare a function taking two doubles:', bn: 'দুটি double নেওয়া ফাংশন ঘোষণা করুন:' },
        codeTemplate: 'double multiply(___ a, ___ b) {\n  return a * b;\n}',
        blanks: ['double', 'double'],
        explanation: { en: 'Each parameter needs its type.', bn: 'প্রতিটি প্যারামিটারের টাইপ লাগবে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c9-params-e2',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'int max(int a, int b) {\n  return (a > b) ? a : b;\n}\ncout << max(10, 25);',
        options: ['25', '10', '35'],
        correctIndex: 0,
        explanation: { en: '10 > 25 is false, so b (25) is returned.', bn: '10 > 25 false, তাই b (25) ফেরত আসে।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'c9-params-e3',
        question: { en: 'What is pass-by-value?', bn: 'pass-by-value কী?' },
        options: ['Function gets a copy of the argument', 'Function modifies the original', 'Function returns the value', 'Passing by pointer'],
        correctIndex: 0,
        explanation: { en: 'Default in C++: the function works on a copy, not original.', bn: 'C++ এ ডিফল্ট: ফাংশন কপিতে কাজ করে, মূলটিতে নয়।' },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'c9-params-e4',
        question: { en: 'Fix the parameter type:', bn: 'প্যারামিটার টাইপ ঠিক করুন:' },
        code: 'int greet(name) {\n  cout << "Hi " << name;\n  return 0;\n}',
        buggyLine: 1,
        explanation: { en: 'Parameters need types: string name, not just name.', bn: 'প্যারামিটারে টাইপ লাগবে: string name, শুধু name নয়।' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'c9-params-e5',
        question: { en: 'Build a BMI calculator function:', bn: 'BMI ক্যালকুলেটর ফাংশন তৈরি করুন:' },
        blocks: ['double bmi(double weight, double height) {', '  return weight / (height * height);', '}', 'cout << bmi(70, 1.75);'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'BMI = weight / height². Define, compute, call.', bn: 'BMI = weight / height²। সংজ্ঞায়িত করুন, হিসাব করুন, কল করুন।' },
        xpReward: 40
      }
    ]
  },
  {
    id: 'c9-exam',
    sectionId: 'c-unit9',
    order: 3,
    isProject: true,
    title: { en: 'Unit Exam: Machine Modules', bn: 'ইউনিট পরীক্ষা: মেশিন মডিউল' },
    description: { en: 'Prove C++ function mastery.', bn: 'C++ ফাংশন দক্ষতা প্রমাণ করুন।' },
    difficulty: 'advanced',
    xpReward: 450,
    estimatedMinutes: 18,
    theory: [
      {
        heading: { en: 'Functions Summary', bn: 'ফাংশনের সারসংক্ষেপ' },
        body: { en: 'returnType name(type param) { return value; }. void for no return. Each parameter needs its type declared.', bn: 'returnType name(type param) { return value; }। রিটার্নের জন্য void। প্রতিটি প্যারামিটারে টাইপ ঘোষণা লাগবে।' }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'c9-exam-e1',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'int cube(int n) { return n * n * n; }\ncout << cube(cube(2));',
        options: ['512', '8', '64'],
        correctIndex: 0,
        explanation: { en: 'cube(2)=8. cube(8)=512.', bn: 'cube(2)=8। cube(8)=512।' },
        xpReward: 40
      },
      {
        type: 'fill_blank',
        id: 'c9-exam-e2',
        question: { en: 'Complete a min function:', bn: 'min ফাংশন সম্পূর্ণ করুন:' },
        codeTemplate: 'int min(int a, int b) {\n  if (a < b) ___ a;\n  ___ b;\n}',
        blanks: ['return', 'return'],
        explanation: { en: 'return the smaller value.', bn: 'ছোট মান return করুন।' },
        xpReward: 35
      },
      {
        type: 'mcq',
        id: 'c9-exam-e3',
        question: { en: 'A function that calls itself is called?', bn: 'নিজেকে কল করে এমন ফাংশনকে কী বলা হয়?' },
        options: ['Recursive', 'Overloaded', 'Static', 'Inline'],
        correctIndex: 0,
        explanation: { en: 'Recursion is a powerful but careful technique.', bn: 'রিকার্সন একটি শক্তিশালী কিন্তু সতর্ক কৌশল।' },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'c9-exam-e4',
        question: { en: 'Fix the missing return:', bn: 'অনুপস্থিত return ঠিক করুন:' },
        code: 'int absolute(int n) {\n  if (n < 0) return -n;\n  // missing else\n}',
        buggyLine: 3,
        explanation: { en: 'Need: return n; for the positive case.', bn: 'ধনাত্মক কেসের জন্য: return n; লাগবে।' },
        xpReward: 35
      },
      {
        type: 'code_arrange',
        id: 'c9-exam-e5',
        question: { en: 'Build a grade function:', bn: 'গ্রেড ফাংশন তৈরি করুন:' },
        blocks: ['string grade(int score) {', '  if (score >= 90) return "A";', '  if (score >= 70) return "B";', '  return "C";', '}', 'cout << grade(85);'],
        correctOrder: [0, 1, 2, 3, 4, 5],
        explanation: { en: 'Check grades top-down, return result.', bn: 'গ্রেড উপর থেকে নিচে পরীক্ষা করুন, ফলাফল ফেরত দিন।' },
        xpReward: 60
      }
    ]
  }
];
