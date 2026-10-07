import type { Lesson } from '../../schema';

export const unit2Lessons: Lesson[] = [
  {
    id: 'p2-math',
    sectionId: 'p-unit2',
    order: 1,
    title: { en: 'Magical Math with Nini', bn: 'নিনির জাদুকরী গণিত' },
    description: {
      en: 'Master arithmetic operators, bKash fee calculations, and cricket overs with Nini.',
      bn: 'নিনির সাথে যোগ, বিয়োগ, গুণ, ভাগ, বিকাশ ফি এবং ক্রিকেটের ওভার হিসাব শেখো।'
    },
    difficulty: 'beginner',
    xpReward: 150,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Basic Arithmetic Operators', bn: 'মৌলিক গাণিতিক অপারেটর' },
        body: {
          en: 'Nini says: "Python is your superfast pocket calculator! You can do +, -, *, and / effortlessly."',
          bn: 'নিনি বলছে: "পাইথন তোমার সুপারফাস্ট পকেট ক্যালকুলেটর! তুমি সহজেই +, -, *, এবং / ব্যবহার করে হিসাব করতে পারবে।"'
        },
        code: {
          code: 'apples = 12\neaten = 4\nremaining = apples - eaten\nprint(remaining)  # 8',
          language: 'python',
          explanation: {
            en: '12 - 4 calculates 8 and prints it.',
            bn: '১২ থেকে ৪ বিয়োগ করে পাইথন ৮ আউটপুট দেয়।'
          }
        }
      },
      {
        heading: { en: 'Integer Division (//) and Remainder (%)', bn: 'পূর্ণসংখ্যা ভাগ (//) ও ভাগশেষ (%)' },
        body: {
          en: 'Nini\'s Tip: Standard division (/) gives a float like 10 / 3 = 3.333. Use // to discard decimals (10 // 3 = 3) and % to get the remainder (10 % 3 = 1)!',
          bn: 'নিনির টিপস: সাধারণ ভাগ (/) সবসময় দশমিক দেয় (যেমন 10 / 3 = 3.333)। কিন্তু // দিলে শুধু পূর্ণসংখ্যা পাওয়া যায় (10 // 3 = 3), আর % দিলে ভাগশেষ পাওয়া যায় (10 % 3 = 1)!'
        },
        code: {
          code: 'balls = 17\novers = balls // 6       # 2 complete overs\nextra_balls = balls % 6   # 5 balls\nprint(overs, "overs and", extra_balls, "balls")',
          language: 'python',
          explanation: {
            en: 'Cricket over calculation: 17 balls = 2 overs and 5 balls!',
            bn: 'ক্রিকেটের হিসাব: ১৭টি বল মানে ২ ওভার ও ৫টি বল!'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p2m-e1',
        question: {
          en: 'Which operator gives you the remainder of a division?',
          bn: 'ভাগ করার পর ভাগশেষ বের করতে তুমি কোন অপারেটর ব্যবহার করবে?'
        },
        options: ['/', '//', '%', '**'],
        correctIndex: 2,
        explanation: {
          en: '% is the modulo operator! 10 % 3 equals 1.',
          bn: 'নিনি বলছে: সাবাশ! % হলো মডুলো (ভাগশেষ) অপারেটর। যেমন 10 % 3 = 1।'
        },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'p2m-e2',
        question: {
          en: 'Complete the code to calculate 4 squared (4 to the power 2):',
          bn: '৪ এর পাওয়ার ২ (৪ এর বর্গ) বের করতে কোডটি পূরণ করো:'
        },
        codeTemplate: 'result = 4 ___ 2',
        blanks: ['**'],
        explanation: {
          en: '** is the exponentiation (power) operator in Python.',
          bn: 'নিনির টিপস: পাইথনে পাওয়ার বা ঘাত বোঝাতে ডাবল স্টার (**) ব্যবহার করা হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p2m-e3',
        question: {
          en: 'What will this integer division output?',
          bn: 'নিচের ইন্টিজার ডিভিশনটি রান করলে কী আউটপুট আসবে?'
        },
        code: 'fuchka = 25\nfriends = 4\nprint(fuchka // friends)',
        options: ['6', '6.25', '1', 'Error'],
        correctIndex: 0,
        explanation: {
          en: '25 // 4 drops the fractional part .25 and leaves the whole integer 6!',
          bn: 'নিনির টিপস: // পূর্ণসংখ্যায় ভাগ করে দশমিকের অংশ ফেলে দেয়। তাই ২৫ // ৪ = ৬!'
        },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p2m-e4',
        question: {
          en: 'How many extra fuchkas are left over for Nini?',
          bn: 'বন্ধুদের মাঝে সমান ভাগে দেওয়ার পর নিনির জন্য কয়টি ফুচকা বাকি থাকবে?'
        },
        code: 'fuchka = 25\nfriends = 4\nprint(fuchka % friends)',
        options: ['1', '6', '0', '4'],
        correctIndex: 0,
        explanation: {
          en: '25 divided by 4 leaves a remainder of 1 (4 * 6 + 1 = 25).',
          bn: 'নিনি বলছে: ৪ × ৬ = ২৪, তাই আর ১টি ফুচকা অবশিষ্ট থাকবে (২৫ % ৪ = ১)!'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p2m-e5',
        question: {
          en: 'Calculate a 1.85% bKash cash-out fee on 1000 Taka:',
          bn: '১০০০ টাকার উপর ১.৮৫% বিকাশ ক্যাশ-আউট ফি হিসাব করতে পূরণ করো:'
        },
        codeTemplate: 'cash = 1000\nfee = cash ___ 0.0185\nprint(fee)',
        blanks: ['*'],
        explanation: {
          en: 'Multiply by the rate: 1000 * 0.0185 = 18.5 Taka.',
          bn: 'নিনির টিপস: শতকরা বের করতে গুণ (*) অপারেটর ব্যবহার করো: ১০০০ * ০.০১৮৫ = ১৮.৫ টাকা।'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p2m-e6',
        question: {
          en: 'Find the dangerous math bug:',
          bn: 'নিচের কোডে কোন লাইনে বিপজ্জনক গাণিতিক ভুল আছে?'
        },
        code: 'total_score = 150\nwickets_left = 0\naverage = total_score / wickets_left\nprint(average)',
        buggyLine: 3,
        explanation: {
          en: 'Line 3 tries to divide by 0! In Python and math, division by zero crashes with ZeroDivisionError.',
          bn: 'নিনি বলছে: ৩ নম্বর লাইনে শূন্য (০) দিয়ে ভাগ করা হয়েছে! গণিতে শূন্য দিয়ে ভাগ করা অসম্ভব, পাইথনে এটা ZeroDivisionError দেয়।'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p2m-e7',
        question: {
          en: 'What does 2 + 3 * 4 evaluate to according to PEMDAS rules?',
          bn: 'অপারেশনের নিয়ম (PEMDAS) অনুযায়ী 2 + 3 * 4 এর মান কত হবে?'
        },
        options: ['14', '20', '24', '18'],
        correctIndex: 0,
        explanation: {
          en: 'Multiplication (3 * 4 = 12) takes precedence over addition (2 + 12 = 14)!',
          bn: 'নিনির টিপস: যোগের চেয়ে গুণের পাওয়ার বেশি! আগে ৩ * ৪ = ১২ হবে, তারপর ২ যোগ হয়ে ১৪ হবে।'
        },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p2m-e8',
        question: {
          en: 'Arrange the code to calculate batting strike rate (Runs / Balls * 100):',
          bn: 'ব্যাটিং স্ট্রাইক রেট (রান / বল * ১০০) হিসাব করার কোড সাজাও:'
        },
        blocks: [
          'runs = 75',
          'balls = 50',
          'strike_rate = (runs / balls) * 100',
          'print("Strike Rate:", strike_rate)'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Define runs and balls first, calculate the rate, then print the result.',
          bn: 'আগে রান ও বলের মান নির্ধারণ করো, তারপর ফর্মুলা দিয়ে হিসাব করো এবং শেষে প্রিন্ট করো।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p2m-e9',
        question: {
          en: 'What will print when using parentheses (2 + 3) * 4?',
          bn: 'বন্ধনী ব্যবহার করায় (2 + 3) * 4 এর আউটপুট কী হবে?'
        },
        code: 'print((2 + 3) * 4)',
        options: ['20', '14', '24', '10'],
        correctIndex: 0,
        explanation: {
          en: 'Parentheses force addition first: 2 + 3 = 5, then 5 * 4 = 20!',
          bn: 'নিনির টিপস: ব্র্যাকেটের ভেতরের কাজ সবার আগে হয়! আগে ২ + ৩ = ৫, তারপর ৫ * ৪ = ২০।'
        },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p2m-e10',
        question: {
          en: 'What is the result type of standard division 10 / 2 in Python 3?',
          bn: 'পাইথনে সাধারণ ভাগ 10 / 2 করলে আউটপুটের ডাটা টাইপ কী হয়?'
        },
        options: ['float (5.0)', 'int (5)', 'str ("5")', 'None'],
        correctIndex: 0,
        explanation: {
          en: 'Single slash (/) always returns a float (e.g. 5.0), even if it divides evenly!',
          bn: 'নিনি বলছে: মনে রেখো! সাধারণ ভাগ (/) নিঃশেষে বিভাজ্য হলেও সবসময় দশমিক (float 5.0) আউটপুট দেয়।'
        },
        xpReward: 20
      }
    ]
  },
  {
    id: 'p2-types',
    sectionId: 'p-unit2',
    order: 2,
    title: { en: 'Data Shapes & Types with Nini', bn: 'নিনির সাথে ডাটার ধরন' },
    description: {
      en: 'Explore int, float, str, bool, and type conversions.',
      bn: 'ইনটিজার, ফ্লোট, স্ট্রিং, বুলিয়ান এবং টাইপ কনভার্সন আয়ত্ত করো।'
    },
    difficulty: 'beginner',
    xpReward: 150,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Python\'s Core 4 Data Types', bn: 'পাইথনের ৪টি মূল ডাটা টাইপ' },
        body: {
          en: 'Nini explains: "Everything in Python has a type! int for whole numbers, float for decimals, str for quotes text, and bool for True/False."',
          bn: 'নিনির ব্যাখ্যা: "পাইথনে প্রতিটি তথ্যের একটি ধরন আছে! int হলো পূর্ণসংখ্যা, float হলো দশমিক, str হলো কোটেশনে লেখা টেক্সট, আর bool হলো সত্য (True) বা মিথ্যা (False)।"'
        },
        code: {
          code: 'age = 18          # int\nheight = 5.9      # float\nname = "Tamim"    # str\nis_student = True # bool\nprint(type(name)) # <class \'str\'>',
          language: 'python',
          explanation: {
            en: 'type() inspects the data type of any variable.',
            bn: 'type() ফাংশন দিয়ে যেকোনো ভেরিয়েবলের আসল টাইপ জানা যায়।'
          }
        }
      },
      {
        heading: { en: 'Type Conversion (Casting)', bn: 'টাইপ পরিবর্তন (কাস্টিং)' },
        body: {
          en: 'When input() reads text like "25", you must convert it with int() to do math: int("25") + 5 = 30.',
          bn: 'নিনির টিপস: input() থেকে যা কিছু পাই তা টেক্সট ("25") হিসেবে আসে। তার সাথে যোগ-বিয়োগ করতে int() দিয়ে রূপান্তর করে নিতে হয়: int("25") + 5 = 30।'
        },
        code: {
          code: 'text_num = "50"\nreal_num = int(text_num)\nprint(real_num + 10)  # 60',
          language: 'python',
          explanation: {
            en: 'int("50") turns string "50" into numeric 50.',
            bn: 'int("50") স্ট্রিং থেকে পূর্ণসংখ্যা ৫০ বানিয়ে দেয়।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p2t-e1',
        question: {
          en: 'What data type is the value 99.5 in Python?',
          bn: 'পাইথনে 99.5 কোন ধরনের ডাটা টাইপ?'
        },
        options: ['float', 'int', 'str', 'bool'],
        correctIndex: 0,
        explanation: {
          en: 'Any number with a decimal point is a float!',
          bn: 'নিনি বলছে: সাবাশ! দশমিক যুক্ত যেকোনো সংখ্যাকে পাইথনে float বলা হয়।'
        },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'p2t-e2',
        question: {
          en: 'Convert the string "100" into a real integer:',
          bn: '"100" টেক্সটকে পূর্ণসংখ্যায় রূপান্তর করতে শূন্যস্থান পূরণ করো:'
        },
        codeTemplate: 'score = ___("100")',
        blanks: ['int'],
        explanation: {
          en: 'int() converts text digits into actual numbers.',
          bn: 'নিনির টিপস: int() ফাংশন টেক্সটকে পূর্ণসংখ্যা বানিয়ে দেয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p2t-e3',
        question: {
          en: 'Watch out for string multiplication! What prints here?',
          bn: 'একটু খেয়াল করো! নিচের কোডটি রান করলে কী প্রিন্ট হবে?'
        },
        code: 'cheer = "Go!"\nprint(cheer * 3)',
        options: ['Go!Go!Go!', 'Go! 3', 'Error', 'Go!Go!'],
        correctIndex: 0,
        explanation: {
          en: 'Multiplying a string by an integer repeats the text 3 times!',
          bn: 'নিনি বলছে: ম্যাজিক দেখো! কোনো টেক্সটকে int দিয়ে গুণ করলে সেটি ততবার রিপিট হয়: "Go!Go!Go!"'
        },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p2t-e4',
        question: {
          en: 'What happens when you add two string numbers?',
          bn: 'দুটি স্ট্রিং সংখ্যা যোগ (+) করলে কী ঘটবে?'
        },
        code: 'a = "10"\nb = "20"\nprint(a + b)',
        options: ['"1020"', '30', 'Error', '"30"'],
        correctIndex: 0,
        explanation: {
          en: 'Strings are joined together (concatenated), not mathematically added!',
          bn: 'নিনির টিপস: উদ্ধৃতি (" ") থাকলে পাইথন সংখ্যা যোগ করে না, দুটি লেখাকে পাশাপাশি জোড়া লাগিয়ে দেয় ("1020")!'
        },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p2t-e5',
        question: {
          en: 'Which of the following is a valid Boolean value in Python?',
          bn: 'নিচের কোনটি পাইথনে সঠিক বুলিয়ান (Boolean) মান?'
        },
        options: ['True', 'true', '"True"', 'TRUE'],
        correctIndex: 0,
        explanation: {
          en: 'Python requires capitalized True and False with no quotes!',
          bn: 'নিনি বলছে: মনে রেখো! পাইথনে বুলিয়ান ভ্যালু লিখতে T ও F বড় হাতের হতে হয় এবং কোনো কোটেশন থাকবে না (True, False)।'
        },
        xpReward: 15
      },
      {
        type: 'bug_hunt',
        id: 'p2t-e6',
        question: {
          en: 'Find the line causing a TypeError:',
          bn: 'কোন লাইনে TypeError সৃষ্টি হচ্ছে তা খুঁজে বের করো:'
        },
        code: 'player = "Sakib"\nruns = 85\nmessage = player + " scored " + runs\nprint(message)',
        buggyLine: 3,
        explanation: {
          en: 'You cannot concatenate string with int directly! Line 3 needs str(runs).',
          bn: 'নিনি বলছে: ৩ নম্বর লাইনে ভুল! লেখার সাথে সংখ্যা সরাসরি জোড়া দেওয়া যায় না। str(runs) দিয়ে রূপান্তর করতে হবে।'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p2t-e7',
        question: {
          en: 'Convert the integer 45 into string text:',
          bn: '৪৫ সংখ্যাটিকে টেক্সট বা স্ট্রিংয়ে রূপান্তর করো:'
        },
        codeTemplate: 'text_age = ___ (45)',
        blanks: ['str'],
        explanation: {
          en: 'str(45) turns 45 into "45".',
          bn: 'নিনির টিপস: str() ফাংশন যেকোনো কিছুকে স্ট্রিং বানিয়ে ফেলে।'
        },
        xpReward: 15
      },
      {
        type: 'code_arrange',
        id: 'p2t-e8',
        question: {
          en: 'Arrange code to take a user number and double it:',
          bn: 'ব্যবহারকারীর কাছ থেকে সংখ্যা নিয়ে তাকে দ্বিগুণ করার কোড সাজাও:'
        },
        blocks: [
          'user_input = input("Enter a number: ")',
          'num = int(user_input)',
          'doubled = num * 2',
          'print("Double is:", doubled)'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Take input (str) → convert with int() → multiply → print!',
          bn: 'প্রথমে ইনপুট নাও → int দিয়ে সংখ্যায় রূপান্তর করো → দ্বিগুণ করো → প্রিন্ট করো!'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p2t-e9',
        question: {
          en: 'What will type(True) print?',
          bn: 'type(True) চালালে কী আউটপুট আসবে?'
        },
        code: 'print(type(True))',
        options: ["<class 'bool'>", "<class 'str'>", "<class 'boolean'>", "True"],
        correctIndex: 0,
        explanation: {
          en: 'Python names the boolean type \'bool\'.',
          bn: 'পাইথনে বুলিয়ান টাইপকে \'bool\' বলা হয়।'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p2t-e10',
        question: {
          en: 'Convert string "7.5" into a decimal float:',
          bn: '"7.5" টেক্সটকে দশমিক সংখ্যায় রূপান্তর করতে পূরণ করো:'
        },
        codeTemplate: 'rating = ___("7.5")',
        blanks: ['float'],
        explanation: {
          en: 'float() converts strings with decimals into float numbers.',
          bn: 'নিনির টিপস: দশমিকের টেক্সটকে সংখ্যা বানাতে float() ব্যবহার করতে হয়।'
        },
        xpReward: 20
      }
    ]
  },
  {
    id: 'p2-exam',
    sectionId: 'p-unit2',
    order: 3,
    isProject: true,
    title: { en: 'Unit 2 Boss Challenge: Genie Calculator', bn: 'ইউনিট ২ বস চ্যালেঞ্জ: জিনি ক্যালকুলেটর' },
    description: {
      en: 'Show Nini you have conquered operators, types, and logic!',
      bn: 'নিনিকে দেখিয়ে দাও তুমি অপারেটর ও টাইপের জাদুকর!'
    },
    difficulty: 'beginner',
    xpReward: 300,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Boss Challenge Time!', bn: 'বস চ্যালেঞ্জের সময়!' },
        body: {
          en: 'Nini cheers: "You have trained hard on operators and data shapes! Now beat this checkpoint to claim your badge!"',
          bn: 'নিনি উৎসাহ দিচ্ছে: "তুমি অপারেটর আর ডাটা টাইপ খুব ভালোভাবে শিখেছো! এবার এই বস চ্যালেঞ্জ পার করে তোমার ব্যাজ জিতে নাও!"'
        }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'p2x-e1',
        question: {
          en: 'What is 19 % 4 (19 mod 4)?',
          bn: '19 % 4 এর মান কত হবে?'
        },
        code: 'print(19 % 4)',
        options: ['3', '4', '1', '4.75'],
        correctIndex: 0,
        explanation: {
          en: '4 * 4 = 16, so remainder 19 - 16 = 3!',
          bn: 'নিনি বলছে: ৪ × ৪ = ১৬, আর ১৯ থেকে ১৬ বাদ দিলে থাকে ৩!'
        },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'p2x-e2',
        question: {
          en: 'What will print here?',
          bn: 'নিচের কোডটি চালালে কী দেখতে পাবে?'
        },
        code: 'x = 3 ** 2 + 1\nprint(x)',
        options: ['10', '7', '9', '12'],
        correctIndex: 0,
        explanation: {
          en: '3 ** 2 is 9, plus 1 is 10!',
          bn: 'নিনির টিপস: ৩ এর পাওয়ার ২ হলো ৯, তার সাথে ১ যোগ করলে ১০ হয়।'
        },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'p2x-e3',
        question: {
          en: 'Find the bug in this bill splitting program:',
          bn: 'বিল ভাগ করার প্রোগ্রামে কোন লাইনে ভুল আছে?'
        },
        code: 'bill = input("Enter bill: ")\npeople = 3\nper_person = bill / people\nprint(per_person)',
        buggyLine: 3,
        explanation: {
          en: 'bill is a string from input()! You cannot divide a string by 3. Convert with int(bill) or float(bill).',
          bn: 'নিনি বলছে: ৩ নম্বর লাইনে ভুল! input() থেকে bill এসেছে লেখা হিসেবে, তাকে ৩ দিয়ে ভাগ করা যায় না। int(bill) বা float(bill) করতে হতো।'
        },
        xpReward: 40
      },
      {
        type: 'fill_blank',
        id: 'p2x-e4',
        question: {
          en: 'Calculate remaining money after buying books: 500 minus (3 books at 120 Taka each):',
          bn: '৫০০ টাকা থেকে ৩টি ১২০ টাকার বই কেনার পর অবশিষ্ট টাকা বের করতে পূরণ করো:'
        },
        codeTemplate: 'cash = 500\nremaining = cash - (3 ___ 120)\nprint(remaining)',
        blanks: ['*'],
        explanation: {
          en: 'Multiply 3 * 120 to get 360, then 500 - 360 = 140.',
          bn: 'নিনির টিপস: ৩টি বইয়ের মোট দাম ৩ * ১২০ = ৩৬০ টাকা। ৫০০ - ৩৬০ = ১৪০ টাকা।'
        },
        xpReward: 35
      },
      {
        type: 'code_arrange',
        id: 'p2x-e5',
        question: {
          en: 'Build an automated bKash Cash-Out Calculator:',
          bn: 'একটি স্বয়ংক্রিয় বিকাশ ক্যাশআউট ক্যালকুলেটর সাজাও:'
        },
        blocks: [
          'amount = 2000',
          'fee_rate = 0.0185',
          'total_fee = amount * fee_rate',
          'print("Total fee is:", total_fee)'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Amount → Fee Rate → Multiply → Output fee!',
          bn: 'টাকার পরিমাণ → ফি এর শতকরা হার → গুণ করে মোট ফি → ফলাফল প্রিন্ট!'
        },
        xpReward: 45
      },
      {
        type: 'output_predict',
        id: 'p2x-e6',
        question: {
          en: 'What is the output of this mixed math?',
          bn: 'এই মিশ্র গণিতের আউটপুট কী আসবে?'
        },
        code: 'a = "7"\nprint(int(a) * 2 + 1)',
        options: ['15', '"771"', '"141"', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'int("7") is 7. 7 * 2 is 14. 14 + 1 is 15!',
          bn: 'নিনি বলছে: int("7") হলো ৭। ৭ * ২ = ১৪, আর ১৪ + ১ = ১৫!'
        },
        xpReward: 35
      },
      {
        type: 'mcq',
        id: 'p2x-e7',
        question: {
          en: 'Which expression checks if number `n` is even?',
          bn: 'কোন এক্সপ্রেশন দিয়ে বোঝা যায় কোনো সংখ্যা `n` জোড় সংখ্যা?'
        },
        options: ['n % 2 == 0', 'n // 2 == 0', 'n / 2 == 0', 'n ** 2 == 0'],
        correctIndex: 0,
        explanation: {
          en: 'If a number divided by 2 has remainder 0 (n % 2 == 0), it is an even number!',
          bn: 'নিনির টিপস: যেকোনো সংখ্যাকে ২ দিয়ে ভাগ করলে যদি ভাগশেষ ০ হয় (n % 2 == 0), তবে সংখ্যাটি জোড়!'
        },
        xpReward: 35
      },
      {
        type: 'output_predict',
        id: 'p2x-e8',
        question: {
          en: 'Final Boss Question: What prints here?',
          bn: 'বস চ্যালেঞ্জের শেষ প্রশ্ন: এখানে কী প্রিন্ট হবে?'
        },
        code: 'x = 10\ny = 3\nprint(x // y, x % y)',
        options: ['3 1', '3.33 1', '3 0', '1 3'],
        correctIndex: 0,
        explanation: {
          en: '10 // 3 is 3, and 10 % 3 is 1. Output is "3 1"!',
          bn: 'নিনি বলছে: সাবাশ! ১০ // ৩ হলো ৩, আর ১০ % ৩ হলো ১। আউটপুট হবে 3 1!'
        },
        xpReward: 50
      }
    ]
  }
];
