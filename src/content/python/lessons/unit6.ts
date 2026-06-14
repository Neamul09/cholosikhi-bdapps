import type { Lesson } from '../../schema';

// Unit 6: Loop-de-Loop — lessonIds: ['p6-for', 'p6-while', 'p6-exam']
export const unit6Lessons: Lesson[] = [
  {
    id: 'p6-for',
    sectionId: 'p-unit6',
    order: 1,
    title: { en: 'Infinite Candy Machine', bn: 'অফুরন্ত ক্যান্ডি মেশিন' },
    description: { en: 'Repeat tasks with for loops.', bn: 'for লুপ দিয়ে কাজ পুনরাবৃত্তি করুন।' },
    difficulty: 'intermediate',
    xpReward: 130,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'For Loops', bn: 'For লুপ' },
        body: { en: 'Use for to repeat code a specific number of times, or loop over a list of items.', bn: 'নির্দিষ্ট সংখ্যক বার বা আইটেমের তালিকায় পুনরাবৃত্তি করার জন্য for loop ব্যবহার করুন।' },
        code: {
          code: 'for i in range(5):\n    print("Candy", i)',
          language: 'python',
          explanation: { en: 'range(5) gives 0,1,2,3,4. Prints 5 candies.', bn: 'range(5) দেয় 0,1,2,3,4। ৫টি ক্যান্ডি প্রিন্ট হবে।' }
        }
      },
      {
        heading: { en: 'Looping over a list', bn: 'তালিকায় লুপ করা' },
        body: { en: 'You can loop directly over a list to process each element.', bn: 'প্রতিটি উপাদান প্রসেস করতে সরাসরি তালিকায় লুপ করা যায়।' },
        code: {
          code: 'fruits = ["apple", "banana", "mango"]\nfor fruit in fruits:\n    print(fruit)',
          language: 'python',
          explanation: { en: 'Each fruit is printed one by one.', bn: 'প্রতিটি ফল একে একে প্রিন্ট হয়।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p6-for-e1',
        question: { en: 'How many times does range(4) iterate?', bn: 'range(4) কতবার ইটারেট হবে?' },
        options: ['4', '5', '3', '0'],
        correctIndex: 0,
        explanation: { en: 'range(4) gives 0, 1, 2, 3 — exactly 4 times.', bn: 'range(4) দেয় 0, 1, 2, 3 — ঠিক ৪ বার লুপ চলবে। ' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p6-for-e2',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'total = 0\nfor n in range(1, 4):\n    total += n\nprint(total)',
        options: ['6', '3', '10'],
        correctIndex: 0,
        explanation: { en: '1 + 2 + 3 = 6. range(1,4) gives 1, 2, 3. from 1 to 4-1=3. So loop will run 3 times.', bn: '১ + ২ + ৩ = ৬। range(1,4) দেয় 1, 2, 3। 1 থেকে 4-1 অর্থাৎ 3 পর্যন্ত লুপ চলবে। সুতরাং লুপটি ৩ বার চলবে। ' },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p6-for-e3',
        question: { en: 'Loop 10 times:', bn: '১০ বার লুপ করুন:' },
        codeTemplate: 'for i in range(___):\n    print("Go!")',
        blanks: ['10'],
        explanation: { en: 'range(10) gives 10 iterations.', bn: 'range(10) ১০ বার লুপ চালায়। ' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p6-for-e4',
        question: { en: 'What does range(2, 7, 2) produce?', bn: 'range(2, 7, 2) কী তৈরি করে?' },
        options: ['2, 4, 6', '2, 3, 4, 5, 6', '2, 7', '0, 2, 4'],
        correctIndex: 0,
        explanation: { en: 'Start 2, end before 7, step 2: gives 2, 4, 6. range(a,b,c) means start from a, end before b, step c.', bn: 'শুরু 2, শেষ 7 এর আগে, ধাপ 2: প্রদান করে 2, 4, 6। range(a,b,c) মানে a থেকে b এর আগে পর্যন্ত c step পরপর যাবে।' },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'p6-for-e5',
        question: { en: 'Fix the loop:', bn: 'লুপটি ঠিক করুন:' },
        code: 'for i in range(3)\n    print(i)',
        buggyLine: 1,
        explanation: { en: 'Missing colon at the end of the for line.', bn: 'for loop এর পরে লাইনের শেষে কোলন নেই।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p6-while',
    sectionId: 'p-unit6',
    order: 2,
    title: { en: 'As Long As', bn: 'যতক্ষণ পর্যন্ত' },
    description: { en: 'Use while loops for condition-based repetition.', bn: 'শর্ত-ভিত্তিক পুনরাবৃত্তির জন্য while লুপ ব্যবহার করুন।' },
    difficulty: 'intermediate',
    xpReward: 130,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'While Loops', bn: 'While লুপ' },
        body: { en: 'while repeats as long as its condition is True. Always make sure the condition can become False — or you get an infinite loop! Which can crash your program.', bn: 'while এ দেওয়া শর্তটি True থাকা পর্যন্ত loop টি পুনরাবৃত্তি করতে থাকে। সবসময় নিশ্চিত করুন শর্তটি যাতে একসময় যেয়ে False হয় — নাহলে অসীম লুপ তৈরি হবে! যা প্রোগ্রামকে ক্র্যাশ করে দিতে পারে। ' },
        code: {
          code: 'lives = 3\nwhile lives > 0:\n    print("Still in game!")\n    lives -= 1',
          language: 'python',
          explanation: { en: 'Loops 3 times (3,2,1) until lives reaches 0.', bn: 'lives শূন্যে পৌঁছানো পর্যন্ত ৩ বার লুপ চলে। ' }
        }
      }
    ],
    exercises: [
      {
        type: 'fill_blank',
        id: 'p6-while-e1',
        question: { en: 'Complete the while condition:', bn: 'while শর্তটি সম্পূর্ণ করুন:' },
        codeTemplate: '___ energy > 0:\n    run()\n    energy -= 10',
        blanks: ['while'],
        explanation: { en: 'while keyword is always followed by the condition.', bn: 'while কিওয়ার্ডের পরে শর্ত বসে। ' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p6-while-e2',
        question: { en: 'How many times will it print?', bn: 'এটি কতবার প্রিন্ট হবে?' },
        code: 'count = 0\nwhile count < 3:\n    print("Hi")\n    count += 1',
        options: ['3', '2', '4', 'Infinite'],
        correctIndex: 0,
        explanation: { en: 'count goes 0, 1, 2 — printing 3 times.', bn: 'এটি 0, 1, 2 কাউন্ট করবে, তাই ৩ বার প্রিন্ট হবে।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p6-while-e3',
        question: { en: 'What causes an infinite loop?', bn: 'অসীম লুপ কী কারণে হয়?' },
        options: ['Condition never becomes False', 'Missing colon', 'Wrong variable name', 'Using range()'],
        correctIndex: 0,
        explanation: { en: 'If the condition never becomes False, the loop never stops.', bn: 'শর্ত কখনো False না হলে, লুপ থামবে না।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p6-while-e4',
        question: { en: 'Fix the infinite loop:', bn: 'অসীম লুপটি ঠিক করুন:' },
        code: 'fuel = 10\nwhile fuel > 0:\n    print("Driving")\n    fuel += 1',
        buggyLine: 4,
        explanation: { en: 'The condition "fuel += 1" increases forever. To fix the infinite loop, it should be fuel -= 1.', bn: '"fuel += 1" সবসময় বাড়তে থাকে। কিন্তু অসীম লুপটি ঠিক করার জন্য fuel -= 1 হতে হবে।' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'p6-while-e5',
        question: { en: 'Build a countdown from 5 to 1:', bn: '৫ থেকে ১ পর্যন্ত কাউন্টডাউন তৈরি করুন:' },
        blocks: ['n = 5', 'while n > 0:', '    print(n)', '    n -= 1'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Start at 5, print, decrease, stop when 0.', bn: '৫ থেকে শুরু করুন, প্রিন্ট করুন, কমাতে থাকুন, 0 হলে থামুন।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p6-exam',
    sectionId: 'p-unit6',
    order: 3,
    isProject: true,
    title: { en: 'Unit Exam: Loop Master', bn: 'ইউনিট পরীক্ষা: লুপ মাস্টার' },
    description: { en: 'Prove mastery of for and while loops.', bn: 'for এবং while লুপের দক্ষতা প্রমাণ করুন।' },
    difficulty: 'intermediate',
    xpReward: 300,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Loop Strategy', bn: 'লুপ কৌশল' },
        body: { en: 'Use for when you know the count. Use while when you have a condition. Both support break to exit early.', bn: 'লুপটি কতবার চলবে তা জানা থাকলে for ব্যবহার করুন। শুধু শর্ত জানা থাকলে while ব্যবহার করুন। উভয় loop থেকে আগে বের হতে break ব্যবহার করুন। ' }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p6-exam-e1',
        question: { en: 'Which loop is best when count is unknown?', bn: 'লুপটি কতবার চলবে তা অজানা থাকলে কোন লুপ সবচেয়ে ভালো?' },
        options: ['while', 'for', 'Both', 'Neither'],
        correctIndex: 0,
        explanation: { en: 'while is condition-based — perfect for unknown counts.', bn: 'while শর্ত-ভিত্তিক loop — লুপটি কতবার চলবে তা অজানা থাকলে while ব্যবহার করা হয়।' },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p6-exam-e2',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'for i in range(1, 6):\n    if i == 3:\n        break\n    print(i)',
        options: ['1\n2', '1\n2\n3', '1\n2\n3\n4\n5'],
        correctIndex: 0,
        explanation: { en: 'break exits the loop when i becomes 3.', bn: 'i এর মান 3 হলে break কিওয়ার্ডের কারণে লুপটি থেকে বের হয়ে যাবে।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'p6-exam-e3',
        question: { en: 'Skip number 2 using continue:', bn: 'continue ব্যবহার করে 2 সংখ্যাটিকে লুপ থেকে বাদ দিন:' },
        codeTemplate: 'for i in range(4):\n    if i == 2:\n        ___\n    print(i)',
        blanks: ['continue'],
        explanation: { en: '"continue" keyword breaks the current iteration.', bn: 'continue কিওয়ার্ডটি একটি ইটারেশনের বাকি অংশ বাদ দিয়ে দেয়।' },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'p6-exam-e4',
        question: { en: 'Fix the countdown bug:', bn: 'কাউন্টডাউন বাগটি ঠিক করুন:' },
        code: 'n = 5\nwhile n > 0:\n    print(n)',
        buggyLine: 3,
        explanation: { en: 'Missing n -= 1 inside the loop — causes infinite loop.', bn: 'লুপের ভেতরে n -= 1 নেই — এটি একটি অসীম লুপ তৈরি করে। ' },
        xpReward: 40
      },
      {
        type: 'code_arrange',
        id: 'p6-exam-e5',
        question: { en: 'Calculate sum of 1 to 10:', bn: '১ থেকে ১০ পর্যন্ত যোগফল হিসাব করুন:' },
        blocks: ['total = 0', 'for n in range(1, 11):', '    total += n', 'print("Sum:", total)'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Accumulate sum then print.', bn: 'যোগফল জমা করে প্রিন্ট করুন।' },
        xpReward: 50
      }
    ]
  }
];
