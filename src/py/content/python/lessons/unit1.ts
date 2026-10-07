import type { Lesson } from '../../schema';

// Unit 1: The Chatterbox Bot — lessonIds: ['p1-hello', 'p1-input', 'p1-vars', 'p1-exam']
// 10/10 Duolingo-style foundational Python with mascot Nini (নিনি) & Tumi voice
export const unit1Lessons: Lesson[] = [
  {
    id: 'p1-hello',
    sectionId: 'p-unit1',
    order: 1,
    title: { en: 'Hello World & print()', bn: 'প্রথম হ্যালো ও প্রিন্ট' },
    description: {
      en: 'Take your first step into Python coding with Nini and print().',
      bn: 'নিনির সাথে তোমার প্রথম পাইথন প্রোগ্রাম print() দিয়ে শুরু করো।'
    },
    difficulty: 'beginner',
    xpReward: 150,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Speaking to the Screen: print()', bn: 'স্ক্রিনে কথা বলা: print() ফাংশন' },
        body: {
          en: 'In Python, we use the `print()` function to show text on the screen. The text must be enclosed inside quotes like "this" or \'this\'. Mascot Nini is here to guide your very first code!',
          bn: 'পাইথনে স্ক্রিনে কোনো বার্তা বা টেক্সট দেখাতে আমরা `print()` ফাংশন ব্যবহার করি। টেক্সট সবসময় উদ্ধৃতি চিহ্নের (যেমন: "..." বা \'...\') ভেতর রাখতে হয়। নিনি তোমাকে শেখাবে কীভাবে সুন্দরভাবে স্ক্রিনে কথা বলতে হয়!'
        },
        code: {
          code: 'print("হ্যালো বাংলাদেশ!")\nprint("চলোশিখিতে তোমাকে স্বাগতম!")',
          language: 'python',
          explanation: {
            en: 'Displays both greeting messages line by line.',
            bn: 'স্ক্রিনে পর পর দুটি লাইন সুন্দরভাবে প্রদর্শিত হবে।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p1h-e1',
        question: {
          en: 'Which Python function is used to display text or output on the screen?',
          bn: 'পাইথনে স্ক্রিনে কোনো মেসেজ বা আউটপুট দেখাতে কোন ফাংশনটি ব্যবহার করবে?'
        },
        options: ['print()', 'output()', 'show()', 'display()'],
        correctIndex: 0,
        explanation: {
          en: 'print() is the standard built-in Python function for screen output.',
          bn: 'নিনির টিপস: পাইথনে আউটপুট দেখানোর স্ট্যান্ডার্ড এবং জাদুকরী ফাংশন হলো print()!'
        },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'p1h-e2',
        question: {
          en: 'Complete the code to print "চলোশিখি" on the screen:',
          bn: 'স্ক্রিনে "চলোশিখি" প্রিন্ট করতে কোডটি সম্পূর্ণ করো:'
        },
        codeTemplate: '___("চলোশিখি")',
        blanks: ['print'],
        explanation: {
          en: 'Always use lowercase print. Python is case-sensitive.',
          bn: 'নিনির টিপস: ফাংশন নেম সবসময় ছোট হাতের অক্ষরে print লিখতে হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p1h-e3',
        question: {
          en: 'What will be printed when this code runs?',
          bn: 'নিচের কোডটি রান করলে আউটপুট কী হবে?'
        },
        code: 'print("৩ + ২")',
        options: ['৩ + ২', '৫', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'Text inside quotation marks is treated as a literal string.',
          bn: 'কোটেশনের (" ") ভেতরের সবকিছু পাইথনে টেক্সট বা স্ট্রিং হিসেবে সরাসরি হুবহু প্রিন্ট হয়।'
        },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p1h-e4',
        question: {
          en: 'Arrange Nini\'s welcome lines in logical sequence:',
          bn: 'নিনির শুভেচ্ছা বার্তা প্রিন্ট করার সঠিক ক্রম সাজাও:'
        },
        blocks: [
          'print("হ্যালো শিক্ষার্থী!")',
          'print("আমি নিনি, তোমার কোডিং সঙ্গী।")',
          'print("চলো একসাথে পাইথন শিখি!")'
        ],
        correctOrder: [0, 1, 2],
        explanation: {
          en: 'Python executes code sequentially from top to bottom.',
          bn: 'পাইথনের লাইনগুলো উপর থেকে নিচে একের পর এক এক্সিকিউট হয়।'
        },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'p1h-e5',
        question: {
          en: 'Find the quote syntax error in this script:',
          bn: 'কোটেশন মার্কের সিনট্যাক্স ভুলটি ধরো:'
        },
        code: 'print("স্বাগতম বাংলাদেশ!")\nprint(হ্যালো)\nprint("কোডিং শুরু হোক!")',
        buggyLine: 2,
        explanation: {
          en: 'Line 2 is missing quotes around the text "হ্যালো".',
          bn: 'নিনির বাগ অ্যালার্ট: লাইন ২-এ "হ্যালো" টেক্সটকে উদ্ধৃতি চিহ্নে ("...") রাখা হয়নি!'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p1h-e6',
        question: {
          en: 'Add the opening and closing double quotes for the string:',
          bn: 'স্ট্রিং তৈরি করতে লেখার শুরুতে ও শেষে উদ্ধৃতি চিহ্ন সম্পূর্ণ করো:'
        },
        codeTemplate: 'print(___সোনার বাংলা___)',
        blanks: ['"', '"'],
        explanation: {
          en: 'Strings must be wrapped in matching opening and closing quotes.',
          bn: 'স্ট্রিং তৈরি করতে লেখার শুরুতে ও শেষে ডাবল কোটেশন বা সিঙ্গেল কোটেশন ব্যবহার করতে হয়।'
        },
        xpReward: 15
      },
      {
        type: 'mcq',
        id: 'p1h-e7',
        question: {
          en: 'What happens if you write Print("Hello") with a capital "P"?',
          bn: 'Print("হ্যালো") (বড় হাতের \'P\') লিখলে পাইথন কী করবে?'
        },
        options: [
          'NameError বা সিনট্যাক্স এরর দেবে কারণ পাইথন Case-Sensitive',
          'কোনো সমস্যা ছাড়া রান করবে',
          'কম্পিউটার অফ হয়ে যাবে',
          'স্ট্রিংটি উল্টো প্রিন্ট করবে'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Python is strictly case-sensitive: print and Print are completely different!',
          bn: 'নিনির টিপস: পাইথন ছোট ও বড় হাতের অক্ষর আলাদা হিসেবে চেনে (Case-Sensitive), তাই সবসময় ছোট হাতের print() লিখতে হবে!'
        },
        xpReward: 20
      }
    ]
  },
  {
    id: 'p1-input',
    sectionId: 'p-unit1',
    order: 2,
    title: { en: 'User Input & Dialog', bn: 'ইনপুট ও ব্যবহারকারীর সাথে আলাপ' },
    description: {
      en: 'Listen to users and collect dynamic input using input().',
      bn: 'ব্যবহারকারীর কাছ থেকে তথ্য সংগ্রহ করে ইন্টারেক্টিভ প্রোগ্রাম বানাও।'
    },
    difficulty: 'beginner',
    xpReward: 150,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Listening to Users: input()', bn: 'ব্যবহারকারীর কথা শোনা: input() ফাংশন' },
        body: {
          en: 'A great app doesn\'t just talk — it listens! In Python, `input()` pauses the program and waits for the user to type something on the keyboard. Nini shows you how to greet each person by their own name.',
          bn: 'কোনো রোবট বা অ্যাপ কেবল নিজে কথা বললে চলে না, মানুষের কথাও শুনতে হয়! পাইথনে ইউজারের কাছ থেকে কিবোর্ডে তথ্য নেওয়ার জন্য `input()` ফাংশন ব্যবহার করা হয়। নিনি দেখাবে কীভাবে ইউজার থেকে নাম নিয়ে তাকে ব্যক্তিগত অভিবাদন জানানো যায়।'
        },
        code: {
          code: 'name = input("তোমার নাম কী? ")\nprint("সালাম, " + name + "!")',
          language: 'python',
          explanation: {
            en: 'input() receives keyboard input and stores it inside the variable.',
            bn: 'input() কিবোর্ড থেকে ইনপুট নেয় এবং ভেরিয়েবলে জমা রাখে।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p1i-e1',
        question: {
          en: 'Which Python function reads keyboard input from the user?',
          bn: 'কিবোর্ড থেকে ব্যবহারকারীর লেখা বা ইনপুট নেওয়ার জন্য পাইথনের কোন ফাংশনটি ব্যবহৃত হয়?'
        },
        options: ['input()', 'get_text()', 'read()', 'scan()'],
        correctIndex: 0,
        explanation: {
          en: 'input() is the standard built-in function for capturing user input.',
          bn: 'নিনির টিপস: ব্যবহারকারীর ইনপুট গ্রহণ করার আদর্শ বিল্ট-ইন ফাংশন হলো input()!'
        },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'p1i-e2',
        question: {
          en: 'Capture the user\'s favorite sport into a variable:',
          bn: 'ব্যবহারকারীর প্রিয় খেলা জানতে ইনপুট নাও:'
        },
        codeTemplate: 'sport = ___("তোমার প্রিয় খেলা কী? ")',
        blanks: ['input'],
        explanation: {
          en: 'input("prompt") shows the prompt message and captures user response.',
          bn: 'input("প্রম্পট মেসেজ") দিয়ে ব্যবহারকারীর কাছ থেকে তথ্য সংগ্রহ করা হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p1i-e3',
        question: {
          en: 'What will this print when the user enters "তামিম"?',
          bn: 'ব্যবহারকারী যদি "তামিম" টাইপ করে, তাহলে আউটপুট কী হবে?'
        },
        code: 'user = "তামিম"\nprint("সালাম, " + user)',
        options: ['সালাম, তামিম', 'সালাম, user', 'সালামতামিম'],
        correctIndex: 0,
        explanation: {
          en: 'String concatenation joins "সালাম, " with the value "তামিম".',
          bn: 'স্ট্রিং কনক্যাটেনেশনে "সালাম, " এবং user এর মান "তামিম" জোড়া লেগে "সালাম, তামিম" তৈরি হয়।'
        },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p1i-e4',
        question: {
          en: 'Arrange the code to get a name and print a friendly greeting:',
          bn: 'ব্যবহারকারীর নাম নিয়ে শুভকামনা জানানোর কোড ক্রমানুসারে সাজাও:'
        },
        blocks: [
          'name = input("তোমার নাম লেখো: ")',
          'greeting = "শুভকামনা, " + name',
          'print(greeting)'
        ],
        correctOrder: [0, 1, 2],
        explanation: {
          en: 'Capture input first, construct greeting message, then print it.',
          bn: 'প্রথমে ইনপুট সংগ্রহ করো, তারপর মেসেজ তৈরি করো, এবং শেষে প্রিন্ট করো।'
        },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'p1i-e5',
        question: {
          en: 'Find the function spelling error in this script:',
          bn: 'ইনপুট ফাংশনের বানানের ভুলটি চিহ্নিত করো:'
        },
        code: 'print("চলোশিখি প্রোফাইল সেটআপ")\ncity = inpt("তোমার জেলা কোনটি? ")\nprint("তোমার শহর: " + city)',
        buggyLine: 2,
        explanation: {
          en: 'Line 2 has a typo: `inpt` instead of `input`.',
          bn: 'নিনির বাগ অ্যালার্ট: লাইন ২-এ input এর বানান ভুল করে inpt লেখা হয়েছে!'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p1i-e6',
        question: {
          en: 'Assign the user input to the variable using the assignment operator:',
          bn: 'ইনপুট নেওয়া মানটি ভেরিয়েবলে সংরক্ষণ করতে অ্যাসাইনমেন্ট অপারেটরটি বসাও:'
        },
        codeTemplate: 'user_color ___ input("পছন্দের রং: ")',
        blanks: ['='],
        explanation: {
          en: '= is the assignment operator that stores the right side into the left variable.',
          bn: 'মান এসাইন বা জমা রাখতে একক সমান চিহ্ন = ব্যবহার করা হয়।'
        },
        xpReward: 15
      },
      {
        type: 'mcq',
        id: 'p1i-e7',
        question: {
          en: 'What data type does input() ALWAYS return in Python?',
          bn: 'input() ফাংশন দিয়ে ব্যবহারকারী যাই লিখুক না কেন (যেমন: "100"), পাইথন সেটি কোন টাইপ হিসেবে গ্রহণ করে?'
        },
        options: [
          'সবসময় স্ট্রিং (str) হিসেবে',
          'সবসময় পূর্ণসংখ্যা (int) হিসেবে',
          'বুলিয়ান (bool) হিসেবে',
          'ফ্লোট (float) হিসেবে'
        ],
        correctIndex: 0,
        explanation: {
          en: 'input() always returns text (str). Convert with int() or float() if you need numbers.',
          bn: 'নিনির প্রো-টিপ: input() সবসময় টেক্সট বা স্ট্রিং হিসেবে মান ফেরত দেয়! সংখ্যায় রূপান্তর করতে পরে int() বা float() ব্যবহার করতে হয়।'
        },
        xpReward: 20
      }
    ]
  },
  {
    id: 'p1-vars',
    sectionId: 'p-unit1',
    order: 3,
    title: { en: 'Variables & Memory Boxes', bn: 'ভেরিয়েবল ও মেমোরি বক্স' },
    description: {
      en: 'Learn naming rules, values, and variable reassignment.',
      bn: 'ভেরিয়েবলের নাম দেওয়ার নিয়ম, মান পরিবর্তন ও ডাটা সংরক্ষণ।'
    },
    difficulty: 'beginner',
    xpReward: 150,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Boxes for Data: Variables', bn: 'তথ্য জমানোর পাত্র: ভেরিয়েবল (Variables)' },
        body: {
          en: 'Variables are like labeled storage containers in computer memory. You give the box a descriptive name, store a value inside using `=`, and retrieve it anytime. Nini will teach you Python naming conventions!',
          bn: 'প্রোগ্রামিংয়ে ভেরিয়েবল হলো লেবেল লাগানো একটি পাত্র বা বক্সের মতো। তুমি চাইলে এতে মান রাখতে পারো এবং পরবর্তীতে যখন খুশি ব্যবহার করতে পারো। নিনি শেখাবে কীভাবে সুন্দর ও অর্থপূর্ণ নামে ভেরিয়েবল তৈরি করতে হয়।'
        },
        code: {
          code: 'district = "সিলেট"\nscore = 95\nprint(district)\nprint(score)',
          language: 'python',
          explanation: {
            en: 'Stores text in district and a number in score, then prints both.',
            bn: 'district এ টেক্সট ও score এ সংখ্যা জমা রেখে প্রিন্ট করা হয়েছে।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p1v-e1',
        question: {
          en: 'Which of the following is a valid, recommended Python variable name (snake_case)?',
          bn: 'পাইথনে নিচের কোন ভেরিয়েবল নামটি সম্পূর্ণ সঠিক ও আদর্শ (Snake_case)?'
        },
        options: ['player_score', '2nd_player', 'player score', 'player-score'],
        correctIndex: 0,
        explanation: {
          en: 'Variable names cannot start with a digit or contain spaces/dashes. player_score is perfect.',
          bn: 'নিনির টিপস: ভেরিয়েবল কখনো সংখ্যা দিয়ে শুরু হতে পারে না এবং মাঝে স্পেস বা হাইফেন থাকা চলবে না। আন্ডারস্কোর _ ব্যবহার করা উত্তম।'
        },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'p1v-e2',
        question: {
          en: 'Assign the temperature 32 to the variable:',
          bn: 'ঢাকার তাপমাত্রা সংরক্ষণ করতে ভেরিয়েবল ডিক্লেয়ার করো:'
        },
        codeTemplate: 'temperature ___ 32\nprint(temperature)',
        blanks: ['='],
        explanation: {
          en: 'Use = to assign 32 into temperature.',
          bn: 'ভেরিয়েবলে মান নির্ধারণে = অপারেটর ব্যবহার করতে হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p1v-e3',
        question: {
          en: 'What will be printed as the final value of coins?',
          bn: 'নিচের কোডটি রান করলে সর্বশেষ কোন সংখ্যাটি প্রিন্ট হবে?'
        },
        code: 'coins = 10\ncoins = 25\ncoins = 50\nprint(coins)',
        options: ['50', '25', '10', '85'],
        correctIndex: 0,
        explanation: {
          en: 'Reassigning a variable replaces its old value with the newest one (50).',
          bn: 'ভেরিয়েবলের আগের মান নতুন মান দিয়ে রিপ্লেস (Reassign) হয়ে যায়। সর্বশেষ মান ৫০।'
        },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p1v-e4',
        question: {
          en: 'Arrange the tea stall billing calculation and printout:',
          bn: 'চায়ের দোকানের বিল হিসাব করার ভেরিয়েবল ও প্রিন্ট সাজাও:'
        },
        blocks: [
          'tea_price = 10',
          'cups = 3',
          'total_bill = tea_price * cups',
          'print("মোট বিল:", total_bill)'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Define unit price and quantity, multiply to calculate total, then print.',
          bn: 'দাম এবং কাপ সংখ্যা নির্ধারণ করে গুণ করো এবং মোট বিল প্রিন্ট করো।'
        },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'p1v-e5',
        question: {
          en: 'Find the invalid variable name starting with a number:',
          bn: 'অবৈধ ভেরিয়েবল নামের ভুলটি ধরো:'
        },
        code: 'user_name = "সাকিব"\n1st_place = "প্রথম"\nscore = 100',
        buggyLine: 2,
        explanation: {
          en: 'Line 2 starts with a number (1st_place), which is illegal in Python syntax.',
          bn: 'নিনির বাগ অ্যালার্ট: লাইন ২-এ ভেরিয়েবলের নাম সংখ্যা 1 দিয়ে শুরু করা হয়েছে, যা পাইথনে নিষিদ্ধ!'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p1v-e6',
        question: {
          en: 'Reassign xp by adding 10 to its existing value:',
          bn: 'ভেরিয়েবলের মান ১০ বৃদ্ধি করে রি-অ্যাসাইন করো:'
        },
        codeTemplate: 'xp = 100\nxp = xp ___ 10\nprint(xp)',
        blanks: ['+'],
        explanation: {
          en: 'xp = xp + 10 adds 10 to current xp (resulting in 110).',
          bn: 'পুরানো মানের সাথে ১০ যোগ করে নতুন মান সেট করতে + ব্যবহার করা হয়।'
        },
        xpReward: 15
      },
      {
        type: 'mcq',
        id: 'p1v-e7',
        question: {
          en: 'Which symbol begins a single-line comment in Python?',
          bn: 'পাইথনে কমেন্ট (মন্তব্য) লেখার জন্য লাইনের শুরুতে কোন প্রতীকটি ব্যবহার করা হয়?'
        },
        options: ['# (হ্যাশ চিহ্ন)', '// (ডাবল স্ল্যাশ)', '/* (স্ল্যাশ স্টার)', '-- (ডাবল ড্যাশ)'],
        correctIndex: 0,
        explanation: {
          en: 'The # symbol marks the rest of the line as a comment, ignored by Python.',
          bn: 'নিনির টিপস: পাইথনে একক লাইনের কমেন্ট লিখতে # ব্যবহার করা হয়, যা কোড পড়ার সুবিধার্থে লেখা হয় এবং পাইথন এটি এড়িয়ে চলে।'
        },
        xpReward: 20
      }
    ]
  },
  {
    id: 'p1-exam',
    sectionId: 'p-unit1',
    order: 4,
    title: { en: 'Unit 1 Grand Review', bn: 'ইউনিট ১ রিভিউর ঝড়' },
    description: {
      en: 'Combine print(), input(), and variables into your first mini chatterbox project.',
      bn: 'প্রিন্ট, ইনপুট ও ভেরিয়েবল একত্রিত করে তোমার প্রথম মিনি প্রজেক্ট সম্পন্ন করো।'
    },
    difficulty: 'beginner',
    xpReward: 250,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Unit 1 Milestone: The Chatterbox Bot', bn: 'ইউনিট ১ এর চূড়ান্ত মাইলফলক' },
        body: {
          en: 'Congratulations! You have mastered print(), input(), and variables. Now, let\'s bring all three together to build an interactive chatterbox bot. Nini is cheering you on!',
          bn: 'অভিনন্দন! তুমি প্রিন্ট, ইনপুট এবং ভেরিয়েবল—পাইথনের এই তিনটি মূলভিত্তি শিখে ফেলেছ। এখন এই তিনটিকে একসাথে জোড়া লাগিয়ে একটি ইন্টারেক্টিভ চ্যাটারবক্স বট তৈরি করার পালা। নিনি তোমার সাথে আছে!'
        },
        code: {
          code: 'print("--- চলোশিখি বট ---")\nhero = input("তোমার ডাকনাম: ")\nprint("হ্যালো " + hero + "! চলো কোডিং শুরু করি!")',
          language: 'python',
          explanation: {
            en: 'A complete interactive greeting program.',
            bn: 'একটি সম্পূর্ণ ইন্টারেক্টিভ শুভেচ্ছা জানানোর প্রোগ্রাম।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'p1x-e1',
        question: {
          en: 'What will this script output on the terminal?',
          bn: 'এই সম্পূর্ণ মিনি স্ক্রিপ্টটি রান করলে টার্মিনালে কী আউটপুট আসবে?'
        },
        code: 'name = "নিনি"\nrole = "মেন্টর"\nprint(name + " হলো তোমার " + role)',
        options: ['নিনি হলো তোমার মেন্টর', 'name হলো তোমার role', 'নিনিহলোতোমারমেন্টর'],
        correctIndex: 0,
        explanation: {
          en: 'Values replace variable names and strings are joined cleanly.',
          bn: 'স্ট্রিং ভেরিয়েবলগুলোর মান যুক্ত হয়ে একটি পূর্ণাঙ্গ বাক্য তৈরি করবে।'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p1x-e2',
        question: {
          en: 'Complete the chatterbox bot sequence using print and input:',
          bn: 'চ্যাটারবক্স বটের সম্পূর্ণ কোড সম্পূর্ণ করো:'
        },
        codeTemplate: '___("বট চালু হচ্ছে...")\nuser = ___("তোমার নাম? ")\nprint("স্বাগতম,", user)',
        blanks: ['print', 'input'],
        explanation: {
          en: 'print outputs the startup text, and input captures the user response.',
          bn: 'বার্তা দেখানোর জন্য print এবং ব্যবহারকারীর উত্তর নিতে input ব্যবহার করা হয়।'
        },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p1x-e3',
        question: {
          en: 'What is the fundamental difference between a variable and a string?',
          bn: 'ভেরিয়েবল এবং স্ট্রিংয়ের মধ্যে মূল পার্থক্য কী?'
        },
        options: [
          'ভেরিয়েবল হলো মান রাখার পাত্র (যেমন: x = 5), আর স্ট্রিং হলো কোটেশনের ভেতরের টেক্সট (যেমন: "ঢাকা")',
          'উভয়ই হুবহু এক জিনিস',
          'স্ট্রিং সংখ্যা দিয়ে শুরু হতে পারে না, ভেরিয়েবল পারে',
          'ভেরিয়েবল স্ক্রিনে প্রিন্ট করা যায় না'
        ],
        correctIndex: 0,
        explanation: {
          en: 'A variable is an identifier pointing to stored data; a string is a specific text data type.',
          bn: 'ভেরিয়েবল মেমোরিতে ডাটা ধারণ করে, আর স্ট্রিং হলো টেক্সট ডাটা টাইপ।'
        },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p1x-e4',
        question: {
          en: 'Arrange this interactive greeting card program in proper execution order:',
          bn: 'একটি সম্পূর্ণ ইন্টারেক্টিভ শুভেচ্ছা কার্ডের কোড ক্রমানুসারে সাজাও:'
        },
        blocks: [
          'print("=== চলোশিখি কার্ড ===")',
          'sender = "নিনি"',
          'receiver = input("কার জন্য কার্ড? ")',
          'print(f"{sender} এর পক্ষ থেকে {receiver} কে শুভেচ্ছা!")'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Print banner, set sender variable, capture recipient, and format final greeting.',
          bn: 'হেডার প্রিন্ট করো, প্রেরক ভেরিয়েবল সেট করো, প্রাপকের নাম ইনপুট নাও এবং শুভেচ্ছা প্রিন্ট করো।'
        },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'p1x-e5',
        question: {
          en: 'Find the missing closing parenthesis bug:',
          bn: 'প্রিন্ট ফাংশনের ক্লোজিং প্যারেন্থেসিসের ভুলটি ধরো:'
        },
        code: 'title = "পাইথন বিগিনার"\nprint(title\nprint("চালিয়ে যাও!")',
        buggyLine: 2,
        explanation: {
          en: 'Line 2 is missing the closing parenthesis: `print(title)`.',
          bn: 'নিনির বাগ অ্যালার্ট: লাইন ২-এ print(title এর শেষে সমাপনী বন্ধনী ) বাদ পড়েছে!'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p1x-e6',
        question: {
          en: 'Print the updated cricket score using the print function:',
          bn: 'ক্রিকেট খেলায় পরিবর্তিত রান স্ক্রিনে প্রদর্শন করো:'
        },
        codeTemplate: 'runs = 45\nruns = runs + 6\n___(f"নতুন রান: {runs}")',
        blanks: ['print'],
        explanation: {
          en: 'print() displays the formatted f-string with the updated score.',
          bn: 'print() ফাংশন দিয়ে পরিবর্তিত রান দেখানো হয়।'
        },
        xpReward: 15
      },
      {
        type: 'mcq',
        id: 'p1x-e7',
        question: {
          en: 'Congratulations! Completing Unit 1 qualifies you with which fundamental skills?',
          bn: 'সাবাশ! ইউনিট ১ সফলভাবে সম্পন্ন করার মাধ্যমে তুমি কোন দক্ষতাগুলো অর্জন করলে?'
        },
        options: [
          'স্ক্রিনে টেক্সট প্রিন্ট করা, কিবোর্ড থেকে ইনপুট নেওয়া এবং ভেরিয়েবলে ডাটা সংরক্ষণ ও প্রসেস করা',
          'শুধু কম্পিউটার অন করা',
          'সব কোড মুখস্থ করা',
          'ইন্টারনেট সংযোগ বন্ধ রাখা'
        ],
        correctIndex: 0,
        explanation: {
          en: 'You have mastered the foundational building blocks of programming with Nini!',
          bn: 'নিনি বলছে: অভিনন্দন! তুমি পাইথনের প্রথম স্তম্ভ জয় করে ফেলেছ। চলোশিখির সাথে ইউনিট ২ এর রোমাঞ্চকর দুনিয়ায় পা রাখা যাক!'
        },
        xpReward: 30
      }
    ]
  }
];
