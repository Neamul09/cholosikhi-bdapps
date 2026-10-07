import type { Lesson } from '../../schema';

// Unit 10: The Grand Showcase — lessonIds: ['p10-start', 'p10-logic', 'p10-ui', 'p10-finish']
// 10/10 Duolingo-style terminal RPG / Adventure Quiz Game project with mascot Nini (নিনি)
export const unit10Lessons: Lesson[] = [
  {
    id: 'p10-start',
    sectionId: 'p-unit10',
    order: 1,
    title: { en: 'Project Setup & Data', bn: 'প্রজেক্ট সেটআপ ও ডাটা মডেলিং' },
    description: {
      en: 'Set up your terminal adventure and player data structures with Nini.',
      bn: 'নিনির সাথে তোমার ফাইনাল টার্মিনাল অ্যাডভেঞ্চারের ব্লুপ্রিন্ট ও প্লেয়ার ডাটা তৈরি করো।'
    },
    difficulty: 'advanced',
    xpReward: 250,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'The Grand Quest: Project Architecture', bn: 'অভিযান শুরু: ডাটার আর্কিটেকচার' },
        body: {
          en: 'Welcome to your capstone project! You will build "CholoSikhi Quest" — an interactive terminal game. We organize our game by modeling player state (name, HP, score, inventory) using a dictionary, and challenge stages using a list of dictionaries. Nini will guide you through every milestone!',
          bn: 'চলোশিখির ফাইনাল ক্যাপস্টোন প্রজেক্টে তোমাকে স্বাগতম! এখানে তুমি তৈরি করবে "চলোশিখি কোয়েস্ট" — একটি চমৎকার ইন্টারেক্টিভ টার্মিনাল অ্যাডভেঞ্চার গেম। গেমে প্লেয়ারের অবস্থা (নাম, HP, স্কোর, ইনভেন্টরি) ডিকশনারি দিয়ে এবং চ্যালেঞ্জের তালিকা লিস্ট অব ডিকশনারি দিয়ে সাজানো হয়। প্রতিটি ধাপে নিনি থাকবে তোমার গাইড!'
        },
        code: {
          code: '# নিনির সাথে প্রজেক্ট আর্কিটেকচার\nplayer = {\n    "name": "নিনজা কোডার",\n    "hp": 100,\n    "score": 0,\n    "inventory": ["কম্পাস"]\n}\n\nquest_bank = [\n    {"q": "পদ্মা সেতুর দৈর্ঘ্য কত কিমি?", "a": "6.15"},\n    {"q": "পাইথনের জনক কে?", "a": "Guido"}\n]\nprint(f"অভিযান শুরু হচ্ছে {player[\'name\']}!")',
          language: 'python',
          explanation: {
            en: 'Dictionary stores player attributes; list of dicts holds all quest stages.',
            bn: 'ডিকশনারি প্লেয়ারের নানা বৈশিষ্ট্য জমা রাখে এবং লিস্ট অব ডিকশনারিতে সব কোয়েস্ট সাজানো থাকে।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p10-start-e1',
        question: {
          en: 'Which Python data structure best stores a player\'s profile (name, health, score)?',
          bn: 'একটি অ্যাডভেঞ্চার গেমে প্লেয়ারের প্রোফাইল (নাম, হেলথ, স্কোর) জমা রাখতে সবচেয়ে আদর্শ পাইথন ডাটা স্ট্রাকচার কোনটি?'
        },
        options: [
          'Dictionary (যেমন: player = {"name": "নিনজা", "hp": 100})',
          'শুধু একটি সাধারণ ইন্টিজার ভেরিয়েবল',
          'একটি অপরিবর্তনযোগ্য স্ট্রিং',
          'একটি ফ্লোট ভেরিয়েবল'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Dictionaries store named key-value pairs, making it natural to represent entity attributes.',
          bn: 'নিনির টিপস: ডিকশনারিতে "key-value" পেয়ারে প্লেয়ারের নানা বৈশিষ্ট্য অর্থপূর্ণ নামে চমৎকারভাবে সাজিয়ে রাখা যায়!'
        },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'p10-start-e2',
        question: {
          en: 'Complete the player dictionary setup and print the player\'s name:',
          bn: 'নিনির অ্যাডভেঞ্চারে প্লেয়ারের ডাটা ডিকশনারি পূর্ণাঙ্গ করো এবং প্লেয়ারের নাম প্রিন্ট করো:'
        },
        codeTemplate: 'player = {\n    "name": "রাহাত",\n    ___: 100,\n    "score": 0\n}\nprint(player[___])',
        blanks: ['"hp"', '"name"'],
        explanation: {
          en: 'Keys in dictionaries are quoted strings: "hp" defines the health key, and player["name"] retrieves the name.',
          bn: 'ডিকশনারির কী স্ট্রিং কোটেশন দিয়ে ডিক্লেয়ার ও রিড করতে হয়: "hp" এবং player["name"]।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p10-start-e3',
        question: {
          en: 'What does len(quest_bank) print here?',
          bn: 'নিচের কোডটি রান করলে কুইজ ব্যাংকে মোট কয়টি প্রশ্ন লোড হবে?'
        },
        code: 'quest_bank = [\n    {"q": "পদ্মা সেতুর দৈর্ঘ্য কত কিমি?", "a": "6.15"},\n    {"q": "পাইথনের জনক কে?", "a": "Guido"},\n    {"q": "চলোশিখির মাসকট কে?", "a": "Nini"}\n]\nprint(len(quest_bank))',
        options: ['3', '6', '1'],
        correctIndex: 0,
        explanation: {
          en: 'len() counts the top-level items in the list. There are 3 question dicts.',
          bn: 'len() ফাংশন লিস্টের ভেতরের ৩টি এলিমেন্ট (ডিকশনারি) গণনা করে ৩ প্রিন্ট করবে।'
        },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'p10-start-e4',
        question: {
          en: 'Arrange the game initialization sequence in the correct logical order:',
          bn: 'গেমের সূচনা ও ডাটা স্ট্রাকচার ইনিশিয়ালাইজেশন ক্রমানুসারে সাজাও:'
        },
        blocks: [
          'player = {"name": "অয়ন", "score": 0, "energy": 50}',
          'quests = [{"q": "2**3 = ?", "a": "8"}]',
          'is_game_running = True',
          'print(f"স্বাগতম {player[\'name\']}! চলোশিখি কোয়েস্ট শুরু...")'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Initialize player and quests data first, set the state flag, then welcome the player.',
          bn: 'প্রথমে প্লেয়ার ডাটা ও কোয়েস্ট ব্যাংক ইনিশিয়ালাইজ করো, তারপর স্টেট ফ্ল্যাগ এবং স্বাগতম মেসেজ দাও।'
        },
        xpReward: 35
      },
      {
        type: 'bug_hunt',
        id: 'p10-start-e5',
        question: {
          en: 'Find the syntax error in the inventory list definition:',
          bn: 'প্লেয়ারের ইনভেন্টরি লিস্টের সিনট্যাক্স ভুলটি ধরো:'
        },
        code: 'q1 = {"question": "ঢাকার প্রাচীন নাম?", "answer": "জাহাঙ্গীরনগর"}\ninventory = ["কলম", "বই", "ম্যাপ"\nprint(q1["answer"])',
        buggyLine: 2,
        explanation: {
          en: 'Line 2 is missing the closing square bracket `]` for the inventory list.',
          bn: 'নিনির বাগ অ্যালার্ট: লাইন ২-এ লিস্টের সমাপনী স্কয়ার ব্র্যাকেট `]` বাদ পড়েছে!'
        },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'p10-start-e6',
        question: {
          en: 'Add a new magical item to the player\'s inventory using the list method:',
          bn: 'লিস্ট মেথড ব্যবহার করে প্লেয়ারের ইনভেন্টরিতে নতুন আইটেম যোগ করো:'
        },
        codeTemplate: 'player_items = ["ম্যাপ", "কম্পাস"]\nplayer_items.___( "ম্যাজিক কলম" )\nprint(len(player_items))',
        blanks: ['append'],
        explanation: {
          en: '.append() adds a new element to the end of a list.',
          bn: 'লিস্টে নতুন উপাদান যুক্ত করতে `.append()` মেথড ব্যবহার করা হয়।'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p10-start-e7',
        question: {
          en: 'Why do we use a boolean flag like `is_game_running = True` in game architecture?',
          bn: 'টার্মিনাল গেম আর্কিটেকচারে `is_game_running = True` ভেরিয়েবলটি কী কাজে ব্যবহৃত হয়?'
        },
        options: [
          'গেমের মূল লুপ চালু বা বন্ধ রাখার স্টেট ফ্ল্যাগ হিসেবে',
          'কম্পিউটারের প্রসেসর শাটডাউন করার জন্য',
          'লিস্টের সব উপাদান স্থায়ীভাবে মুছে ফেলতে',
          'ইউজারের ইন্টারনেট কানেকশন বন্ধ করতে'
        ],
        correctIndex: 0,
        explanation: {
          en: 'A state flag controls the primary `while` loop, running while True and exiting when False.',
          bn: 'নিনির আর্কিটেকচার টিপস: একটি বুলিয়ান ভ্যারিয়েবলকে "ফ্ল্যাগ" হিসেবে ব্যবহার করে গেম যতক্ষণ চলবে ততক্ষণ লুপ চালু রাখা হয়!'
        },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p10-logic',
    sectionId: 'p-unit10',
    order: 2,
    title: { en: 'Core Engine & Logic', bn: 'কোর গেম লজিক ও ইঞ্জিন' },
    description: {
      en: 'Build the game engine that processes turns, checks inputs, and updates scores.',
      bn: 'শর্ত, লুপ ও ফাংশন একত্রিত করে গেমের প্রাণ বা ইঞ্জিন বানাও।'
    },
    difficulty: 'advanced',
    xpReward: 250,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'The Engine: Input Validation & Score Updates', bn: 'গেম লজিকের হৃৎপিণ্ড: ইনপুট যাচাই ও স্কোরিং' },
        body: {
          en: 'Real users make typos and use mixed uppercase/lowercase letters. A robust game engine cleans input with `.strip().lower()`, compares against expected answers, awards XP, and tracks player energy. Mascot Nini will help you write clean, resilient logic!',
          bn: 'আসল ব্যবহারকারীরা মাঝে মাঝে ভুল করে বাড়তি স্পেস দেয় বা ছোট-বড় হাতের মিশিয়ে লেখে। একটি শক্তিশালী গেম ইঞ্জিন `.strip().lower()` দিয়ে ইনপুট পরিষ্কার করে, সঠিক উত্তরের সাথে মেলায়, স্কোর বৃদ্ধি করে এবং প্লেয়ারের হেলথ আপডেট করে। নিনি তোমাকে শেখাবে কীভাবে মজবুত কোড লিখতে হয়!'
        },
        code: {
          code: 'def check_answer(user_ans, correct_ans):\n    # স্পেস ছাঁটাই ও ছোট হাতের অক্ষরে রূপান্তর\n    return user_ans.strip().lower() == correct_ans.strip().lower()\n\nuser = "  Dhaka  "\ncorrect = "dhaka"\nif check_answer(user, correct):\n    print("নিনি বলছে: সাবাশ! সঠিক উত্তর! (+১০ পয়েন্ট)")',
          language: 'python',
          explanation: {
            en: 'Cleaning inputs prevents frustrating false-negative grading for players.',
            bn: 'ইনপুট ক্লিন করলে ইউজার অপ্রয়োজনীয় স্পেস বা ক্যাপিটাল লেটার দিলেও উত্তর সঠিক হিসেবে গৃহীত হয়।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p10-logic-e1',
        question: {
          en: 'How do you ensure answers like " Dhaka ", "dhaka", and "DHAKA" are all graded correctly?',
          bn: 'ব্যবহারকারী " Dhaka " বা "dhaka" বা "DHAKA" লিখলেও যাতে উত্তর সঠিক হয়, তার জন্য কোন পদ্ধতিটি সেরা?'
        },
        options: [
          '.strip().lower() ব্যবহার করে অপ্রয়োজনীয় স্পেস কেটে ছোট হাতের করে তুলনা করা',
          '.split().upper() দিয়ে টেক্সট কেটে ফেলা',
          '.append() দিয়ে সব টেক্সট যোগ করা',
          '.pop() দিয়ে শেষের অক্ষর মুছে ফেলা'
        ],
        correctIndex: 0,
        explanation: {
          en: '.strip() removes accidental whitespace and .lower() makes the comparison case-insensitive.',
          bn: 'নিনির প্রো-টিপ: .strip() বাইরের অতিরিক্ত স্পেস মুছে ফেলে এবং .lower() সব অক্ষরকে ছোট হাতের করে তুলনা নিশ্চিত করে।'
        },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'p10-logic-e2',
        question: {
          en: 'Add 10 to score if correct, otherwise subtract 5 from energy:',
          bn: 'উত্তর সঠিক হলে স্কোর ১০ বাড়াও এবং ভুল হলে এনার্জি ৫ কমাও:'
        },
        codeTemplate: 'if user_ans.strip().lower() == correct_ans.lower():\n    score ___ 10\nelse:\n    energy ___ 5',
        blanks: ['+=', '-='],
        explanation: {
          en: '+= 10 increments score by 10; -= 5 decrements energy by 5.',
          bn: '`+= 10` দিয়ে মান ১০ বৃদ্ধি পায় এবং `-= 5` দিয়ে ৫ হ্রাস পায়।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p10-logic-e3',
        question: {
          en: 'What will be the final score after this grading loop completes?',
          bn: '৩টি প্রশ্নের পর প্লেয়ারের ফাইনাল স্কোর কত হবে?'
        },
        code: 'answers = ["ঢাকা", "ভুল", "python"]\ncorrect = ["ঢাকা", "রংপুর", "python"]\nscore = 0\nfor i in range(len(answers)):\n    if answers[i] == correct[i]:\n        score += 10\nprint(score)',
        options: ['20', '30', '10'],
        correctIndex: 0,
        explanation: {
          en: 'Question 0 and Question 2 match (10 + 10 = 20). Question 1 does not match.',
          bn: '১ম ও ৩য় প্রশ্নের উত্তর সঠিক (১০ + ১০ = ২০)। ২য় প্রশ্নের উত্তর ভুল হওয়ায় স্কোর অপরিবর্তিত থাকে।'
        },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'p10-logic-e4',
        question: {
          en: 'Arrange the answer verification function in proper Python structure:',
          bn: 'একটি প্রশ্ন যাচাই করার পূর্ণাঙ্গ ফাংশন ক্রমানুসারে সাজাও:'
        },
        blocks: [
          'def verify_answer(user_input, target):',
          '    clean_user = user_input.strip().lower()',
          '    clean_target = target.strip().lower()',
          '    return clean_user == clean_target'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Define function with parameters, normalize user input, normalize expected answer, return comparison boolean.',
          bn: 'ফাংশন ডিফাইন করো, উভয় ইনপুট ক্লিন করো এবং তুলনার সত্য/মিথ্যা মান রিটার্ন করো।'
        },
        xpReward: 35
      },
      {
        type: 'bug_hunt',
        id: 'p10-logic-e5',
        question: {
          en: 'Find the comparison assignment bug in the player health check:',
          bn: 'প্লেয়ারের এনার্জি চেকের তুলনামূলক অপারেটরের মারাত্মক বাগটি চিহ্নিত করো:'
        },
        code: 'energy = 0\nif energy = 0:\n    print("নিনি বলছে: তোমার শক্তি শেষ! মিশন ব্যর্থ।")',
        buggyLine: 2,
        explanation: {
          en: 'Line 2 uses `=` (assignment) instead of `==` (equality comparison).',
          bn: 'নিনির বাগ অ্যালার্ট: লাইন ২-এ তুলনার জন্য `==` দরকার ছিল, কিন্তু অ্যাসাইনমেন্ট অপারেটর `=` লেখা হয়েছে!'
        },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'p10-logic-e6',
        question: {
          en: 'Complete the round engine loop and return the total score:',
          bn: 'সমস্ত প্রশ্ন লুপ দিয়ে ঘোরার ফাংশন সম্পূর্ণ করো এবং স্কোর ফেরত দাও:'
        },
        codeTemplate: 'def play_round(quest_list):\n    score = 0\n    ___ quest in quest_list:\n        print(quest["q"])\n    ___ score',
        blanks: ['for', 'return'],
        explanation: {
          en: '`for quest in quest_list:` loops through questions, and `return score` hands back the final calculated score.',
          bn: 'লিস্টের ওপর লুপ চালানোর জন্য `for` এবং ফাংশন থেকে মান ফেরত দিতে `return` ব্যবহার করা হয়।'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p10-logic-e7',
        question: {
          en: 'Which statement immediately exits the game loop if the player types "quit"?',
          bn: 'প্লেয়ার যদি খেলায় মাঝপথে "quit" টাইপ করে বের হতে চায়, লুপের ভেতরে কোন স্টেটমেন্টটি ব্যবহার করবে?'
        },
        options: [
          'break',
          'continue',
          'pass',
          'return 0'
        ],
        correctIndex: 0,
        explanation: {
          en: 'The `break` statement halts loop execution immediately and jumps out.',
          bn: 'নিনির টিপস: ব্যবহারকারী গেম ত্যাগ করতে চাইলে `break` স্টেটমেন্ট দিয়ে তাৎক্ষণিক লুপ থেকে বেরিয়ে যাওয়া যায়!'
        },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p10-ui',
    sectionId: 'p-unit10',
    order: 3,
    title: { en: 'Terminal UX & Dashboard', bn: 'ইউজার এক্সপেরিয়েন্স ও টার্মিনাল ড্যাশবোর্ড' },
    description: {
      en: 'Design ASCII banners, dynamic health bars, and formatted status HUDs.',
      bn: 'সুন্দর ASCII আর্ট, হেলথ বার ও f-string ড্যাশবোর্ড বানিয়ে গেমকে আকর্ষণীয় করো।'
    },
    difficulty: 'advanced',
    xpReward: 250,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Terminal Visual Magic', bn: 'টার্মিনালে ভিজ্যুয়াল ম্যাজিক' },
        body: {
          en: 'A great terminal application feels immersive! By combining f-strings, string multiplication (`"=" * 30`), and visual blocks (`"█"` and `"░"`), we can build progress bars, badges, and neatly aligned cards. Nini shows you how formatting transforms simple text into a joyful experience.',
          bn: 'টার্মিনাল প্রোগ্রামও দেখতে দারুণ প্রফেশনাল হতে পারে! পাইথনের f-string, স্ট্রিং গুণন (`"=" * 30`) এবং ভিজ্যুয়াল ব্লক (`"█"` ও `"░"`) ব্যবহার করে আমরা সহজে প্রগ্রেস বার, রেটিং কার্ড এবং ড্যাশবোর্ড বানাতে পারি। নিনি তোমাকে নান্দনিক ইউজার এক্সপেরিয়েন্স (UX) তৈরি শেখাবে।'
        },
        code: {
          code: '# হেলথ বার ও স্ট্যাটাস ড্যাশবোর্ড\nhp = 3\nmax_hp = 5\nhealth_bar = "█" * hp + "░" * (max_hp - hp)\n\nprint("=" * 32)\nprint("      চলোশিখি কোয়েস্ট HUD      ")\nprint("=" * 32)\nprint(f"হেলথ: [{health_bar}] {hp}/{max_hp}")\nprint(f"স্কোর: 85 | লেভেল: প্রো")\nprint("=" * 32)',
          language: 'python',
          explanation: {
            en: 'Repeating block characters creates a dynamic graphical health meter in console.',
            bn: 'ব্লক ক্যারেক্টার গুণ করে টার্মিনালেই চমৎকার ভিজ্যুয়াল হেলথ মিটার তৈরি করা যায়!'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'fill_blank',
        id: 'p10-ui-e1',
        question: {
          en: 'Create a 30-character decorative header border for CholoSikhi Quest:',
          bn: 'টার্মিনালে ৩০ অক্ষরের একটি আকর্ষণীয় ব্যানার বর্ডার প্রিন্ট করো:'
        },
        codeTemplate: 'title = "চলোশিখি কোয়েস্ট"\nprint("___" ___ 30)\nprint(f"★ {title} ★")\nprint("___" ___ 30)',
        blanks: ['=', '*', '=', '*'],
        explanation: {
          en: '"=" * 30 repeats the "=" character 30 times to form a crisp border.',
          bn: '"=" * 30 সমান চিহ্নটিকে ৩০ বার পুনরাবৃত্তি করে একটি সুন্দর বর্ডার বানায়।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p10-ui-e2',
        question: {
          en: 'What does this dynamic visual health bar print when hp is 4 and max_hp is 5?',
          bn: 'নিচের কোডটি প্লেয়ারের হেলথ বার হিসেবে টার্মিনালে কী প্রিন্ট করবে?'
        },
        code: 'hp = 4\nmax_hp = 5\nbar = "█" * hp + "░" * (max_hp - hp)\nprint(f"HP: [{bar}]")',
        options: [
          'HP: [████░]',
          'HP: [█████]',
          'HP: [░░░░█]'
        ],
        correctIndex: 0,
        explanation: {
          en: '4 full blocks (█) followed by 1 empty block (░) creates [████░].',
          bn: 'hp=4 এর জন্য ৪টি পূর্ণ ব্লক "█" এবং বাকি ৫-৪=১টির জন্য ১টি "░" তৈরি হয়।'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p10-ui-e3',
        question: {
          en: 'Which f-string specifier accurately formats a float accuracy to 1 decimal place (e.g. 92.5%)?',
          bn: 'f-string এ দশমিকের পর ঠিক ১ ঘর পর্যন্ত শতকরা হার (যেমন: 92.5%) দেখাতে কোন ফরম্যাটিং স্পেসিফায়ারটি সঠিক?'
        },
        options: [
          '{accuracy:.1f}%',
          '{accuracy:1d}%',
          '{accuracy.round(1)}',
          '{pct.to_fixed(1)}'
        ],
        correctIndex: 0,
        explanation: {
          en: ':.1f formats floating-point values with exactly 1 decimal digit.',
          bn: 'নিনির টিপস: `:.1f` দশমিকের পর ঠিক এক ঘর পর্যন্ত ফ্লোট সংখ্যা সুন্দরভাবে ফরম্যাট করে।'
        },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'p10-ui-e4',
        question: {
          en: 'Arrange the round result scorecard in proper visual order:',
          bn: 'গেমের রাউন্ড রেজাল্ট কার্ড প্রিন্ট করার কোড ক্রমানুসারে সাজাও:'
        },
        blocks: [
          'print("-" * 25)',
          'print(f"প্লেয়ার: {player_name}")',
          'print(f"স্কোর: {score}/100")',
          'print("-" * 25)'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Top separator, player info, score line, and bottom separator form a clean card.',
          bn: 'উপরে বর্ডার, মাঝে প্লেয়ারের নাম ও স্কোর, এবং নিচে সমাপনী বর্ডার দিয়ে কার্ড তৈরি হয়।'
        },
        xpReward: 35
      },
      {
        type: 'bug_hunt',
        id: 'p10-ui-e5',
        question: {
          en: 'Identify the bug preventing variables from interpolating in this print statement:',
          bn: 'এই কোডে ভ্যারিয়েবল রিপ্লেস না হওয়ার বাগটি চিহ্নিত করো:'
        },
        code: 'coins = 150\nplayer = "নিনি"\nprint("স্বাগতম {player}! তোমার কয়েন: {coins}")',
        buggyLine: 3,
        explanation: {
          en: 'Line 3 is missing the `f` prefix before the string, so `{player}` and `{coins}` print literally.',
          bn: 'নিনির বাগ অ্যালার্ট: লাইন ৩-এ স্ট্রিংয়ের শুরুতে `f` লেখা হয়নি, ফলে কার্লি ব্র্যাকেট ভ্যারিয়েবল রিপ্লেস করতে পারছে না!'
        },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'p10-ui-e6',
        question: {
          en: 'Add a clean terminal input prompt symbol so the user knows where to type:',
          bn: 'ইউজারের ইনপুট প্রম্পটে একটি সুন্দর অ্যারো নির্দেশক যোগ করো:'
        },
        codeTemplate: 'user_choice = input( "তোমার সিদ্ধান্ত (1/2): ___ " )',
        blanks: ['>'],
        explanation: {
          en: 'Adding `> ` provides clear visual affordance for console user typing.',
          bn: 'প্রম্পটে `> ` দিলে ইউজার পরিষ্কার বুঝতে পারে কার্সরটি কোথায় টাইপ করার অপেক্ষায় আছে।'
        },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p10-ui-e7',
        question: {
          en: 'According to Nini, what makes a great user experience when a player answers correctly?',
          bn: 'নিনির মতে, প্লেয়ার কোনো প্রশ্নের সঠিক উত্তর দিলে কোনটি দেখানো সেরা ইউএক্স (UX)?'
        },
        options: [
          'উজ্জ্বল ইতিবাচক ফিডব্যাক যেমন: "✓ চমৎকার! সঠিক উত্তর (+১০ পয়েন্ট)"',
          'কিছুই না দেখিয়ে নীরবে পরের প্রশ্নে চলে যাওয়া',
          'একটি জটিল এরর কোড প্রিন্ট করা',
          'টার্মিনাল ক্র্যাশ করিয়ে দেওয়া'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Immediate positive feedback reinforces learning and provides delight.',
          bn: 'নিনির টিপস: ব্যবহারকারীকে সবসময় তাৎক্ষণিক ইতিবাচক ফিডব্যাক ও উৎসাহ দেওয়া একজন ভালো সফটওয়্যার নির্মাতার পরিচয়!'
        },
        xpReward: 25
      }
    ]
  },
  {
    id: 'p10-finish',
    sectionId: 'p-unit10',
    order: 4,
    isProject: true,
    title: { en: 'Grand Finale & Certification', bn: 'গ্র্যান্ড ফিনালে ও মাস্টার সার্টিফিকেট' },
    description: {
      en: 'Assemble the complete game, compute final ranks, and celebrate with Nini!',
      bn: 'সবকিছু জোড়া লাগিয়ে সম্পূর্ণ টার্মিনাল প্রজেক্ট সফলভাবে রান করো এবং পাইথন মাস্টার হও!'
    },
    difficulty: 'advanced',
    xpReward: 600,
    estimatedMinutes: 20,
    theory: [
      {
        heading: { en: 'Congratulations: You Are a Python Programmer!', bn: 'সাবাশ! তুমি এখন একজন পাইথন প্রোগ্রামার' },
        body: {
          en: 'You have journeyed from your very first `print("হ্যালো বাংলাদেশ!")` all the way to building a multi-module interactive terminal adventure. You have mastered variables, types, conditions, boolean operators, loops, lists, dictionaries, and functions. Mascot Nini proudly congratulates you on completing the foundation course!',
          bn: 'তোমার প্রথম `print("হ্যালো বাংলাদেশ!")` থেকে শুরু করে আজ তুমি একটি পূর্ণাঙ্গ ইন্টারেক্টিভ টার্মিনাল অ্যাডভেঞ্চার প্রজেক্ট তৈরি করে ফেলেছ! ভ্যারিয়েবল, ডাটা টাইপ, শর্ত, বুলিয়ান লজিক, লুপ, লিস্ট, ডিকশনারি এবং ফাংশন — প্রোগ্রামিংয়ের প্রতিটি স্তম্ভ এখন তোমার আয়ত্তে। মাসকট নিনি তোমাকে প্রাণঢালা অভিনন্দন জানাচ্ছে!'
        },
        code: {
          code: 'def run_cholosikhi_quest():\n    print("=" * 35)\n    print("   🏆 চলোশিখি পাইথন গ্র্যান্ড ফিনালে 🏆   ")\n    print("=" * 35)\n    player = {"name": "বিজয়ী কোডার", "score": 100}\n    print(f"অভিনন্দন {player[\'name\']}! তোমার স্কোর: {player[\'score\']}")\n    print("নিনি বলছে: তুমি এখন একজন দক্ষ পাইথন কারিগর! 🚀")\n\nif __name__ == "__main__":\n    run_cholosikhi_quest()',
          language: 'python',
          explanation: {
            en: 'A clean, complete Python program demonstrating functions, dicts, f-strings, and entrypoint convention.',
            bn: 'একটি সম্পূর্ণ পাইথন প্রোগ্রাম যা ফাংশন, ডিকশনারি, f-string এবং মেইন এন্ট্রি-পয়েন্ট সমন্বয় করে।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'p10-finish-e1',
        question: {
          en: 'What rank badge will Nini print for a player scoring 8 out of 10?',
          bn: 'সম্পূর্ণ গেম শেষে ৮/১০ স্কোর পেলে নিনির কোড কী র‍্যাঙ্ক প্রিন্ট করবে?'
        },
        code: 'score = 8\ntotal = 10\npct = (score / total) * 100\nif pct >= 80:\n    rank = "গোল্ডেন কোডার 🏆"\nelse:\n    rank = "সিলভার কোডার 🥈"\nprint(f"র‍্যাঙ্ক: {rank} ({pct:.0f}%)")',
        options: [
          'র‍্যাঙ্ক: গোল্ডেন কোডার 🏆 (80%)',
          'র‍্যাঙ্ক: সিলভার কোডার 🥈 (80%)',
          'র‍্যাঙ্ক: গোল্ডেন কোডার 🏆 (0.8%)'
        ],
        correctIndex: 0,
        explanation: {
          en: 'pct is (8/10)*100 = 80. Since 80 >= 80, the condition is met and "80%" is printed.',
          bn: 'pct = (৮ / ১০) * ১০০ = ৮০। ৮০ >= ৮০ শর্তটি সত্য হওয়ায় গোল্ডেন কোডার 🏆 (80%) প্রিন্ট হবে।'
        },
        xpReward: 40
      },
      {
        type: 'fill_blank',
        id: 'p10-finish-e2',
        question: {
          en: 'Complete the main game function declaration and standard Python execution block:',
          bn: 'গেমের মূল ড্রাইভার ফাংশন এবং প্রজেক্টের স্টার্টার সম্পূর্ণ করো:'
        },
        codeTemplate: '___ start_game():\n    print("চলোশিখি পাইথন চ্যাম্পিয়নশিপ শুরু!")\n\nif __name__ == "___":\n    start_game()',
        blanks: ['def', '__main__'],
        explanation: {
          en: '`def` defines the function, and `__name__ == "__main__"` is the Python convention for script execution.',
          bn: 'ফাংশন তৈরিতে `def` এবং সরাসরি স্ক্রিপ্ট রান করার স্ট্যান্ডার্ড পাইথন কনভেনশনে `__main__` ব্যবহৃত হয়।'
        },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'p10-finish-e3',
        question: {
          en: 'What is the primary advantage of organizing game code into small, single-purpose functions?',
          bn: 'একটি সম্পূর্ণ পাইথন প্রজেক্টে ফাংশনগুলোকে ছোট ছোট দায়িত্বে ভাগ করার প্রধান সুবিধা কী?'
        },
        options: [
          'কোড সহজে পড়া যায়, সহজে টেস্ট করা যায় এবং বাগ দূর করা সহজ হয় (মডুলার আর্কিটেকচার)',
          'কম্পিউটারের সিপিইউ সাময়িক বন্ধ রাখা যায়',
          'ফাইলের আকার শূন্য বাইট হয়ে যায়',
          'কোড এক্সিকিউশন স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যায়'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Modular architecture improves readability, reusability, testing, and maintainability.',
          bn: 'নিনির স্থাপত্য নীতি: মডুলার কোড সহজে টেস্ট ও মেরামত করা যায়, যা প্রফেশনাল সফটওয়্যার তৈরির মূল ভিত্তি।'
        },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'p10-finish-e4',
        question: {
          en: 'Arrange the full lifecycle of the CholoSikhi Quest game execution:',
          bn: 'একটি সম্পূর্ণ কুইজ অ্যাডভেঞ্চার গেমের মূল এক্সিকিউশন ফ্লো ক্রমানুসারে সাজাও:'
        },
        blocks: [
          'quests = load_questions()',
          'player = setup_player()',
          'final_score = run_game_loop(player, quests)',
          'show_victory_screen(player, final_score)'
        ],
        correctOrder: [0, 1, 2, 3],
        explanation: {
          en: 'Load questions, initialize player, execute the game loop, and display the final victory screen.',
          bn: 'কোয়েস্ট ও প্লেয়ার ডাটা প্রস্তুত করো, গেম লুপ পরিচালনা করো, এবং সবশেষে বিজয়ী স্ক্রিন দেখাও।'
        },
        xpReward: 50
      },
      {
        type: 'bug_hunt',
        id: 'p10-finish-e5',
        question: {
          en: 'Spot the syntax bug in the game victory handler:',
          bn: 'গেমের সমাপ্তি হ্যান্ডলারে পাইথন সিনট্যাক্স ভুলটি ধরো:'
        },
        code: 'def finish_game(player, score):\n    print(f"খেলা সমাপ্ত! {player} এর স্কোর: {score}")\n    if score >= 50\n        print("নিনি বলছে: অসাধারণ খেলেছ!")',
        buggyLine: 3,
        explanation: {
          en: 'Line 3 is missing the required colon `:` at the end of the `if` statement.',
          bn: 'নিনির বাগ অ্যালার্ট: লাইন ৩-এ `if score >= 50` এর শেষে কোলন `:` বাদ পড়েছে!'
        },
        xpReward: 35
      },
      {
        type: 'fill_blank',
        id: 'p10-finish-e6',
        question: {
          en: 'Complete Nini\'s final graduation message in the f-string:',
          bn: 'নিনি ও চলোশিখির গ্র্যান্ড সেলিব্রেশন মেসেজ সম্পূর্ণ করো:'
        },
        codeTemplate: 'hero = "তুমি"\nplatform = "চলোশিখি"\nprint(f"সাবাশ {___}! {___} এর পাইথন কোর্স সফলভাবে সম্পন্ন হয়েছে! 🎓")',
        blanks: ['hero', 'platform'],
        explanation: {
          en: 'Variables enclosed in curly braces {hero} and {platform} are evaluated in f-strings.',
          bn: 'f-string এ কার্লি ব্র্যাকেটের ভেতর {hero} ও {platform} দিলে তাদের মান প্রিন্ট হবে।'
        },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'p10-finish-e7',
        question: {
          en: 'Congratulations! Having mastered Python fundamentals with Nini, what is your best next step?',
          bn: 'অভিনন্দন! পাইথনের ফাউন্ডেশন কোর্স শেষ করে এখন তোমার পরবর্তী সেরা পদক্ষেপ কী?'
        },
        options: [
          'বাস্তব প্রজেক্ট তৈরি (Web, AI/Automation) এবং নিয়মিত কোডিং প্র্যাকটিস চালিয়ে যাওয়া',
          'কোডিং শেখা চিরতরে বন্ধ করে দেওয়া',
          'সব কোড ডিলিট করে দেওয়া',
          'শুধু ভ্যারিয়েবল মুখস্থ করা'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Building real projects and consistent practice are how programmers grow into software engineers.',
          bn: 'নিনির সমাপনী বার্তা: অভিনন্দন! তুমি এখন কোডিংয়ের বাস্তব ভিত্তি তৈরি করে ফেলেছ। চলোশিখির সাথে নতুন সফটওয়্যার বানানোর তোমার রোমাঞ্চকর যাত্রা শুরু হোক!'
        },
        xpReward: 50
      }
    ]
  }
];

