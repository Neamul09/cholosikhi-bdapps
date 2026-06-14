import type { Lesson } from '../../schema';

// C++ Unit 10: The Empire Build — lessonIds: ['c10-start', 'c10-logic', 'p10-ui', 'p10-finish']
// NOTE: metadata uses p10-ui and p10-finish for unit 10 (reuses python ids intentionally for shared lessons)
export const unit10Lessons: Lesson[] = [
  {
    id: 'c10-start',
    sectionId: 'c-unit10',
    order: 1,
    title: { en: 'Empire Setup', bn: 'এম্পায়ার সেটআপ' },
    description: { en: 'Plan your final C++ project structure.', bn: 'আপনার চূড়ান্ত C++ প্রজেক্টের কাঠামো পরিকল্পনা করুন।' },
    difficulty: 'advanced',
    xpReward: 200,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'The Grand Project: Student Grade System', bn: 'গ্র্যান্ড প্রজেক্ট: ছাত্র গ্রেড সিস্টেম' },
        body: { en: 'We will build a student grade tracking system using arrays, functions, and loops.', bn: 'আমরা অ্যারে, ফাংশন এবং লুপ ব্যবহার করে একটি ছাত্র গ্রেড ট্র্যাকিং সিস্টেম তৈরি করব।' },
        code: {
          code: '#include <iostream>\n#include <string>\nusing namespace std;\n\nconst int MAX = 5;\nstring names[MAX];\nint scores[MAX];',
          language: 'cpp',
          explanation: { en: 'Two parallel arrays: names and scores.', bn: 'দুটি সমান্তরাল অ্যারে: names এবং scores।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c10-start-e1',
        question: { en: 'Best structure for student records in C++?', bn: 'C++ এ ছাত্রের রেকর্ডের সেরা কাঠামো?' },
        options: ['Parallel arrays or struct', 'A single variable', 'Only integers', 'Nothing — C++ cannot do this'],
        correctIndex: 0,
        explanation: { en: 'Parallel arrays work well; structs are even better.', bn: 'সমান্তরাল অ্যারে ভালো কাজ করে; struct আরও ভালো।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'c10-start-e2',
        question: { en: 'Declare a constant size:', bn: 'একটি ধ্রুবক আকার ঘোষণা করুন:' },
        codeTemplate: '___ int MAX_STUDENTS = 30;',
        blanks: ['const'],
        explanation: { en: 'const makes a variable unchangeable.', bn: 'const একটি ভেরিয়েবলকে অপরিবর্তনযোগ্য করে।' },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'c10-start-e3',
        question: { en: 'What is the size of this array?', bn: 'এই অ্যারের আকার কত?' },
        code: 'int data[] = {10, 20, 30, 40, 50};\nint size = sizeof(data) / sizeof(data[0]);\ncout << size;',
        options: ['5', '4', '50'],
        correctIndex: 0,
        explanation: { en: 'sizeof trick gives element count: 20/4 = 5.', bn: 'sizeof কৌশল উপাদানের সংখ্যা দেয়: 20/4 = 5।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'c10-start-e4',
        question: { en: 'What is const for?', bn: 'const কিসের জন্য?' },
        options: ['Variables that should not change', 'Faster code', 'Required for arrays', 'Only for integers'],
        correctIndex: 0,
        explanation: { en: 'const prevents accidental modification.', bn: 'const আকস্মিক পরিবর্তন রোধ করে।' },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'c10-start-e5',
        question: { en: 'Initialize student data arrays:', bn: 'ছাত্রের ডাটা অ্যারে ইনিশিয়ালাইজ করুন:' },
        blocks: ['const int N = 3;', 'string names[N] = {"Alice", "Bob", "Carol"};', 'int scores[N] = {90, 85, 92};', 'cout << names[0] << ": " << scores[0];'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Declare size, initialize both arrays, display first entry.', bn: 'আকার ঘোষণা করুন, উভয় অ্যারে ইনিশিয়ালাইজ করুন, প্রথম এন্ট্রি দেখান।' },
        xpReward: 40
      }
    ]
  },
  {
    id: 'c10-logic',
    sectionId: 'c-unit10',
    order: 2,
    title: { en: 'Empire Logic', bn: 'এম্পায়ার লজিক' },
    description: { en: 'Build grade calculation and statistics functions.', bn: 'গ্রেড হিসাব এবং পরিসংখ্যান ফাংশন তৈরি করুন।' },
    difficulty: 'advanced',
    xpReward: 200,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Grade System Logic', bn: 'গ্রেড সিস্টেম লজিক' },
        body: { en: 'Calculate average, find max, assign letter grade — all using functions.', bn: 'গড় হিসাব করুন, সর্বোচ্চ খুঁজুন, লেটার গ্রেড নির্ধারণ করুন — সব ফাংশন ব্যবহার করে।' },
        code: {
          code: 'double average(int scores[], int n) {\n  int sum = 0;\n  for (int i = 0; i < n; i++) sum += scores[i];\n  return (double)sum / n;\n}\n\nstring letterGrade(int s) {\n  if (s >= 90) return "A";\n  if (s >= 70) return "B";\n  return "C";\n}',
          language: 'cpp',
          explanation: { en: 'Functions for statistics and grading.', bn: 'পরিসংখ্যান এবং গ্রেডিং এর জন্য ফাংশন।' }
        }
      }
    ],
    exercises: [
      {
        type: 'fill_blank',
        id: 'c10-logic-e1',
        question: { en: 'Pass array to function:', bn: 'ফাংশনে অ্যারে পাঠান:' },
        codeTemplate: 'double avg(int scores___, int n) {\n  /* ... */\n}',
        blanks: ['[]'],
        explanation: { en: 'Arrays are passed as pointer-like: int arr[].', bn: 'অ্যারে পয়েন্টারের মতো পাঠানো হয়: int arr[]।' },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'c10-logic-e2',
        question: { en: 'What is the average?', bn: 'গড় কত?' },
        code: 'int s[] = {80, 90, 70};\nint sum = 0;\nfor (int x : s) sum += x;\ncout << sum / 3;',
        options: ['80', '90', '70'],
        correctIndex: 0,
        explanation: { en: '(80+90+70)/3 = 240/3 = 80.', bn: '(৮০+৯০+৭০)/৩ = ২৪০/৩ = ৮০।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'c10-logic-e3',
        question: { en: 'Why cast to (double) before division?', bn: 'ভাগের আগে (double) তে cast কেন করবেন?' },
        options: ['To get decimal result', 'To make it faster', 'Required syntax', 'To print correctly'],
        correctIndex: 0,
        explanation: { en: 'int/int = int (truncates). (double)int/int = double.', bn: 'int/int = int (কাটে)। (double)int/int = double।' },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'c10-logic-e4',
        question: { en: 'Fix the integer division:', bn: 'পূর্ণ সংখ্যার ভাগ ঠিক করুন:' },
        code: 'int total = 250;\nint n = 3;\ndouble avg = total / n;\ncout << avg;',
        buggyLine: 3,
        explanation: { en: '250/3 = 83 (int). Cast: (double)total / n = 83.33.', bn: '250/3 = 83 (int)। Cast: (double)total / n = 83.33।' },
        xpReward: 35
      },
      {
        type: 'code_arrange',
        id: 'c10-logic-e5',
        question: { en: 'Find max score in array:', bn: 'অ্যারেতে সর্বোচ্চ স্কোর খুঁজুন:' },
        blocks: ['int findMax(int arr[], int n) {', '  int max = arr[0];', '  for (int i = 1; i < n; i++) {', '    if (arr[i] > max) max = arr[i];', '  }', '  return max; }'],
        correctOrder: [0, 1, 2, 3, 4, 5],
        explanation: { en: 'Track max by comparing each element.', bn: 'প্রতিটি উপাদান তুলনা করে max ট্র্যাক করুন।' },
        xpReward: 50
      }
    ]
  },
  {
    id: 'p10-ui',
    sectionId: 'c-unit10',
    order: 3,
    title: { en: 'Display Module', bn: 'ডিসপ্লে মডিউল' },
    description: { en: 'Build the display and reporting module.', bn: 'ডিসপ্লে এবং রিপোর্টিং মডিউল তৈরি করুন।' },
    difficulty: 'advanced',
    xpReward: 200,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'C++ Output Formatting', bn: 'C++ আউটপুট ফরম্যাটিং' },
        body: { en: 'Use setw() and fixed/setprecision() for formatted output. Include <iomanip>.', bn: 'ফরম্যাটেড আউটপুটের জন্য setw() এবং fixed/setprecision() ব্যবহার করুন। <iomanip> অন্তর্ভুক্ত করুন।' },
        code: {
          code: '#include <iomanip>\n\ncout << fixed << setprecision(2);\ncout << 3.14159;  // 3.14\n\n// Table formatting:\ncout << setw(10) << "Name" << setw(8) << "Score";',
          language: 'cpp',
          explanation: { en: 'setprecision controls decimal places. setw pads columns.', bn: 'setprecision দশমিক স্থান নিয়ন্ত্রণ করে। setw কলাম প্যাড করে।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c10-ui-e1',
        question: { en: 'Which header enables setw and setprecision?', bn: 'কোন হেডার setw এবং setprecision সক্ষম করে?' },
        options: ['<iomanip>', '<iostream>', '<string>', '<cmath>'],
        correctIndex: 0,
        explanation: { en: '<iomanip> contains stream manipulators.', bn: '<iomanip> এ স্ট্রিম ম্যানিপুলেটর আছে।' },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'c10-ui-e2',
        question: { en: 'Print with 2 decimal places:', bn: '২ দশমিক স্থান সহ প্রিন্ট করুন:' },
        codeTemplate: 'cout << fixed << setprecision(___) << 3.14159;',
        blanks: ['2'],
        explanation: { en: 'setprecision(2) shows 2 decimal places.', bn: 'setprecision(2) ২ দশমিক স্থান দেখায়।' },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'c10-ui-e3',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'cout << "=" * 20;',
        options: ['Error — C++ cannot multiply strings like Python', '====================', '20'],
        correctIndex: 0,
        explanation: { en: 'C++ string * int does not work. Use a loop or string(20, "=").', bn: 'C++ এ string * int কাজ করে না। লুপ বা string(20, "=") ব্যবহার করুন।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'c10-ui-e4',
        question: { en: 'How to print 20 dashes in C++?', bn: 'C++ এ ২০টি ড্যাশ কীভাবে প্রিন্ট করবেন?' },
        options: ['string(20, \'-\')', '"-" * 20', 'repeat("-", 20)', 'puts("-", 20)'],
        correctIndex: 0,
        explanation: { en: 'string(n, char) creates a string with n repeated chars.', bn: 'string(n, char) n বার পুনরাবৃত্তি চরিত্র সহ স্ট্রিং তৈরি করে।' },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'c10-ui-e5',
        question: { en: 'Print a student report card header:', bn: 'একটি ছাত্রের রিপোর্ট কার্ড হেডার প্রিন্ট করুন:' },
        blocks: ['cout << string(30, \'=\') << endl;', 'cout << "  STUDENT REPORT CARD  " << endl;', 'cout << string(30, \'=\') << endl;'],
        correctOrder: [0, 1, 2],
        explanation: { en: 'Top border, title, bottom border.', bn: 'উপরের সীমানা, শিরোনাম, নিচের সীমানা।' },
        xpReward: 40
      }
    ]
  },
  {
    id: 'p10-finish',
    sectionId: 'c-unit10',
    order: 4,
    isProject: true,
    title: { en: 'Grand Finale!', bn: 'গ্র্যান্ড ফিনালে!' },
    description: { en: 'Complete the Student Grade System. You built an empire!', bn: 'ছাত্র গ্রেড সিস্টেম সম্পন্ন করুন। আপনি একটি সাম্রাজ্য তৈরি করেছেন!' },
    difficulty: 'advanced',
    xpReward: 700,
    estimatedMinutes: 25,
    theory: [
      {
        heading: { en: 'The Complete Grade System', bn: 'সম্পূর্ণ গ্রেড সিস্টেম' },
        body: { en: 'This final project combines everything: arrays, functions, loops, conditions, strings, and output formatting.', bn: 'এই চূড়ান্ত প্রজেক্টে সবকিছু একত্রিত: অ্যারে, ফাংশন, লুপ, শর্ত, স্ট্রিং এবং আউটপুট ফরম্যাটিং।' },
        code: {
          code: '#include <iostream>\n#include <string>\n#include <iomanip>\nusing namespace std;\n\nconst int N = 3;\nstring names[] = {"Alice", "Bob", "Carol"};\nint scores[] = {90, 75, 88};\n\nstring grade(int s) {\n  if (s >= 90) return "A";\n  if (s >= 70) return "B";\n  return "C";\n}\n\nint main() {\n  cout << string(30, \'=\') << endl;\n  for (int i = 0; i < N; i++) {\n    cout << setw(10) << names[i]\n         << setw(6) << scores[i]\n         << setw(4) << grade(scores[i]) << endl;\n  }\n  return 0;\n}',
          language: 'cpp',
          explanation: { en: 'A complete, modular grade reporting program!', bn: 'একটি সম্পূর্ণ, মডুলার গ্রেড রিপোর্টিং প্রোগ্রাম!' }
        }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'c10-finish-e1',
        question: { en: 'What is: (double)(80 + 90 + 100) / 3?', bn: '(double)(80 + 90 + 100) / 3 কত?' },
        code: 'cout << fixed << setprecision(1) << (double)(80+90+100)/3;',
        options: ['90.0', '90.3', '270.0'],
        correctIndex: 0,
        explanation: { en: '270/3 = 90.0 exactly.', bn: '270/3 = ঠিক 90.0।' },
        xpReward: 40
      },
      {
        type: 'fill_blank',
        id: 'c10-finish-e2',
        question: { en: 'Call the grade function for score 85:', bn: 'স্কোর 85 এর জন্য grade ফাংশন কল করুন:' },
        codeTemplate: 'cout << ___(85);',
        blanks: ['grade'],
        explanation: { en: 'grade(85) returns "B" according to our function.', bn: 'আমাদের ফাংশন অনুযায়ী grade(85) "B" ফেরত দেয়।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'c10-finish-e3',
        question: { en: 'What is next after mastering C++ basics?', bn: 'C++ মূল বিষয় আয়ত্ত করার পর কী?' },
        options: ['OOP: classes and objects', 'Relearn variables', 'Assembly language only', 'Stop here'],
        correctIndex: 0,
        explanation: { en: 'Classes, inheritance, polymorphism — the OOP world awaits!', bn: 'ক্লাস, ইনহেরিটেন্স, পলিমরফিজম — OOP জগৎ অপেক্ষা করছে!' },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'c10-finish-e4',
        question: { en: 'Fix the function declaration order:', bn: 'ফাংশন ঘোষণার ক্রম ঠিক করুন:' },
        code: 'int main() {\n  cout << square(5);\n  return 0;\n}\n\nint square(int n) { return n * n; }',
        buggyLine: 2,
        explanation: { en: 'square used before defined. Add a prototype: int square(int);', bn: 'square সংজ্ঞার আগে ব্যবহার হয়েছে। একটি প্রোটোটাইপ যোগ করুন: int square(int);' },
        xpReward: 40
      },
      {
        type: 'code_arrange',
        id: 'c10-finish-e5',
        question: { en: 'Arrange the complete grade display loop:', bn: 'সম্পূর্ণ গ্রেড ডিসপ্লে লুপ সাজান:' },
        blocks: [
          'for (int i = 0; i < N; i++) {',
          '  string g = grade(scores[i]);',
          '  cout << names[i] << ": " << scores[i] << " (" << g << ")" << endl;',
          '}'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Loop, grade each, print formatted line.', bn: 'লুপ, প্রতিটি গ্রেড করুন, ফরম্যাটেড লাইন প্রিন্ট করুন।' },
        xpReward: 80
      }
    ]
  }
];
