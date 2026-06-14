import type { Lesson } from '../../schema';

// Unit 7: Deep Recall — lessonIds: ['p7-review-1', 'p7-review-2', 'p7-exam']
export const unit7Lessons: Lesson[] = [
  {
    id: 'p7-review-1',
    sectionId: 'p-unit7',
    order: 1,
    title: { en: 'Logic Review Sprint', bn: 'লজিক রিভিউ স্প্রিন্ট' },
    description: { en: 'Rapid fire review of if, and, or, not.', bn: 'if, and, or, not এর দ্রুত রিভিউ।' },
    difficulty: 'intermediate',
    xpReward: 130,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Logic & Conditions Recap', bn: 'লজিক ও শর্তের সারসংক্ষেপ' },
        body: { en: 'if/elif/else handle conditions. and/or combine conditions. not flips them. Indentation is critical.', bn: 'if/elif/else শর্তগুলোকে নিয়ন্ত্রণ করে। and/or শর্ত একত্রিত করে। not সেগুলোকে উল্টে দেয়। এবং ইন্ডেন্টেশন অত্যন্ত গুরুত্বপূর্ণ।' },
        code: {
          code: 'x = 15\nif x > 10 and x < 20:\n    print("In teen zone")',
          language: 'python',
          explanation: { en: 'Both conditions are checked using "and".', bn: '"and" ব্যবহার করে উভয় শর্ত পরীক্ষা করা হয়।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p7-r1-e1',
        question: { en: 'What runs if all if/elif fail?', bn: 'সব if/elif ব্যর্থ হলে কোনটি কাজ করে?' },
        options: ['else', 'elif', 'break', 'pass'],
        correctIndex: 0,
        explanation: { en: 'else is the final fallback. when if/elif conditions are false then else runs.', bn: 'যখন if/elif এর শর্তগুলো মিথ্যা হয় তখন else কাজ করে। else হলো চূড়ান্ত ফলব্যাক।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p7-r1-e2',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'a = 5\nb = 10\nif a > b or b > 8:\n    print("Yes")',
        options: ['Yes', 'Nothing', 'Error'],
        correctIndex: 0,
        explanation: { en: 'b > 8 condition is True, so "or" gives True.', bn: 'b > 8 শর্তটি True, তাই "or" True হিসেবে বিবেচিত হবে।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p7-r1-e3',
        question: { en: 'Add an extra check:', bn: 'একটি অতিরিক্ত শর্ত যোগ করুন:' },
        codeTemplate: 'if x > 0:\n    print("Positive")\n___ x == 0:\n    print("Zero")',
        blanks: ['elif'],
        explanation: { en: 'elif adds another condition to check.', bn: 'elif আরেকটি শর্ত যোগ করে।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p7-r1-e4',
        question: { en: 'What is: not (True and False)?', bn: 'not (True and False) বলতে কি বোঝায়?' },
        options: ['True', 'False', 'None', 'Error'],
        correctIndex: 0,
        explanation: { en: '"True and False" = False. not False = True.', bn: '"True and False" = False। not False = True।' },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'p7-r1-e5',
        question: { en: 'Arrange the complete grade logic:', bn: 'গ্রেডের সম্পূর্ণ লজিক সাজান:' },
        blocks: ['grade = 75', 'if grade >= 90:', '    print("A")', 'elif grade >= 70:', '    print("B")', 'else:', '    print("C")'],
        correctOrder: [0, 1, 2, 3, 4, 5, 6],
        explanation: { en: 'Check highest grade first, then next one.', bn: 'প্রথমে সর্বোচ্চ গ্রেড চেক করুন, তারপর নিচের গুলো চেক করুন।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p7-review-2',
    sectionId: 'p-unit7',
    order: 2,
    title: { en: 'Loop Review Sprint', bn: 'লুপ রিভিউ স্প্রিন্ট' },
    description: { en: 'Master review of for/while, break, continue.', bn: 'for/while, break, continue এর পরিপূর্ণ রিভিউ।' },
    difficulty: 'intermediate',
    xpReward: 130,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Loops Recap', bn: 'লুপের সারসংক্ষেপ' },
        body: { en: 'for = known iterations. while = condition-based. break = exit early. continue = skip current step.', bn: 'for = জানা ইটারেশন। while = শর্ত-ভিত্তিক অজানা ইটারেশন। break = loop থেকে আগে বের হয়ে যাওয়া। continue = বর্তমান ধাপ বাদ দিয়ে পরের ধাপে চলে যাওয়া। ' },
        code: {
          code: 'for i in range(5):\n    if i == 3:\n        break\n    print(i)  # 0 1 2',
          language: 'python',
          explanation: { en: 'break exits at i=3.', bn: 'i=3 হলে break বের করে দেয়।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p7-r2-e1',
        question: { en: 'What does "continue" keyword do?', bn: '"continue" কিওয়ার্ডটি কী কাজ করে ?' },
        options: ['Skips to next iteration', 'Exits the loop', 'Restarts the loop', 'Does nothing'],
        correctIndex: 0,
        explanation: { en: 'continue jumps to the next loop iteration.', bn: 'continue পরবর্তী লুপ ইটারেশনে চলে যায়। ' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p7-r2-e2',
        question: { en: 'What is the final value of sum?', bn: 'sum এর চূড়ান্ত মান কত হবে?' },
        code: 'sum = 0\nfor i in range(1, 5):\n    sum += i\nprint(sum)',
        options: ['10', '4', '15'],
        correctIndex: 0,
        explanation: { en: '1+2+3+4 = 10.', bn: '১+২+৩+৪ = ১০।' },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p7-r2-e3',
        question: { en: 'Exit loop when x is found:', bn: 'x পাওয়া গেলে লুপ থেকে বের হোন:' },
        codeTemplate: 'for item in bag:\n    if item == x:\n        ___',
        blanks: ['break'],
        explanation: { en: 'break exits the loop immediately.', bn: 'break তাৎক্ষণিকভাবে লুপ থেকে বের করে দেয়।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p7-r2-e4',
        question: { en: 'Fix the off-by-one error:', bn: 'off-by-one এরর ঠিক করুন:' },
        code: 'for i in range(1, 10):\n    print(i)',
        buggyLine: 1,
        explanation: { en: 'range(1, 10) gives 1-9, not 10. Use range(1, 11) to include 10.', bn: 'range(1, 10) ১-৯ দেয়, ১০ নয়। ১০ অন্তর্ভুক্ত করতে range(1, 11) ব্যবহার করুন।' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'p7-r2-e5',
        question: { en: 'Print only even numbers from 1 to 10:', bn: '১ থেকে ১০ পর্যন্ত শুধু জোড় সংখ্যা প্রিন্ট করুন:' },
        blocks: ['for i in range(1, 11):', '    if i % 2 != 0:', '        continue', '    print(i)'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Skip odd numbers with continue.', bn: 'continue দিয়ে বিজোড় সংখ্যা বাদ দিন।' },
        xpReward: 35
      }
    ]
  },
  {
    id: 'p7-exam',
    sectionId: 'p-unit7',
    order: 3,
    isProject: true,
    title: { en: 'Unit Exam: Deep Recall', bn: 'ইউনিট পরীক্ষা: ডিপ রিকল' },
    description: { en: 'Full test of logic, loops, and boolean operators.', bn: 'লজিক, লুপ এবং বুলিয়ান অপারেটরের সম্পূর্ণ পরীক্ষা।' },
    difficulty: 'intermediate',
    xpReward: 300,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Master Test', bn: 'মাস্টার টেস্ট' },
        body: { en: 'This exam combines all logic, loops, and boolean concepts.', bn: 'এই পরীক্ষায় সব লজিক, লুপ এবং বুলিয়ান কনসেপ্ট একসাথে করা হয়েছে। ' }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'p7-exam-e1',
        question: { en: 'What is the output?', bn: 'আউটপুট কী?' },
        code: 'for i in range(3):\n    for j in range(2):\n        print(i, j)',
        options: ['0 0\n0 1\n1 0\n1 1\n2 0\n2 1', '0\n1\n2', '0 0\n1 1\n2 2'],
        correctIndex: 0,
        explanation: { en: 'Nested loops: outer i goes 0-2, inner j goes 0-1 for each i.', bn: 'নেস্টেড লুপ: বাইরের i loop এর জন্য 0-2, আবার ভেতরের j প্রতিটি i এর জন্য 0-1। ' },
        xpReward: 40
      },
      {
        type: 'mcq',
        id: 'p7-exam-e2',
        question: { en: 'What keyword skips to next loop iteration?', bn: 'কোন কিওয়ার্ড বর্তমান ইটারেশনের বাকি অংশ স্কিপ করে পরবর্তী লুপ ইটারেশনে যায়?' },
        options: ['continue', 'break', 'pass', 'skip'],
        correctIndex: 0,
        explanation: { en: 'continue skips the rest of the current iteration.', bn: 'continue বর্তমান ইটারেশনের বাকি অংশ বাদ দিয়ে পরবর্তী লুপ ইটারেশনে যায়। ' },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p7-exam-e3',
        question: { en: 'Complete the combined condition:', bn: 'শর্তটি সম্পূর্ণ করুন:' },
        codeTemplate: 'if score >= 60 ___ attempts <= 3:\n    print("Passed!")',
        blanks: ['and'],
        explanation: { en: 'Both must be True: good score AND within attempts.', bn: 'উভয়ই True হতে হবে: ভালো স্কোর এবং নির্দিষ্ট প্রচেষ্টার মধ্যে।' },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'p7-exam-e4',
        question: { en: 'Find the scope bug:', bn: 'স্কোপ বাগ খুঁজুন:' },
        code: 'for i in range(3):\n    result = i * 2\nprint(result)',
        buggyLine: 3,
        explanation: { en: 'Actually this works in Python (loop variable stays in scope), but result would be 4 (last i=2).', bn: 'এটি পাইথনে সঠিকভাবে কাজ করে (লুপ ভেরিয়েবল এর স্কোপে থাকে), কিন্তু result হবে 4 (শেষ i=2)।' },
        xpReward: 35
      },
      {
        type: 'code_arrange',
        id: 'p7-exam-e5',
        question: { en: 'Arrange: count multiples of 3 up to 20:', bn: 'সাজিয়ে লিখুন : ২০ পর্যন্ত ৩ এর গুণিতক বের করার জন্য কোডটি:' },
        blocks: ['count = 0', 'for n in range(1, 21):', '    if n % 3 == 0:', '        count += 1', 'print(count)'],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: { en: 'Count numbers divisible by 3 from 1-20.', bn: '১-২০ এর মধ্যে ৩ দিয়ে বিভাজ্য সংখ্যা বের করুন।' },
        xpReward: 50
      }
    ]
  }
];
