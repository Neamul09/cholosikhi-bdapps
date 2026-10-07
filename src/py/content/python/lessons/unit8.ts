import type { Lesson } from '../../schema';

// Unit 8: Inventory Master — lessonIds: ['p8-lists', 'p8-dicts', 'p8-exam']
export const unit8Lessons: Lesson[] = [
  {
    id: 'p8-lists',
    sectionId: 'p-unit8',
    order: 1,
    title: { en: 'The Treasure Chest: Lists with Nini', bn: 'নিনির সাথে গুপ্তধনের বাক্স: লিস্ট' },
    description: {
      en: 'Store collections of items, access by index, and manipulate lists with Nini.',
      bn: 'নিনির সাথে একাধিক ডাটা একসাথে জমা রাখা, ইনডেক্স দিয়ে খোঁজা এবং লিস্ট পরিবর্তন শেখো।'
    },
    difficulty: 'intermediate',
    xpReward: 160,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'What is a List?', bn: 'লিস্ট কী?' },
        body: {
          en: 'Nini says: "A Python list is like your school backpack! You can put anything inside: numbers, text, or even other lists. And remember: Python counts starting at 0!"',
          bn: 'নিনি বলছে: "পাইথন লিস্ট হলো তোমার স্কুল ব্যাগের মতো! এর ভেতর বই, খাতা, কলম—যেকোনো কিছু ক্রমানুসারে গুছিয়ে রাখা যায়। আর মনে রেখো: পাইথন সবসময় ০ থেকে গণনা শুরু করে!"'
        },
        code: {
          code: 'bazaar = ["চাল", "ডাল", "তেল"]\nprint(bazaar[0])    # চাল\nprint(bazaar[-1])   # তেল (শেষের আইটেম)\nbazaar.append("লবণ")\nprint(len(bazaar))  # 4',
          language: 'python',
          explanation: {
            en: 'Lists are zero-indexed. [-1] gives the last item, .append() adds to the end, and len() gives the total count.',
            bn: 'লিস্টের ইনডেক্স ০ দিয়ে শুরু। [-1] শেষের আইটেম দেয়, .append() শেষে নতুন উপাদান যোগ করে, আর len() মোট উপাদান সংখ্যা জানায়।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p8-lists-e1',
        question: {
          en: 'What is the index of the very first element in any Python list?',
          bn: 'পাইথনে যেকোনো লিস্টের প্রথম উপাদানটির ইনডেক্স নম্বর কত?'
        },
        options: ['0', '1', '-1', 'first'],
        correctIndex: 0,
        explanation: {
          en: 'Python uses zero-based indexing! The first element is always at index [0].',
          bn: 'নিনি বলছে: সাবাশ! পাইথনে গণনা শূন্য (০) থেকে শুরু হয়, তাই প্রথম উপাদানের ইনডেক্স [0]।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p8-lists-e2',
        question: {
          en: 'What will print(colors[-1]) display?',
          bn: 'নিচের কোডে colors[-1] এর আউটপুট কী হবে?'
        },
        code: 'colors = ["লাল", "সবুজ", "নীল"]\nprint(colors[-1])',
        options: ['নীল', 'লাল', 'সবুজ', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'Negative index [-1] represents the very last element of the list!',
          bn: 'নিনির টিপস: নেগেটিভ ইনডেক্স [-1] সবসময় লিস্টের একদম শেষ উপাদানটিকে নির্দেশ করে।'
        },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p8-lists-e3',
        question: {
          en: 'Add "বিরিয়ানি" to the end of the menu list:',
          bn: 'menu লিস্টের একদম শেষে "বিরিয়ানি" যোগ করতে সঠিক মেথডটি লেখো:'
        },
        codeTemplate: 'menu = ["খিচুড়ি", "পোলাও"]\nmenu.___("বিরিয়ানি")',
        blanks: ['append'],
        explanation: {
          en: '.append(item) adds the new element to the end of the list.',
          bn: 'নিনি বলছে: চমৎকার! লিস্টের শেষে কিছু যুক্ত করতে .append() মেথড ব্যবহার করা হয়।'
        },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p8-lists-e4',
        question: {
          en: 'What is printed by len(friends)?',
          bn: 'len(friends) এর আউটপুট কী হবে?'
        },
        code: 'friends = ["তানভীর", "সাদিয়া", "রাফি", "ফারিয়া"]\nprint(len(friends))',
        options: ['4', '3', '5', '0'],
        correctIndex: 0,
        explanation: {
          en: 'len() counts the number of elements in the list. There are 4 friends!',
          bn: 'নিনির টিপস: len() মোট উপাদান সংখ্যা গুনে বলে দেয়। এখানে মোট ৪ জন বন্ধু আছে।'
        },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p8-lists-e5',
        question: {
          en: 'Which method removes AND returns the last item from a list?',
          bn: 'লিস্টের শেষ উপাদানটি মুছে ফেলার সাথে সাথে ফেরত দেয় কোন মেথডটি?'
        },
        options: ['pop()', 'remove()', 'delete()', 'discard()'],
        correctIndex: 0,
        explanation: {
          en: '.pop() removes the item at the specified index (default is the last item) and returns it!',
          bn: 'নিনি বলছে: সাবাশ! pop() শেষের উপাদানটিকে লিস্ট থেকে সরিয়ে এনে ফেরত দেয়।'
        },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p8-lists-e6',
        question: {
          en: 'What is the result of this list slicing: letters[1:3]?',
          bn: 'letters[1:3] স্লাইসিংয়ের ফলাফল কী হবে?'
        },
        code: 'letters = ["a", "b", "c", "d", "e"]\nprint(letters[1:3])',
        options: ["['b', 'c']", "['b', 'c', 'd']", "['a', 'b']", "['c', 'd']"],
        correctIndex: 0,
        explanation: {
          en: 'Slice [1:3] takes index 1 and 2, stopping right before index 3! So ["b", "c"].',
          bn: 'নিনির টিপস: [1:3] মানে ইনডেক্স ১ এবং ২ নিবে, কিন্তু ৩ এর আগে থামবে! তাই [\'b\', \'c\']।'
        },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'p8-lists-e7',
        question: {
          en: 'Find the IndexError bug in this list access:',
          bn: 'লিস্ট এক্সেসের কোন লাইনে IndexError ঘটবে?'
        },
        code: 'fruits = ["আম", "কলা"]\nprint(fruits[0])\nprint(fruits[2])',
        buggyLine: 3,
        explanation: {
          en: 'fruits only has 2 items at index 0 and 1! Index 2 does not exist, throwing IndexError.',
          bn: 'নিনির টিপস: ৩ নম্বর লাইনে fruits[2] খোঁজা হয়েছে, কিন্তু লিস্টে শুধু ইনডেক্স ০ ও ১ আছে! ফলে IndexError হবে।'
        },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'p8-lists-e8',
        question: {
          en: 'Arrange the code to create an inventory, append an item, and print the count:',
          bn: 'ইনভেন্টরি তৈরি করে নতুন আইটেম যোগ এবং মোট সংখ্যা দেখার কোড সাজাও:'
        },
        blocks: [
          'inventory = ["তলোয়ার", "ঢাল"]',
          'inventory.append("ম্যাজিক বোতল")',
          'print(f"মোট আইটেম: {len(inventory)}")'
        ],
        correctOrder: [0, 1, 2],
        explanation: {
          en: 'Initialize list, append the new item, then print len().',
          bn: 'নিনির টিপস: প্রথমে লিস্ট তৈরি করো, append দিয়ে আইটেম বাড়াও, তারপর len() দিয়ে সংখ্যা প্রিন্ট করো।'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p8-lists-e9',
        question: {
          en: 'Remove "মাছ" from the list by value using the remove method:',
          bn: 'লিস্ট থেকে সরাসরি মান উল্লেখ করে "মাছ" বাদ দিতে মেথডটির নাম লেখো:'
        },
        codeTemplate: 'cart = ["ডিম", "মাছ", "দুধ"]\ncart.___("মাছ")',
        blanks: ['remove'],
        explanation: {
          en: '.remove("value") searches for the first matching value and deletes it.',
          bn: 'নিনি বলছে: একদম ঠিক! কোনো সুনির্দিষ্ট মান মুছে ফেলতে .remove() ব্যবহার করা হয়।'
        },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p8-lists-e10',
        question: {
          en: 'What happens when you modify a list element via index?',
          bn: 'ইনডেক্স দিয়ে মান পরিবর্তন করলে আউটপুট কী হবে?'
        },
        code: 'nums = [10, 20, 30]\nnums[1] = 99\nprint(nums)',
        options: ['[10, 99, 30]', '[99, 20, 30]', '[10, 20, 30, 99]', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'Lists are mutable! nums[1] = 99 replaces the item at index 1 with 99.',
          bn: 'নিনি বলছে: সাবাশ! পাইথনে লিস্টের যেকোনো উপাদানের মান ইনডেক্স ধরে সরাসরি বদলে ফেলা যায়।'
        },
        xpReward: 20
      }
    ]
  },
  {
    id: 'p8-dicts',
    sectionId: 'p-unit8',
    order: 2,
    title: { en: 'The Secret Decoder: Dictionaries with Nini', bn: 'নিনির সাথে ডিকশনারির গোপন কোড' },
    description: {
      en: 'Store real-world structured data using Key-Value pairs with Nini.',
      bn: 'কী-ভ্যালু (Key-Value) জোড়া দিয়ে বাস্তব জগতের তথ্য গোছাতে ডিকশনারি শেখো।'
    },
    difficulty: 'intermediate',
    xpReward: 160,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Key-Value Mapping', bn: 'কী-ভ্যালু জোড়া' },
        body: {
          en: 'Nini says: "In a real dictionary, you look up a word (key) to find its definition (value). In Python, a dict stores pairs like {"name": "নিনি", "role": "মাসকট"} using curly braces { }!"',
          bn: 'নিনি বলছে: "আসল অভিধানে যেমন শব্দ (key) দেখে অর্থ (value) খোঁজা হয়, পাইথনেও ঠিক তাই! কার্লি ব্র্যাকেট { } দিয়ে যেমন {"name": "নিনি", "role": "মাসকট"} জোড়া আকারে ডাটা রাখা হয়!"'
        },
        code: {
          code: 'student = {"নাম": "আরিফ", "রোল": 7, "জিপিএ": 5.0}\nprint(student["নাম"])       # আরিফ\nstudent["জিপিএ"] = 5.0\nprint(student.get("স্কুল", "অজানা"))  # অজানা (নিরাপদ এক্সেস)',
          language: 'python',
          explanation: {
            en: 'Access values using their key in square brackets or with .get() for safe lookups.',
            bn: 'ব্র্যাকেটে কী (key) দিয়ে মান পাওয়া যায়, অথবা এরর এড়াতে .get() ব্যবহার করা হয়।'
          }
        }
      }
    ],
    exercises: [
      {
        type: 'fill_blank',
        id: 'p8-dicts-e1',
        question: {
          en: 'Access the gamer\'s score using the "score" key:',
          bn: '"score" কী ব্যবহার করে গেমারের স্কোর প্রিন্ট করতে ফাঁকা স্থান পূরণ করো:'
        },
        codeTemplate: 'player = {"name": "Nini", "score": 250}\nprint(player[___])',
        blanks: ['"score"'],
        explanation: {
          en: 'Keys inside square brackets must be enclosed in quotes like "score".',
          bn: 'নিনি বলছে: সাবাশ! ডিকশনারির কী কল করতে উদ্ধৃতি চিহ্ন দিয়ে "score" লিখতে হয়।'
        },
        xpReward: 15
      },
      {
        type: 'mcq',
        id: 'p8-dicts-e2',
        question: {
          en: 'How do you add a new key "phone" with value "01700" to dict "contact"?',
          bn: 'contact ডিকশনারিতে নতুন কী "phone" এবং মান "01700" কীভাবে যুক্ত করবে?'
        },
        options: [
          'contact["phone"] = "01700"',
          'contact.add("phone", "01700")',
          'contact.append("phone": "01700")',
          'contact.insert("phone", "01700")'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Simply assign to the new key: contact["phone"] = "01700".',
          bn: 'নিনির টিপস: ডিকশনারিতে নতুন তথ্য যোগ করতে সোজা contact["phone"] = "01700" লিখে দিলেই হয়ে যায়।'
        },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p8-dicts-e3',
        question: {
          en: 'What is printed after updating the quantity?',
          bn: 'পরিমাণ আপডেট করার পর নিচের কোডটি কী প্রিন্ট করবে?'
        },
        code: 'stock = {"আম": 10, "কলা": 25}\nstock["আম"] += 5\nprint(stock["আম"])',
        options: ['15', '10', '5', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'stock["আম"] was 10. Adding 5 makes it 15!',
          bn: 'নিনি বলছে: সাবাশ! ১০ এর সাথে ৫ যোগ হয়ে আমের পরিমাণ ১৫ হয়ে গেছে।'
        },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p8-dicts-e4',
        question: {
          en: 'What does dict.get("age", 18) do if "age" does NOT exist in the dictionary?',
          bn: 'যদি ডিকশনারিতে "age" কী না থাকে, তবে dict.get("age", 18) কী ফেরত দেবে?'
        },
        options: [
          'ডিফল্ট মান 18 ফেরত দেবে',
          'KeyError ক্র্যাশ করবে',
          'None ফেরত দেবে',
          'ডিকশনারি মুছে দেবে'
        ],
        correctIndex: 0,
        explanation: {
          en: '.get(key, default) safely returns the fallback default value without crashing!',
          bn: 'নিনির টিপস: .get() মেথডের সবচেয়ে বড় সুবিধা হলো কি না থাকলে প্রোগ্রাম ক্র্যাশ না করে ডিফল্ট মান (১৮) ফেরত দেয়।'
        },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p8-dicts-e5',
        question: {
          en: 'Find the KeyError crash in this code:',
          bn: 'এই কোডের কোন লাইনে KeyError ক্র্যাশ ঘটবে?'
        },
        code: 'hero = {"name": "Nini", "hp": 100}\nprint(hero["name"])\nprint(hero["mana"])',
        buggyLine: 3,
        explanation: {
          en: 'Line 3 tries to access "mana" which is not a key in hero! Use hero.get("mana", 0) instead.',
          bn: 'নিনির টিপস: ৩ নম্বর লাইনে "mana" খোঁজা হয়েছে যা ডিকশনারিতে নেই! তাই পাইথন KeyError দিয়ে বন্ধ হয়ে যাবে।'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p8-dicts-e6',
        question: {
          en: 'Iterate over both keys and values of a dictionary using the items method:',
          bn: 'কী এবং ভ্যালু উভয় জোড়া একসাথে লুপ করতে মেথডটির নাম লেখো:'
        },
        codeTemplate: 'prices = {"চা": 10, "বিস্কুট": 5}\nfor item, price in prices.___():\n    print(item, price)',
        blanks: ['items'],
        explanation: {
          en: '.items() yields (key, value) tuples for each entry in the dictionary.',
          bn: 'নিনি বলছে: সাবাশ! .items() দিলে লুপে এক সাথে কী এবং ভ্যালু দুটোই পাওয়া যায়।'
        },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p8-dicts-e7',
        question: {
          en: 'What does ("নাম" in student) evaluate to?',
          bn: '("নাম" in student) এই শর্তের আউটপুট কী হবে?'
        },
        code: 'student = {"নাম": "তানিশা", "বয়স": 16}\nprint("নাম" in student)',
        options: ['True', 'False', 'তানিশা', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'The "in" operator checks whether a key exists in the dictionary. It does, so True!',
          bn: 'নিনির টিপস: "in" দিয়ে দেখা যায় কোনো কী ডিকশনারিতে আছে কিনা। যেহেতু আছে, তাই True।'
        },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p8-dicts-e8',
        question: {
          en: 'Arrange the code to create a character profile and display their stats:',
          bn: 'একটি ক্যারেক্টার প্রোফাইল ডিকশনারি তৈরি ও প্রিন্ট করার কোড সাজাও:'
        },
        blocks: [
          'player = {"name": "নিনি", "level": 10}',
          'player["gold"] = 500',
          'print(f"{player[\'name\']} এর কাছে {player[\'gold\']} সোনা আছে")'
        ],
        correctOrder: [0, 1, 2],
        explanation: {
          en: 'Initialize profile, add gold key, and format message with dictionary values.',
          bn: 'নিনির টিপস: ডিকশনারি তৈরি করে gold যোগ করো, তারপর f-string এ মানগুলো বসিয়ে প্রিন্ট করো।'
        },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p8-dicts-e9',
        question: {
          en: 'What does list(my_dict.keys()) return?',
          bn: 'my_dict.keys() কে লিস্টে রূপান্তর করলে কী পাওয়া যায়?'
        },
        options: [
          'ডিকশনারির সবকটি কী (keys) এর তালিকা',
          'ডিকশনারির সবকটি মান (values) এর তালিকা',
          'কী এবং মান জোড়ার তালিকা',
          'খালি লিস্ট'
        ],
        correctIndex: 0,
        explanation: {
          en: '.keys() provides a view of all the keys present in the dictionary.',
          bn: 'নিনি বলছে: একদম ঠিক! .keys() দিলে ডিকশনারির সমস্ত কী এর তালিকা পাওয়া যায়।'
        },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p8-dicts-e10',
        question: {
          en: 'What is printed by this dictionary value length?',
          bn: 'নিচের কোডের আউটপুট কী হবে?'
        },
        code: 'team = {"batsmen": ["তামিম", "শান্ত"], "bowlers": ["মুস্তাফিজ", "তাসকিন", "শরিফুল"]}\nprint(len(team["bowlers"]))',
        options: ['3', '2', '5', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'team["bowlers"] is a list containing 3 players! len() returns 3.',
          bn: 'নিনির টিপস: team["bowlers"] হলো ৩ জন খেলোয়াড়ের একটি লিস্ট! তাই এর দৈর্ঘ্য হবে ৩।'
        },
        xpReward: 25
      }
    ]
  },
  {
    id: 'p8-exam',
    sectionId: 'p-unit8',
    order: 3,
    isProject: true,
    title: { en: 'Unit 8 Checkpoint: Inventory Master Exam', bn: 'ইউনিট ৮ চেকপয়েন্ট: ইনভেন্টরি মাস্টার পরীক্ষা' },
    description: {
      en: 'Combine lists and dictionaries into real-world inventory, shopping cart, and player stats systems!',
      bn: 'লিস্ট ও ডিকশনারি কাজে লাগিয়ে বাস্তবসম্মত ইনভেন্টরি ও শপিং কার্ট সিস্টেম বানাও!'
    },
    difficulty: 'intermediate',
    xpReward: 350,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Data Architecture Mastery', bn: 'ডাটা আর্কিটেকচার মাস্টারি' },
        body: {
          en: 'Nini says: "Congratulations on reaching the data structures checkpoint! Almost all professional Python programs combine lists of dictionaries or dictionaries of lists. You now have the power to structure real data!"',
          bn: 'নিনি বলছে: "ডাটা স্ট্রাকচার চেকপয়েন্টে পৌঁছানোর জন্য অভিনন্দন! পেশাদার পাইথন কোডাররা সবসময় লিস্টের ভেতর ডিকশনারি অথবা ডিকশনারির ভেতর লিস্ট ব্যবহার করে। মাথা খাটিয়ে সবগুলো প্রশ্নের উত্তর দাও!"'
        }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'p8-exam-e1',
        question: {
          en: 'What is printed after adding and removing inventory items?',
          bn: 'আইটেম যোগ ও বিয়োগের পর নিচের কোডটি কী প্রিন্ট করবে?'
        },
        code: 'bag = ["ম্যাপ", "কম্পাস", "খাবার"]\nbag.append("টর্চ")\nbag.remove("খাবার")\nprint(len(bag))',
        options: ['3', '4', '2', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'Started with 3, appended 1 (4), removed 1 (3). len(bag) is 3!',
          bn: 'নিনির টিপস: ৩টি আইটেম ছিল, ১টি যুক্ত হয়ে ৪টি হলো, আবার ১টি মুছে ৩টি হলো। তাই দৈর্ঘ্য ৩!'
        },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p8-exam-e2',
        question: {
          en: 'Check if "আম" is present as a key in the fruit_stock dictionary using the membership operator:',
          bn: '"আম" ডিকশনারির কী হিসেবে আছে কিনা তা পরীক্ষা করতে অপারেটরটি লেখো:'
        },
        codeTemplate: 'fruit_stock = {"আম": 50, "লিচু": 100}\nif "আম" ___ fruit_stock:\n    print("আম স্টকে আছে")',
        blanks: ['in'],
        explanation: {
          en: 'The "in" operator tests for key membership in a dictionary.',
          bn: 'নিনি বলছে: সাবাশ! কোনো কী ডিকশনারিতে আছে কিনা তা দেখতে "in" ব্যবহার করা হয়।'
        },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p8-exam-e3',
        question: {
          en: 'What is the calculated total bill from this cart dictionary?',
          bn: 'এই কার্ট ডিকশনারি থেকে মোট বিল কত আসবে?'
        },
        code: 'cart = {"বই": 200, "কলম": 20, "খাতা": 50}\ntotal = sum(cart.values())\nprint(f"মোট: {total} টাকা")',
        options: ['মোট: 270 টাকা', 'মোট: 200 টাকা', 'Error', '270'],
        correctIndex: 0,
        explanation: {
          en: 'cart.values() gives [200, 20, 50]. sum() calculates 200 + 20 + 50 = 270!',
          bn: 'নিনির টিপস: cart.values() সমস্ত দামের তালিকা দেয় এবং sum() এদের যোগ করে ২৭০ টাকা পায়!'
        },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'p8-exam-e4',
        question: {
          en: 'Find the KeyError bug where a missing item is looked up without .get():',
          bn: 'এই কোডের কোন লাইনে ডিকশনারিতে না থাকা কী এর কারণে ক্র্যাশ করবে?'
        },
        code: 'menu = {"চা": 10, "কফি": 50}\nprint(menu["চা"])\nprint(menu["লাচ্ছি"])',
        buggyLine: 3,
        explanation: {
          en: 'Line 3 accesses "লাচ্ছি" which does not exist in menu, throwing a KeyError! Use menu.get("লাচ্ছি", 0).',
          bn: 'নিনির টিপস: ৩ নম্বর লাইনে "লাচ্ছি" মেন্যুতে নেই, তাই পাইথন KeyError দেখাবে। এর বদলে menu.get("লাচ্ছি", 0) লেখা উচিত ছিল।'
        },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'p8-exam-e5',
        question: {
          en: 'Arrange the code to find the most expensive price in a shop dictionary:',
          bn: 'দোকানের ডিকশনারি থেকে সর্বোচ্চ দাম খুঁজে বের করার কোড সাজাও:'
        },
        blocks: [
          'shop = {"রুটি": 35, "দুধ": 80, "ঘি": 450}',
          'highest = max(shop.values())',
          'print(f"সর্বোচ্চ দাম: {highest} টাকা")'
        ],
        correctOrder: [0, 1, 2],
        explanation: {
          en: 'Define shop dict, call max() on shop.values(), and print the peak price.',
          bn: 'নিনির টিপস: ডিকশনারি তৈরি করে values() এর ওপর max() চালাও, তারপর সর্বোচ্চ দাম প্রিন্ট করো।'
        },
        xpReward: 35
      },
      {
        type: 'output_predict',
        id: 'p8-exam-e6',
        question: {
          en: 'What is printed by accessing this list of dictionaries?',
          bn: 'ডিকশনারির এই লিস্টটির আউটপুট কী হবে?'
        },
        code: 'heroes = [\n    {"name": "নিনি", "score": 100},\n    {"name": "রাফি", "score": 85}\n]\nprint(heroes[0]["name"])',
        options: ['নিনি', 'রাফি', '100', 'Error'],
        correctIndex: 0,
        explanation: {
          en: 'heroes[0] gets the first dictionary, and ["name"] extracts "নিনি"!',
          bn: 'নিনি বলছে: সাবাশ! heroes[0] হলো প্রথম ডিকশনারি, আর ["name"] দিলে "নিনি" নাম পাওয়া যায়।'
        },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'p8-exam-e7',
        question: {
          en: 'What is the main advantage of a dictionary over a list for looking up student data by ID?',
          bn: 'স্টুডেন্ট আইডি দিয়ে তথ্য খোঁজার ক্ষেত্রে লিস্টের চেয়ে ডিকশনারির প্রধান সুবিধা কী?'
        },
        options: [
          'ডিকশনারিতে কী (ID) দিয়ে সরাসরি ও চোখের পলকে খোঁজা যায়, পুরো তালিকা ঘুরতে হয় না',
          'ডিকশনারি মেমোরি কম ব্যবহার করে',
          'ডিকশনারিতে ইনডেক্স উল্টো থাকে',
          'কোনো সুবিধা নেই'
        ],
        correctIndex: 0,
        explanation: {
          en: 'Dictionary keys allow instant O(1) lookups by identifier without looping through all elements!',
          bn: 'নিনির টিপস: ডিকশনারির সবচেয়ে বড় জাদু হলো কী দিয়ে তৎক্ষণাৎ সরাসরি তথ্য খুঁজে পাওয়া যায়, পুরো ডাটা ঘাঁটতে হয় না।'
        },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p8-exam-e8',
        question: {
          en: 'What does this list modification and sorting print?',
          bn: 'লিস্টের এই কোডটি কী প্রিন্ট করবে?'
        },
        code: 'scores = [50, 20, 80]\nscores.sort()\nprint(scores[0])',
        options: ['20', '50', '80', 'None'],
        correctIndex: 0,
        explanation: {
          en: 'scores.sort() organizes numbers in ascending order: [20, 50, 80]. Index [0] is 20!',
          bn: 'নিনির টিপস: .sort() ছোট থেকে বড় ক্রমে সাজায় ([২০, ৫০, ৮০])। ফলে ইনডেক্স ০-তে এখন সবচেয়ে ছোট সংখ্যা ২০!'
        },
        xpReward: 25
      }
    ]
  }
];

