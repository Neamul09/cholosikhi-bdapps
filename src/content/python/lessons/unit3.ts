import type { Lesson } from '../../schema';

// Unit 3: Memory Recall — lessonIds: ['p3-recall-1', 'p3-recall-2', 'p3-exam']
export const unit3Lessons: Lesson[] = [
  {
    id: 'p3-recall-1',
    sectionId: 'p-unit3',
    order: 1,
    title: { en: 'Recall: Input & Variables', bn: 'রিকল: ইনপুট ও ভেরিয়েবল' },
    description: { en: 'Review print, input, and variables from Unit 1.', bn: 'ইউনিট ১ থেকে print, input এবং ভেরিয়েবল রিভিউ করুন।' },
    difficulty: 'beginner',
    xpReward: 100,
    estimatedMinutes: 8,
    theory: [
      {
        heading: { en: 'Quick Review', bn: 'দ্রুত রিভিউ' },
        body: { en: 'Remember: print() shows output, input() collects text, variables store values.', bn: 'মনে রাখুন: print() আউটপুট দেখায়, input() টেক্সট গ্রহণ করে, ভেরিয়েবল মান জমা রাখে।' },
        code: {
          code: 'name = input("Your name: ")\nprint("Hello, " + name)',
          language: 'python',
          explanation: { en: 'Get name from user and greet them.', bn: 'ব্যবহারকারীর কাছ থেকে নাম নিয়ে তাদের অভিবাদন জানান।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p3-r1-e1',
        question: { en: 'Which function gets text from the user?', bn: 'কোন ফাংশন ব্যবহারকারীর কাছ থেকে টেক্সট গ্রহণ করে?' },
        options: ['input()', 'read()', 'get()', 'scan()'],
        correctIndex: 0,
        explanation: { en: 'input() reads text typed by the user.', bn: 'input() ব্যবহারকারীর টাইপ করা টেক্সট গ্রহণ করে।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p3-r1-e2',
        question: { en: 'Print a greeting:', bn: 'একটি অভিবাদন প্রিন্ট করুন:' },
        codeTemplate: '___ ("Hello, World!")',
        blanks: ['print'],
        explanation: { en: 'print() displays text on the screen.', bn: 'print() স্ক্রিনে টেক্সট দেখায়।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p3-r1-e3',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'city = "Dhaka"\nprint("I live in " + city)',
        options: ['I live in Dhaka', 'city', 'Dhaka'],
        correctIndex: 0,
        explanation: { en: 'String concatenation (+) joins the two parts.', bn: 'স্ট্রিং সংযোজন (+) দুটি অংশকে একত্রিত করে।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p3-r1-e4',
        question: { en: 'What does input() always return?', bn: 'input() সবসময় কী ধরনের ডেটা রিটার্ন করে?' },
        options: ['A string', 'An integer', 'A float', 'A list'],
        correctIndex: 0,
        explanation: { en: 'input() always returns a string, even if numbers are typed.', bn: 'input() সবসময় একটি স্ট্রিং রিটার্ন করে, এমনকি সংখ্যা টাইপ করলেও।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p3-r1-e5',
        question: { en: 'Fix the greeting:', bn: 'অভিবাদনটি ঠিক করুন:' },
        code: 'name = "Farhan"\nprint("Hello " name)',
        buggyLine: 2,
        explanation: { en: 'Need a (+) to join strings: "Hello " + name', bn: 'স্ট্রিং যোগ করার জন্য (+) ব্যবহার করতে হয়: "Hello " + name' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p3-recall-2',
    sectionId: 'p-unit3',
    order: 2,
    title: { en: 'Recall: Math & Types', bn: 'রিকল: গণিত ও টাইপ' },
    description: { en: 'Review operators and data types from Unit 2.', bn: 'ইউনিট ২ থেকে অপারেটর এবং ডাটা টাইপ রিভিউ করুন।' },
    difficulty: 'beginner',
    xpReward: 100,
    estimatedMinutes: 8,
    theory: [
      {
        heading: { en: 'Math & Types Review', bn: 'গণিত ও টাইপ রিভিউ' },
        body: { en: 'int for whole numbers, float for decimals, % for remainder, ** for powers, float() int() to convert.', bn: 'পূর্ণ সংখ্যার জন্য int, দশমিকের জন্য float, ভাগশেষের জন্য %, পাওয়ারের জন্য **, টাইপ রূপান্তরের জন্য int() এবং float()।}' },
        code: {
          code: 'score = int(input("Score: "))\nbonus = score * 0.1\nprint("Bonus:", bonus)',
          language: 'python',
          explanation: { en: 'Convert input to int, calculate 10% bonus.', bn: 'ইনপুটকে int এ রূপান্তর করুন, তারপর 10% বোনাস হিসাব করুন।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p3-r2-e1',
        question: { en: 'Which converts "7" to an integer?', bn: '"7" কে পূর্ণ সংখ্যায় রূপান্তর করে কোনটি?' },
        options: ['int("7")', 'float("7")', 'str(7)', 'num("7")'],
        correctIndex: 0,
        explanation: { en: 'int("7") converts the string to integer 7.', bn: 'int("7") স্ট্রিংটিকে পূর্ণ সংখ্যা ৭ এ রূপান্তর করে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p3-r2-e2',
        question: { en: 'Predict the output:', bn: 'আউটপুট অনুমান করুন:' },
        code: 'x = 9\nprint(x ** 2)',
        options: ['81', '18', '92'],
        correctIndex: 0,
        explanation: { en: '9 to the power of 2 is 81.', bn: '৯ এর সূচক ২ হলো ৮১।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p3-r2-e3',
        question: { en: 'Get remainder of 13 / 4:', bn: '13 / 4 এর ভাগশেষ নিন:' },
        codeTemplate: 'r = 13 ___ 4\nprint(r)',
        blanks: ['%'],
        explanation: { en: '% gives the remainder: 13 % 4 = 1.', bn: '% ভাগশেষ দেয়: 13 % 4 = ১।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p3-r2-e4',
        question: { en: 'What is 7 // 2?', bn: '7 // 2 কত?' },
        options: ['3', '3.5', '4', '1'],
        correctIndex: 0,
        explanation: { en: '// is integer division — drops the decimal. 7//2 = 3.', bn: '// হলো পূর্ণসংখ্যার ভাগফল — দশমিক বাদ দেয়। 7//2 = 3।' },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p3-r2-e5',
        question: { en: 'Calculate area of a circle (r=5):', bn: 'বৃত্তের ক্ষেত্রফল হিসাব করুন (r=5):' },
        blocks: ['r = 5', 'pi = 3.14', 'area = pi * r ** 2', 'print(area)'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Area = π × r². Define r, pi, compute, print.', bn: 'ক্ষেত্রফল = π × r²। r, pi নির্ধারণ করুন, হিসাব করুন, প্রিন্ট করুন।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p3-exam',
    sectionId: 'p-unit3',
    order: 3,
    isProject: true,
    title: { en: 'Unit Exam: Memory Recall', bn: 'ইউনিট পরীক্ষা: মেমোরি রিকল' },
    description: { en: 'Final test of Units 1 & 2 material.', bn: 'ইউনিট ১ ও ২ এর চূড়ান্ত পরীক্ষা।' },
    difficulty: 'beginner',
    xpReward: 250,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Final Checkpoint', bn: 'চূড়ান্ত চেকপয়েন্ট' },
        body: { en: 'This exam covers: print, input, variables, operators, types, and conversion.', bn: 'এই পরীক্ষায় রয়েছে: print, input, variables, operators, types, and conversion.' }
      }
    ],
    exercises: [
      {
        type: 'bug_hunt',
        id: 'p3-exam-e1',
        question: { en: 'Find the bug in this calculator:', bn: 'এই ক্যালকুলেটরে বাগ খুঁজুন:' },
        code: 'a = input("First: ")\nb = input("Second: ")\nprint(a + b)',
        buggyLine: 3,
        explanation: { en: 'input returns strings. Use int(a) + int(b) for math.', bn: 'input স্ট্রিং রিটার্ন করে। গণিতের জন্য int(a) + int(b) ব্যবহার করতে হবে।' },
        xpReward: 40
      },
      {
        type: 'mcq',
        id: 'p3-exam-e2',
        question: { en: 'What does 2 ** 10 equal?', bn: '2 ** 10 কত?' },
        options: ['1024', '20', '100', '200'],
        correctIndex: 0,
        explanation: { en: '2 to the power 10 is 1024.', bn: '২ এর সূচক ১০ হলো ১০২৪।' },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'p3-exam-e3',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'x = "Hello"\nprint(x * 2)',
        options: ['HelloHello', 'Hello2', 'Error'],
        correctIndex: 0,
        explanation: { en: 'String * int repeats the string.', bn: 'String * int স্ট্রিংটি পুনরাবৃত্তি করে।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'p3-exam-e4',
        question: { en: 'Convert age to string for printing:', bn: 'প্রিন্টের জন্য age কে স্ট্রিংয়ে রূপান্তর করুন:' },
        codeTemplate: 'age = 17\nprint("Age: " + ___(age))',
        blanks: ['str'],
        explanation: { en: 'str() converts numbers to strings.', bn: 'str() সংখ্যাকে স্ট্রিংয়ে রূপান্তর করে।' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'p3-exam-e5',
        question: { en: 'Build a temperature converter (C to F):', bn: 'সেলসিয়াস থেকে ফারেনহাইটে তাপমাত্রা রূপান্তরকারী প্রোগ্রাম তৈরি করুন:' },
        blocks: ['celsius = 100', 'fahrenheit = (celsius * 9/5) + 32', 'print(fahrenheit)'],
        correctOrder: [0, 1, 2],
        explanation: { en: 'Formula: F = (C × 9/5) + 32.', bn: 'সূত্র: F = (C × 9/5) + 32।' },
        xpReward: 50
      }
    ]
  }
];
