import type { Lesson } from '../../schema';

export const unit2Lessons: Lesson[] = [
  {
    id: 'p2-math',
    sectionId: 'p-unit2',
    order: 1,
    title: { en: 'Magical Math', bn: 'জাদুকরী গণিত' },
    description: { en: 'Learn addition, subtraction, multiplication and division.', bn: 'যোগ, বিয়োগ, গুণ ও ভাগ শিখুন।' },
    difficulty: 'beginner',
    xpReward: 100,
    estimatedMinutes: 8,
    theory: [
      {
        heading: { en: 'Arithmetic Operators', bn: 'গাণিতিক অপারেটর' },
        body: { en: 'Python supports +, -, *, / and // (integer division), and % (remainder).', bn: 'পাইথন +, -, *, / এবং // (পূর্ণ সংখ্যায় ভাগ), এবং % (ভাগশেষ) সমর্থন করে।' },
        code: {
          code: 'total = 5 + 10\nproduct = 4 * 3\nprint(total, product)',
          language: 'python',
          explanation: { en: 'total is 15, product is 12.', bn: 'total হলো ১৫, product হলো ১২।' }
        }
      },
      {
        heading: { en: 'Order of Operations', bn: 'অপারেশনের ক্রম' },
        body: { en: 'Python follows PEMDAS: Parentheses, Exponents, Multiply/Divide, Add/Subtract.', bn: 'পাইথন PEMDAS অনুসরণ করে: বন্ধনী, সূচক, গুণ/ভাগ, যোগ/বিয়োগ।' },
        code: {
          code: 'result = (2 + 3) * 4\nprint(result)  # 20',
          language: 'python',
          explanation: { en: 'Parentheses evaluated first.', bn: 'বন্ধনী আগে মূল্যায়িত হয়।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p2-math-e1',
        question: { en: 'Which operator gives the remainder?', bn: 'কোন অপারেটর ভাগশেষ প্রদান করে?' },
        options: ['/', '//', '%', '*'],
        correctIndex: 2,
        explanation: { en: '% is the modulo operator — it gives the remainder.', bn: '% হলো মডুলো অপারেটর — এটি ভাগশেষ প্রদান করে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p2-math-e2',
        question: { en: 'What does this print?', bn: 'এটি কী প্রিন্ট করে?' },
        code: 'print(10 // 3)',
        options: ['3', '3.33', '1'],
        correctIndex: 0,
        explanation: { en: '// is integer division, drops the decimal.', bn: '// হলো পূর্ণ সংখ্যায় ভাগ, দশমিকের পরের অঙ্কগুলো বাদ দেয়।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p2-math-e3',
        question: { en: 'Complete: multiply x by 3', bn: 'সম্পূর্ণ করুন: x কে ৩ দিয়ে গুণ করুন' },
        codeTemplate: 'result = x ___ 3',
        blanks: ['*'],
        explanation: { en: '* is the multiplication operator.', bn: '* হলো গুণের অপারেটর।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p2-math-e4',
        question: { en: 'What is 2 ** 3 in Python?', bn: 'পাইথনে 2 ** 3 কত?' },
        options: ['8', '6', '5', '9'],
        correctIndex: 0,
        explanation: { en: '** is the power operator. 2**3 = 8.', bn: '** হলো পাওয়ার অপারেটর। 2**3 = ৮।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p2-math-e5',
        question: { en: 'Find the bug:', bn: 'বাগটি খুঁজুন:' },
        code: 'a = 10\nb = 0\nresult = a / b\nprint(result)',
        buggyLine: 3,
        explanation: { en: 'Cannot divide by zero! This causes a ZeroDivisionError.', bn: 'শূন্য দিয়ে ভাগ করা যাবে না! এটি ZeroDivisionError প্রদান করে।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p2-types',
    sectionId: 'p-unit2',
    order: 2,
    title: { en: 'Data Shapes', bn: 'ডাটা শেপ' },
    description: { en: 'Understand int, float, str, and type conversion.', bn: 'int, float, str এবং টাইপ রূপান্তর বুঝুন।' },
    difficulty: 'beginner',
    xpReward: 100,
    estimatedMinutes: 8,
    theory: [
      {
        heading: { en: 'Data Types', bn: 'ডাটা টাইপ' },
        body: { en: 'int = whole numbers, float = decimals, str = text, bool = True/False.', bn: 'int = পূর্ণ সংখ্যা, float = দশমিক, str = টেক্সট, bool = True/False।' },
        code: {
          code: 'age = 17         # int\nheight = 5.8     # float\nname = "Nini"   # str\nprint(type(age))',
          language: 'python',
          explanation: { en: 'type() tells you what type a variable is.', bn: 'type() আপনাকে বলে একটি ভেরিয়েবল কোন টাইপের।' }
        }
      },
      {
        heading: { en: 'Type Conversion', bn: 'টাইপ রূপান্তর' },
        body: { en: 'Use int(), float(), str() to convert between types.', bn: 'টাইপের মধ্যে রূপান্তর করতে int(), float(), str() ব্যবহার করুন।' },
        code: {
          code: 'num_str = "42"\nnum = int(num_str)\nprint(num + 1)  # 43',
          language: 'python',
          explanation: { en: 'int() converts a string number to an integer.', bn: 'int() একটি স্ট্রিং সংখ্যাকে পূর্ণ সংখ্যায় রূপান্তর করে।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p2-types-e1',
        question: { en: 'What type is 3.14?', bn: '3.14 কোন টাইপ?' },
        options: ['int', 'float', 'str', 'bool'],
        correctIndex: 1,
        explanation: { en: 'Numbers with decimals are float.', bn: 'দশমিক সহ সংখ্যাগুলো হলো float।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p2-types-e2',
        question: { en: 'Convert to integer:', bn: 'পূর্ণ সংখ্যায় রূপান্তর করুন:' },
        codeTemplate: 'x = ___("99")',
        blanks: ['int'],
        explanation: { en: 'int() converts strings to integers.', bn: 'int() স্ট্রিংকে পূর্ণ সংখ্যায় রূপান্তর করে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p2-types-e3',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'x = "5"\ny = 3\nprint(x * y)',
        options: ['"555"', '15', 'Error'],
        correctIndex: 0,
        explanation: { en: 'Multiplying a string by int repeats it: "5" * 3 = "555".', bn: 'স্ট্রিংকে int দিয়ে গুণ করলে সেটির পুনরাবৃত্তি হয়: "5" * 3 = "555"।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'p2-types-e4',
        question: { en: 'What type is True?', bn: 'True কোন টাইপ?' },
        options: ['str', 'int', 'bool', 'float'],
        correctIndex: 2,
        explanation: { en: 'True and False are boolean (bool) values.', bn: 'True এবং False হলো বুলিয়ান (bool) মান।' },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p2-types-e5',
        question: { en: 'Arrange to safely add a user number:', bn: 'নিরাপদে ব্যবহারকারীর সংখ্যা যোগ করতে সাজান:' },
        blocks: ['user_input = input("Enter:")', 'num = int(user_input)', 'print(num + 10)'],
        correctOrder: [0, 1, 2],
        explanation: { en: 'Get input → convert → use.', bn: 'ইনপুট নিন → রূপান্তর করুন → ব্যবহার করুন।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p2-exam',
    sectionId: 'p-unit2',
    order: 3,
    isProject: true,
    title: { en: 'Unit Exam: Genie Calculator', bn: 'ইউনিট পরীক্ষা: জিনি ক্যালকুলেটর' },
    description: { en: 'Prove your math and types mastery.', bn: 'গণিত ও টাইপ সম্পর্কে দক্ষতা প্রমাণ করুন।' },
    difficulty: 'beginner',
    xpReward: 250,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Exam Challenge', bn: 'পরীক্ষার চ্যালেঞ্জ' },
        body: { en: 'You will be tested on operators, data types, and type conversion. Good luck!', bn: 'আপনাকে অপারেটর, ডাটা টাইপ এবং টাইপ রূপান্তর নিয়ে পরীক্ষা করা হবে। শুভকামনা!' }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p2-exam-e1',
        question: { en: 'What is 17 % 5?', bn: '17 % 5 কত?' },
        options: ['2', '3', '1', '4'],
        correctIndex: 0,
        explanation: { en: '17 divided by 5 is 3 remainder 2.', bn: '17 কে 5 দিয়ে ভাগ করলে ভাগফল 3 এবং ভাগশেষ 2।' },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'p2-exam-e2',
        question: { en: 'Predict the output:', bn: 'আউটপুট অনুমান করুন:' },
        code: 'x = 5.0\nprint(type(x))',
        options: ["<class 'float'>", "<class 'int'>", "<class 'str'>"],
        correctIndex: 0,
        explanation: { en: '5.0 has a decimal so it is float.', bn: '5.0-এ দশমিক আছে তাই এটি float।' },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'p2-exam-e3',
        question: { en: 'Find the type error:', bn: 'টাইপ এরর খুঁজুন:' },
        code: 'price = "50"\ntax = 5\ntotal = price + tax\nprint(total)',
        buggyLine: 3,
        explanation: { en: 'Cannot add str and int directly. Use int(price) + tax.', bn: 'সরাসরি str এবং int যোগ করা যাবে না। int(price) + tax ব্যবহার করুন।' },
        xpReward: 40
      },
      {
        type: 'fill_blank',
        id: 'p2-exam-e4',
        question: { en: 'Calculate bill with 10% tip:', bn: '১০% টিপ সহ বিল হিসাব করুন:' },
        codeTemplate: 'bill = 200\ntip = bill ___ 0.1\ntotal = bill + tip\nprint(total)',
        blanks: ['*'],
        explanation: { en: 'Multiply by 0.1 to get 10%.', bn: '১০% পেতে 0.1 দিয়ে গুণ করুন।' },
        xpReward: 50
      },
      {
        type: 'code_arrange',
        id: 'p2-exam-e5',
        question: { en: 'Build a simple area calculator:', bn: 'একটি সাধারণ ক্ষেত্রফল ক্যালকুলেটর তৈরি করুন:' },
        blocks: ['length = 10', 'width = 5', 'area = length * width', 'print("Area:", area)'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Define both sides, multiply, then print.', bn: 'উভয় বাহু নির্ধারণ করুন, গুণ করুন, তারপর প্রিন্ট করুন।' },
        xpReward: 50
      }
    ]
  }
];
