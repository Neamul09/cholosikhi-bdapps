import type { Lesson } from '../../schema';

// C++ Unit 5: Logic Gates — lessonIds: ['c5-and', 'c5-or', 'c5-exam']
export const unit5Lessons: Lesson[] = [
  {
    id: 'c5-and',
    sectionId: 'c-unit5',
    order: 1,
    title: { en: 'The AND Circuit', bn: 'AND সার্কিট' },
    description: { en: 'Combine conditions with && and ! in C++.', bn: 'C++ এ && এবং ! দিয়ে শর্ত একত্রিত করুন।' },
    difficulty: 'intermediate',
    xpReward: 130,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Logical AND (&&)', bn: 'লজিক্যাল AND (&&)' },
        body: { en: '&& returns true only if BOTH sides are true. Use ! to negate (flip) a condition.', bn: '&& শুধুমাত্র উভয় দিক সত্য হলে true দেয়। শর্ত নেগেট (উল্টানো) করতে ! ব্যবহার করুন।' },
        code: {
          code: 'bool hasKey = true;\nint level = 5;\nif (hasKey && level >= 5) {\n  cout << "Door unlocked!" << endl;\n}',
          language: 'cpp',
          explanation: { en: 'Both hasKey=true AND level>=5 must be satisfied.', bn: 'hasKey=true এবং level>=5 উভয়কেই পূরণ করতে হবে।' }
        }
      },
      {
        heading: { en: 'NOT Operator (!)', bn: 'NOT অপারেটর (!)' },
        body: { en: '!true = false, !false = true. Useful for "unless" logic.', bn: '!true = false, !false = true। "unless" লজিকের জন্য দরকারী।' }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c5-and-e1',
        question: { en: 'What is: true && false in C++?', bn: 'C++ এ true && false কত?' },
        options: ['false', 'true', '0', 'Error'],
        correctIndex: 0,
        explanation: { en: '&& needs both true. One false makes result false.', bn: '&& উভয় true চায়। একটি false ফলাফলকে false করে।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'c5-and-e2',
        question: { en: 'Both must be true:', bn: 'উভয়কেই true হতে হবে:' },
        codeTemplate: 'if (alive ___ hasAmmo) {\n  cout << "Shoot!";\n}',
        blanks: ['&&'],
        explanation: { en: '&& requires both conditions to be true.', bn: '&& উভয় শর্ত true হওয়া প্রয়োজন।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c5-and-e3',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'bool p = true, q = false;\nif (!q && p) {\n  cout << "Yes";\n}',
        options: ['Yes', 'Nothing', 'Error'],
        correctIndex: 0,
        explanation: { en: '!q = !false = true. true && true = true.', bn: '!q = !false = true। true && true = true।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'c5-and-e4',
        question: { en: 'What does ! do?', bn: '! কী করে?' },
        options: ['Flips true/false', 'Compares values', 'Adds numbers', 'Prints output'],
        correctIndex: 0,
        explanation: { en: '! is the logical NOT operator.', bn: '! হলো লজিক্যাল NOT অপারেটর।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'c5-and-e5',
        question: { en: 'Fix the logic:', bn: 'লজিক ঠিক করুন:' },
        code: 'int speed = 50;\nif (speed > 0 & speed < 100) {\n  cout << "In range";\n}',
        buggyLine: 2,
        explanation: { en: 'Use && for logical AND, not & (which is bitwise).', bn: 'লজিক্যাল AND এর জন্য && ব্যবহার করুন, & নয় (যা বিটওয়াইজ)।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'c5-or',
    sectionId: 'c-unit5',
    order: 2,
    title: { en: 'The OR Circuit', bn: 'OR সার্কিট' },
    description: { en: 'Use || for flexible C++ conditions.', bn: 'নমনীয় C++ শর্তের জন্য || ব্যবহার করুন।' },
    difficulty: 'intermediate',
    xpReward: 130,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Logical OR (||)', bn: 'লজিক্যাল OR (||)' },
        body: { en: '|| returns true if at LEAST ONE side is true. Only false || false gives false.', bn: 'অন্তত একটি দিক সত্য হলে || true দেয়। শুধুমাত্র false || false হলে false।' },
        code: {
          code: 'string weapon = "sword";\nif (weapon == "sword" || weapon == "axe") {\n  cout << "Melee fighter!" << endl;\n}',
          language: 'cpp',
          explanation: { en: 'Either weapon qualifies.', bn: 'যেকোনো অস্ত্র যোগ্য।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c5-or-e1',
        question: { en: 'What is: false || true?', bn: 'false || true কত?' },
        options: ['true', 'false', 'Error', 'null'],
        correctIndex: 0,
        explanation: { en: '|| only needs one true.', bn: '|| এর জন্য মাত্র একটি true হলেই চলে।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'c5-or-e2',
        question: { en: 'Allow admin or mod access:', bn: 'admin বা mod অ্যাক্সেস দিন:' },
        codeTemplate: 'if (isAdmin ___ isMod) {\n  cout << "Allowed";\n}',
        blanks: ['||'],
        explanation: { en: '|| requires only one to be true.', bn: '|| এর জন্য মাত্র একটি true হলেই চলে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c5-or-e3',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'bool a = false, b = false;\nif (a || b) {\n  cout << "One true";\n} else {\n  cout << "Both false";\n}',
        options: ['Both false', 'One true', 'Error'],
        correctIndex: 0,
        explanation: { en: 'Both false, so || is false, else runs.', bn: 'উভয়ই false, তাই || false, else চলে।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'c5-or-e4',
        question: { en: 'When is || false?', bn: '|| কখন false?' },
        options: ['Both sides false', 'Either side false', 'Both sides true', 'Never'],
        correctIndex: 0,
        explanation: { en: '|| is only false when BOTH operands are false.', bn: 'উভয় অপারেন্ড false হলেই || false।' },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'c5-or-e5',
        question: { en: 'Arrange weekend check:', bn: 'সাপ্তাহিক ছুটি চেক সাজান:' },
        blocks: ['string day = "Saturday";', 'if (day == "Saturday" || day == "Sunday") {', '  cout << "Weekend!";', '}'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Either Saturday or Sunday is a weekend.', bn: 'শনিবার বা রবিবার যেকোনোটি সাপ্তাহিক ছুটি।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'c5-exam',
    sectionId: 'c-unit5',
    order: 3,
    isProject: true,
    title: { en: 'Unit Exam: Logic Gates', bn: 'ইউনিট পরীক্ষা: লজিক গেটস' },
    description: { en: 'Master &&, ||, and ! in C++.', bn: 'C++ এ &&, || এবং ! আয়ত্ত করুন।' },
    difficulty: 'intermediate',
    xpReward: 300,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Logic Summary', bn: 'লজিকের সারসংক্ষেপ' },
        body: { en: '&&: both true. ||: at least one true. !: flip. Python "and"/"or"/"not" = C++ "&&"/"||"/"!".', bn: '&&: উভয় true। ||: অন্তত একটি true। !: উল্টান। Python "and"/"or"/"not" = C++ "&&"/"||"/"!"।' }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'c5-exam-e1',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'int x = 8;\nif (x > 5 && x < 15) {\n  cout << "In zone";\n}',
        options: ['In zone', 'Nothing', 'Error'],
        correctIndex: 0,
        explanation: { en: '8>5 is true AND 8<15 is true, so && is true.', bn: '8>5 true এবং 8<15 true, তাই && true।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'c5-exam-e2',
        question: { en: 'Negate the condition:', bn: 'শর্ত নেগেট করুন:' },
        codeTemplate: 'bool connected = false;\nif (___connected) {\n  cout << "Offline mode";\n}',
        blanks: ['!'],
        explanation: { en: '!connected flips false to true.', bn: '!connected false কে true তে উল্টায়।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'c5-exam-e3',
        question: { en: 'What is: !(true || false)?', bn: '!(true || false) কত?' },
        options: ['false', 'true', '0', 'Error'],
        correctIndex: 0,
        explanation: { en: 'true||false = true. !true = false.', bn: 'true||false = true। !true = false।' },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'c5-exam-e4',
        question: { en: 'Find the logic bug:', bn: 'লজিক বাগ খুঁজুন:' },
        code: 'string color = "blue";\nif (color == "red" && color == "blue") {\n  cout << "Match";\n}',
        buggyLine: 2,
        explanation: { en: 'color cannot be both red AND blue simultaneously. Use ||.', bn: 'color একই সময়ে লাল এবং নীল হতে পারে না। || ব্যবহার করুন।' },
        xpReward: 35
      },
      {
        type: 'code_arrange',
        id: 'c5-exam-e5',
        question: { en: 'Arrange the multi-condition access check:', bn: 'বহু-শর্ত অ্যাক্সেস চেক সাজান:' },
        blocks: ['bool isAdmin = false;', 'bool isPaid = true;', 'bool hasCode = true;', 'if (isAdmin || (isPaid && hasCode)) {', '  cout << "Access granted"; }'],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: { en: 'Admin OR (paid subscriber who also has code) gets access.', bn: 'Admin অথবা (পেইড সাবস্ক্রাইবার যার কোডও আছে) অ্যাক্সেস পায়।' },
        xpReward: 50
      }
    ]
  }
];
