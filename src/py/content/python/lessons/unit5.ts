import type { Lesson } from '../../schema';

// Unit 5: Boolean Logic — lessonIds: ['p5-and', 'p5-or', 'p5-exam']
export const unit5Lessons: Lesson[] = [
  {
    id: 'p5-and',
    sectionId: 'p-unit5',
    order: 1,
    title: { en: 'The AND & NOT Gates with Nini', bn: 'নিনির সাথে AND ও NOT গেট' },
    description: {
      en: 'Master multi-condition decision making using and & not with Nini.',
      bn: 'নিনির সাথে and ও not অপারেটর দিয়ে একসাথে একাধিক শর্ত যাচাই করা শেখো।'
    },
    difficulty: 'intermediate',
    xpReward: 160,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Strict Matching: and', bn: 'কঠোর শর্ত: and' },
        body: {
          en: 'Nini says: "The \'and\' operator is like a strict school headmaster! It gives True ONLY if BOTH conditions are 100% True. If even one is False, the whole thing fails!"',
          bn: 'নিনি বলছে: "\'and\' হলো একজন কঠোর শিক্ষক! উভয় পাশের দুটি শর্তই যদি ১০০% সত্য (True) হয়, তবেই এর পুরো ফলাফল True হবে। একটা শর্তও মিথ্যা হলে সব বাতিল!"'
        },
        code: {
          code: 'gpa = 5.0\nmath_score = 92\nif gpa >= 4.5 and math_score >= 80:\n    print("তুমি ইঞ্জিনিয়ারিং ভর্তির যোগ্য!")',
          language: 'python',
          explanation: {
            en: 'Both GPA and math score satisfy the criteria.',
            bn: 'জিপিএ এবং গণিতের নম্বর দুটিই শর্ত পূরণ করায় মেসেজটি প্রিন্ট হয়েছে।'
          }
        }
      },
      {
        heading: { en: 'The Inverter: not', bn: 'উল্টো করার জাদুকর: not' },
        body: {
          en: 'Nini\'s Tip: The \'not\' operator simply flips the truth value! not True becomes False, and not False becomes True. It is perfect for checking negative states like \'not account_blocked\'.',
          bn: 'নিনির টিপস: \'not\' অপারেটর সত্যকে মিথ্যা আর মিথ্যাকে সত্য বানিয়ে দেয়! যেমন not True হয়ে যায় False। অ্যাকাউন্ট ব্লক নয় কিনা তা চেক করতে এটি দারুণ উপযোগী।'
        },
        code: {
          code: 'is_raining = False\nif not is_raining:\n    print("চলো মাঠে ফুটবল খেলি!")',
          language: 'python',
          explanation: {
            en: 'not False evaluates to True, so we go play football!',
            bn: 'not False এর মান True, তাই আমরা ফুটবল খেলতে মাঠে যাব!'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p5-and-e1',
        question: {
          en: 'What is the boolean result of (True and False) in Python?',
          bn: 'পাইথনে (True and False) এর ফলাফল কী হবে?'
        },
        options: ['False', 'True', 'None', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'and requires BOTH sides to be True. Since one is False, the result is False!',
          bn: 'নিনির টিপস: and এর দুই পাশই True হতে হয়। যেহেতু এক পাশ False, তাই চূড়ান্ত ফলাফল False।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p5-and-e2',
        question: {
          en: 'What will this double condition print?',
          bn: 'নিচের ডাবল কন্ডিশন কোডটি কী প্রিন্ট করবে?'
        },
        code: 'age = 22\nhas_nid = True\nif age >= 18 and has_nid:\n    print("ভোট দেওয়ার অনুমতি আছে")',
        options: ['ভোট দেওয়ার অনুমতি আছে', 'কিছুই না', 'Error', 'False'],
        correctIndex: 0,
        explanation: {
          en: '22 >= 18 is True, and has_nid is True. True and True gives True!',
          bn: 'নিনি বলছে: সাবাশ! বয়স ১৮ এর বেশি এবং এনআইডি কার্ড আছে—দুটি শর্তই সত্য হওয়ায় মেসেজটি প্রিন্ট হবে।'
        },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p5-and-e3',
        question: {
          en: 'What does "not False" evaluate to?',
          bn: '"not False" এর মান কী হবে?'
        },
        options: ['True', 'False', 'None', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'not inverts boolean values: not False turns into True!',
          bn: 'নিনির টিপস: not অপারেটর মিথ্যাকে উল্টে সত্য (True) করে দেয়।'
        },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'p5-and-e4',
        question: {
          en: 'Check that the player is alive AND has at least 1 bullet:',
          bn: 'প্লেয়ার জীবিত এবং তার কাছে অন্তত ১টি গুলি আছে—উভয় শর্ত একসাথে যাচাই করতে কি-ওয়ার্ডটি লেখো:'
        },
        codeTemplate: 'if is_alive ___ bullets >= 1:\n    print("ফায়ার করো!")',
        blanks: ['and'],
        explanation: {
          en: 'Use "and" when both requirements must be met simultaneously.',
          bn: 'নিনি বলছে: চমৎকার! দুটি শর্তই পূরণ করতে and ব্যবহার করতে হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p5-and-e5',
        question: {
          en: 'What is printed when speed is 80?',
          bn: 'speed = 80 হলে নিচের কোডটি কী প্রিন্ট করবে?'
        },
        code: 'speed = 80\nif speed >= 40 and speed <= 60:\n    print("নিরাপদ গতি")\nelse:\n    print("গতির নিয়ম ভঙ্গ")',
        options: ['গতির নিয়ম ভঙ্গ', 'নিরাপদ গতি', 'কিছুই না', 'Error'],
        correctIndex: 0,
        explanation: {
          en: '80 >= 40 is True, but 80 <= 60 is False! True and False gives False, triggering else.',
          bn: 'নিনির টিপস: ৮০ সংখ্যাটি ৪০ এর বড় হলেও ৬০ এর কম নয় (False)। and থাকায় একটি শর্ত পূরণ না হওয়ায় else চলবে।'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p5-and-e6',
        question: {
          en: 'Find the bug in this not operator usage:',
          bn: 'এই কোডের কোন লাইনে not অপারেটরের ব্যবহারে বাগ আছে?'
        },
        code: 'game_over = False\nif game_over not:\n    print("খেলা চালিয়ে যাও")',
        buggyLine: 2,
        explanation: {
          en: 'not must precede the expression: "if not game_over:". It cannot be placed after.',
          bn: 'নিনির টিপস: পাইথনে not সবসময় ভেরিয়েবলের আগে বসে (if not game_over:), পরে নয়!'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p5-and-e7',
        question: {
          en: 'Invert the condition so the code runs only when the user is NOT blocked:',
          bn: 'ইউজার ব্লকড না থাকলে কোডটি রান করার জন্য ফাঁকা স্থানে সঠিক কি-ওয়ার্ডটি লেখো:'
        },
        codeTemplate: 'is_blocked = False\nif ___ is_blocked:\n    print("লগইন সফল")',
        blanks: ['not'],
        explanation: {
          en: 'not is_blocked evaluates to True when is_blocked is False.',
          bn: 'নিনি বলছে: সাবাশ! not ব্যবহার করলে False উল্টে True হয়ে যায়।'
        },
        xpReward: 15
      },
      {
        type: 'code_arrange',
        id: 'p5-and-e8',
        question: {
          en: 'Arrange this security check (correct PIN AND battery > 10%):',
          bn: 'নিরাপত্তা চেকের কোডটি ক্রমানুসারে সাজাও (সঠিক পিন এবং ব্যাটারি ১০% এর বেশি):'
        },
        blocks: [
          'pin_correct = True',
          'battery = 75',
          'if pin_correct and battery > 10:',
          '    print("ফোন আনলক হয়েছে")'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Define variables, combine checks with "and", and indent the success message.',
          bn: 'নিনির টিপস: ভেরিয়েবল সেট করে and দিয়ে দুটি শর্ত একসাথে মেলাও, তারপর প্রিন্ট করো।'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p5-and-e9',
        question: {
          en: 'What is the value of (True and True and False)?',
          bn: '(True and True and False) এর চূড়ান্ত মান কী হবে?'
        },
        options: ['False', 'True', 'None', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'No matter how many True conditions you have, a single False in an and chain makes the whole expression False!',
          bn: 'নিনি বলছে: মনে রাখবে, and এর চেইনে যতগুলোই True থাকুক, একটি মাত্র False থাকলেই পুরো ফলাফল False হয়ে যায়!'
        },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p5-and-e10',
        question: {
          en: 'What will be printed?',
          bn: 'নিচের কোডটি চালালে কী আউটপুট আসবে?'
        },
        code: 'has_money = True\nstall_open = False\nif has_money and not stall_open:\n    print("দোকান বন্ধ, বাড়ি ফিরে যাও")',
        options: ['দোকান বন্ধ, বাড়ি ফিরে যাও', 'কিছুই না', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'has_money is True, and not stall_open is not False = True. True and True is True!',
          bn: 'নিনির টিপস: has_money হলো True, আর not stall_open মানে not False = True! দুটিই সত্য হওয়ায় মেসেজ প্রিন্ট হবে।'
        },
        xpReward: 20
      }
    ]
  },
  {
    id: 'p5-or',
    sectionId: 'p-unit5',
    order: 2,
    title: { en: 'The OR Gate with Nini', bn: 'নিনির সাথে OR গেট' },
    description: {
      en: 'Make flexible decisions using "or" when any single condition is sufficient.',
      bn: 'যেকোনো একটি শর্ত পূরণ হলেই কাজ সম্পন্ন করতে "or" অপারেটর ব্যবহার করো।'
    },
    difficulty: 'intermediate',
    xpReward: 160,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'The Generous Friend: or', bn: 'উদার বন্ধু: or' },
        body: {
          en: 'Nini says: "\'or\' is friendly and generous! It returns True if AT LEAST ONE condition is True. It only gives False when every single condition is False."',
          bn: 'নিনি বলছে: "\'or\' হলো খুব উদার এক বন্ধু! যেকোনো একটা শর্ত সত্য (True) হলেই ও খুশি হয়ে True ফেরত দেয়। শুধুমাত্র সব শর্ত মিথ্যা (False) হলেই ফলাফল False হয়।"'
        },
        code: {
          code: 'day = "Friday"\nif day == "Friday" or day == "Saturday":\n    print("ছুটির দিন! চলো ঘুরতে যাই!")',
          language: 'python',
          explanation: {
            en: 'Either Friday or Saturday qualifies as a weekend in Bangladesh.',
            bn: 'শুক্র বা শনি—যেকোনো একদিন হলেই ছুটির দিন হিসেবে গণ্য হবে।'
          }
        }
      },
      {
        heading: { en: 'Comparing and vs or', bn: 'and বনাম or এর তুলনা' },
        body: {
          en: 'Nini\'s Tip:\n• True or False &rarr; True\n• False or True &rarr; True\n• True or True &rarr; True\n• False or False &rarr; False (only false case!)',
          bn: 'নিনির টিপস:\n• True or False &rarr; True\n• False or True &rarr; True\n• True or True &rarr; True\n• False or False &rarr; False (একমাত্র যখন দুই পাশই মিথ্যা!)'
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p5-or-e1',
        question: {
          en: 'What does (False or True) evaluate to in Python?',
          bn: 'পাইথনে (False or True) এর মান কী হবে?'
        },
        options: ['True', 'False', 'None', 'Error'],
        correctIndex: 0,
        explanation: {
          en: '"or" needs only one True condition to produce True.',
          bn: 'নিনি বলছে: সাবাশ! or এর জন্য যেকোনো একটি শর্ত True হলেই পুরো ফলাফল True হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p5-or-e2',
        question: {
          en: 'What is printed by this discount coupon checker?',
          bn: 'এই ডিসকাউন্ট কুপন চেকারের আউটপুট কী হবে?'
        },
        code: 'is_student = True\nhas_coupon = False\nif is_student or has_coupon:\n    print("২০% ছাড় প্রযোজ্য!")',
        options: ['২০% ছাড় প্রযোজ্য!', 'কিছুই না', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'Since is_student is True, the condition passes immediately!',
          bn: 'নিনির টিপস: যেহেতু is_student সত্য (True), তাই কুপন না থাকলেও or এর কারণে ২০% ছাড় প্রযোজ্য হবে!'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p5-or-e3',
        question: {
          en: 'Allow entry if the guest has a VIP badge OR an invitation ticket:',
          bn: 'অতিথির ভিআইপি ব্যাজ অথবা দাওয়াত কার্ড—যেকোনো একটি থাকলেই প্রবেশের অনুমতি দিতে কি-ওয়ার্ডটি লেখো:'
        },
        codeTemplate: 'if has_vip_badge ___ has_invitation:\n    print("স্বাগতম অনুষ্ঠানে!")',
        blanks: ['or'],
        explanation: {
          en: 'Use "or" when either condition is sufficient for access.',
          bn: 'নিনি বলছে: অসাধারণ! যেকোনো একটি বিকল্প যথেষ্ট হলে or ব্যবহার করা হয়।'
        },
        xpReward: 15
      },
      {
        type: 'mcq',
        id: 'p5-or-e4',
        question: {
          en: 'In which scenario does "A or B" return False?',
          bn: 'কোন ক্ষেত্রে "A or B" এর মান False হবে?'
        },
        options: [
          'যখন A এবং B উভয়ই False',
          'যখন A True এবং B False',
          'যখন A False এবং B True',
          'যখন A এবং B উভয়ই True'
        ],
        correctIndex: 0,
        explanation: {
          en: '"or" is only False when BOTH sides are False.',
          bn: 'নিনির টিপস: or শুধুমাত্র তখনই False হয় যখন দুই পাশের সবগুলো শর্তই False হয়।'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p5-or-e5',
        question: {
          en: 'Find the impossible condition bug:',
          bn: 'এই কোডের কোন লাইনে অসম্ভব শর্তের বাগ আছে?'
        },
        code: 'weather = "sunny"\nif weather == "sunny" and weather == "rainy":\n    print("অদ্ভুত আবহাওয়া")',
        buggyLine: 2,
        explanation: {
          en: 'A variable cannot equal two different values at the same instant! It should use "or", not "and".',
          bn: 'নিনির টিপস: একই সাথে আবহাওয়া রোদ এবং বৃষ্টি দুটি সমান হতে পারে না! ২ নম্বর লাইনে and এর জায়গায় or ব্যবহার করা উচিত ছিল।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p5-or-e6',
        question: {
          en: 'What will this payment method check print?',
          bn: 'নিচের পেমেন্ট মেথড চেকের আউটপুট কী হবে?'
        },
        code: 'method = "bKash"\nif method == "bKash" or method == "Nagad":\n    print("মোবাইল ব্যাংকিং গ্রহণযোগ্য")\nelse:\n    print("অন্য উপায় বেছে নিন")',
        options: ['মোবাইল ব্যাংকিং গ্রহণযোগ্য', 'অন্য উপায় বেছে নিন', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'method == "bKash" is True, so the if block executes!',
          bn: 'নিনি বলছে: সাবাশ! বিকাশ বা নগদ এর মধ্যে প্রথমটি মিলে যাওয়ায় if ব্লকের লেখাটি প্রিন্ট হবে।'
        },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p5-or-e7',
        question: {
          en: 'Arrange the login recovery options (email or phone):',
          bn: 'লগইন রিকভারি অপশনের কোডটি ক্রমানুসারে সাজাও (ইমেইল অথবা ফোন নম্বর):'
        },
        blocks: [
          'has_email = False',
          'has_phone = True',
          'if has_email or has_phone:',
          '    print("ওটিপি কোড পাঠানো হয়েছে")'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Define recovery methods, check with "or", and print notification.',
          bn: 'নিনির টিপস: ভেরিয়েবল ডিফাইন করো, or দিয়ে যেকোনো একটি চেক করো, তারপর প্রিন্ট করো।'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p5-or-e8',
        question: {
          en: 'Complete the condition so that free shipping applies if cart > 1000 tk OR user is a premium member:',
          bn: 'কার্ট ১০০০ টাকার বেশি অথবা প্রিমিয়াম মেম্বার হলে ফ্রি ডেলিভারি দিতে কি-ওয়ার্ডটি লেখো:'
        },
        codeTemplate: 'if cart_total > 1000 ___ is_premium:\n    print("ফ্রি ডেলিভারি!")',
        blanks: ['or'],
        explanation: {
          en: 'The "or" operator applies free shipping if either qualification is met.',
          bn: 'নিনির টিপস: যেকোনো একটি শর্তে ফ্রি ডেলিভারি পেতে or ব্যবহার করা হয়েছে।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p5-or-e9',
        question: {
          en: 'What is printed when both are False?',
          bn: 'দুটি শর্তই মিথ্যা হলে নিচের কোডটি কী প্রিন্ট করবে?'
        },
        code: 'key = False\nlockpick = False\nif key or lockpick:\n    print("দরজা খুলে গেছে")\nelse:\n    print("দরজা বন্ধ")',
        options: ['দরজা বন্ধ', 'দরজা খুলে গেছে', 'কিছুই না', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'False or False evaluates to False, so the else branch executes.',
          bn: 'নিনির টিপস: False or False মানে False, তাই else ব্লকের "দরজা বন্ধ" প্রিন্ট হবে।'
        },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p5-or-e10',
        question: {
          en: 'What is the boolean result of (False or False or True or False)?',
          bn: '(False or False or True or False) এর ফলাফল কী হবে?'
        },
        options: ['True', 'False', 'None', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'A single True anywhere in an "or" chain makes the entire expression True!',
          bn: 'নিনি বলছে: দারুণ! or এর চেইনে একটা মাত্র True পেলেই পুরো ফলাফল True হয়ে যায়।'
        },
        xpReward: 20
      }
    ]
  },
  {
    id: 'p5-exam',
    sectionId: 'p-unit5',
    order: 3,
    isProject: true,
    title: { en: 'Unit 5 Checkpoint: Boolean Logic Exam', bn: 'ইউনিট ৫ চেকপয়েন্ট: বুলিয়ান লজিক পরীক্ষা' },
    description: {
      en: 'Synthesize and, or, not, and parentheses in realistic multi-clause challenges!',
      bn: 'and, or, not ও বন্ধনীর সমন্বয়ে জটিল শর্ত সমাধানের চূড়ান্ত পরীক্ষা দাও!'
    },
    difficulty: 'intermediate',
    xpReward: 300,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Mastering Combined Logic', bn: 'কম্বাইন্ড লজিকের দক্ষতা' },
        body: {
          en: 'Nini says: "Logic gates are the brain cells of all software! Parentheses ( ) group logic together. Remember: \'not\' happens first, then \'and\', then \'or\'!"',
          bn: 'নিনি বলছে: "বুলিয়ান লজিক হলো কম্পিউটারের মস্তিষ্কের স্নায়ু! ব্র্যাকেট ( ) দিয়ে শর্ত গুছিয়ে নেওয়া যায়। মনে রেখো: সবার আগে not, তারপর and, আর সবার শেষে or এর কাজ হয়!"'
        }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'p5-exam-e1',
        question: {
          en: 'What will this combined not & comparison code print?',
          bn: 'নিচের কোডটি কী প্রিন্ট করবে?'
        },
        code: 'num = 7\nif not (num > 10):\n    print("১০ বা তার চেয়ে ছোট")',
        options: ['১০ বা তার চেয়ে ছোট', 'কিছুই না', 'Error', 'num'],
        correctIndex: 0,
        explanation: {
          en: '7 > 10 is False. not False is True, so the if block runs!',
          bn: 'নিনির টিপস: ৭ > ১০ মিথ্যা (False)। not False মানে সত্য (True), তাই মেসেজটি প্রিন্ট হবে।'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p5-exam-e2',
        question: {
          en: 'What is the boolean evaluation of: True or (False and False)?',
          bn: 'True or (False and False) এর মান কী হবে?'
        },
        options: ['True', 'False', 'Error', 'None'],
        correctIndex: 0,
        explanation: {
          en: 'Inside brackets: False and False is False. Then True or False evaluates to True!',
          bn: 'নিনি বলছে: সাবাশ! বন্ধনীর ভেতর False and False হলো False। কিন্তু বামে True or থাকায় পুরোটা True হয়ে যায়।'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p5-exam-e3',
        question: {
          en: 'Fill the blank so the message prints ONLY when it is NOT raining and user has energy:',
          bn: 'বৃষ্টি না থাকলে এবং গায়ে শক্তি থাকলে বাইরে যাওয়ার কোডটি সম্পূর্ণ করো:'
        },
        codeTemplate: 'is_raining = False\nhas_energy = True\nif ___ is_raining and has_energy:\n    print("চলো সাইকেল চালাতে যাই")',
        blanks: ['not'],
        explanation: {
          en: 'not is_raining turns False into True, satisfying both conditions.',
          bn: 'নিনির টিপস: not দিলে False উল্টে গিয়ে True হয়ে যায়।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p5-exam-e4',
        question: {
          en: 'What is the result of this user authentication check?',
          bn: 'এই ইউজার অথেনটিকেশন চেকের আউটপুট কী হবে?'
        },
        code: 'username_ok = True\npassword_ok = True\nis_banned = False\nif username_ok and password_ok and not is_banned:\n    print("ড্যাশবোর্ডে স্বাগতম")\nelse:\n    print("প্রবেশ নিষেধ")',
        options: ['ড্যাশবোর্ডে স্বাগতম', 'প্রবেশ নিষেধ', 'কিছুই না', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'All three parts are True: username_ok (True), password_ok (True), and not is_banned (True)!',
          bn: 'নিনি বলছে: চমৎকার! ইউজারনেম সঠিক, পাসওয়ার্ড সঠিক এবং ইউজার ব্যান নয় (not False = True)। ফলে ড্যাশবোর্ডে প্রবেশের অনুমতি মিলবে।'
        },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'p5-exam-e5',
        question: {
          en: 'Arrange the role authorization check for admin or moderator:',
          bn: 'এডমিন বা মডারেটরের অ্যাক্সেস চেকের কোডটি সাজাও:'
        },
        blocks: [
          'user_role = "moderator"',
          'if user_role == "admin" or user_role == "moderator":',
          '    print("অ্যাক্সেস অনুমোদিত")',
          'else:',
          '    print("সাধারণ ব্যবহারকারী")'
        ],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: {
          en: 'Initialize role, check with "or", and handle both branches.',
          bn: 'নিনির টিপস: role ডিফাইন করে or দিয়ে যাচাই করো, তারপর উপযুক্ত বার্তা দাও।'
        },
        xpReward: 35
      },
      {
        type: 'bug_hunt',
        id: 'p5-exam-e6',
        question: {
          en: 'Find the precedence bug where the discount is applied to non-members:',
          bn: 'এই কোডের কোন লাইনে ব্র্যাকেট ছাড়া লজিকের ক্রুটি আছে?'
        },
        code: 'is_member = False\nis_admin = True\npoints = 50\nif is_member or is_admin and points > 100:\n    print("স্পেশাল গিফট")',
        buggyLine: 4,
        explanation: {
          en: '"and" has higher precedence than "or". Group with parentheses: "(is_member or is_admin) and points > 100".',
          bn: 'নিনির টিপস: পাইথনে and এর ক্ষমতা or এর চেয়ে বেশি! তাই স্পষ্ট করতে (is_member or is_admin) ব্র্যাকেটে রাখতে হয়।'
        },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'p5-exam-e7',
        question: {
          en: 'What is printed when age is 16 and has_parent is True?',
          bn: 'age = 16 এবং has_parent = True হলে সিনেমার টিকিট কোডটি কী প্রিন্ট করবে?'
        },
        code: 'age = 16\nhas_parent = True\nif age >= 18 or (age >= 13 and has_parent):\n    print("মুভি টিকিট ইস্যু")',
        options: ['মুভি টিকিট ইস্যু', 'কিছুই না', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'age >= 18 is False, but inside brackets (16 >= 13 and True) is True. False or True gives True!',
          bn: 'নিনির টিপস: ১৬ >= ১৮ মিথ্যা, কিন্তু ১৩ এর বেশি ও অভিভাবক সাথে থাকায় (True and True = True) টিকিট পাওয়া যাবে!'
        },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'p5-exam-e8',
        question: {
          en: 'Which Python keyword would you use to test if neither A nor B is true?',
          bn: 'A এবং B এর কোনোটিই সত্য নয় তা চেক করতে নিচের কোনটি সবচেয়ে উপযোগী?'
        },
        options: [
          'not A and not B',
          'A and B',
          'A or B',
          'not (A and B)'
        ],
        correctIndex: 0,
        explanation: {
          en: 'not A and not B (or "not (A or B)" by De Morgan\'s law) checks that neither condition is True.',
          bn: 'নিনির টিপস: দুটির কোনোটিই সত্য নয় বোঝাতে not A and not B ব্যবহার করা হয় (ডি মর্গানের নিয়ম অনুসারে এটি not (A or B) এর সমান)।'
        },
        xpReward: 25
      }
    ]
  }
];

