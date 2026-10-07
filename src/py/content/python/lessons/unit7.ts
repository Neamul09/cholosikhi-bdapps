import type { Lesson } from '../../schema';

// Unit 7: Deep Recall — lessonIds: ['p7-review-1', 'p7-review-2', 'p7-exam']
export const unit7Lessons: Lesson[] = [
  {
    id: 'p7-review-1',
    sectionId: 'p-unit7',
    order: 1,
    title: { en: 'Logic Review Sprint with Nini', bn: 'নিনির সাথে লজিক রিভিউ স্প্রিন্ট' },
    description: {
      en: 'Fast-paced spaced repetition of if, elif, else, and, or, not with Nini.',
      bn: 'নিনির সাথে if, elif, else, and, or, not এর দ্রুত ও নিখুঁত রিভিশন স্প্রিন্ট।'
    },
    difficulty: 'intermediate',
    xpReward: 160,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Logic Sprint Checkpoint', bn: 'লজিক স্প্রিন্ট চেকপয়েন্ট' },
        body: {
          en: 'Nini says: "Welcome to Deep Recall, coding hero! In this sprint, we test your mastery over condition trees. Remember: == compares, != inverts equality, and and/or control flow!"',
          bn: 'নিনি বলছে: "ডিপ রিকলে স্বাগতম, কোডিং হিরো! এই স্প্রিন্টে তোমার ডিসিশন ট্রির দক্ষতা যাচাই করা হবে। মনে রেখো: == সমতা দেখে, != অসমান কিনা দেখে, আর and/or পথ নিয়ন্ত্রণ করে!"'
        },
        code: {
          code: 'battery = 85\nwifi = True\nif battery > 20 and wifi:\n    print("তুমি অনলাইন গেমিংয়ের জন্য প্রস্তুত!")',
          language: 'python',
          explanation: {
            en: 'Both conditions are met, granting access.',
            bn: 'ব্যাটারি ২০ এর বেশি এবং ওয়াইফাই অন থাকায় গেমিং মেসেজ প্রিন্ট হবে।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p7-r1-e1',
        question: {
          en: 'Which branch executes if all if and elif conditions evaluate to False?',
          bn: 'যদি সবকটি if এবং elif শর্ত মিথ্যা (False) হয়, তবে কোন ব্লকটি স্বয়ংক্রিয়ভাবে কাজ করে?'
        },
        options: ['else', 'elif', 'break', 'শুরুতে ফিরে যাবে'],
        correctIndex: 0,
        explanation: {
          en: 'else is the default catch-all fallback when all preceding conditions fail.',
          bn: 'নিনি বলছে: সাবাশ! পূর্বের সব শর্ত মিথ্যা হলে পাইথন সোজা else ব্লকে চলে যায়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p7-r1-e2',
        question: {
          en: 'What is printed by this condition?',
          bn: 'নিচের কোডটি চালালে কী প্রিন্ট হবে?'
        },
        code: 'a = 15\nb = 20\nif a > 10 and b < 25:\n    print("সীমার মধ্যে")',
        options: ['সীমার মধ্যে', 'কিছুই না', 'Error', 'False'],
        correctIndex: 0,
        explanation: {
          en: '15 > 10 is True, and 20 < 25 is True. True and True is True!',
          bn: 'নিনির টিপস: ১৫ > ১০ সত্য এবং ২০ < ২৫ ও সত্য। and এর দুই পাশই সত্য হওয়ায় মেসেজ প্রিন্ট হবে।'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p7-r1-e3',
        question: {
          en: 'Add the middle conditional branch keyword to check if balance is exactly 0:',
          bn: 'ব্যালেন্স ঠিক ০ কিনা যাচাই করতে মাঝের সঠিক শর্ত কি-ওয়ার্ডটি লেখো:'
        },
        codeTemplate: 'balance = 0\nif balance > 0:\n    print("পজিটিভ")\n___ balance == 0:\n    print("ব্যালেন্স শূন্য")\nelse:\n    print("নেগেটিভ")',
        blanks: ['elif'],
        explanation: {
          en: 'elif introduces an additional conditional check between if and else.',
          bn: 'নিনি বলছে: চমৎকার! মাঝের শর্ত চেক করার জন্য elif ব্যবহার করা হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p7-r1-e4',
        question: {
          en: 'What does this statement print?',
          bn: 'এই স্টেটমেন্টটি কী প্রিন্ট করবে?'
        },
        code: 'print(not (10 == 10))',
        options: ['False', 'True', '10', 'Error'],
        correctIndex: 0,
        explanation: {
          en: '10 == 10 is True. Applying not inverts it to False!',
          bn: 'নিনির টিপস: ১০ == ১০ সত্য (True)। এর আগে not থাকায় সত্য উল্টে গিয়ে False হয়ে যায়!'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p7-r1-e5',
        question: {
          en: 'Find the bug where assignment = is accidentally used instead of comparison ==:',
          bn: 'এই কোডের কোন লাইনে ভুল করে == এর জায়গায় = ব্যবহার করা হয়েছে?'
        },
        code: 'color = "green"\nif color = "green":\n    print("যেতে পারো")',
        buggyLine: 2,
        explanation: {
          en: 'Line 2 must use "==" to compare strings, not "=" which tries to assign.',
          bn: 'নিনির টিপস: ২ নম্বর লাইনে if color == "green": লিখতে হতো, কারণ একটি সমান মান নির্ধারণ করে, তুলনা নয়।'
        },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'p7-r1-e6',
        question: {
          en: 'Arrange the complete grading criteria from highest to lowest:',
          bn: 'সর্বোচ্চ থেকে সর্বনিম্ন ক্রমানুসারে গ্রেডিং কোডটি সাজাও:'
        },
        blocks: [
          'score = 82',
          'if score >= 80:',
          '    print("A+")',
          'elif score >= 70:',
          '    print("A")',
          'else:',
          '    print("Pass")'
        ],
        correctOrder: [0, 1, 2, 3, 4, 5, 6],
        explanation: {
          en: 'Always test the most restrictive condition (highest score) first!',
          bn: 'নিনির টিপস: গ্রেডিংয়ের ক্ষেত্রে সবসময় সর্বোচ্চ শর্তটি আগে চেক করতে হয়, তারপর ক্রমানুসারে নিচে নামতে হয়।'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p7-r1-e7',
        question: {
          en: 'Grant access if the user is an admin OR has a special pass:',
          bn: 'ইউজার এডমিন অথবা তার কাছে স্পেশাল পাস থাকলেই প্রবেশের অনুমতি দিতে কি-ওয়ার্ডটি লেখো:'
        },
        codeTemplate: 'if is_admin ___ has_pass:\n    print("প্রবেশ অনুমোদিত")',
        blanks: ['or'],
        explanation: {
          en: '"or" permits access when at least one condition holds True.',
          bn: 'নিনি বলছে: সাবাশ! দুটির যেকোনো একটি শর্ত সত্য হলেই or এর মাধ্যমে প্রবেশ মিলবে।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p7-r1-e8',
        question: {
          en: 'What is printed when is_vip is False and cart is 1200?',
          bn: 'is_vip = False এবং cart = 1200 হলে নিচের কোডটি কী প্রিন্ট করবে?'
        },
        code: 'is_vip = False\ncart = 1200\nif is_vip or cart > 1000:\n    print("ফ্রি ডেলিভারি")\nelse:\n    print("৫০ টাকা চার্জ")',
        options: ['ফ্রি ডেলিভারি', '৫০ টাকা চার্জ', 'Error', 'কিছুই না'],
        correctIndex: 0,
        explanation: {
          en: 'Although is_vip is False, 1200 > 1000 is True. False or True evaluates to True!',
          bn: 'নিনির টিপস: ভিআইপি না হলেও কার্ট ১০০০ টাকার বেশি হওয়ায় or শর্তটি সত্য হয়ে "ফ্রি ডেলিভারি" প্রিন্ট হবে।'
        },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p7-r1-e9',
        question: {
          en: 'What is the boolean result of (not True or not False)?',
          bn: '(not True or not False) এর ফলাফল কী হবে?'
        },
        options: ['True', 'False', 'None', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'not True is False. not False is True. False or True evaluates to True!',
          bn: 'নিনি বলছে: একদম ঠিক! not True মানে False, আর not False মানে True। তাই False or True = True!'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p7-r1-e10',
        question: {
          en: 'Find the indentation bug inside this nested if:',
          bn: 'এই নেস্টেড if এর কোন লাইনে ইন্ডেন্টেশন ভুল আছে?'
        },
        code: 'age = 20\nhas_id = True\nif age >= 18:\nif has_id:\n    print("ভোট দিন")',
        buggyLine: 4,
        explanation: {
          en: 'Line 4 is inside the first if, so it must be indented: "    if has_id:".',
          bn: 'নিনির টিপস: ৪ নম্বর লাইনটি প্রথম if এর ভেতরে থাকায় এটিকে ৪ স্পেস ডানে ইন্ডেন্ট করতে হবে।'
        },
        xpReward: 25
      }
    ]
  },
  {
    id: 'p7-review-2',
    sectionId: 'p-unit7',
    order: 2,
    title: { en: 'Loop Review Sprint with Nini', bn: 'নিনির সাথে লুপ রিভিউ স্প্রিন্ট' },
    description: {
      en: 'Master for, while, range, break, and continue with high-speed interactive drills.',
      bn: 'for, while, range, break ও continue এর নিখুঁত ব্যবহার দ্রুত অনুশীলন করো।'
    },
    difficulty: 'intermediate',
    xpReward: 160,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Loop Mastery Recap', bn: 'লুপ মাস্টারি সারসংক্ষেপ' },
        body: {
          en: 'Nini\'s quick loop recap:\n• for loops: best when the number of iterations is known in advance.\n• while loops: best when running until an external event happens.\n• break: exits the loop immediately.\n• continue: skips straight to the next iteration.',
          bn: 'নিনির কুইক লুপ রিক্যাপ:\n• for লুপ: যখন আগে থেকে জানা থাকে কয়বার লুপ চালাতে হবে।\n• while লুপ: যখন কোনো নির্দিষ্ট শর্ত পূরণ না হওয়া পর্যন্ত চলতে হবে।\n• break: সাথে সাথে পুরো লুপ বন্ধ করে বের হয়ে যায়।\n• continue: চলতি ধাপ বাদ দিয়ে সোজা পরের ধাপে চলে যায়।'
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p7-r2-e1',
        question: {
          en: 'Which keyword skips the remaining code in the CURRENT iteration and advances to the next?',
          bn: 'কোন কি-ওয়ার্ডটি চলতি ধাপের বাকি কোড এড়িয়ে পরবর্তী ধাপে চলে যায়?'
        },
        options: ['continue', 'break', 'pass', 'exit'],
        correctIndex: 0,
        explanation: {
          en: 'continue skips the rest of the current iteration, whereas break terminates the loop.',
          bn: 'নিনি বলছে: সাবাশ! continue বর্তমান ধাপ স্কিপ করে পরের ধাপে চলে যায়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p7-r2-e2',
        question: {
          en: 'What is the final sum printed after summing range(1, 6)?',
          bn: 'range(1, 6) এর সংখ্যাগুলো যোগ করলে আউটপুট কী আসবে?'
        },
        code: 's = 0\nfor x in range(1, 6):\n    s += x\nprint(s)',
        options: ['15', '21', '10', '5'],
        correctIndex: 0,
        explanation: {
          en: 'range(1, 6) gives 1, 2, 3, 4, 5. 1 + 2 + 3 + 4 + 5 = 15!',
          bn: 'নিনির টিপস: range(1, 6) এর সংখ্যাগুলো হলো ১, ২, ৩, ৪, ৫। এদের মোট যোগফল ১৫!'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p7-r2-e3',
        question: {
          en: 'Immediately exit the loop when target item "সোনার চাবি" is found:',
          bn: '"সোনার চাবি" পাওয়া মাত্রই লুপ থেকে সাথে সাথে বের হয়ে আসতে কি-ওয়ার্ডটি লেখো:'
        },
        codeTemplate: 'for item in chest:\n    if item == "সোনার চাবি":\n        ___',
        blanks: ['break'],
        explanation: {
          en: 'break immediately terminates the loop execution.',
          bn: 'নিনি বলছে: চমৎকার! break কি-ওয়ার্ড লুপ থেকে বের করে নিয়ে আসে।'
        },
        xpReward: 15
      },
      {
        type: 'bug_hunt',
        id: 'p7-r2-e4',
        question: {
          en: 'Fix the off-by-one bug so numbers 1 to 10 are all included:',
          bn: '১ থেকে ১০ পর্যন্ত সবগুলো সংখ্যা অন্তর্ভুক্ত করতে কোন লাইনে ভুল আছে?'
        },
        code: 'for i in range(1, 10):\n    print(i)',
        buggyLine: 1,
        explanation: {
          en: 'range(1, 10) stops at 9! Line 1 must be "for i in range(1, 11):" to include 10.',
          bn: 'নিনির টিপস: range(1, 10) কিন্তু ৯ এ গিয়ে থেমে যায়! ১০ কে পেতে হলে range(1, 11) লিখতে হবে।'
        },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'p7-r2-e5',
        question: {
          en: 'Arrange the code to print only odd numbers by skipping evens with continue:',
          bn: 'continue দিয়ে জোড় সংখ্যা স্কিপ করে বিজোড় সংখ্যা প্রিন্ট করার কোড সাজাও:'
        },
        blocks: [
          'for n in range(1, 6):',
          '    if n % 2 == 0:',
          '        continue',
          '    print(n)'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Check if divisible by 2, continue if true, otherwise print.',
          bn: 'নিনির টিপস: ২ দিয়ে বিভাজ্য হলে continue করে পরের ধাপে যাও, অন্যথায় সংখ্যাটি প্রিন্ট করো।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p7-r2-e6',
        question: {
          en: 'What will this while loop output?',
          bn: 'নিচের while লুপটি কী আউটপুট দেবে?'
        },
        code: 'count = 3\nwhile count > 0:\n    print(count)\n    count -= 1',
        options: ['3\n2\n1', '3\n2\n1\n0', '3\n2', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'Loops for count = 3, 2, 1. When count becomes 0, 0 > 0 is False and it halts!',
          bn: 'নিনির টিপস: ৩, ২, ১ প্রিন্ট হবে। শূন্যের ক্ষেত্রে ০ > ০ মিথ্যা হওয়ায় লুপ বন্ধ হয়ে যাবে।'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p7-r2-e7',
        question: {
          en: 'Print every 3rd number from 3 to 12 using range(3, 13, ___):',
          bn: '৩ থেকে ১২ পর্যন্ত প্রতি ৩ সংখ্যা পরপর প্রিন্ট করতে স্টেপ কত লিখবে?'
        },
        codeTemplate: 'for i in range(3, 13, ___):\n    print(i)',
        blanks: ['3'],
        explanation: {
          en: 'The 3rd argument in range() is the step value (3, 6, 9, 12).',
          bn: 'নিনি বলছে: সাবাশ! ৩ ধাপ পরপর লাফ দেওয়ার জন্য স্টেপ ৩ বসাতে হবে।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p7-r2-e8',
        question: {
          en: 'How many times will "লুপ" be printed before break triggers?',
          bn: 'break লাগার আগে "লুপ" মোট কতবার প্রিন্ট হবে?'
        },
        code: 'for i in range(10):\n    print("লুপ")\n    if i == 2:\n        break',
        options: ['৩ বার', '২ বার', '১০ বার', '১ বার'],
        correctIndex: 0,
        explanation: {
          en: 'Runs for i = 0 (prints), i = 1 (prints), i = 2 (prints, then breaks). Total 3 times!',
          bn: 'নিনির টিপস: i = 0, 1, 2 এর জন্য প্রিন্ট হয়ে তারপর ব্রেক হয়, অর্থাৎ মোট ৩ বার প্রিন্ট হবে!'
        },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p7-r2-e9',
        question: {
          en: 'What is the shorthand operator to increment variable "runs" by 4?',
          bn: 'runs ভেরিয়েবলের মান ৪ বাড়ানোর শর্টহ্যান্ড অপারেটর কোনটি?'
        },
        options: ['runs += 4', 'runs =+ 4', 'runs ++ 4', 'runs.add(4)'],
        correctIndex: 0,
        explanation: {
          en: 'runs += 4 is equivalent to runs = runs + 4.',
          bn: 'নিনি বলছে: একদম ঠিক! মান ৪ বাড়াতে runs += 4 লিখতে হয়।'
        },
        xpReward: 15
      },
      {
        type: 'bug_hunt',
        id: 'p7-r2-e10',
        question: {
          en: 'Find the misplaced statement that creates an infinite loop:',
          bn: 'কাউন্টার লুপের বাইরে থাকায় কোন লাইনে অনন্ত লুপ তৈরি হচ্ছে?'
        },
        code: 'n = 5\nwhile n > 0:\n    print(n)\nn -= 1',
        buggyLine: 4,
        explanation: {
          en: 'Line 4 is not indented inside the while loop! Because n -= 1 never runs inside the loop, n stays 5 forever.',
          bn: 'নিনির টিপস: ৪ নম্বর লাইনটি ইন্ডেন্টেশন ছাড়া লুপের বাইরে লেখা হয়েছে! ফলে লুপের ভেতরে n এর মান কখনো কমে না এবং অনন্ত লুপ তৈরি হয়।'
        },
        xpReward: 25
      }
    ]
  },
  {
    id: 'p7-exam',
    sectionId: 'p-unit7',
    order: 3,
    isProject: true,
    title: { en: 'Unit 7 Checkpoint: Deep Recall Exam', bn: 'ইউনিট ৭ চেকপয়েন্ট: ডিপ রিকল পরীক্ষা' },
    description: {
      en: 'Synthesize conditions, boolean operators, and loops into complex, battle-tested code!',
      bn: 'কন্ডিশন, বুলিয়ান লজিক এবং লুপের সমন্বয়ে বাস্তব কোডিং চ্যালেঞ্জ জয় করো!'
    },
    difficulty: 'intermediate',
    xpReward: 300,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'The Ultimate Synthesis Arena', bn: 'আলটিমেট সিন্থেসিস এরেনা' },
        body: {
          en: 'Nini says: "You have combined two superpowers: Decision Making and Repetition! Together, you can build any software logic in the world. Prove your mastery now!"',
          bn: 'নিনি বলছে: "তুমি দুটি সুপারপাওয়ার একত্রিত করেছো: সিদ্ধান্ত নেওয়া এবং পুনরাবৃত্তি করা! এ দুটো দিয়ে পৃথিবীর যেকোনো সফটওয়্যার লজিক তৈরি করা সম্ভব। এবার তোমার দক্ষতা প্রমাণ করো!"'
        }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'p7-exam-e1',
        question: {
          en: 'What is printed by this nested loop multiplication grid?',
          bn: 'নিচের নেস্টেড লুপের আউটপুট কী হবে?'
        },
        code: 'total = 0\nfor i in range(2):\n    for j in range(3):\n        total += 1\nprint(total)',
        options: ['6', '5', '4', '0'],
        correctIndex: 0,
        explanation: {
          en: 'Outer loop runs 2 times, inner loop runs 3 times for each: 2 * 3 = 6!',
          bn: 'নিনির টিপস: বাইরের লুপ ২ বার, আর প্রতিবারে ভেতরের লুপ ৩ বার চলে: ২ × ৩ = মোট ৬ বার total বাড়ে।'
        },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'p7-exam-e2',
        question: {
          en: 'In Python, what happens when a break statement inside an INNER loop is triggered?',
          bn: 'একটি নেস্টেড লুপের ভেতরের লুপে break কল হলে কী ঘটবে?'
        },
        options: [
          'শুধুমাত্র ভেতরের লুপটি থামবে, বাইরের লুপটি চলতে থাকবে',
          'উভয় লুপই সাথে সাথে থেমে যাবে',
          'পুরো প্রোগ্রাম ক্র্যাশ করবে',
          'বাইরের লুপটি থামবে কিন্তু ভেতরেরটি চলবে'
        ],
        correctIndex: 0,
        explanation: {
          en: 'break only exits the innermost enclosing loop! The outer loop continues running normally.',
          bn: 'নিনি বলছে: মনে রাখবে, break শুধুমাত্র যে লুপের ভেতর থাকে কেবল সেটিকেই থামায়, বাইরের লুপের ওপর প্রভাব ফেলে না।'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p7-exam-e3',
        question: {
          en: 'Complete the condition to test that score >= 50 AND attempts <= 3:',
          bn: 'স্কোর ৫০ বা তার বেশি এবং চেষ্টা ৩ বারের মধ্যে—উভয় শর্ত মেলাতে কি-ওয়ার্ডটি লেখো:'
        },
        codeTemplate: 'if score >= 50 ___ attempts <= 3:\n    print("তুমি কোয়ালিফাই করেছো!")',
        blanks: ['and'],
        explanation: {
          en: 'Both criteria must be True simultaneously, so "and" is required.',
          bn: 'নিনি বলছে: সাবাশ! উভয় শর্ত সত্য হতে হবে বিধায় and ব্যবহার করতে হয়।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p7-exam-e4',
        question: {
          en: 'What will this loop filter print?',
          bn: 'এই ফিল্টার লুপটির আউটপুট কী হবে?'
        },
        code: 'for n in [3, 8, 11, 14]:\n    if n % 2 == 0 and n > 10:\n        print(n)',
        options: ['14', '8\n14', '8', '11\n14'],
        correctIndex: 0,
        explanation: {
          en: '8 is even but not >10. 11 is >10 but not even. Only 14 is both even AND >10!',
          bn: 'নিনির টিপস: ৮ জোড় হলেও ১০ এর বড় নয়, ১১ দশের বড় হলেও জোড় নয়। শুধুমাত্র ১৪ সংখ্যাটি জোড় এবং ১০ এর চেয়ে বড়!'
        },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'p7-exam-e5',
        question: {
          en: 'Arrange the code to count how many multiples of 3 exist between 1 and 20:',
          bn: '১ থেকে ২০ এর মধ্যে ৩ এর গুণিতক কয়টি তা গণনার কোড সাজাও:'
        },
        blocks: [
          'count = 0',
          'for n in range(1, 21):',
          '    if n % 3 == 0:',
          '        count += 1',
          'print(f"৩ এর গুণিতক: {count} টি")'
        ],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: {
          en: 'Initialize counter, loop 1-20, check remainder % 3 == 0, increment, and print.',
          bn: 'নিনির টিপস: কাউন্টার ০ রাখো, ১ থেকে ২০ পর্যন্ত লুপ চালিয়ে ৩ দিয়ে বিভাজ্য কিনা দেখো, যোগ করো এবং প্রিন্ট করো।'
        },
        xpReward: 35
      },
      {
        type: 'bug_hunt',
        id: 'p7-exam-e6',
        question: {
          en: 'Find the bug in this password attempt limiter:',
          bn: 'পাসওয়ার্ড লিমিট চেকারের কোন লাইনে ভুল শর্ত রয়েছে?'
        },
        code: 'tries = 3\nwhile tries < 0:\n    print("পাসওয়ার্ড লিখুন")\n    tries -= 1',
        buggyLine: 2,
        explanation: {
          en: 'Line 2 condition "tries < 0" is False when tries is 3! It should be "while tries > 0:".',
          bn: 'নিনির টিপস: ২ নম্বর লাইনে tries < 0 দেওয়ায় শুরুতেই শর্ত মিথ্যা হয়ে লুপে ঢুকছে না! এখানে tries > 0 হতে হবে।'
        },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'p7-exam-e7',
        question: {
          en: 'What is printed by this string search loop?',
          bn: 'এই সার্চ লুপটির আউটপুট কী হবে?'
        },
        code: 'found = False\nfor fruit in ["আম", "জাম", "লিচু"]:\n    if fruit == "লিচু":\n        found = True\n        break\nprint(found)',
        options: ['True', 'False', 'লিচু', 'Error'],
        correctIndex: 0,
        explanation: {
          en: '"লিচু" is in the list, setting found = True and breaking cleanly. Result: True!',
          bn: 'নিনি বলছে: সাবাশ! লিস্টে "লিচু" মেলায় found এর মান True হয়ে ব্রেক করে, তাই আউটপুট True।'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p7-exam-e8',
        question: {
          en: 'What is the output of: sum([i for i in range(1, 4)])?',
          bn: 'range(1, 4) এর সংখ্যাগুলোর যোগফল কত হবে?'
        },
        options: ['6 (1 + 2 + 3)', '10 (1 + 2 + 3 + 4)', '4', '3'],
        correctIndex: 0,
        explanation: {
          en: 'range(1, 4) generates 1, 2, 3. 1 + 2 + 3 = 6.',
          bn: 'নিনির টিপস: range(1, 4) মানে ১, ২, ৩। এদের যোগফল ১ + ২ + ৩ = ৬!'
        },
        xpReward: 25
      }
    ]
  }
];

