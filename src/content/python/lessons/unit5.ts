import type { Lesson } from '../../schema';

// Unit 5: Boolean Logic — lessonIds: ['p5-and', 'p5-or', 'p5-exam']
export const unit5Lessons: Lesson[] = [
  {
    id: 'p5-and',
    sectionId: 'p-unit5',
    order: 1,
    title: { en: 'The AND Gate', bn: 'AND গেট' },
    description: { en: 'Combine conditions with and & not.', bn: 'and ও not দিয়ে শর্ত একত্রিত করুন।' },
    difficulty: 'intermediate',
    xpReward: 130,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'and / not', bn: 'and / not' },
        body: { en: 'and returns True only if BOTH conditions are True. not flips True to False and vice versa.', bn: 'and শুধুমাত্র তখন True দেয় যখন উভয় শর্ত True হয়। not,  True কে False এবং False কে True করে দেয়।' },
        code: {
          code: 'age = 20\nhas_ticket = True\nif (age >= 18) and (has_ticket):\n    print("Welcome!")',
          language: 'python',
          explanation: { en: 'Both conditions must be True to enter.', bn: 'প্রবেশের জন্য উভয় শর্ত True হতে হবে।' }
        }
      },
      {
        heading: { en: 'Truth Table for "and"', bn: '"and" এর সত্য সারণি' },
        body: { en: 'True and True = True. True and False = False. False and True = False. False and False = False.', bn: 'True and True = True। True and False = False। False and True = False। False and False = False।' }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p5-and-e1',
        question: { en: 'What is: True and False?', bn: 'True and False কত?' },
        options: ['False', 'True', 'Error', 'None'],
        correctIndex: 0,
        explanation: { en: 'and requires BOTH to be True.', bn: 'and এর জন্য উভয়কেই True হতে হবে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p5-and-e2',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'x = 7\nif x > 5 and x < 10:\n    print("In range")',
        options: ['In range', 'Nothing', 'Error'],
        correctIndex: 0,
        explanation: { en: '7 > 5 is True AND 7 < 10 is True, so both pass.', bn: '7 > 5 True এবং 7 < 10 True, উভয় condition ই True, তাই "In range" প্রিন্ট হবে।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p5-and-e3',
        question: { en: 'What does not True evaluate to?', bn: 'not True এর ভ্যালু কী হবে?' },
        options: ['False', 'True', '0', 'Error'],
        correctIndex: 0,
        explanation: { en: 'not flips the boolean value.', bn: 'not বুলিয়ান মানকে উল্টে দেয়।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p5-and-e4',
        question: { en: 'Check if player is alive and has ammo:', bn: 'প্লেয়ার জীবিত এবং প্লেয়ারের কাছে গুলি আছে কিনা পরীক্ষা করুন:' },
        codeTemplate: 'if alive ___ has_ammo:\n    print("Shoot!")',
        blanks: ['and'],
        explanation: { en: 'Use "and" to fulfill both conditions.', bn: 'উভয় শর্ত পূরনের জন্য "and" ব্যবহার করুন।' },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p5-and-e5',
        question: { en: 'VIP access: age must be over 18 and have VIP pass:', bn: 'VIP অ্যাক্সেস: বয়স ১৮ এর বেশি হতে হবে এবং VIP পাস থাকতে হবে:' },
        blocks: ['age = 21', 'has_pass = True', 'if age > 18 and has_pass:', '    print("VIP Access!")'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Both age and pass must be satisfied.', bn: 'বয়স এবং VIP পাস উভয় শর্তই পূরণ হতে হবে।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p5-or',
    sectionId: 'p-unit5',
    order: 2,
    title: { en: 'The OR Gate', bn: 'OR গেট' },
    description: { en: 'Use "or" for fulfilling one of the conditions.', bn: 'অন্তত একটি শর্ত পূরনের জন্য "or" ব্যবহার করুন।' },
    difficulty: 'intermediate',
    xpReward: 130,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'or operator', bn: 'or অপারেটর' },
        body: { en: '"or" returns True if at LEAST ONE condition is True. Only "False or False" gives False.', bn: '"or" True দেয় যদি অন্তত একটি শর্ত True হয়। শুধুমাত্র "False or False" হলে False পাওয়া যায়।' },
        code: {
          code: 'weapon = "sword"\nif weapon == "sword" or weapon == "bow":\n    print("Combat ready!")',
          language: 'python',
          explanation: { en: 'Any matching weapon qualifies.', bn: 'যেকোনো একটি অস্ত্র মিলে গেলেই সম্পূর্ণ শর্ত True বলে বিবেচিত হয়' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p5-or-e1',
        question: { en: 'What is: "False or True"?', bn: '"False or True" বলতে কী বোঝায়?' },
        options: ['True', 'False', 'Error', 'None'],
        correctIndex: 0,
        explanation: { en: '"or" only needs one True to be True.', bn: '"or" এর জন্য মাত্র একটি শর্ত true হলেই ফলাফল true হবে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p5-or-e2',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'day = "Saturday"\nif day == "Saturday" or day == "Sunday":\n    print("Weekend!")',
        options: ['Weekend!', 'Nothing', 'Error'],
        correctIndex: 0,
        explanation: { en: 'Saturday matches the first "or" condition.', bn: 'Saturday প্রথম "or" শর্তের সাথে মিলে যায়, তাই "Weekend!" প্রিন্ট হবে।' },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p5-or-e3',
        question: { en: 'Escape if rope or ladder exists:', bn: 'দড়ি বা মই থাকলে পালিয়ে যান:' },
        codeTemplate: 'if has_rope ___ has_ladder:\n    print("Escape!")',
        blanks: ['or'],
        explanation: { en: 'Use "or" when either condition is sufficient.', bn: 'যেকোনো একটি শর্ত যথেষ্ট হলে "or" ব্যবহার করুন।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p5-or-e4',
        question: { en: 'What is: "False or False"?', bn: '"False or False" বলতে কী বোঝায়?' },
        options: ['False', 'True', 'None', 'Error'],
        correctIndex: 0,
        explanation: { en: 'Both are False, so "or" gives False.', bn: 'উভয় শর্তই False, তাই "or" False দেয়।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p5-or-e5',
        question: { en: 'Fix the logic:', bn: 'লজিকটি ঠিক করুন:' },
        code: 'color = "blue"\nif color == "red" and color == "blue":\n    print("Match!")',
        buggyLine: 2,
        explanation: { en: 'Color cannot be both red and blue at a time. Use "or" instead.', bn: 'Color একই সময়ে লাল এবং নীল হতে পারে না। তাই "and" এর পরিবর্তে "or" ব্যবহার করুন।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p5-exam',
    sectionId: 'p-unit5',
    order: 3,
    isProject: true,
    title: { en: 'Unit Exam: Boolean Logic', bn: 'ইউনিট পরীক্ষা: বুলিয়ান লজিক' },
    description: { en: 'Master and, or, not in combined challenges.', bn: 'কম্বাইন্ড চ্যালেঞ্জে and, or, not এর দক্ষতা যাচাই করুন।' },
    difficulty: 'intermediate',
    xpReward: 300,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Boolean Operators Summary', bn: 'বুলিয়ান অপারেটর সারসংক্ষেপ' },
        body: { en: 'and: both must be True. or: at least one must be True. not: flips the value.', bn: 'and: উভয়কেই True হতে হবে। or: অন্তত একটি True হতে হবে। not: ভ্যালুকে উল্টিয়ে দেয়।' }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'p5-exam-e1',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'x = 5\nif not (x > 10):\n    print("Small number")',
        options: ['Small number', 'Nothing', 'Error'],
        correctIndex: 0,
        explanation: { en: 'x > 10 is False, "not False" is True, so it prints "Small number".', bn: 'x > 10 শর্তটি False, কিন্তু "not False" শর্তটি True, তাই "Small number" প্রিন্ট হবে।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'p5-exam-e2',
        question: { en: 'What is: True or (False and True)?', bn: 'True or (False and True) বলতে কী বোঝায়?' },
        options: ['True', 'False', 'None', 'Error'],
        correctIndex: 0,
        explanation: { en: '(False and True) = False. So, True or False = True.', bn: '(False and True) = False। সুতরাং, True or False = True।' },
        xpReward: 35
      },
      {
        type: 'fill_blank',
        id: 'p5-exam-e3',
        question: { en: 'Check neither condition is True:', bn: 'কোনো শর্তই True নয় কিনা পরীক্ষা করুন:' },
        codeTemplate: 'if ___ raining and ___ windy:\n    print("Perfect day!")',
        blanks: ['not', 'not'],
        explanation: { en: 'not before each condition flips the condition.', bn: 'প্রতিটি শর্তের আগে not ব্যবহার করলে শর্তটি উল্টে যায়।' },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'p5-exam-e4',
        question: { en: 'Fix the operator:', bn: 'অপারেটরটি ঠিক করুন:' },
        code: 'hp = 0\nmp = 0\nif not hp or not mp:\n    print("Game over")',
        buggyLine: 3,
        explanation: { en: 'if not hp and not mp — both must be 0.', bn: 'if not hp and not mp — উভয়কেই 0 হতে হবে।' },
        xpReward: 40
      },
      {
        type: 'code_arrange',
        id: 'p5-exam-e5',
        question: { en: 'Build the "admin or vip" access check:', bn: '"admin বা vip" অ্যাক্সেস চেক করে প্রোগ্রামটি তৈরি করুন:' },
        blocks: ['role = "vip"', 'if role == "admin" or role == "vip":', '    print("Full access!")', 'else:', '    print("Limited access")'],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: { en: 'Either role qualifies for full access.', bn: 'উভয় role ই পূর্ণ অ্যাক্সেসের জন্য যোগ্য।' },
        xpReward: 50
      }
    ]
  }
];
