import type { Lesson } from '../../schema';

// Unit 6: Loop-de-Loop — lessonIds: ['p6-for', 'p6-while', 'p6-exam']
export const unit6Lessons: Lesson[] = [
  {
    id: 'p6-for',
    sectionId: 'p-unit6',
    order: 1,
    title: { en: 'The For Loop Machine with Nini', bn: 'নিনির সাথে For লুপ মেশিন' },
    description: {
      en: 'Learn how for loops and range() repeat actions effortlessly with Nini.',
      bn: 'নিনির সাথে for লুপ এবং range() দিয়ে যেকোনো কাজ নিমেষেই বারবার করা শেখো।'
    },
    difficulty: 'intermediate',
    xpReward: 160,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'The Power of Automation: For Loops', bn: 'স্বয়ংক্রিয় কাজের ক্ষমতা: For লুপ' },
        body: {
          en: 'Nini says: "Why repeat yourself 100 times by hand? A for loop tells Python: \'Take this list or range of numbers and do the work for each item automatically!\'"',
          bn: 'নিনি বলছে: "একই কাজ কেন ১০০ বার হাতে লিখবে? for লুপ পাইথনকে বলে: \'এই সংখ্যার তালিকা নাও আর প্রতিটির জন্য স্বয়ংক্রিয়ভাবে কাজ করো!\'"'
        },
        code: {
          code: 'for ball in range(1, 7):\n    print(f"বল নম্বর {ball} করা হলো")',
          language: 'python',
          explanation: {
            en: 'Simulates bowling 6 balls in a cricket over (1 through 6)!',
            bn: 'ক্রিকেটের এক ওভারে ১ থেকে ৬ পর্যন্ত প্রতিটি বল করার হিসাব প্রিন্ট করে!'
          }
        }
      },
      {
        heading: { en: 'Understanding range(start, stop, step)', bn: 'range(start, stop, step) এর নিয়ম' },
        body: {
          en: 'Nini\'s Tip: Remember that range(start, stop) STOPS right before the stop number!\n• range(5) &rarr; 0, 1, 2, 3, 4 (5 numbers, starting at 0)\n• range(1, 6) &rarr; 1, 2, 3, 4, 5\n• range(0, 10, 2) &rarr; 0, 2, 4, 6, 8 (steps by 2!)',
          bn: 'নিনির টিপস: সবসময় মনে রাখবে, range(start, stop) কিন্তু stop সংখ্যার ঠিক আগের ঘরে থেমে যায়!\n• range(5) &rarr; 0, 1, 2, 3, 4 (০ থেকে শুরু করে মোট ৫টি সংখ্যা)\n• range(1, 6) &rarr; 1, 2, 3, 4, 5 (৬ এর আগে ৫-এ থামে)\n• range(0, 10, 2) &rarr; 0, 2, 4, 6, 8 (২ ধাপ পরপর লাফ দেয়!)'
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p6-for-e1',
        question: {
          en: 'How many times will a loop with range(5) run?',
          bn: 'range(5) দিয়ে চালানো একটি for লুপ মোট কতবার চলবে?'
        },
        options: ['৫ বার (0 থেকে 4)', '৪ বার (1 থেকে 4)', '৬ বার (0 থেকে 5)', 'অসীম বার'],
        correctIndex: 0,
        explanation: {
          en: 'range(5) yields 0, 1, 2, 3, 4 — exactly 5 iterations starting at index 0!',
          bn: 'নিনির টিপস: range(5) এর সংখ্যাগুলো হলো ০, ১, ২, ৩, ৪—অর্থাৎ ঠিক ৫ বার লুপটি ঘুরবে!'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p6-for-e2',
        question: {
          en: 'What is the final sum printed after this loop finishes?',
          bn: 'নিচের লুপটি শেষ হওয়ার পর মোট যোগফল কত প্রিন্ট হবে?'
        },
        code: 'total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)',
        options: ['10', '15', '4', '6'],
        correctIndex: 0,
        explanation: {
          en: 'range(1, 5) gives numbers 1, 2, 3, 4. Their sum is 1 + 2 + 3 + 4 = 10!',
          bn: 'নিনি বলছে: সাবাশ! range(1, 5) মানে ১, ২, ৩, ৪। এদের যোগফল ১ + ২ + ৩ + ৪ = ১০!'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p6-for-e3',
        question: {
          en: 'Complete the loop to print each item in the fruits list:',
          bn: 'fruits লিস্টের প্রতিটি ফলের নাম প্রিন্ট করতে লুপের কি-ওয়ার্ডটি লেখো:'
        },
        codeTemplate: 'fruits = ["আম", "কাঁঠাল", "লিচু"]\n___ f in fruits:\n    print(f)',
        blanks: ['for'],
        explanation: {
          en: 'The "for" keyword iterates over every element in any iterable sequence.',
          bn: 'নিনি বলছে: একদম ঠিক! লিস্টের প্রতিটি আইটেমে এক এক করে যেতে for লুপ ব্যবহার করা হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p6-for-e4',
        question: {
          en: 'What are the exact numbers printed by this loop?',
          bn: 'এই লুপটি চালালে কোন সংখ্যাগুলো প্রিন্ট হবে?'
        },
        code: 'for n in range(2, 9, 2):\n    print(n, end=", ")',
        options: ['2, 4, 6, 8', '2, 3, 4, 5, 6, 7, 8', '2, 4, 6, 8, 10', '0, 2, 4, 6, 8'],
        correctIndex: 0,
        explanation: {
          en: 'Starts at 2, increases by step 2, and stops before 9: gives 2, 4, 6, 8.',
          bn: 'নিনির টিপস: ২ থেকে শুরু, প্রতি ধাপে ২ যোগ এবং ৯ এর আগে থামা: ২, ৪, ৬, ৮।'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p6-for-e5',
        question: {
          en: 'Find the syntax bug in this for loop header:',
          bn: 'এই for লুপের প্রথম লাইনে কোন সিনট্যাক্স চিহ্নটি বাদ পড়েছে?'
        },
        code: 'for i in range(3)\n    print("সাবাশ!")',
        buggyLine: 1,
        explanation: {
          en: 'Line 1 is missing the mandatory colon (:) at the end: "for i in range(3):".',
          bn: 'নিনির টিপস: ১ নম্বর লাইনের শেষে কোলন (:) দিতে হবে: for i in range(3):।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p6-for-e6',
        question: {
          en: 'What will this string loop print?',
          bn: 'স্ট্রিং এর ওপর এই লুপটি চালালে আউটপুট কী হবে?'
        },
        code: 'word = "নিনি"\nfor char in word:\n    print(char)',
        options: ['ন\nি\nন\nি', 'নিনি', 'word', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'Looping over a string processes each character one by one on new lines!',
          bn: 'নিনির টিপস: স্ট্রিং এর ওপর for লুপ চালালে প্রতিটি বর্ণ বা চিহ্ন আলাদা আলাদা লাইনে প্রিন্ট হয়।'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p6-for-e7',
        question: {
          en: 'Count down from 5 to 1 using a step of -1 in range(5, 0, ___):',
          bn: '৫ থেকে ১ পর্যন্ত পেছনের দিকে গুনতে range(5, 0, ___) এর ফাঁকা জায়গায় কত স্টেপ বসাবে?'
        },
        codeTemplate: 'for n in range(5, 0, ___):\n    print(n)',
        blanks: ['-1'],
        explanation: {
          en: 'A step of -1 counts downwards from start to stop + 1.',
          bn: 'নিনি বলছে: দারুণ! পেছনের দিকে এক এক করে গুনতে নেগেটিভ স্টেপ -১ দিতে হয়।'
        },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p6-for-e8',
        question: {
          en: 'Arrange the code to print the 5 times multiplication table (5 x 1 to 5 x 3):',
          bn: '৫ এর নামতার প্রথম ৩টি লাইন তৈরির কোড সাজাও (৫ × ১ থেকে ৫ × ৩):'
        },
        blocks: [
          'for i in range(1, 4):',
          '    ans = 5 * i',
          '    print(f"5 x {i} = {ans}")'
        ],
        correctOrder: [0, 1, 2],
        explanation: {
          en: 'Loop from 1 to 3, calculate 5 * i, and print the formatted equation.',
          bn: 'নিনির টিপস: ১ থেকে ৩ পর্যন্ত লুপ চালাও, গুণফল হিসাব করো এবং নামতা আকারে প্রিন্ট করো।'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p6-for-e9',
        question: {
          en: 'What does range(1, 1) produce?',
          bn: 'range(1, 1) লুপে দিলে কী ঘটবে?'
        },
        options: [
          'লুপটি একবারও চলবে না (খালি রেঞ্জ)',
          'লুপটি ১ বার চলবে',
          'লুপটি অসীম বার চলবে',
          'SyntaxError হবে'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Because start equals stop, the range is empty. The loop runs 0 times without error!',
          bn: 'নিনি বলছে: মনে রাখবে, শুরু এবং শেষ একই সংখ্যা হলে রেঞ্জ খালি থাকে, তাই লুপ একবারও ঘুরবে না।'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p6-for-e10',
        question: {
          en: 'Find the indentation bug inside this loop:',
          bn: 'এই লুপের ভেতরে কোন লাইনে ইন্ডেন্টেশনের ভুল রয়েছে?'
        },
        code: 'total = 0\nfor x in [10, 20, 30]:\ntotal += x\nprint(total)',
        buggyLine: 3,
        explanation: {
          en: 'Line 3 must be indented to be inside the for loop body: "    total += x".',
          bn: 'নিনির টিপস: ৩ নম্বর লাইনটি লুপের ভেতরে কাজ করার জন্য অবশ্যই ইন্ডেন্টেড হতে হবে!'
        },
        xpReward: 25
      }
    ]
  },
  {
    id: 'p6-while',
    sectionId: 'p-unit6',
    order: 2,
    title: { en: 'The While Loop Guardian', bn: 'নিনির সাথে While লুপ প্রহরী' },
    description: {
      en: 'Run code as long as a condition holds true, and learn how to avoid infinite loops.',
      bn: 'যতক্ষণ শর্ত সত্য থাকে ততক্ষণ কাজ করতে while লুপের জাদুকরী কৌশল শেখো।'
    },
    difficulty: 'intermediate',
    xpReward: 160,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Condition-Driven: while', bn: 'শর্তভিত্তিক পুনরাবৃত্তি: while' },
        body: {
          en: 'Nini says: "A while loop asks before every turn: \'Is this condition STILL True?\' If yes, it runs again. But BEWARE! You must update the counter inside, or it will loop forever and freeze your browser!"',
          bn: 'নিনি বলছে: "while লুপ প্রতিবার ঘোরার আগে জিজ্ঞেস করে: \'শর্তটি কি এখনও সত্য?\' সত্য হলে ও বারবার চলবে। কিন্তু সাবধান! লুপের ভেতর কাউন্টার পরিবর্তন না করলে এটি অনন্তকাল ঘুরে ব্রাউজার ফ্রিজ করে দেবে!"'
        },
        code: {
          code: 'countdown = 3\nwhile countdown > 0:\n    print(countdown)\n    countdown -= 1\nprint("রকেট উৎক্ষেপণ সফল!")',
          language: 'python',
          explanation: {
            en: 'Counts 3, 2, 1, then countdown becomes 0 and the loop terminates cleanly!',
            bn: '৩, ২, ১ প্রিন্ট করে শূন্যে পৌঁছালে লুপ শেষ হয়ে রকেট উৎক্ষেপণ বার্তা দেয়!'
          }
        }
      },
      {
        heading: { en: 'Escaping Loops: break', bn: 'লুপ থেকে পালানো: break' },
        body: {
          en: 'Nini\'s Tip: Need to escape an emergency situation immediately? The \'break\' keyword instantly slams the brakes and exits any loop!',
          bn: 'নিনির টিপস: কোনো জরুরি প্রয়োজনে লুপ থেকে সাথে সাথে বের হয়ে আসতে চাইলে \'break\' কি-ওয়ার্ড ব্যবহার করো!'
        }
      }
    ],
    exercises: [
      {
        type: 'fill_blank',
        id: 'p6-while-e1',
        question: {
          en: 'Write the keyword to repeat the block while energy is greater than 0:',
          bn: 'শক্তি (energy) শূন্যের বেশি থাকা পর্যন্ত কাজ চালিয়ে যেতে সঠিক কি-ওয়ার্ডটি লেখো:'
        },
        codeTemplate: 'energy = 5\n___ energy > 0:\n    print("লড়াই করো!")\n    energy -= 1',
        blanks: ['while'],
        explanation: {
          en: 'The "while" statement repeatedly executes while the condition is True.',
          bn: 'নিনি বলছে: সাবাশ! শর্ত সত্য থাকা পর্যন্ত লুপ চালাতে while ব্যবহার করা হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p6-while-e2',
        question: {
          en: 'How many times will "নিনির চা" be printed?',
          bn: 'নিচের কোডটিতে "নিনির চা" মোট কতবার প্রিন্ট হবে?'
        },
        code: 'cups = 0\nwhile cups < 3:\n    print("নিনির চা")\n    cups += 1',
        options: ['৩ বার', '২ বার', '৪ বার', 'অসীম বার'],
        correctIndex: 0,
        explanation: {
          en: 'cups starts at 0, goes to 1, then 2 (3 times). When cups becomes 3, 3 < 3 is False and it stops!',
          bn: 'নিনির টিপস: cups এর মান ০, ১, ২ পর্যন্ত গিয়ে মোট ৩ বার প্রিন্ট হবে। ৩ হলে ৩ < ৩ মিথ্যা হয়ে লুপ থামবে।'
        },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p6-while-e3',
        question: {
          en: 'What causes a dreaded "infinite loop" in Python?',
          bn: 'পাইথনে বিপদজনক "ইনফিনিট লুপ" (অনন্ত লুপ) কেন তৈরি হয়?'
        },
        options: [
          'লুপের শর্তটি কখনো False হয় না',
          'কোডে কোলন (:) না দিলে',
          'ভেরিয়েবলের নাম ভুল লিখলে',
          'লুপের ভেতর print ব্যবহার করলে'
        ],
        correctIndex: 0,
        explanation: {
          en: 'If the loop condition is always True and never updated to False, the computer is trapped forever!',
          bn: 'নিনি বলছে: মনে রাখবে, লুপের ভেতরের শর্ত যদি কখনো মিথ্যা (False) না হয়, তবে কম্পিউটার অনন্তকাল ঘুরতে থাকে!'
        },
        xpReward: 15
      },
      {
        type: 'bug_hunt',
        id: 'p6-while-e4',
        question: {
          en: 'Fix the infinite loop by finding the line that increases fuel instead of decreasing it:',
          bn: 'এই কোডের কোন লাইনে ভুলের কারণে জ্বালানি কমার বদলে বেড়ে অনন্ত লুপ তৈরি হচ্ছে?'
        },
        code: 'fuel = 5\nwhile fuel > 0:\n    print("গাড়ি চলছে")\n    fuel += 1',
        buggyLine: 4,
        explanation: {
          en: 'Line 4 should be "fuel -= 1" so fuel eventually reaches 0 and ends the loop!',
          bn: 'নিনির টিপস: ৪ নম্বর লাইনে fuel += 1 দিলে জ্বালানি আজীবন বাড়তেই থাকবে! এখানে fuel -= 1 হতে হবে।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p6-while-e5',
        question: {
          en: 'What will be printed when the while condition is initially False?',
          bn: 'শুরুতেই শর্ত মিথ্যা হলে নিচের কোডটি কী প্রিন্ট করবে?'
        },
        code: 'count = 10\nwhile count < 5:\n    print("লুপ চলছে")\n    count += 1\nprint("বাইরে চলে এসেছি")',
        options: ['বাইরে চলে এসেছি', 'লুপ চলছে\nবাইরে চলে এসেছি', 'কিছুই না', 'Error'],
        correctIndex: 0,
        explanation: {
          en: '10 < 5 is False from the start! The loop body never runs even once.',
          bn: 'নিনির টিপস: শুরুতেই ১০ < ৫ মিথ্যা, তাই লুপের ভেতর একবারও না ঢুকে সরাসরি বাইরের মেসেজটি প্রিন্ট করবে।'
        },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p6-while-e6',
        question: {
          en: 'Arrange the countdown from 3 to 1 followed by "ব্লাস্ট অফ!":',
          bn: '৩ থেকে ১ পর্যন্ত গুনে "ব্লাস্ট অফ!" জানানোর কোডটি ক্রমানুসারে সাজাও:'
        },
        blocks: [
          'sec = 3',
          'while sec > 0:',
          '    print(sec)',
          '    sec -= 1',
          'print("ব্লাস্ট অফ!")'
        ],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: {
          en: 'Initialize counter, loop with print and decrement, then print final blast off message.',
          bn: 'নিনির টিপস: কাউন্টার ৩ দিয়ে শুরু করো, প্রিন্ট ও বিয়োগ করো, লুপ শেষ হলে ব্লাস্ট অফ প্রিন্ট করো।'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p6-while-e7',
        question: {
          en: 'Decrement the coins counter by 1 in each round (shorthand notation):',
          bn: 'প্রতি রাউন্ডে কয়েন সংখ্যা ১ কমাতে সংক্ষেপ রূপটি লেখো:'
        },
        codeTemplate: 'coins = 10\nwhile coins > 0:\n    coins ___ 1',
        blanks: ['-='],
        explanation: {
          en: '-= is the decrement assignment operator (coins -= 1 means coins = coins - 1).',
          bn: 'নিনি বলছে: সাবাশ! -= অপারেটর দিয়ে ১ করে মান কমানো হয়।'
        },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p6-while-e8',
        question: {
          en: 'What is the output of this loop with a break statement?',
          bn: 'break স্টেটমেন্ট থাকা এই লুপটির আউটপুট কী হবে?'
        },
        code: 'n = 1\nwhile n <= 5:\n    if n == 3:\n        break\n    print(n)\n    n += 1',
        options: ['1\n2', '1\n2\n3', '3', '1\n2\n3\n4\n5'],
        correctIndex: 0,
        explanation: {
          en: 'When n reaches 3, break triggers before printing 3, instantly ending the loop!',
          bn: 'নিনির টিপস: যখন n এর মান ৩ হয়, print হওয়ার আগেই break লেগে যায়, তাই কেবল ১ এবং ২ প্রিন্ট হবে!'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p6-while-e9',
        question: {
          en: 'When should you prefer a while loop over a for loop?',
          bn: 'কখন for লুপের চেয়ে while লুপ ব্যবহার করা বেশি সুবিধাজনক?'
        },
        options: [
          'যখন আগে থেকে জানা নেই কাজটি ঠিক কতবার করতে হবে (শর্তের ওপর নির্ভরশীল)',
          'যখন নির্দিষ্ট ১০ বার লুপ চালাতে হবে',
          'যখন কোনো লিস্টের সব আইটেম প্রিন্ট করতে হবে',
          'while লুপ কখনো ব্যবহার করা উচিত নয়'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Use while loops when termination depends on an unknown condition (like user guessing a secret number)!',
          bn: 'নিনি বলছে: চমৎকার! যখন জানা থাকে না ইউজার কয় বারে সঠিক পাসওয়ার্ড দেবে বা খেলা কখন শেষ হবে, তখন while লুপ সেরা।'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p6-while-e10',
        question: {
          en: 'Find the missing update line causing the loop to never end:',
          bn: 'এই কোডের কোন লাইনের পর কাউন্টার পরিবর্তনের লাইনটি মিসিং রয়েছে?'
        },
        code: 'attempt = 1\nwhile attempt <= 3:\n    print("চেষ্টা নম্বর:", attempt)\nprint("শেষ")',
        buggyLine: 3,
        explanation: {
          en: 'Inside the while loop after line 3, you must increment attempt: "attempt += 1".',
          bn: 'নিনির টিপস: ৩ নম্বর লাইনের পর attempt += 1 না দিলে attempt এর মান আজীবন ১ থাকবে এবং লুপ থামবে না!'
        },
        xpReward: 25
      }
    ]
  },
  {
    id: 'p6-exam',
    sectionId: 'p-unit6',
    order: 3,
    isProject: true,
    title: { en: 'Unit 6 Checkpoint: Loop Master Exam', bn: 'ইউনিট ৬ চেকপয়েন্ট: লুপ মাস্টার পরীক্ষা' },
    description: {
      en: 'Synthesize for, while, range, break, and continue in practical challenges!',
      bn: 'for, while, range, break ও continue এর সমন্বয়ে বাস্তব কোডিং চ্যালেঞ্জ সমাধান করো!'
    },
    difficulty: 'intermediate',
    xpReward: 300,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Loop Master Mastery', bn: 'লুপ মাস্টারের কৌশল' },
        body: {
          en: 'Nini says: "You\'ve reached the Loop Arena! Remember: \'break\' exits completely, while \'continue\' skips ONLY the current turn and jumps directly to the next!"',
          bn: 'নিনি বলছে: "তুমি লুপ এরেনায় পৌঁছে গেছো! মনে রেখো: \'break\' লুপকে পুরোপুরি থামিয়ে দেয়, আর \'continue\' কেবল চলতি রাউন্ডটি স্কিপ করে পরের রাউন্ডে চলে যায়!"'
        }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'p6-exam-e1',
        question: {
          en: 'What does this continue statement print?',
          bn: 'continue স্টেটমেন্ট থাকা এই লুপটি কী প্রিন্ট করবে?'
        },
        code: 'for i in range(1, 5):\n    if i == 3:\n        continue\n    print(i)',
        options: ['1\n2\n4', '1\n2\n3\n4', '1\n2', '3'],
        correctIndex: 0,
        explanation: {
          en: 'When i == 3, continue skips the print, then the loop resumes for i = 4! Outputs 1, 2, 4.',
          bn: 'নিনির টিপস: i == 3 হলে continue এর কারণে প্রিন্ট বাদ পড়ে পরের ধাপে চলে যায়। তাই ১, ২, ৪ প্রিন্ট হবে।'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p6-exam-e2',
        question: {
          en: 'What is the crucial difference between "break" and "continue"?',
          bn: '"break" এবং "continue" এর মধ্যকার মূল পার্থক্য কী?'
        },
        options: [
          'break পুরো লুপ থামিয়ে দেয়, আর continue শুধু বর্তমান ধাপটি স্কিপ করে পরের ধাপে যায়',
          'continue পুরো লুপ থামিয়ে দেয়, break স্কিপ করে',
          'উভয়ই লুপ পুরোপুরি বন্ধ করে দেয়',
          'উভয়ই লুপের গতি দ্বিগুণ করে দেয়'
        ],
        correctIndex: 0,
        explanation: {
          en: 'break stops the entire loop cold. continue merely skips to the next iteration.',
          bn: 'নিনি বলছে: সাবাশ! break লুপ ভেঙে ফেলে, আর continue চলতি ধাপ এড়িয়ে পরের ধাপে এগিয়ে যায়।'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p6-exam-e3',
        question: {
          en: 'Skip even numbers using continue by checking modulo remainder:',
          bn: 'ভাগশেষ ২ দিয়ে ভাগ করে ০ হলে continue দিয়ে জোড় সংখ্যা স্কিপ করো:'
        },
        codeTemplate: 'for n in range(1, 6):\n    if n % 2 == 0:\n        ___\n    print(n)',
        blanks: ['continue'],
        explanation: {
          en: 'continue skips the rest of the loop block for even numbers, printing only odds (1, 3, 5).',
          bn: 'নিনি বলছে: চমৎকার! জোড় সংখ্যা এলে continue দিয়ে এড়িয়ে কেবল বিজোড় সংখ্যাগুলো প্রিন্ট করা হচ্ছে।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p6-exam-e4',
        question: {
          en: 'What is the value of count after the loop finishes?',
          bn: 'লুপটি শেষ হওয়ার পর count ভেরিয়েবলের মান কত হবে?'
        },
        code: 'count = 0\nfor x in [5, 12, 18, 3, 25]:\n    if x > 10:\n        count += 1\nprint(count)',
        options: ['3', '5', '2', '0'],
        correctIndex: 0,
        explanation: {
          en: 'The numbers greater than 10 are 12, 18, and 25 (exactly 3 numbers)!',
          bn: 'নিনির টিপস: ১০ এর চেয়ে বড় সংখ্যা হলো ১২, ১৮ এবং ২৫—মোট ৩টি! তাই count = 3।'
        },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'p6-exam-e5',
        question: {
          en: 'Arrange the code to sum numbers 1 through 10 using an accumulator pattern:',
          bn: '১ থেকে ১০ পর্যন্ত সংখ্যাগুলোর যোগফল বের করার কোড সাজাও:'
        },
        blocks: [
          'total = 0',
          'for num in range(1, 11):',
          '    total += num',
          'print(f"১ থেকে ১০ এর যোগফল: {total}")'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Initialize total = 0, loop 1 to 10 with range(1, 11), accumulate, and display result (55).',
          bn: 'নিনির টিপস: প্রথমে total = 0, তারপর range(1, 11) দিয়ে ১ থেকে ১০ পর্যন্ত লুপ চালিয়ে যোগ করো।'
        },
        xpReward: 35
      },
      {
        type: 'bug_hunt',
        id: 'p6-exam-e6',
        question: {
          en: 'Find the bug causing 0 runs in this countdown while loop:',
          bn: 'কাউন্টডাউন লুপটিতে কোন লাইনে ভুল শর্ত দেওয়ায় লুপটি একবারও চলছে না?'
        },
        code: 'time_left = 5\nwhile time_left < 0:\n    print(time_left)\n    time_left -= 1',
        buggyLine: 2,
        explanation: {
          en: 'Line 2 says "while time_left < 0", but time_left starts at 5! It should be "time_left > 0".',
          bn: 'নিনির টিপস: ২ নম্বর লাইনে time_left < 0 লেখা হয়েছে! ৫ সংখ্যাটি তো ০ এর চেয়ে ছোট নয়, তাই এখানে time_left > 0 হতে হবে।'
        },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'p6-exam-e7',
        question: {
          en: 'What is printed by this early exit search loop?',
          bn: 'এই সার্চ লুপটির আউটপুট কী হবে?'
        },
        code: 'names = ["রহিম", "করিম", "নিনি", "সাকিব"]\nfor name in names:\n    if name == "নিনি":\n        print("নিনিকে পাওয়া গেছে!")\n        break',
        options: ['নিনিকে পাওয়া গেছে!', 'রহিম\nকরিম\nনিনিকে পাওয়া গেছে!', 'কিছুই না', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'The loop checks each name quietly until it finds "নিনি", prints the message, and breaks immediately!',
          bn: 'নিনির টিপস: লুপটি চলতে চলতে নিনিকে পাওয়া মাত্রই মেসেজ প্রিন্ট করে break দিয়ে সাথে সাথে বন্ধ হয়ে যায়।'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p6-exam-e8',
        question: {
          en: 'How many asterisks (*) will be printed in total by this nested loop?',
          bn: 'নিচের নেস্টেড লুপটিতে মোট কতটি তারকা (*) প্রিন্ট হবে?'
        },
        code: 'for row in range(3):\n    for col in range(2):\n        print("*")',
        options: ['6', '5', '3', '2'],
        correctIndex: 0,
        explanation: {
          en: 'The outer loop runs 3 times, and for each time, the inner loop runs 2 times: 3 * 2 = 6 total!',
          bn: 'নিনি বলছে: সাবাশ! বাইরের লুপ ৩ বার এবং প্রতিবারে ভেতরের লুপ ২ বার ঘোরে: ৩ × ২ = মোট ৬ বার!'
        },
        xpReward: 30
      }
    ]
  }
];

