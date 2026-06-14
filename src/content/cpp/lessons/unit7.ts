import type { Lesson } from '../../schema';

// C++ Unit 7: Deep Context — lessonIds: ['c7-review-1', 'c7-review-2', 'c7-exam']
export const unit7Lessons: Lesson[] = [
  {
    id: 'c7-review-1',
    sectionId: 'c-unit7',
    order: 1,
    title: { en: 'Logic Review Sprint', bn: 'লজিক রিভিউ স্প্রিন্ট' },
    description: { en: 'Review C++ conditionals and boolean operators.', bn: 'C++ শর্তসাপেক্ষ এবং বুলিয়ান অপারেটর রিভিউ করুন।' },
    difficulty: 'intermediate',
    xpReward: 130,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'C++ Logic Recap', bn: 'C++ লজিকের সারসংক্ষেপ' },
        body: { en: 'if (cond) {} else if (cond) {} else {}. && = AND, || = OR, ! = NOT. Always == for comparison, never =.', bn: 'if (cond) {} else if (cond) {} else {}। && = AND, || = OR, ! = NOT। তুলনার জন্য সবসময় ==, কখনো = নয়।' },
        code: {
          code: 'int x = 7;\nif (x > 0 && x < 10) {\n  cout << "Single digit positive";\n}',
          language: 'cpp',
          explanation: { en: 'Both conditions checked with &&.', bn: '&& দিয়ে উভয় শর্ত পরীক্ষা করা হয়।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c7-r1-e1',
        question: { en: 'C++ equivalent of Python "and"?', bn: 'Python "and" এর C++ সমতুল্য?' },
        options: ['&&', '||', '!', 'and'],
        correctIndex: 0,
        explanation: { en: '&& is C++\'s logical AND operator.', bn: '&& হলো C++ এর লজিক্যাল AND অপারেটর।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c7-r1-e2',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'bool a = true, b = false;\ncout << (a || b ? "Yes" : "No");',
        options: ['Yes', 'No', 'Error'],
        correctIndex: 0,
        explanation: { en: 'true || false = true. Ternary prints "Yes".', bn: 'true || false = true। টার্নারি "Yes" প্রিন্ট করে।' },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'c7-r1-e3',
        question: { en: 'Check player is NOT muted:', bn: 'প্লেয়ার muted নয় কিনা পরীক্ষা করুন:' },
        codeTemplate: 'if (___isMuted) {\n  chat();\n}',
        blanks: ['!'],
        explanation: { en: '!isMuted is true when isMuted is false.', bn: '!isMuted true যখন isMuted false।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'c7-r1-e4',
        question: { en: 'What is: !(false && true)?', bn: '!(false && true) কত?' },
        options: ['true', 'false', 'Error', '0'],
        correctIndex: 0,
        explanation: { en: 'false&&true = false. !false = true.', bn: 'false&&true = false। !false = true।' },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'c7-r1-e5',
        question: { en: 'Arrange: check if speed is in valid range:', bn: 'সাজান: speed বৈধ পরিসরে আছে কিনা পরীক্ষা করুন:' },
        blocks: ['int speed = 65;', 'if (speed >= 0 && speed <= 120) {', '  cout << "Safe speed";', '} else {', '  cout << "Overspeeding!"; }'],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: { en: 'Speed must be between 0 and 120 inclusive.', bn: 'গতি অবশ্যই ০ এবং ১২০ এর মধ্যে হতে হবে।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'c7-review-2',
    sectionId: 'c-unit7',
    order: 2,
    title: { en: 'Loop Review Sprint', bn: 'লুপ রিভিউ স্প্রিন্ট' },
    description: { en: 'Review all C++ loop types.', bn: 'সব C++ লুপ টাইপ রিভিউ করুন।' },
    difficulty: 'intermediate',
    xpReward: 130,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'C++ Loops Recap', bn: 'C++ লুপের সারসংক্ষেপ' },
        body: { en: 'for = known count. while = condition only. do-while = at least once. break = exit. continue = skip.', bn: 'for = জানা গণনা। while = শুধু শর্ত। do-while = অন্তত একবার। break = বের হওয়া। continue = বাদ দেওয়া।' },
        code: {
          code: '// Sum of even numbers 1-10\nint sum = 0;\nfor (int i = 1; i <= 10; i++) {\n  if (i % 2 != 0) continue;\n  sum += i;\n}\ncout << sum;  // 30',
          language: 'cpp',
          explanation: { en: 'continue skips odd numbers.', bn: 'continue বিজোড় সংখ্যা বাদ দেয়।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c7-r2-e1',
        question: { en: 'When should you use for instead of while?', bn: 'while এর পরিবর্তে for কখন ব্যবহার করবেন?' },
        options: ['When iteration count is known', 'When condition-based', 'Never', 'Always'],
        correctIndex: 0,
        explanation: { en: 'for is best when you know how many times to loop.', bn: 'কতবার লুপ করতে হবে জানলে for সবচেয়ে ভালো।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c7-r2-e2',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'int n = 1;\nwhile (n <= 16) n *= 2;\ncout << n;',
        options: ['32', '16', '8'],
        correctIndex: 0,
        explanation: { en: 'n doubles: 1→2→4→8→16→32. Stops at 32.', bn: 'n দ্বিগুণ হয়: 1→2→4→8→16→32। 32 এ থামে।' },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'c7-r2-e3',
        question: { en: 'Skip negative numbers in loop:', bn: 'লুপে ঋণাত্মক সংখ্যা বাদ দিন:' },
        codeTemplate: 'if (n < 0) ___;\ncout << n;',
        blanks: ['continue'],
        explanation: { en: 'continue skips to the next iteration.', bn: 'continue পরবর্তী ইটারেশনে যায়।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'c7-r2-e4',
        question: { en: 'Fix the off-by-one:', bn: 'off-by-one ঠিক করুন:' },
        code: 'for (int i = 1; i < 10; i++) {\n  cout << i;\n}',
        buggyLine: 1,
        explanation: { en: 'i < 10 prints 1-9. Use i <= 10 to include 10.', bn: 'i < 10 ১-৯ প্রিন্ট করে। ১০ অন্তর্ভুক্ত করতে i <= 10 ব্যবহার করুন।' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'c7-r2-e5',
        question: { en: 'Count numbers divisible by 5 from 1-50:', bn: '১-৫০ থেকে ৫ দিয়ে বিভাজ্য সংখ্যা গণনা করুন:' },
        blocks: ['int count = 0;', 'for (int i = 1; i <= 50; i++) {', '  if (i % 5 == 0) count++;', '}', 'cout << count;'],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: { en: '5, 10, 15... 50. That is 10 numbers.', bn: '৫, ১০, ১৫... ৫০। সেটি ১০টি সংখ্যা।' },
        xpReward: 35
      }
    ]
  },
  {
    id: 'c7-exam',
    sectionId: 'c-unit7',
    order: 3,
    isProject: true,
    title: { en: 'Unit Exam: Deep Context', bn: 'ইউনিট পরীক্ষা: ডিপ কনটেক্সট' },
    description: { en: 'Full test of C++ logic and loops.', bn: 'C++ লজিক এবং লুপের সম্পূর্ণ পরীক্ষা।' },
    difficulty: 'intermediate',
    xpReward: 350,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Combined Challenge', bn: 'মিলিত চ্যালেঞ্জ' },
        body: { en: 'This exam tests your ability to combine conditions and loops in C++.', bn: 'এই পরীক্ষা C++ এ শর্ত এবং লুপ একত্রিত করার দক্ষতা পরীক্ষা করে।' }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'c7-exam-e1',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'for (int i = 0; i < 5; i++) {\n  if (i == 3) break;\n  cout << i;\n}',
        options: ['012', '0123', '01234'],
        correctIndex: 0,
        explanation: { en: 'break at i=3. Prints 0, 1, 2.', bn: 'i=3 এ break। ০, ১, ২ প্রিন্ট করে।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'c7-exam-e2',
        question: { en: 'Nested loop: outer runs 3 times, inner 2 times. Total iterations?', bn: 'নেস্টেড লুপ: বাইরেরটি ৩ বার, ভেতরেরটি ২ বার। মোট ইটারেশন?' },
        options: ['6', '5', '9', '3'],
        correctIndex: 0,
        explanation: { en: '3 × 2 = 6 total inner loop executions.', bn: '৩ × ২ = ৬ মোট ভেতরের লুপ এক্সিকিউশন।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'c7-exam-e3',
        question: { en: 'Skip to next iteration on condition:', bn: 'শর্তে পরবর্তী ইটারেশনে যান:' },
        codeTemplate: 'if (score < 0) ___;\nprocess(score);',
        blanks: ['continue'],
        explanation: { en: 'Skip processing negative scores.', bn: 'ঋণাত্মক স্কোর প্রসেস করা বাদ দিন।' },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'c7-exam-e4',
        question: { en: 'Find the logic bug in the password check:', bn: 'পাসওয়ার্ড চেকে লজিক বাগ খুঁজুন:' },
        code: 'int tries = 0;\ndo {\n  cin >> pass;\n  tries++;\n} while (pass != "secret" | tries < 3);',
        buggyLine: 5,
        explanation: { en: 'Use || not | for logical OR: (pass != "secret" || tries < 3).', bn: 'লজিক্যাল OR এর জন্য | নয় || ব্যবহার করুন।' },
        xpReward: 40
      },
      {
        type: 'code_arrange',
        id: 'c7-exam-e5',
        question: { en: 'Arrange: find if any number in array is negative:', bn: 'সাজান: অ্যারেতে কোনো ঋণাত্মক সংখ্যা আছে কিনা খুঁজুন:' },
        blocks: ['int arr[] = {3, -1, 7, 2};', 'bool found = false;', 'for (int x : arr) {', '  if (x < 0) { found = true; break; }', '}', 'cout << (found ? "Yes" : "No");'],
        correctOrder: [0, 1, 2, 3, 4, 5],
        explanation: { en: 'Loop through, flag negative, break early.', bn: 'লুপ করুন, ঋণাত্মক চিহ্নিত করুন, আগে বের হোন।' },
        xpReward: 55
      }
    ]
  }
];
