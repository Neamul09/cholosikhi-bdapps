import type { Lesson } from '../../schema';

// Unit 4: Hero's Quest — lessonIds: ['p4-if', 'p4-else', 'p4-exam']
export const unit4Lessons: Lesson[] = [
  {
    id: 'p4-if',
    sectionId: 'p-unit4',
    order: 1,
    title: { en: 'The Gatekeeper with Nini', bn: 'নিনির সাথে ফটক প্রহরী' },
    description: {
      en: 'Learn how computers make smart decisions using if statements and comparisons.',
      bn: 'if স্টেটমেন্ট ও তুলনা অপারেটর দিয়ে কম্পিউটারকে বুদ্ধিমান সিদ্ধান্ত নিতে শেখাও।'
    },
    difficulty: 'beginner',
    xpReward: 160,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Decision Time: The if Statement', bn: 'সিদ্ধান্ত নেওয়ার সময়: if স্টেটমেন্ট' },
        body: {
          en: 'Nini says: "Life is full of choices! In Python, when a condition is True, the indented code inside the if block springs to life!"',
          bn: 'নিনি বলছে: "আমাদের জীবনে যেমন পছন্দ থাকে, কোডিংয়েও তাই! পাইথনে if এর শর্ত True (সত্য) হলেই কেবল ভেতরের ইন্ডেন্টেড কোড রান করে!"'
        },
        code: {
          code: 'metro_balance = 50\nif metro_balance >= 20:\n    print("মেট্রোরেল গেট খুলে গেল! স্বাগতম!")',
          language: 'python',
          explanation: {
            en: 'If metro_balance is 20 or more, the gate opens!',
            bn: 'মেট্রো ব্যালেন্স ২০ বা তার বেশি হলেই গেট খোলার মেসেজ প্রিন্ট হবে!'
          }
        }
      },
      {
        heading: { en: 'Comparison Symbols Cheat Sheet', bn: 'তুলনা প্রতীকের চিট-শিট' },
        body: {
          en: 'Nini\'s Tip: Remember the golden rule: = is for assigning, but == is for comparing! Here are all comparison operators:\n• == (is equal to)\n• != (is not equal to)\n• > (greater than)\n• < (less than)\n• >= (greater than or equal to)\n• <= (less than or equal to)',
          bn: 'নিনির টিপস: সোনালী নিয়ম মনে রাখবে: একটি = মান জমা রাখে (assign), কিন্তু দুটি == মান তুলনা করে (compare)!\n• == (উভয় পাশ সমান কিনা)\n• != (সমান নয় কিনা)\n• > (বড় কিনা)\n• < (ছোট কিনা)\n• >= (বড় অথবা সমান)\n• <= (ছোট অথবা সমান)'
        },
        code: {
          code: 'hp = 100\nif hp == 100:\n    print("ফুল হেলথ! তুমি অপরাজেয়!")',
          language: 'python',
          explanation: {
            en: '== tests if hp is exactly 100.',
            bn: '== দিয়ে যাচাই করা হচ্ছে hp ঠিক ১০০ কিনা।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p4-if-e1',
        question: {
          en: 'Which operator checks if two values are equal in Python?',
          bn: 'পাইথনে দুটি মান সমান কিনা তা পরীক্ষা করতে কোন অপারেটর ব্যবহার করবে?'
        },
        options: ['==', '=', '===', 'equal'],
        correctIndex: 0,
        explanation: {
          en: '== checks equality! A single = is the assignment operator.',
          bn: 'নিনির টিপস: মনে রাখবে, সমতা তুলনা করতে ডাবল সমান (==) দিতে হয়। একটি সমান (=) কেবল ভেরিয়েবলে মান রাখে।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p4-if-e2',
        question: {
          en: 'What will be printed to the screen?',
          bn: 'নিচের কোডটি চালালে স্ক্রিনে কী প্রিন্ট হবে?'
        },
        code: 'score = 75\nif score >= 80:\n    print("স্টার মার্কস!")\nprint("খেলা শেষ!")',
        options: ['খেলা শেষ!', 'স্টার মার্কস!\nখেলা শেষ!', 'স্টার মার্কস!', 'কিছুই না'],
        correctIndex: 0,
        explanation: {
          en: '75 is not >= 80, so the if block is skipped! Only "খেলা শেষ!" outside the block runs.',
          bn: 'নিনির টিপস: ৭৫ সংখ্যাটি ৮০ এর চেয়ে বড় বা সমান নয়, তাই if ব্লক বাদ পড়েছে। শুধু শেষের "খেলা শেষ!" প্রিন্ট হয়েছে।'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p4-if-e3',
        question: {
          en: 'Check if the gamer\'s health is strictly greater than 0:',
          bn: 'গেমারের হেলথ (hp) শূন্যের চেয়ে বেশি কিনা তা পরীক্ষা করতে চিহ্নটি বসাও:'
        },
        codeTemplate: 'hp = 45\nif hp ___ 0:\n    print("প্লেয়ার এখনো বেঁচে আছে!")',
        blanks: ['>'],
        explanation: {
          en: '> checks if the left value is strictly greater than the right value.',
          bn: 'নিনি বলছে: সাবাশ! > চিহ্নটি নির্দেশ করে বামের মান ডানের চেয়ে বড় কিনা।'
        },
        xpReward: 15
      },
      {
        type: 'mcq',
        id: 'p4-if-e4',
        question: {
          en: 'What character MUST follow an if condition in Python?',
          bn: 'পাইথনে if শর্তের শেষে বাধ্যতামূলকভাবে কোন চিহ্নটি দিতে হয়?'
        },
        options: ['Colon (:)', 'Semicolon (;)', 'Curly brace ({)', 'Arrow (->)'],
        correctIndex: 0,
        explanation: {
          en: 'Python requires a colon (:) at the end of every if condition line.',
          bn: 'নিনির টিপস: if শর্ত লেখার পর সবসময় লাইনের শেষে কোলন (:) দিতে হবে, নইলে পাইথন সিনট্যাক্স এরর দেখাবে।'
        },
        xpReward: 15
      },
      {
        type: 'bug_hunt',
        id: 'p4-if-e5',
        question: {
          en: 'Find the indentation error in this safety check:',
          bn: 'এই কোডের কোন লাইনে ইন্ডেন্টেশন (ট্যাব/স্পেস) এর ভুল আছে?'
        },
        code: 'speed = 80\nif speed > 60:\nprint("গতি কমাও! জরিমানা হবে!")\nprint("নিরাপদে ড্রাইভ করো")',
        buggyLine: 3,
        explanation: {
          en: 'Line 3 must be indented (typically 4 spaces) to be inside the if block!',
          bn: 'নিনির টিপস: ৩ নম্বর লাইনটি if ব্লকের অংশ, তাই এটিকে অবশ্যই ইন্ডেন্ট (ডানে ৪টি স্পেস) করে লিখতে হবে।'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p4-if-e6',
        question: {
          en: 'Check if the user\'s entered password is NOT equal to "1234":',
          bn: 'ইউজারের দেওয়া পাসওয়ার্ড "1234" এর অসমান (not equal) কিনা তা পরীক্ষা করো:'
        },
        codeTemplate: 'pin = "9876"\nif pin ___ "1234":\n    print("পিন ভুল হয়েছে!")',
        blanks: ['!='],
        explanation: {
          en: '!= means "not equal to".',
          bn: 'নিনি বলছে: অসাধারণ! != মানে হলো "সমান নয়"।'
        },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p4-if-e7',
        question: {
          en: 'What is the output of this Metro pass check?',
          bn: 'মেট্রোপাসের এই কোডটির আউটপুট কী হবে?'
        },
        code: 'balance = 20\nif balance >= 20:\n    print("যাওয়ার অনুমতি আছে")\nif balance < 20:\n    print("রিচার্জ করো")',
        options: ['যাওয়ার অনুমতি আছে', 'রিচার্জ করো', 'দুটোই প্রিন্ট হবে', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'balance is 20, so 20 >= 20 is True! The second condition 20 < 20 is False.',
          bn: 'নিনির টিপস: balance হলো ২০, তাই ২০ >= ২০ সত্য (True)! ফলে প্রথম মেসেজটিই প্রিন্ট হবে।'
        },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p4-if-e8',
        question: {
          en: 'Arrange the code to check if cricket balls bowled is 6 to declare an over:',
          bn: '৬টি বল করা হলে ওভার শেষ ঘোষণা করার কোডটি ক্রমানুসারে সাজাও:'
        },
        blocks: [
          'balls = 6',
          'if balls == 6:',
          '    print("ওভার সমাপ্ত!")'
        ],
        correctOrder: [0, 1, 2],
        explanation: {
          en: 'Set balls = 6, check condition with ==, and indent the print.',
          bn: 'নিনির টিপস: প্রথমে বল সংখ্যা ভেরিয়েবলে রাখবে, তারপর if দিয়ে তুলনা করবে, আর ভেতরে প্রিন্ট করবে।'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p4-if-e9',
        question: {
          en: 'What happens if you write "if x = 5:" instead of "if x == 5:"?',
          bn: 'যদি তুমি "if x == 5:" এর বদলে ভুল করে "if x = 5:" লেখো, তবে কী ঘটবে?'
        },
        options: [
          'SyntaxError (সিনট্যাক্স এরর)',
          'কোডটি স্বাভাবিকভাবে চলবে',
          'x এর মান ৫ হয়ে প্রিন্ট হবে',
          'False আউটপুট আসবে'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Single = is variable assignment. You cannot assign a variable inside an if condition in this way, causing SyntaxError!',
          bn: 'নিনির টিপস: = দিয়ে ভ্যালু এসাইন করা হয়, শর্ত চেক করা যায় না। তাই পাইথন একটি SyntaxError ছুঁড়ে দেবে!'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p4-if-e10',
        question: {
          en: 'Find the missing colon syntax bug:',
          bn: 'এই কোডের কোন লাইনে কোলন (:) দিতে ভুলে গেছে?'
        },
        code: 'age = 21\nif age >= 18\n    print("তুমি ভোটার!")',
        buggyLine: 2,
        explanation: {
          en: 'Line 2 is missing the mandatory colon (:) at the end: if age >= 18:',
          bn: 'নিনির টিপস: ২ নম্বর লাইনে if age >= 18 এর শেষে কোলন (:) দেওয়া হয়নি!'
        },
        xpReward: 25
      }
    ]
  },
  {
    id: 'p4-else',
    sectionId: 'p-unit4',
    order: 2,
    title: { en: 'The Crossroads: elif & else', bn: 'নিনির সাথে দুটি পথ: elif ও else' },
    description: {
      en: 'Handle multiple outcomes smoothly with elif and default fallback with else.',
      bn: 'একাধিক বিকল্পের জন্য elif এবং কোনো শর্ত না মিললে ব্যাকআপ হিসেবে else ব্যবহার করো।'
    },
    difficulty: 'beginner',
    xpReward: 160,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'The Backup Plan: else', bn: 'ব্যাকআপ পরিকল্পনা: else' },
        body: {
          en: 'Nini says: "What if the if condition is False? That\'s where else comes to the rescue! It acts as your catch-all safety net."',
          bn: 'নিনি বলছে: "যদি if শর্ত মিথ্যা হয়, তবে কী হবে? তখনই আসে else! যদি কোনো শর্তই না মেলে, তখন পাইথন সোজা else এর ভেতরের কোড চালায়।"'
        },
        code: {
          code: 'rain = False\nif rain:\n    print("ছাতা নিয়ে বের হও!")\nelse:\n    print("রোদচশমা পরে বাইরে যাও!")',
          language: 'python',
          explanation: {
            en: 'Since rain is False, the else block runs automatically.',
            bn: 'যেহেতু rain মিথ্যা, তাই পাইথন সরাসরি else ব্লকটি রান করে।'
          }
        }
      },
      {
        heading: { en: 'Multiple Choices: elif (Else If)', bn: 'বহু বিকল্পের সমাধান: elif' },
        body: {
          en: 'Nini\'s Tip: When you have 3 or more options (like grades A, B, C or traffic lights Red, Yellow, Green), use elif! Python tests them in order from top to bottom and stops as soon as one matches.',
          bn: 'নিনির টিপস: যখন ৩ বা তার বেশি বিকল্প থাকে (যেমন পরীক্ষার গ্রেড বা ট্রাফিক লাইট), তখন elif ব্যবহার করবে। পাইথন ওপর থেকে নিচে একে একে দেখে এবং প্রথম যেটি মেলে সেটি রান করে থেমে যায়।'
        },
        code: {
          code: 'signal = "yellow"\nif signal == "red":\n    print("থামো!")\nelif signal == "yellow":\n    print("ধীরে চলো / প্রস্তুত হও!")\nelse:\n    print("সামনে এগিয়ে যাও!")',
          language: 'python',
          explanation: {
            en: 'Matches "yellow", prints the warning, and skips the rest!',
            bn: 'signal "yellow" মেলায় সতর্কবার্তা দিয়ে বাকি কোড স্কিপ করে।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'fill_blank',
        id: 'p4-else-e1',
        question: {
          en: 'Complete the else fallback when the condition is False:',
          bn: 'শর্ত মিথ্যা হলে ব্যাকআপ হিসেবে চালানোর কি-ওয়ার্ডটি লেখো:'
        },
        codeTemplate: 'score = 40\nif score >= 50:\n    print("পাস!")\n___:\n    print("আবার চেষ্টা করো!")',
        blanks: ['else'],
        explanation: {
          en: 'else runs when the if condition evaluates to False.',
          bn: 'নিনি বলছে: সাবাশ! if মিথ্যা হলে else ব্লকের কোড কাজ করে।'
        },
        xpReward: 15
      },
      {
        type: 'mcq',
        id: 'p4-else-e2',
        question: {
          en: 'How many else blocks can be attached to a single if statement?',
          bn: 'একটি if স্টেটমেন্টের সাথে সর্বোচ্চ কয়টি else ব্লক থাকতে পারে?'
        },
        options: ['Only 1', 'As many as you want', 'Up to 3', 'Zero'],
        correctIndex: 0,
        explanation: {
          en: 'An if can only have ONE else at the very end! Use elif for multiple intermediate branches.',
          bn: 'নিনির টিপস: একটি if চেইনে শুধুমাত্র একটিই else থাকতে পারে সবার শেষে। একাধিক বিকল্পের জন্য elif ব্যবহার করতে হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p4-else-e3',
        question: {
          en: 'What is the output of this temperature checker?',
          bn: 'এই তাপমাত্রা চেকারের আউটপুট কী হবে?'
        },
        code: 'temp = 32\nif temp > 35:\n    print("প্রচণ্ড গরম")\nelif temp >= 25:\n    print("আরামদায়ক আবহাওয়া")\nelse:\n    print("ঠাণ্ডা আবহাওয়া")',
        options: ['আরামদায়ক আবহাওয়া', 'প্রচণ্ড গরম', 'ঠাণ্ডা আবহাওয়া', 'Error'],
        correctIndex: 0,
        explanation: {
          en: '32 is not > 35, but 32 >= 25 is True! So the elif block runs.',
          bn: 'নিনির টিপস: ৩২ > ৩৫ মিথ্যা, কিন্তু ৩২ >= ২৫ সত্য! তাই elif ব্লকের "আরামদায়ক আবহাওয়া" প্রিন্ট হবে।'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p4-else-e4',
        question: {
          en: 'Find the bug in this elif statement:',
          bn: 'এই কোডের কোন লাইনে সিনট্যাক্স ভুল আছে?'
        },
        code: 'marks = 85\nif marks >= 80:\n    print("A+")\nelif:\n    print("Not A+")',
        buggyLine: 4,
        explanation: {
          en: 'elif MUST have a condition! Line 4 should either be "else:" or specify a condition like "elif marks < 80:".',
          bn: 'নিনির টিপস: ৪ নম্বর লাইনে elif এর সাথে কোনো শর্ত দেওয়া হয়নি! শর্ত ছাড়া ব্যাকআপ দিতে else: ব্যবহার করতে হয়।'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p4-else-e5',
        question: {
          en: 'Add the keyword for checking a second conditional branch:',
          bn: 'দ্বিতীয় আরেকটি শর্ত চেক করতে পাইথনের সঠিক কি-ওয়ার্ডটি লেখো:'
        },
        codeTemplate: 'if x > 0:\n    print("Positive")\n___ x < 0:\n    print("Negative")\nelse:\n    print("Zero")',
        blanks: ['elif'],
        explanation: {
          en: 'elif (short for else-if) lets you check additional conditions.',
          bn: 'নিনি বলছে: একদম ঠিক! মাঝের অতিরিক্ত শর্ত যাচাই করতে elif ব্যবহার করতে হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p4-else-e6',
        question: {
          en: 'What prints when the user has exactly 500 taka?',
          bn: 'ইউজারের কাছে ঠিক ৫০০ টাকা থাকলে নিচের কোনটি প্রিন্ট হবে?'
        },
        code: 'taka = 500\nif taka > 500:\n    print("কাচ্চি বিরিয়ানি")\nelif taka == 500:\n    print("মোরগ পোলাও")\nelse:\n    print("খিচুড়ি")',
        options: ['মোরগ পোলাও', 'কাচ্চি বিরিয়ানি', 'খিচুড়ি', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'taka > 500 is False (500 is not strictly greater than 500). But taka == 500 is True!',
          bn: 'নিনির টিপস: ৫০০ > ৫০০ মিথ্যা, কিন্তু ৫০০ == ৫০০ সত্য! তাই "মোরগ পোলাও" প্রিন্ট হবে।'
        },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p4-else-e7',
        question: {
          en: 'Arrange this GPA grading system code correctly:',
          bn: 'জিপিএ গ্রেডিং সিস্টেমের কোডটি ক্রমানুসারে সাজাও:'
        },
        blocks: [
          'gpa = 4.8',
          'if gpa == 5.0:',
          '    print("গোল্ডেন এ প্লাস!")',
          'elif gpa >= 4.0:',
          '    print("এ গ্রেড")',
          'else:',
          '    print("পাস")'
        ],
        correctOrder: [0, 1, 2, 3, 4, 5, 6],
        explanation: {
          en: 'Define gpa, check top grade first (5.0), then check 4.0+, and finish with else.',
          bn: 'নিনির টিপস: প্রথমে সর্বোচ্চ গ্রেড ৫.০ চেক করো, তারপর ৪.০ এর বেশি কিনা, সবশেষে বাকিদের জন্য else।'
        },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'p4-else-e8',
        question: {
          en: 'Why does the order of elif statements matter in Python?',
          bn: 'পাইথনে elif শর্তগুলোর ক্রম (অর্ডার) কেন অত্যন্ত গুরুত্বপূর্ণ?'
        },
        options: [
          'পাইথন প্রথম যে শর্তটি সত্য পায় সেটি রান করে বাকিগুলো বাদ দেয়',
          'পাইথন সবসময় নিচের elif আগে রান করে',
          'পাইথন সব elif একসাথে সমান্তরালে চালায়',
          'অর্ডারের কোনো গুরুত্ব নেই'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Python evaluates top to bottom and halts at the first matching True branch!',
          bn: 'নিনি বলছে: সাবাশ! পাইথন প্রথম যে শর্তটি সত্য পায় সেটি রান করে পুরো if-elif চেইন থেকে বের হয়ে যায়।'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p4-else-e9',
        question: {
          en: 'Find the misplaced else bug:',
          bn: 'এই কোডের কোন লাইনে else ভুল জায়গায় বসানো হয়েছে?'
        },
        code: 'num = 10\nelse:\n    print("Zero")\nif num > 0:\n    print("Positive")',
        buggyLine: 2,
        explanation: {
          en: 'An else cannot appear before an if! It must follow an if or elif.',
          bn: 'নিনির টিপস: if ছাড়া কখনো আগে else আসতে পারে না! ২ নম্বর লাইনে else ভুল।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p4-else-e10',
        question: {
          en: 'What is printed by this number sign checker?',
          bn: 'নিচের কোডটি চালালে কী আউটপুট আসবে?'
        },
        code: 'n = 0\nif n > 0:\n    print("পজিটিভ")\nelif n < 0:\n    print("নেগেটিভ")\nelse:\n    print("শূন্য")',
        options: ['শূন্য', 'পজিটিভ', 'নেগেটিভ', 'Error'],
        correctIndex: 0,
        explanation: {
          en: '0 is neither >0 nor <0, so the catch-all else branch executes!',
          bn: 'নিনির টিপস: ০ ধনাত্মকও নয় ঋণাত্মকও নয়, তাই শেষ ব্যাকআপ হিসেবে else ব্লকের "শূন্য" প্রিন্ট হবে।'
        },
        xpReward: 20
      }
    ]
  },
  {
    id: 'p4-exam',
    sectionId: 'p-unit4',
    order: 3,
    isProject: true,
    title: { en: 'Unit 4 Checkpoint: Hero\'s Quest Exam', bn: 'ইউনিট ৪ চেকপয়েন্ট: হিরো\'স কোয়েস্ট পরীক্ষা' },
    description: {
      en: 'Conquer real-world decision making scenarios with if, elif, else, and comparison operators!',
      bn: 'if, elif, else ও তুলনা অপারেটর দিয়ে বাস্তব সমস্যার বুদ্ধিমান সমাধান করো!'
    },
    difficulty: 'intermediate',
    xpReward: 250,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Boss Battle: Smart Decisions', bn: 'বস ব্যাটেল: বুদ্ধিমান সিদ্ধান্ত' },
        body: {
          en: 'Nini says: "You are ready for the Hero\'s Quest! Put on your thinking cap. Pay close attention to indentation, equality signs, and branch ordering!"',
          bn: 'নিনি বলছে: "তুমি হিরো\'স কোয়েস্টের জন্য প্রস্তুত! ইন্ডেন্টেশন, ডাবল সমান (==) এবং শর্তের ক্রম সতর্কতার সাথে খেয়াল করে পরীক্ষাটি দাও!"'
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p4-exam-e1',
        question: {
          en: 'What is printed when age is 15?',
          bn: 'age = 15 হলে নিচের কোডটি কী প্রিন্ট করবে?'
        },
        code: 'age = 15\nif age >= 18:\n    print("পূর্ণবয়স্ক")\nelif age >= 13:\n    print("কিশোর")\nelse:\n    print("শিশু")',
        options: ['কিশোর', 'পূর্ণবয়স্ক', 'শিশু', 'কিছুই না'],
        correctIndex: 0,
        explanation: {
          en: '15 is not >= 18, but 15 >= 13 is True. So "কিশোর" prints.',
          bn: 'নিনির টিপস: ১৫ সংখ্যাটি ১৮ এর চেয়ে ছোট কিন্তু ১৩ এর সমান বা বড়। তাই elif শর্তটি সত্য হয়ে "কিশোর" প্রিন্ট করবে।'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p4-exam-e2',
        question: {
          en: 'Complete the comparison to test if the player is NOT game over (lives not zero):',
          bn: 'প্লেয়ারের জীবন (lives) শূন্যের সমান নয় (not equal) কিনা তা লিখতে চিহ্নটি বসাও:'
        },
        codeTemplate: 'lives = 3\nif lives ___ 0:\n    print("খেলা এখনো চলছে!")',
        blanks: ['!='],
        explanation: {
          en: '!= checks inequality (lives != 0).',
          bn: 'নিনি বলছে: সাবাশ! != হলো অসমান (not equal) অপারেটর।'
        },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'p4-exam-e3',
        question: {
          en: 'Find the comparison bug in this VIP lounge entrance code:',
          bn: 'ভিআইপি লাউঞ্জ প্রবেশের এই কোডের কোন লাইনে ভুল আছে?'
        },
        code: 'is_vip = "yes"\nif is_vip = "yes":\n    print("স্বাগতম ভিআইপি লাউঞ্জে!")',
        buggyLine: 2,
        explanation: {
          en: 'Line 2 uses = (assignment) instead of == (equality comparison)!',
          bn: 'নিনির টিপস: ২ নম্বর লাইনে ডাবল সমান (==) এর জায়গায় ভুলে সিঙ্গেল সমান (=) দেওয়া হয়েছে!'
        },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'p4-exam-e4',
        question: {
          en: 'What will this nested decision code print?',
          bn: 'নিচের নেস্টেড কোডটির আউটপুট কী হবে?'
        },
        code: 'has_ticket = True\nbag_weight = 15\nif has_ticket:\n    if bag_weight <= 20:\n        print("বোর্ডিং পাস ইস্যু হয়েছে")\n    else:\n        print("অতিরিক্ত ওজনের জরিমানা")',
        options: ['বোর্ডিং পাস ইস্যু হয়েছে', 'অতিরিক্ত ওজনের জরিমানা', 'কিছুই না', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'has_ticket is True, and 15 <= 20 is also True! So the inner if executes.',
          bn: 'নিনির টিপস: টিকিট আছে (True) এবং ব্যাগের ওজন ১৫ কেজি ২০ এর কম। তাই ভেতরের if ব্লকের মেসেজটি প্রিন্ট হবে।'
        },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'p4-exam-e5',
        question: {
          en: 'Arrange the Metro Rail smart gate code from top to bottom:',
          bn: 'মেট্রোরেল স্মার্ট গেটের লজিক ক্রমানুসারে সাজাও:'
        },
        blocks: [
          'card_balance = 15',
          'if card_balance >= 20:',
          '    print("গেট উন্মুক্ত")',
          'else:',
          '    print("অপর্যাপ্ত ব্যালেন্স, রিচার্জ করুন")'
        ],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: {
          en: 'Set balance, check if balance >= 20, indent the open message, else indent the recharge prompt.',
          bn: 'নিনির টিপস: প্রথমে ব্যালেন্স সেট করো, তারপর ২০ টাকার বেশি কিনা চেক করো, অন্যথায় রিচার্জের মেসেজ দাও।'
        },
        xpReward: 35
      },
      {
        type: 'mcq',
        id: 'p4-exam-e6',
        question: {
          en: 'What is the boolean value of the expression (25 >= 25)?',
          bn: '(25 >= 25) এই এক্সপ্রেশনটির মান কী হবে?',
        },
        options: ['True', 'False', '25', 'Error'],
        correctIndex: 0,
        explanation: {
          en: '>= means "greater than OR equal to". Since 25 equals 25, it evaluates to True!',
          bn: 'নিনি বলছে: সাবাশ! >= মানে হলো বড় অথবা সমান। যেহেতু ২৫ এবং ২৫ সমান, তাই ফলাফল True।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p4-exam-e7',
        question: {
          en: 'What is printed when x = 50?',
          bn: 'x = 50 হলে নিচের কোডটি কী প্রিন্ট করবে?'
        },
        code: 'x = 50\nif x > 100:\n    print("১০০ এর বেশি")\nelif x > 40:\n    print("৪০ এর বেশি")\nelif x > 20:\n    print("২০ এর বেশি")',
        options: ['৪০ এর বেশি', '২০ এর বেশি', '৪০ এর বেশি\n২০ এর বেশি', '১০০ এর বেশি'],
        correctIndex: 0,
        explanation: {
          en: 'Even though 50 > 20 is also True, Python stops at the first matching branch (x > 40)!',
          bn: 'নিনির টিপস: ৫০ সংখ্যাটি ২০ এর চেয়েও বড় হওয়া সত্ত্বেও, পাইথন প্রথম ম্যাচ পাওয়া মাত্রই (x > 40) থেমে যায়!'
        },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'p4-exam-e8',
        question: {
          en: 'Find the indentation error in the else block:',
          bn: 'নিচের কোডের কোন লাইনে ভুলভাবে ইন্ডেন্টেশন করা হয়েছে?'
        },
        code: 'score = 45\nif score >= 50:\n    print("পাস")\nelse:\nprint("ফেল")',
        buggyLine: 5,
        explanation: {
          en: 'Line 5 must be indented inside the else block: "    print(\'ফেল\')".',
          bn: 'নিনির টিপস: ৫ নম্বর লাইনটি else ব্লকের ভেতরে থাকার জন্য ইন্ডেন্টেড (৪টি স্পেস ডানে) হতে হবে!'
        },
        xpReward: 30
      }
    ]
  }
];

