import type { Lesson } from '../../schema';

// Unit 3: Memory Recall — lessonIds: ['p3-recall-1', 'p3-recall-2', 'p3-exam']
export const unit3Lessons: Lesson[] = [
  {
    id: 'p3-recall-1',
    sectionId: 'p-unit3',
    order: 1,
    title: { en: 'Recall: Input & Variables with Nini', bn: 'রিকল: নিনির সাথে ইনপুট ও ভেরিয়েবল' },
    description: {
      en: 'Review print(), input(), variables, and string magic from Unit 1 with Nini.',
      bn: 'নিনির সাথে ইউনিট ১ এর print(), input(), ভেরিয়েবল এবং স্ট্রিং এর জাদু রিভিশন করো।'
    },
    difficulty: 'beginner',
    xpReward: 160,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Memory Checkpoint: Chatterbox Basics', bn: 'মেমোরি চেকপয়েন্ট: চ্যাটারবক্স বেসিকস' },
        body: {
          en: 'Nini says: "Welcome back, hero! Let\'s sharpen your memory. Remember: print() speaks to the screen, input() listens to the user, and variables hold your treasures!"',
          bn: 'নিনি বলছে: "স্বাগতম হিরো! চলো তোমার স্মৃতি ঝালিয়ে নিই। মনে রেখো: print() স্ক্রিনে কথা বলে, input() ইউজারের কথা শোনে, আর ভেরিয়েবল তোমার তথ্য জমা রাখে!"'
        },
        code: {
          code: 'hero_name = input("তোমার নাম কী? ")\nprint("চলো শুরু করি,", hero_name)',
          language: 'python',
          explanation: {
            en: 'input() gets text from the user, and print() greets them warmly.',
            bn: 'input() ইউজারের কাছ থেকে নাম সংগ্রহ করে এবং print() তাকে অভিবাদন জানায়।'
          }
        }
      },
      {
        heading: { en: 'String Repetition & Formatting', bn: 'স্ট্রিং রিপিটেশন ও ফরম্যাটিং' },
        body: {
          en: 'Nini\'s Tip: In Python, you can multiply strings! "Go!" * 3 becomes "Go!Go!Go!". Plus, remember that input() ALWAYS yields a string.',
          bn: 'নিনির টিপস: পাইথনে স্ট্রিংকে গুণ করা যায়! "Go!" * 3 লিখলে হবে "Go!Go!Go!"। আর মনে রাখবে, input() সবসময় স্ট্রিং (লেখা) দেয়।'
        },
        code: {
          code: 'cheer = "সাবাশ! " * 3\nprint(cheer)  # সাবাশ! সাবাশ! সাবাশ! ',
          language: 'python',
          explanation: {
            en: 'Multiplying a string repeats it without any loop!',
            bn: 'কোনো লুপ ছাড়াই স্ট্রিং গুণ করে সহজে পুনরাবৃত্তি করা যায়!'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p3-r1-e1',
        question: {
          en: 'What does input() ALWAYS return in Python?',
          bn: 'পাইথনে input() ফাংশন সবসময় কী ধরণের ডাটা ফেরত দেয়?'
        },
        options: ['String (str)', 'Integer (int)', 'Float (float)', 'Boolean (bool)'],
        correctIndex: 0,
        explanation: {
          en: 'input() always returns a string (str), even if the user types digits like 42!',
          bn: 'নিনির টিপস: ইউজার ৪২ লিখলেও input() সেটাকে স্ট্রিং "42" হিসেবে নেয়, তাই সংখ্যা হিসেবে ব্যবহারের আগে int() করতে হয়!'
        },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'p3-r1-e2',
        question: {
          en: 'Complete the code to print "Hello, Nini!" to the console:',
          bn: 'কনসোলে "Hello, Nini!" প্রিন্ট করতে ফাঁকা স্থান পূরণ করো:'
        },
        codeTemplate: '___("Hello, Nini!")',
        blanks: ['print'],
        explanation: {
          en: 'print() is the universal output command in Python. Always lowercase!',
          bn: 'নিনি বলছে: সাবাশ! পাইথনে স্ক্রিনে কিছু দেখাতে সবসময় ছোট হাতের print() ব্যবহার করবে।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p3-r1-e3',
        question: {
          en: 'What will be printed on the screen?',
          bn: 'নিচের কোডটি চালালে স্ক্রিনে কী দেখা যাবে?'
        },
        code: 'team = "Tigers"\nprint("Go " + team + "!")',
        options: ['Go Tigers!', 'Go team!', 'GoTigers!', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'String concatenation with + joins "Go ", "Tigers", and "!" into "Go Tigers!".',
          bn: 'নিনির টিপস: + দিয়ে স্ট্রিং জোড়া দিলে "Go Tigers!" তৈরি হয়।'
        },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p3-r1-e4',
        question: {
          en: 'What is the output of multiplying this string?',
          bn: 'এই স্ট্রিং গুণটির আউটপুট কী হবে?'
        },
        code: 'chant = "Cholo " * 3\nprint(chant)',
        options: ['Cholo Cholo Cholo ', 'Cholo*3', 'Cholo3', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'Multiplying a string repeats it the specified number of times!',
          bn: 'নিনি বলছে: পাইথনে স্ট্রিং গুণ করলে সেটি নির্দিষ্ট সংখ্যক বার পুনরাবৃত্তি হয়।'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p3-r1-e5',
        question: {
          en: 'Find the bug in this greeting program:',
          bn: 'এই গ্রিটিং প্রোগ্রামের কোন লাইনে ভুল আছে?'
        },
        code: 'name = "Siam"\nprint("স্বাগতম " name)\nprint("চলো শিখি")',
        buggyLine: 2,
        explanation: {
          en: 'Line 2 is missing the + operator to concatenate "স্বাগতম " and name!',
          bn: 'নিনির টিপস: ২ নম্বর লাইনে "স্বাগতম " এবং name এর মাঝে + চিহ্ন দিতে ভুলে গিয়েছো!'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p3-r1-e6',
        question: {
          en: 'Which of the following is an INVALID variable name in Python?',
          bn: 'নিচের কোনটি পাইথনে একটি অবৈধ (ভুল) ভেরিয়েবলের নাম?'
        },
        options: ['user_score', '2fast', '_secret', 'totalAmount'],
        correctIndex: 1,
        explanation: {
          en: 'Variable names cannot start with a digit! 2fast causes a SyntaxError.',
          bn: 'নিনির টিপস: কোনো ভেরিয়েবলের নাম কখনো সংখ্যা দিয়ে শুরু হতে পারে না (যেমন 2fast ভুল)। তবে fast2 বা user_2 সঠিক!'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p3-r1-e7',
        question: {
          en: 'Prompt the user to enter their home district in Bangladesh:',
          bn: 'ইউজারের কাছ থেকে তার জেলা ইনপুট নেওয়ার ফাংশনটি লেখো:'
        },
        codeTemplate: 'district = ___("তোমার জেলা কোনটি? ")',
        blanks: ['input'],
        explanation: {
          en: 'input() displays the prompt and captures user keyboard input.',
          bn: 'নিনি বলছে: চমৎকার! ইনপুট নেওয়ার জন্য input() ফাংশন ব্যবহার করতে হয়।'
        },
        xpReward: 15
      },
      {
        type: 'bug_hunt',
        id: 'p3-r1-e8',
        question: {
          en: 'Why does this code crash when the user enters 5?',
          bn: 'ইউজার ৫ দিলে নিচের কোডটি কোন লাইনে ক্র্যাশ করবে?'
        },
        code: 'candies = input("কয়টি মিষ্টি চাও? ")\nmore = candies + 2\nprint(more)',
        buggyLine: 2,
        explanation: {
          en: 'candies is a string! You cannot add an integer 2 to a string without int(candies).',
          bn: 'নিনির টিপস: candies হলো স্ট্রিং! স্ট্রিং এর সাথে সরাসরি সংখ্যা ২ যোগ করা যায় না। করতে হবে int(candies) + 2।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p3-r1-e9',
        question: {
          en: 'What will print(f"...") display?',
          bn: 'এই f-string এর আউটপুট কী হবে?'
        },
        code: 'hero = "নিনি"\nlevel = 5\nprint(f"{hero} এখন লেভেল {level}!")',
        options: [
          'নিনি এখন লেভেল 5!',
          '{hero} এখন লেভেল {level}!',
          'hero এখন লেভেল level!',
          'Error'
        ],
        correctIndex: 0,
        explanation: {
          en: 'f-strings replace expressions inside curly braces with their values!',
          bn: 'নিনি বলছে: সাবাশ! f-strings এর ভেতর কার্লি ব্র্যাকেট { } দিলে ভেরিয়েবলের আসল মান সেখানে বসে যায়।'
        },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p3-r1-e10',
        question: {
          en: 'Arrange the lines to ask the user for their city and welcome them:',
          bn: 'ইউজারের কাছে শহর জানতে চেয়ে তাকে স্বাগতম জানানোর কোডটি ক্রমানুসারে সাজাও:'
        },
        blocks: [
          'city = input("তোমার শহর: ")',
          'msg = f"{city}-তে তোমাকে স্বাগতম!"',
          'print(msg)'
        ],
        correctOrder: [0, 1, 2],
        explanation: {
          en: 'First get input, then format the message, then print it!',
          bn: 'নিনির টিপস: প্রথমে ইনপুট নিয়ে ভেরিয়েবলে রাখবে, তারপর মেসেজ তৈরি করবে, সবশেষে স্ক্রিনে প্রিন্ট করবে।'
        },
        xpReward: 25
      }
    ]
  },
  {
    id: 'p3-recall-2',
    sectionId: 'p-unit3',
    order: 2,
    title: { en: 'Recall: Math & Types with Nini', bn: 'রিকল: নিনির সাথে গণিত ও টাইপ' },
    description: {
      en: 'Master type conversion, modulo, integer division, and powers from Unit 2.',
      bn: 'টাইপ রূপান্তর, ভাগশেষ (%), পূর্ণসংখ্যা ভাগ (//) এবং পাওয়ার (**) ঝালিয়ে নাও।'
    },
    difficulty: 'beginner',
    xpReward: 160,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Operators Quick Memory Map', bn: 'অপারেটর কুইক মেমোরি ম্যাপ' },
        body: {
          en: 'Nini\'s rulebook:\n• / gives float (7 / 2 = 3.5)\n• // gives integer quotient (7 // 2 = 3)\n• % gives remainder (7 % 2 = 1)\n• ** gives power (2 ** 3 = 8)\n• int(), float(), str() change types!',
          bn: 'নিনির রুলবুক:\n• / ভাগ করলে সবসময় ফ্লোট দেয় (7 / 2 = 3.5)\n• // পূর্ণসংখ্যার ভাগফল দেয় (7 // 2 = 3)\n• % ভাগশেষ দেয় (7 % 2 = 1)\n• ** ঘাত বা পাওয়ার দেয় (2 ** 3 = 8)\n• int(), float(), str() দিয়ে টাইপ কনভার্ট করা হয়!'
        },
        code: {
          code: 'total_bill = int("450")\nfriends = 3\nper_person = total_bill // friends\nprint("প্রতি জনের বিল:", per_person)  # 150',
          language: 'python',
          explanation: {
            en: 'Convert string to integer, then divide equally.',
            bn: 'স্ট্রিংকে int এ কনভার্ট করে সমানভাবে ৩ ভাগে ভাগ করা হয়েছে।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p3-r2-e1',
        question: {
          en: 'Which Python function converts "120" into a numeric integer?',
          bn: 'কোন ফাংশনটি "120" স্ট্রিংকে সংখ্যা (ইন্টিজার) এ রূপান্তর করে?'
        },
        options: ['int("120")', 'str(120)', 'float("120")', 'num("120")'],
        correctIndex: 0,
        explanation: {
          en: 'int("120") converts the text into integer 120.',
          bn: 'নিনি বলছে: সাবাশ! int() ফাংশন স্ট্রিংকে পূর্ণসংখ্যায় রূপান্তর করে।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p3-r2-e2',
        question: {
          en: 'What is the output of 3 ** 3 in Python?',
          bn: 'পাইথনে 3 ** 3 এর মান কত হবে?'
        },
        code: 'print(3 ** 3)',
        options: ['27', '9', '6', '33'],
        correctIndex: 0,
        explanation: {
          en: '3 ** 3 means 3 cubed (3 * 3 * 3 = 27).',
          bn: 'নিনির টিপস: ** হলো পাওয়ার। ৩ এর কিউব মানে ৩ × ৩ × ৩ = ২৭!'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p3-r2-e3',
        question: {
          en: 'Get the remainder when 17 sweets are shared among 5 kids:',
          bn: '১৭টি মিষ্টি ৫ জন বাচ্চার মাঝে সমান ভাগে বিলিয়ে দিলে কয়টি অবশিষ্ট থাকবে?'
        },
        codeTemplate: 'leftover = 17 ___ 5',
        blanks: ['%'],
        explanation: {
          en: '% is the modulo operator! 17 % 5 = 2.',
          bn: 'নিনির টিপস: ভাগশেষ বের করতে মডুলো (%) অপারেটর ব্যবহার করা হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p3-r2-e4',
        question: {
          en: 'What is the result of 19 // 4?',
          bn: '19 // 4 এর ফলাফল কী হবে?'
        },
        code: 'print(19 // 4)',
        options: ['4', '4.75', '3', 'Error'],
        correctIndex: 0,
        explanation: {
          en: '// discards the decimal fraction .75, leaving 4.',
          bn: 'নিনির টিপস: // পূর্ণসংখ্যার ভাগ করে দশমিক অংশ ফেলে দেয়। ১৯ কে ৪ দিয়ে ভাগ করলে পূর্ণসংখ্যা ৪।'
        },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p3-r2-e5',
        question: {
          en: 'What is the data type of the result of 10 / 2?',
          bn: '10 / 2 হিসাব করার পর ফলাফলটির টাইপ কী হবে?'
        },
        options: ['float', 'int', 'str', 'bool'],
        correctIndex: 0,
        explanation: {
          en: 'Single slash / in Python ALWAYS returns a float (5.0, not 5)!',
          bn: 'নিনি বলছে: সবসময় মনে রাখবে! পাইথনে একটি / দিয়ে ভাগ করলে ফলাফল সবসময় float (যেমন 5.0) হয়।'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p3-r2-e6',
        question: {
          en: 'Find the bug in this age announcement:',
          bn: 'এই কোডের কোন লাইনে ভুল আছে?'
        },
        code: 'age = 16\nmsg = "আমার বয়স " + age\nprint(msg)',
        buggyLine: 2,
        explanation: {
          en: 'Cannot concatenate str and int. Must use str(age) or f"আমার বয়স {age}".',
          bn: 'নিনির টিপস: পাইথনে স্ট্রিং এবং সংখ্যা সরাসরি + করা যায় না। ২ নম্বর লাইনে str(age) লিখতে হতো।'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p3-r2-e7',
        question: {
          en: 'Convert the decimal string "14.99" to a floating-point number:',
          bn: '"14.99" স্ট্রিংকে ফ্লোট সংখ্যায় রূপান্তর করতে ফাংশনটি লেখো:'
        },
        codeTemplate: 'price = ___("14.99")',
        blanks: ['float'],
        explanation: {
          en: 'float() converts strings containing decimal points into floating-point numbers.',
          bn: 'নিনি বলছে: সাবাশ! দশমিক সংখ্যায় রূপান্তর করার জন্য float() ব্যবহার করা হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p3-r2-e8',
        question: {
          en: 'What does type(True) return?',
          bn: 'type(True) এর আউটপুট কী হবে?'
        },
        code: 'print(type(True))',
        options: ["<class 'bool'>", "<class 'str'>", "<class 'int'>", "True"],
        correctIndex: 0,
        explanation: {
          en: 'True and False belong to the boolean data type: bool.',
          bn: 'নিনির টিপস: True এবং False হলো বুলিয়ান টাইপ (<class \'bool\'>)।'
        },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p3-r2-e9',
        question: {
          en: 'Calculate the total price for 3 plate biryani at 220 taka each:',
          bn: '২২০ টাকা করে ৩ প্লেট বিরিয়ানীর মোট দাম হিসাব করার কোডটি সাজাও:'
        },
        blocks: [
          'price_per_plate = 220',
          'plates = 3',
          'total = price_per_plate * plates',
          'print(f"মোট বিল: {total} টাকা")'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Define unit price and quantity, multiply them, then display with an f-string.',
          bn: 'নিনির টিপস: প্রথমে এক প্লেটের দাম ও প্লেট সংখ্যা নির্ধারণ করে গুণ করবে, তারপর প্রিন্ট করবে।'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p3-r2-e10',
        question: {
          en: 'What is the value of 10 - 2 * 3?',
          bn: '10 - 2 * 3 এর সঠিক মান কত?'
        },
        options: ['4', '24', '16', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'Operator precedence (BODMAS/PEMDAS): multiplication happens first! 2 * 3 = 6, then 10 - 6 = 4.',
          bn: 'নিনি বলছে: মনে রেখো, গুণের কাজ আগে হয়! ২ × ৩ = ৬, তারপর ১০ - ৬ = ৪।'
        },
        xpReward: 20
      }
    ]
  },
  {
    id: 'p3-exam',
    sectionId: 'p-unit3',
    order: 3,
    isProject: true,
    title: { en: 'Unit 3 Checkpoint: Memory Recall Exam', bn: 'ইউনিট ৩ চেকপয়েন্ট: মেমোরি রিকল পরীক্ষা' },
    description: {
      en: 'Prove your mastery of Units 1 & 2 before tackling conditions and decision making!',
      bn: 'পরের ধাপে যাওয়ার আগে ইউনিট ১ ও ২ এর যাবতীয় জ্ঞানের চূড়ান্ত পরীক্ষা দাও!'
    },
    difficulty: 'beginner',
    xpReward: 250,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Final Checkpoint Challenge', bn: 'চূড়ান্ত চেকপয়েন্ট চ্যালেঞ্জ' },
        body: {
          en: 'Nini says: "You are doing amazing! This checkpoint combines user input, mathematical calculations, type conversions, and formatted messages. Stay confident!"',
          bn: 'নিনি বলছে: "তুমি দারুণ করছো! এই চেকপয়েন্টে ইনপুট, হিসাব-নিকাশ, টাইপ কনভার্সন এবং মেসেজ ফরম্যাটিং সব একসাথে পরীক্ষা করা হবে। মাথা ঠান্ডা রেখে উত্তর দাও!"'
        }
      }
    ],
    exercises: [
      {
        type: 'bug_hunt',
        id: 'p3-exam-e1',
        question: {
          en: 'Fix the bKash fee calculation bug:',
          bn: 'বিকাশ ক্যাশআউট খরচের কোডটিতে কোন লাইনে বাগ আছে?'
        },
        code: 'amount = input("টাকার পরিমাণ: ")\nfee = amount * 0.0185\nprint(f"খরচ: {fee} টাকা")',
        buggyLine: 2,
        explanation: {
          en: 'amount is a string! You cannot multiply a string by a float 0.0185. Line 1 or 2 needs float(amount).',
          bn: 'নিনির টিপস: amount একটি স্ট্রিং! স্ট্রিং এর সাথে সরাসরি 0.0185 গুণ করা যায় না। int() বা float() করতে হবে।'
        },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'p3-exam-e2',
        question: {
          en: 'What will this string and number code print?',
          bn: 'নিচের কোডটির আউটপুট কী হবে?'
        },
        code: 'runs = "6"\nprint(runs * 3)',
        options: ['666', '18', '6 6 6', 'Error'],
        correctIndex: 0,
        explanation: {
          en: '"6" is in quotes, making it a string! "6" * 3 repeats the character 3 times: "666".',
          bn: 'নিনির টিপস: "6" উদ্ধৃতি চিহ্নের ভেতর থাকায় এটি স্ট্রিং! তাই ৩ দিয়ে গুণ করলে "666" হবে, ১৮ নয়!'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p3-exam-e3',
        question: {
          en: 'Convert the user input into an integer so we can calculate their birth year:',
          bn: 'ইউজারের বয়সকে ইন্টিজারে রূপান্তর করো যাতে জন্মসাল হিসাব করা যায়:'
        },
        codeTemplate: 'age = ___("20")\nbirth_year = 2026 - age',
        blanks: ['int'],
        explanation: {
          en: 'int("20") turns the text into the number 20, allowing subtraction.',
          bn: 'নিনি বলছে: সাবাশ! int() ফাংশন স্ট্রিংকে সংখ্যায় রূপান্তর করে বিয়োগ করার উপযোগী করে।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p3-exam-e4',
        question: {
          en: 'What is printed by this cricket over calculator?',
          bn: 'এই ক্রিকেট ওভার ক্যালকুলেটরের আউটপুট কী হবে?'
        },
        code: 'balls = 29\novers = balls // 6\nextra = balls % 6\nprint(f"{overs}.{extra}")',
        options: ['4.5', '4.83', '5.0', '29'],
        correctIndex: 0,
        explanation: {
          en: '29 // 6 is 4 complete overs, and 29 % 6 is 5 balls remaining. Result: "4.5" overs!',
          bn: 'নিনির টিপস: ২৯ বল মানে ৪ পূর্ণ ওভার (29 // 6 = 4) এবং ৫টি অতিরিক্ত বল (29 % 6 = 5)। তাই আউটপুট হবে 4.5!'
        },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'p3-exam-e5',
        question: {
          en: 'Which expression correctly calculates 2 to the 10th power (1024)?',
          bn: '২ এর পাওয়ার ১০ (১০২৪) হিসাব করতে কোন এক্সপ্রেশনটি সঠিক?'
        },
        options: ['2 ** 10', '2 ^ 10', '2 * 10', 'power(2, 10)'],
        correctIndex: 0,
        explanation: {
          en: 'In Python, ** is the power operator. ^ is bitwise XOR!',
          bn: 'নিনির টিপস: পাইথনে পাওয়ার এর জন্য ** ব্যবহার করতে হয়। ^ কিন্তু পাওয়ার নয়, ওটা বিটওয়াইজ এক্স-অর।'
        },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'p3-exam-e6',
        question: {
          en: 'Build a Dhaka rickshaw fare calculator (30 tk base fare + 15 tk per km):',
          bn: 'একটি রিকশা ভাড়া ক্যালকুলেটর কোড সাজাও (বেস ভাড়া ৩০ টাকা + প্রতি কিমি ১৫ টাকা):'
        },
        blocks: [
          'distance_km = 4',
          'base_fare = 30',
          'total = base_fare + (distance_km * 15)',
          'print(f"রিকশা ভাড়া: {total} টাকা")'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Initialize distance and base fare, compute total (30 + 60 = 90 tk), and print.',
          bn: 'নিনির টিপস: প্রথমে দূরত্ব ও বেস ভাড়া নির্ধারণ করো, মোট ভাড়া হিসাব করো (৩০ + ৪×১৫ = ৯০), তারপর প্রিন্ট করো।'
        },
        xpReward: 35
      },
      {
        type: 'bug_hunt',
        id: 'p3-exam-e7',
        question: {
          en: 'Find the syntax error in this variable assignment:',
          bn: 'নিচের ভেরিয়েবল অ্যাসাইনমেন্টের কোন লাইনে সিনট্যাক্স ভুল আছে?'
        },
        code: 'player_name = "Nini"\n1st_score = 100\nprint(player_name, 1st_score)',
        buggyLine: 2,
        explanation: {
          en: 'Variable names cannot start with a digit! 1st_score should be first_score or score_1.',
          bn: 'নিনির টিপস: ভেরিয়েবলের নাম ১ দিয়ে শুরু করা যায় না! ২ নম্বর লাইনে 1st_score ভুল।'
        },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'p3-exam-e8',
        question: {
          en: 'What is the output of this multi-type calculation?',
          bn: 'এই হিসাবটির চূড়ান্ত আউটপুট কী হবে?'
        },
        code: 'a = 10\nb = "2"\nprint(a + int(b) * 3)',
        options: ['16', '36', '10222', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'int("2") is 2. Multiplication takes precedence: 2 * 3 = 6. Then 10 + 6 = 16.',
          bn: 'নিনি বলছে: সাবাশ! int("2") হলো ২। ২ × ৩ = ৬। তারপর ১০ + ৬ = ১৬!'
        },
        xpReward: 30
      }
    ]
  }
];

