import type { Lesson } from '../../schema';

// C++ Unit 4: Branching Paths — lessonIds: ['c4-if', 'c4-else', 'c4-exam']
export const unit4Lessons: Lesson[] = [
  {
    id: 'c4-if',
    sectionId: 'c-unit4',
    order: 1,
    title: { en: 'The Gatekeeper', bn: 'দ্বাররক্ষী' },
    description: { en: 'Make decisions with if statements in C++.', bn: 'C++ এ if স্টেটমেন্ট দিয়ে সিদ্ধান্ত নিন।' },
    difficulty: 'beginner',
    xpReward: 120,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'if Statements in C++', bn: 'C++ এ if স্টেটমেন্ট' },
        body: { en: 'Use if to conditionally run code. The condition goes in () and the body in {}. No colon — use curly braces!', bn: 'শর্তসাপেক্ষে কোড চালাতে if ব্যবহার করুন। শর্ত () এ এবং বডি {} এ যায়। কোলন নেই — কার্লি ব্রেস ব্যবহার করুন!' },
        code: {
          code: '#include <iostream>\nusing namespace std;\n\nint main() {\n  int age = 18;\n  if (age >= 18) {\n    cout << "Welcome!" << endl;\n  }\n  return 0;\n}',
          language: 'cpp',
          explanation: { en: 'Runs the cout only when age >= 18.', bn: 'শুধুমাত্র age >= 18 হলে cout চলে।' }
        }
      },
      {
        heading: { en: 'Comparison Operators', bn: 'তুলনা অপারেটর' },
        body: { en: '== (equal), != (not equal), < (less), > (greater), <= (less or equal), >= (greater or equal).', bn: '== (সমান), != (সমান নয়), < (কম), > (বেশি), <= (কম বা সমান), >= (বেশি বা সমান)।' }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c4-if-e1',
        question: { en: 'How do you wrap an if block in C++?', bn: 'C++ এ if ব্লক কীভাবে মোড়ান?' },
        options: ['{ }', '( )', '[ ]', 'Just indent'],
        correctIndex: 0,
        explanation: { en: 'C++ uses curly braces {} for code blocks.', bn: 'C++ কোড ব্লকের জন্য কার্লি ব্রেস {} ব্যবহার করে।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'c4-if-e2',
        question: { en: 'Complete the if check:', bn: 'if চেক সম্পূর্ণ করুন:' },
        codeTemplate: 'if (score ___ 100) {\n  cout << "Perfect!";\n}',
        blanks: ['=='],
        explanation: { en: '== checks equality in C++.', bn: 'C++ এ == সমতা পরীক্ষা করে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c4-if-e3',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'int x = 5;\nif (x > 10) {\n  cout << "Big";\n}',
        options: ['Nothing', 'Big', 'Error'],
        correctIndex: 0,
        explanation: { en: '5 is not > 10, so the if block is skipped.', bn: '5 > 10 নয়, তাই if ব্লক বাদ যায়।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'c4-if-e4',
        question: { en: 'What does != mean?', bn: '!= কী বোঝায়?' },
        options: ['Not equal', 'Equal', 'Greater than', 'Less than'],
        correctIndex: 0,
        explanation: { en: '!= is "not equal to".', bn: '!= মানে "সমান নয়"।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'c4-if-e5',
        question: { en: 'Fix the assignment vs comparison bug:', bn: 'নির্ধারণ বনাম তুলনার বাগ ঠিক করুন:' },
        code: 'int hp = 100;\nif (hp = 0) {\n  cout << "Dead";\n}',
        buggyLine: 2,
        explanation: { en: '= assigns, == compares. Use if (hp == 0).', bn: '= নির্ধারণ করে, == তুলনা করে। if (hp == 0) ব্যবহার করুন।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'c4-else',
    sectionId: 'c-unit4',
    order: 2,
    title: { en: 'Fork in the Road', bn: 'রাস্তার কাঁটা' },
    description: { en: 'Handle all outcomes with if/else if/else.', bn: 'if/else if/else দিয়ে সব ফলাফল সামলান।' },
    difficulty: 'beginner',
    xpReward: 120,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'else and else if', bn: 'else এবং else if' },
        body: { en: 'else runs when if is false. else if chains multiple checks. Only one block runs — the first matching one.', bn: 'if মিথ্যা হলে else চলে। else if একাধিক চেক চেইন করে। শুধু একটি ব্লক চলে — প্রথম মিলে যাওয়াটি।' },
        code: {
          code: 'int score = 72;\nif (score >= 90) {\n  cout << "A";\n} else if (score >= 70) {\n  cout << "B";\n} else {\n  cout << "C";\n}',
          language: 'cpp',
          explanation: { en: '72 >= 70, so "B" is printed.', bn: '72 >= 70, তাই "B" প্রিন্ট হয়।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c4-else-e1',
        question: { en: 'In C++, how do you write "else if"?', bn: 'C++ এ "else if" কীভাবে লেখেন?' },
        options: ['else if (cond)', 'elif (cond)', 'elseif (cond)', 'else(cond)'],
        correctIndex: 0,
        explanation: { en: 'C++ uses "else if" (two words) with a condition.', bn: 'C++ শর্ত সহ "else if" (দুটি শব্দ) ব্যবহার করে।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'c4-else-e2',
        question: { en: 'Add default case:', bn: 'ডিফল্ট কেস যোগ করুন:' },
        codeTemplate: 'if (hp > 50) {\n  cout << "Healthy";\n} ___ {\n  cout << "Low HP";\n}',
        blanks: ['else'],
        explanation: { en: 'else handles all remaining cases.', bn: 'else অবশিষ্ট সব ক্ষেত্র সামলায়।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c4-else-e3',
        question: { en: 'What is printed when x = 5?', bn: 'x = 5 হলে কী প্রিন্ট হবে?' },
        code: 'int x = 5;\nif (x > 10) {\n  cout << "Big";\n} else if (x > 3) {\n  cout << "Medium";\n} else {\n  cout << "Small";\n}',
        options: ['Medium', 'Big', 'Small'],
        correctIndex: 0,
        explanation: { en: '5 is not >10 but is >3, so "Medium" prints.', bn: '5 >10 নয় কিন্তু >3, তাই "Medium" প্রিন্ট হয়।' },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'c4-else-e4',
        question: { en: 'Arrange the traffic light logic:', bn: 'ট্রাফিক লাইট লজিক সাজান:' },
        blocks: ['string light = "red";', 'if (light == "green") {', '  cout << "Go";', '} else if (light == "yellow") {', '  cout << "Slow";', '} else {', '  cout << "Stop"; }'],
        correctOrder: [0, 1, 2, 3, 4, 5, 6],
        explanation: { en: 'Check green, yellow, then default to stop.', bn: 'সবুজ, হলুদ পরীক্ষা করুন, তারপর ডিফল্ট থামানো।' },
        xpReward: 35
      },
      {
        type: 'bug_hunt',
        id: 'c4-else-e5',
        question: { en: 'Fix the dangling else:', bn: 'dangling else ঠিক করুন:' },
        code: 'int x = 5;\nif (x > 0)\n  cout << "Pos";\n  cout << "Always";\nelse {\n  cout << "Neg";\n}',
        buggyLine: 4,
        explanation: { en: 'Without {}, only one line belongs to if. Add {} around both lines.', bn: '{} ছাড়া শুধু একটি লাইন if এর অন্তর্গত। উভয় লাইনের চারপাশে {} যোগ করুন।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'c4-exam',
    sectionId: 'c-unit4',
    order: 3,
    isProject: true,
    title: { en: 'Unit Exam: Branching Paths', bn: 'ইউনিট পরীক্ষা: ব্রাঞ্চিং পাথ' },
    description: { en: 'Test C++ conditional mastery.', bn: 'C++ শর্তসাপেক্ষ দক্ষতা পরীক্ষা করুন।' },
    difficulty: 'intermediate',
    xpReward: 300,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Conditionals Exam', bn: 'শর্তসাপেক্ষ পরীক্ষা' },
        body: { en: 'C++ conditions: if (cond) {} else if (cond) {} else {}. Always use == not = for comparison.', bn: 'C++ শর্ত: if (cond) {} else if (cond) {} else {}। তুলনার জন্য সবসময় == ব্যবহার করুন, = নয়।' }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'c4-exam-e1',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'int n = 0;\nif (n > 0) cout << "Pos";\nelse if (n < 0) cout << "Neg";\nelse cout << "Zero";',
        options: ['Zero', 'Pos', 'Neg'],
        correctIndex: 0,
        explanation: { en: 'Neither condition matches, so else runs.', bn: 'কোনো শর্ত মেলে না, তাই else চলে।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'c4-exam-e2',
        question: { en: 'Check access for members and VIPs:', bn: 'মেম্বার এবং VIP এর অ্যাক্সেস পরীক্ষা করুন:' },
        codeTemplate: 'if (isMember ___ isVIP) {\n  cout << "Allowed";\n}',
        blanks: ['||'],
        explanation: { en: '|| is OR in C++. True if either is true.', bn: 'C++ এ || হলো OR। যেকোনো একটি সত্য হলে True।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'c4-exam-e3',
        question: { en: 'What is && in C++?', bn: 'C++ এ && কী?' },
        options: ['Logical AND', 'Bitwise AND', 'String join', 'Address of'],
        correctIndex: 0,
        explanation: { en: '&& is the logical AND operator. Both must be true.', bn: '&& হলো লজিক্যাল AND অপারেটর। উভয়কেই সত্য হতে হবে।' },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'c4-exam-e4',
        question: { en: 'Fix the condition:', bn: 'শর্ত ঠিক করুন:' },
        code: 'int age = 20;\nif age >= 18 {\n  cout << "Adult";\n}',
        buggyLine: 2,
        explanation: { en: 'The condition must be in parentheses: if (age >= 18).', bn: 'শর্তটি অবশ্যই বন্ধনীতে: if (age >= 18)।' },
        xpReward: 35
      },
      {
        type: 'code_arrange',
        id: 'c4-exam-e5',
        question: { en: 'Arrange fee calculation:', bn: 'ফি হিসাব সাজান:' },
        blocks: ['int age = 12;', 'if (age < 5) {', '  cout << "Free";', '} else if (age < 18) {', '  cout << "Half price";', '} else {', '  cout << "Full price"; }'],
        correctOrder: [0, 1, 2, 3, 4, 5, 6],
        explanation: { en: 'Check youngest first, descend age ranges.', bn: 'সবচেয়ে কম বয়স প্রথমে পরীক্ষা করুন, বয়সের পরিসর নিচে নামুন।' },
        xpReward: 50
      }
    ]
  }
];
