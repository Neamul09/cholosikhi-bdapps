import type { Lesson } from '../../schema';

// Unit 8: Inventory Master — lessonIds: ['p8-lists', 'p8-dicts', 'p8-exam']
export const unit8Lessons: Lesson[] = [
  {
    id: 'p8-lists',
    sectionId: 'p-unit8',
    order: 1,
    title: { en: 'The Treasure Chest', bn: 'গুপ্তধনের বাক্স' },
    description: { en: 'Store, access, and modify lists.', bn: 'লিস্ট জমা, অ্যাক্সেস এবং পরিবর্তন করুন।' },
    difficulty: 'intermediate',
    xpReward: 140,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Python Lists', bn: 'পাইথন লিস্ট' },
        body: { en: 'A list stores multiple items in order. Access items with index [0], [1]... Negative index [-1] gives the last item.', bn: 'একটি লিস্ট ক্রমানুসারে একাধিক আইটেম জমা রাখে। ইনডেক্স [0], [1]... দিয়ে আইটেম অ্যাক্সেস করা যায়। নেগেটিভ ইনডেক্স [-1] শেষ আইটেম রিটার্ন করে।' },
        code: {
          code: 'items = ["Sword", "Shield", "Potion"]\nprint(items[0])   # Sword\nprint(items[-1])  # Potion\nitems.append("Map")\nprint(len(items)) # 4',
          language: 'python',
          explanation: { en: 'append() adds to the end. len() gives the count.', bn: 'append() শেষে ভ্যালু যোগ করে। len() আইটেমের সংখ্যা রিটার্ন করে।' }
        }
      },
      {
        heading: { en: 'List Methods', bn: 'লিস্ট মেথড' },
        body: { en: 'append(x): add x to end. remove(x): delete x. pop(): remove last. sort(): sort the list.', bn: 'append(x): শেষে x যোগ করে। remove(x): x মুছে দেয়। pop(): লিস্টের শেষ ভ্যালুটি সরায়। sort(): লিস্ট বড় থেকে ছোট ক্রমে সাজায়। reverse(): লিস্টti উলটো করে দেয়।' }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p8-lists-e1',
        question: { en: 'What is the index of the first item in a list?', bn: 'একটি লিস্টের প্রথম আইটেমের ইনডেক্স কত?' },
        options: ['0', '1', '-1', 'first'],
        correctIndex: 0,
        explanation: { en: 'Python lists are zero-indexed.', bn: 'পাইথন লিস্ট শূন্য-ইনডেক্সড।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p8-lists-e2',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'nums = [10, 20, 30]\nnums.append(40)\nprint(nums[-1])',
        options: ['40', '30', '10'],
        correctIndex: 0,
        explanation: { en: 'append adds 40 to end. [-1] is the last item.', bn: 'append শেষে 40 যোগ করে। [-1] শেষ আইটেম।' },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p8-lists-e3',
        question: { en: 'Get the number of items:', bn: 'আইটেমের সংখ্যা পান:' },
        codeTemplate: 'bag = ["apple", "book"]\nsize = ___(bag)\nprint(size)',
        blanks: ['len'],
        explanation: { en: 'len() returns the number of elements.', bn: 'len() উপাদানের সংখ্যা ফেরত দেয়।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p8-lists-e4',
        question: { en: 'How do you remove the last item?', bn: 'শেষ আইটেম কীভাবে সরাবেন?' },
        options: ['list.pop()', 'list.remove()', 'list.delete()', 'list.last()'],
        correctIndex: 0,
        explanation: { en: 'pop() removes and returns the last item.', bn: 'pop() শেষ আইটেম সরিয়ে দেয় এবং ফেরত দেয়।' },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p8-lists-e5',
        question: { en: 'Build inventory: add item and loop through:', bn: 'ইনভেন্টরি তৈরি করুন: আইটেম যোগ করুন এবং লুপ করুন:' },
        blocks: ['inv = ["food", "water"]', 'inv.append("map")', 'for item in inv:', '    print(item)'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Create, add, then loop.', bn: 'তৈরি করুন, যোগ করুন, তারপর লুপ করুন।' },
        xpReward: 35
      }
    ]
  },
  {
    id: 'p8-dicts',
    sectionId: 'p-unit8',
    order: 2,
    title: { en: 'The Secret Decoder', bn: 'গোপন ডিকোডার' },
    description: { en: 'Use Key-Value pairs with Dictionaries.', bn: 'ডিকশনারির মাধ্যমে কি-ভ্যালু জোড়া ব্যবহার করুন।' },
    difficulty: 'intermediate',
    xpReward: 140,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Dictionaries', bn: 'ডিকশনারি' },
        body: { en: 'A dictionary stores data as key: value pairs. Access values using keys, not numeric indexes.', bn: 'ডিকশনারি key: value জোড়া হিসেবে ডাটা জমা রাখে। সংখ্যাসূচক ইনডেক্স নয়, কি ব্যবহার করে মান অ্যাক্সেস করুন।' },
        code: {
          code: 'hero = {"name": "Zara", "hp": 100, "level": 5}\nprint(hero["name"])  # Zara\nhero["hp"] -= 20\nprint(hero["hp"])    # 80',
          language: 'python',
          explanation: { en: 'Access and modify values using keys.', bn: 'কি ব্যবহার করে মান অ্যাক্সেস এবং পরিবর্তন করুন।' }
        }
      },
      {
        heading: { en: 'Dict Methods', bn: 'Dict মেথড' },
        body: { en: 'dict.keys(): all keys. dict.values(): all values. dict.get(k, default): safe access.', bn: 'dict.keys(): সব কি। dict.values(): সব মান। dict.get(k, default): নিরাপদ অ্যাক্সেস।' }
      }
    ],
    exercises: [
      {
        type: 'fill_blank',
        id: 'p8-dicts-e1',
        question: { en: 'Access the "name" key:', bn: '"name" কি অ্যাক্সেস করুন:' },
        codeTemplate: 'profile = {"name": "Ravi", "age": 17}\nprint(profile[___])',
        blanks: ['"name"'],
        explanation: { en: 'Use the key string inside square brackets.', bn: 'স্কয়ার ব্র্যাকেটের ভেতরে কি স্ট্রিং ব্যবহার করুন।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p8-dicts-e2',
        question: { en: 'How do you add a new key to a dict?', bn: 'একটি dict এ নতুন কি কীভাবে যোগ করবেন?' },
        options: ['dict["new_key"] = value', 'dict.add("new_key")', 'dict.append(value)', 'dict.insert("new_key")'],
        correctIndex: 0,
        explanation: { en: 'Assign directly with a new key.', bn: 'নতুন কি দিয়ে সরাসরি নির্ধারণ করুন।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p8-dicts-e3',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'stats = {"kills": 5, "deaths": 2}\nkd = stats["kills"] / stats["deaths"]\nprint(kd)',
        options: ['2.5', '3', '5'],
        correctIndex: 0,
        explanation: { en: '5 / 2 = 2.5.', bn: '৫ / ২ = ২.৫।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p8-dicts-e4',
        question: { en: 'What does dict.get("hp", 0) do if "hp" not present?', bn: '"hp" না থাকলে dict.get("hp", 0) কী করে?' },
        options: ['Returns 0', 'Raises KeyError', 'Returns None', 'Adds "hp"'],
        correctIndex: 0,
        explanation: { en: 'get() returns the default value if key is missing.', bn: 'কি অনুপস্থিত হলে get() ডিফল্ট মান ফেরত দেয়।' },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'p8-dicts-e5',
        question: { en: 'Fix the key error:', bn: 'কি এরর ঠিক করুন:' },
        code: 'player = {"name": "Leo"}\nprint(player["score"])',
        buggyLine: 2,
        explanation: { en: '"score" key does not exist. Use player.get("score", 0) for safety.', bn: '"score" কি নেই। নিরাপত্তার জন্য player.get("score", 0) ব্যবহার করুন।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p8-exam',
    sectionId: 'p-unit8',
    order: 3,
    isProject: true,
    title: { en: 'Unit Exam: Inventory Master', bn: 'ইউনিট পরীক্ষা: ইনভেন্টরি মাস্টার' },
    description: { en: 'Test your lists and dict skills.', bn: 'লিস্ট ও dict দক্ষতা পরীক্ষা করুন।' },
    difficulty: 'intermediate',
    xpReward: 350,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Inventory Exam', bn: 'ইনভেন্টরি পরীক্ষা' },
        body: { en: 'You will combine lists and dictionaries in a real inventory challenge.', bn: 'আপনি একটি বাস্তব ইনভেন্টরি চ্যালেঞ্জে লিস্ট এবং ডিকশনারি একত্রিত করবেন।' }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'p8-exam-e1',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'inv = ["apple", "sword", "map"]\ninv.remove("sword")\nprint(len(inv))',
        options: ['2', '3', '1'],
        correctIndex: 0,
        explanation: { en: 'remove("sword") deletes it. 3-1 = 2 items left.', bn: 'remove("sword") মুছে দেয়। ৩-১ = ২টি আইটেম বাকি।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'p8-exam-e2',
        question: { en: 'Loop over dictionary values:', bn: 'ডিকশনারির মান লুপ করুন:' },
        codeTemplate: 'shop = {"apple": 5, "sword": 50}\nfor item, price in shop.___():\n    print(item, price)',
        blanks: ['items'],
        explanation: { en: '.items() returns (key, value) pairs to loop over.', bn: '.items() (key, value) জোড়া ফেরত দেয়।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'p8-exam-e3',
        question: { en: 'What is a valid way to check if a key exists?', bn: 'একটি কি আছে কিনা জানার বৈধ উপায় কোনটি?' },
        options: ['"key" in my_dict', 'my_dict.has("key")', 'my_dict.exists("key")', 'my_dict.contains("key")'],
        correctIndex: 0,
        explanation: { en: 'Use "in" operator to check membership.', bn: 'সদস্যপদ পরীক্ষা করতে "in" অপারেটর ব্যবহার করুন।' },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'p8-exam-e4',
        question: { en: 'Fix the list concatenation:', bn: 'লিস্ট সংযোজন ঠিক করুন:' },
        code: 'a = [1, 2, 3]\nb = [4, 5]\nc = a + b\nprint(c[10])',
        buggyLine: 4,
        explanation: { en: 'c has only 5 items (index 0-4). Index 10 does not exist.', bn: 'c এ মাত্র ৫টি আইটেম (ইনডেক্স 0-4)। ইনডেক্স 10 নেই।' },
        xpReward: 35
      },
      {
        type: 'code_arrange',
        id: 'p8-exam-e5',
        question: { en: 'Build a shop and find most expensive item:', bn: 'একটি দোকান তৈরি করুন এবং সবচেয়ে দামি আইটেম খুঁজুন:' },
        blocks: ['shop = {"bread": 2, "milk": 3, "cheese": 8}', 'max_price = max(shop.values())', 'print("Max price:", max_price)'],
        correctOrder: [0, 1, 2],
        explanation: { en: 'max() on values() finds the highest price.', bn: 'values() এ max() সর্বোচ্চ মূল্য খুঁজে পায়।' },
        xpReward: 55
      }
    ]
  }
];
