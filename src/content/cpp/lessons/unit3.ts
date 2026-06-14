import type { Lesson } from '../../schema';

// C++ Unit 3: Synapse Recall — lessonIds: ['c3-recall-1', 'c3-recall-2', 'c3-exam']
export const unit3Lessons: Lesson[] = [
  {
    id: 'c3-recall-1',
    sectionId: 'c-unit3',
    order: 1,
    title: { en: 'I/O & Variables Review', bn: 'I/O ও ভেরিয়েবল রিভিউ' },
    description: { en: 'Rapid review of cin, cout, and variables.', bn: 'cin, cout এবং ভেরিয়েবলের দ্রুত রিভিউ।' },
    difficulty: 'beginner',
    xpReward: 120,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'I/O Recap', bn: 'I/O সারসংক্ষেপ' },
        body: { en: 'cout << outputs. cin >> inputs. endl or "\\n" for newline. Semicolons end every statement.', bn: 'cout << আউটপুট দেয়। cin >> ইনপুট নেয়। নতুন লাইনের জন্য endl বা "\\n"। প্রতিটি স্টেটমেন্ট সেমিকোলনে শেষ।' },
        code: {
          code: '#include <iostream>\nusing namespace std;\n\nint main() {\n  string name;\n  cout << "Name: ";\n  cin >> name;\n  cout << "Hello, " << name << endl;\n  return 0;\n}',
          language: 'cpp',
          explanation: { en: 'Input then greet. Classic I/O pattern.', bn: 'ইনপুট তারপর অভিবাদন। ক্লাসিক I/O প্যাটার্ন।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c3-r1-e1',
        question: { en: 'Which object reads user input in C++?', bn: 'C++ এ কোন অবজেক্ট ব্যবহারকারীর ইনপুট পড়ে?' },
        options: ['cin', 'cout', 'read', 'input'],
        correctIndex: 0,
        explanation: { en: 'cin >> reads input from the keyboard.', bn: 'cin >> কিবোর্ড থেকে ইনপুট পড়ে।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'c3-r1-e2',
        question: { en: 'Read an integer from user:', bn: 'ব্যবহারকারীর কাছ থেকে একটি পূর্ণ সংখ্যা পড়ুন:' },
        codeTemplate: 'int num;\ncin ___ num;',
        blanks: ['>>'],
        explanation: { en: '>> is the extraction operator for cin.', bn: '>> হলো cin এর জন্য এক্সট্র্যাকশন অপারেটর।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c3-r1-e3',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'int x = 5;\ncout << "x = " << x << endl;\ncout << "x+1 = " << x + 1;',
        options: ['x = 5\nx+1 = 6', 'x = 5 x+1 = 6', 'x = 5\nx = 5'],
        correctIndex: 0,
        explanation: { en: 'endl creates a new line between the two outputs.', bn: 'endl দুটি আউটপুটের মধ্যে নতুন লাইন তৈরি করে।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'c3-r1-e4',
        question: { en: 'What ends every C++ statement?', bn: 'প্রতিটি C++ স্টেটমেন্ট কী দিয়ে শেষ হয়?' },
        options: ['Semicolon ;', 'Colon :', 'Period .', 'Nothing'],
        correctIndex: 0,
        explanation: { en: 'Every statement in C++ must end with a semicolon.', bn: 'C++ এ প্রতিটি স্টেটমেন্ট সেমিকোলন দিয়ে শেষ হতে হবে।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'c3-r1-e5',
        question: { en: 'Find the missing semicolon:', bn: 'অনুপস্থিত সেমিকোলন খুঁজুন:' },
        code: 'int age = 18\ncout << "Age: " << age;',
        buggyLine: 1,
        explanation: { en: 'Missing ; after 18. Should be: int age = 18;', bn: '18 এর পরে ; নেই। হওয়া উচিত: int age = 18;' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'c3-recall-2',
    sectionId: 'c-unit3',
    order: 2,
    title: { en: 'Math & Types Review', bn: 'গণিত ও টাইপ রিভিউ' },
    description: { en: 'Review C++ arithmetic and type system.', bn: 'C++ গাণিতিক এবং টাইপ সিস্টেম রিভিউ করুন।' },
    difficulty: 'beginner',
    xpReward: 120,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Math & Types Recap', bn: 'গণিত ও টাইপের সারসংক্ষেপ' },
        body: { en: 'int/int = int (truncates). Cast (double) for decimals. Compound: +=, -=, *=, /=, %=. Types: int, double, bool, char, string.', bn: 'int/int = int (কাটে)। দশমিকের জন্য (double) cast। যৌগিক: +=, -=, *=, /=, %=। টাইপ: int, double, bool, char, string।' },
        code: {
          code: '// Tax calculator\ndouble price = 500.0;\ndouble tax = price * 0.15;\ndouble total = price + tax;\ncout << "Total: " << total;  // 575',
          language: 'cpp',
          explanation: { en: '15% tax on 500 = 75. Total = 575.', bn: '500 এর 15% কর = 75। মোট = 575।' }
        }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'c3-r2-e1',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'int a = 10, b = 3;\ncout << a % b;',
        options: ['1', '3', '0'],
        correctIndex: 0,
        explanation: { en: '10 % 3 = 1 (remainder after dividing by 3).', bn: '10 % 3 = 1 (3 দিয়ে ভাগ করার পরে ভাগশেষ)।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'c3-r2-e2',
        question: { en: 'Use compound operator to halve salary:', bn: 'compound অপারেটর ব্যবহার করে salary অর্ধেক করুন:' },
        codeTemplate: 'int salary = 5000;\nsalary ___ 2;\ncout << salary;',
        blanks: ['/='],
        explanation: { en: '/= divides and stores: 5000/2 = 2500.', bn: '/= ভাগ করে এবং জমা রাখে: 5000/2 = 2500।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'c3-r2-e3',
        question: { en: 'What is (int)7.8?', bn: '(int)7.8 কত?' },
        options: ['7', '8', '7.8', 'Error'],
        correctIndex: 0,
        explanation: { en: 'Casting to int always truncates toward zero.', bn: 'int তে cast করলে সবসময় শূন্যের দিকে কেটে নেয়।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'c3-r2-e4',
        question: { en: 'Which is NOT a primitive C++ type?', bn: 'কোনটি C++ এর প্রিমিটিভ টাইপ নয়?' },
        options: ['string', 'int', 'double', 'bool'],
        correctIndex: 0,
        explanation: { en: 'string is a class, not a primitive. int, double, bool, char are primitives.', bn: 'string একটি ক্লাস, প্রিমিটিভ নয়। int, double, bool, char হলো প্রিমিটিভ।' },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'c3-r2-e5',
        question: { en: 'Build a percentage calculator:', bn: 'একটি শতাংশ ক্যালকুলেটর তৈরি করুন:' },
        blocks: ['int total = 200;', 'int correct = 150;', 'double percent = (double)correct / total * 100;', 'cout << percent << "%";'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Cast before dividing to get decimal percentage.', bn: 'দশমিক শতাংশ পেতে ভাগের আগে cast করুন।' },
        xpReward: 35
      }
    ]
  },
  {
    id: 'c3-exam',
    sectionId: 'c-unit3',
    order: 3,
    isProject: true,
    title: { en: 'Unit Exam: Synapse Recall', bn: 'ইউনিট পরীক্ষা: সিন্যাপস রিকল' },
    description: { en: 'Full review test of C++ Units 1 & 2.', bn: 'C++ ইউনিট ১ ও ২ এর সম্পূর্ণ রিভিউ পরীক্ষা।' },
    difficulty: 'beginner',
    xpReward: 300,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Full Recap Test', bn: 'সম্পূর্ণ রিক্যাপ পরীক্ষা' },
        body: { en: 'This exam covers Units 1 and 2: I/O, variables, types, arithmetic, and assignment operators.', bn: 'এই পরীক্ষায় ইউনিট ১ এবং ২: I/O, ভেরিয়েবল, টাইপ, গণিত এবং নির্ধারণ অপারেটর।' }
      }
    ],
    exercises: [
      {
        type: 'bug_hunt',
        id: 'c3-exam-e1',
        question: { en: 'Find the I/O direction bug:', bn: 'I/O দিকনির্দেশনার বাগ খুঁজুন:' },
        code: 'int n;\ncout >> n;\ncin << "Value: " << n;',
        buggyLine: 2,
        explanation: { en: 'cin uses >> and cout uses <<. They are swapped here.', bn: 'cin >> ব্যবহার করে এবং cout << ব্যবহার করে। এখানে তারা অদলবদল হয়েছে।' },
        xpReward: 35
      },
      {
        type: 'output_predict',
        id: 'c3-exam-e2',
        question: { en: 'What is the final value of x?', bn: 'x এর চূড়ান্ত মান কত?' },
        code: 'int x = 10;\nx += 5;\nx *= 2;\ncout << x;',
        options: ['30', '25', '15'],
        correctIndex: 0,
        explanation: { en: 'x=10, x+=5 → 15, x*=2 → 30.', bn: 'x=10, x+=5 → 15, x*=2 → 30।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'c3-exam-e3',
        question: { en: 'What does endl do?', bn: 'endl কী করে?' },
        options: ['Moves to new line and flushes buffer', 'Ends the program', 'Closes the file', 'Nothing'],
        correctIndex: 0,
        explanation: { en: 'endl = newline + buffer flush. \\n is faster (no flush).', bn: 'endl = নতুন লাইন + বাফার ফ্লাশ। \\n দ্রুত (ফ্লাশ নেই)।' },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'c3-exam-e4',
        question: { en: 'Complete the full C++ program:', bn: 'সম্পূর্ণ C++ প্রোগ্রাম শেষ করুন:' },
        codeTemplate: '#include <___>\nusing namespace std;\nint main() {\n  cout << "Hi!";\n  return 0;\n}',
        blanks: ['iostream'],
        explanation: { en: '#include <iostream> enables cin and cout.', bn: '#include <iostream> cin এবং cout সক্ষম করে।' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'c3-exam-e5',
        question: { en: 'Build a C++ BMI calculator:', bn: 'একটি C++ BMI ক্যালকুলেটর তৈরি করুন:' },
        blocks: ['double weight, height;', 'cin >> weight >> height;', 'double bmi = weight / (height * height);', 'cout << "BMI: " << bmi;'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Declare → input → calculate → print.', bn: 'ঘোষণা → ইনপুট → হিসাব → প্রিন্ট।' },
        xpReward: 55
      }
    ]
  }
];
