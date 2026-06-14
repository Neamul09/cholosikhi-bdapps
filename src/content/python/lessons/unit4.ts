import type { Lesson } from '../../schema';

// Unit 4: Hero's Quest — lessonIds: ['p4-if', 'p4-else', 'p4-exam']
export const unit4Lessons: Lesson[] = [
  {
    id: 'p4-if',
    sectionId: 'p-unit4',
    order: 1,
    title: { en: 'The Guard Dog', bn: 'পাহারাদার কুকুর' },
    description: { en: 'Make decisions with if statements.', bn: 'if স্টেটমেন্ট দিয়ে সিদ্ধান্ত নিন।' },
    difficulty: 'beginner',
    xpReward: 120,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'If Statements', bn: 'If স্টেটমেন্ট' },
        body: { en: 'An if statement runs code only when a condition is True. The code inside must be indented.', bn: 'if স্টেটমেন্ট শুধুমাত্র তখনই কোড চালায় যখন একটি শর্ত True হয়। ভেতরের কোড অবশ্যই ইন্ডেন্টেড হতে হবে।' },
        code: {
          code: 'age = 18\nif age >= 18:\n    print("You may enter!")',
          language: 'python',
          explanation: { en: 'Only prints if age is 18 or more.', bn: 'শুধুমাত্র বয়স ১৮ বা তার বেশি হলেই প্রিন্ট করে।' }
        }
      },
      {
        heading: { en: 'Comparison Operators', bn: 'তুলনা অপারেটর' },
        body: { en: 'Use == (equal), != (not equal), < (less than), > (greater than), <=, >= to compare values.', bn: '== (সমান), != (সমান নয়), < (কম), > (বেশি), <=, >= ব্যবহার করে মান তুলনা করুন।' }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p4-if-e1',
        question: { en: 'Which symbol checks equality?', bn: 'কোন প্রতীক সমতা নির্দেশ করে?' },
        options: ['==', '=', '!=', '<='],
        correctIndex: 0,
        explanation: { en: '== compares values. = assigns values.', bn: '== মান তুলনা করে। = মান নির্ধারণ করে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p4-if-e2',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'score = 85\nif score >= 90:\n    print("A grade")',
        options: ['Nothing', 'A grade', 'Error'],
        correctIndex: 0,
        explanation: { en: '85 is not >= 90, so the "if" block is skipped.', bn: '৮৫ >= ৯০ নয়, তাই "if" ব্লকটি কার্যকর হয় না।' },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p4-if-e3',
        question: { en: 'Check if health is positive:', bn: 'health ধনাত্মক কিনা পরীক্ষা করুন:' },
        codeTemplate: 'health = 10\nif health ___ 0:\n    print("Alive!")',
        blanks: ['>'],
        explanation: { en: '">" checks if health is greater than 0.', bn: '">" পরীক্ষা করে health শূন্যের চেয়ে বড় কিনা।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p4-if-e4',
        question: { en: 'What must follow an if condition?', bn: 'if শর্তের পরে কী ব্যবহার করতে হবে?' },
        options: ['A colon :', 'A semicolon ;', 'Curly braces {}', 'Nothing'],
        correctIndex: 0,
        explanation: { en: 'Python uses a colon after if conditions.', bn: 'পাইথনে if শর্তের পরে কোলন ব্যবহার হয়।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'p4-if-e5',
        question: { en: 'Find the indentation bug:', bn: 'ইন্ডেন্টেশন বাগটি খুঁজুন:' },
        code: 'x = 5\nif x > 0:\nprint("Positive")',
        buggyLine: 3,
        explanation: { en: 'The print must be indented inside the if block.', bn: 'print অবশ্যই if ব্লকের ভেতরে ইন্ডেন্টেড হতে হবে।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p4-else',
    sectionId: 'p-unit4',
    order: 2,
    title: { en: 'The Other Path', bn: 'অন্য পথ' },
    description: { en: 'Handle both outcomes with if/elif/else.', bn: 'if/elif/else দিয়ে উভয় ফলাফল নিয়ন্ত্রণ করুন' },
    difficulty: 'beginner',
    xpReward: 120,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'else and elif', bn: 'else এবং elif' },
        body: { en: 'else runs when if is False. elif lets you check more conditions in between.', bn: 'if মিথ্যা হলে else কাজ করে। elif মাঝখানে আরও শর্ত পরীক্ষা করার সুযোগ দেয়।' },
        code: {
          code: 'score = 72\nif score >= 90:\n    print("A")\nelif score >= 70:\n    print("B")\nelse:\n    print("C or below")',
          language: 'python',
          explanation: { en: 'Checks A first, then B, then defaults to C.', bn: 'প্রথমে A পরীক্ষা করে, তারপর B, তারপর C-তে স্বয়ংক্রিয়ভাবে কাজ করে।' }
        }
      }
    ],
    exercises: [
      {
        type: 'fill_blank',
        id: 'p4-else-e1',
        question: { en: 'Add a default case:', bn: 'একটি ডিফল্ট কেস যোগ করুন:' },
        codeTemplate: 'if rain:\n    print("Umbrella")\n___:\n    print("Sunny day")',
        blanks: ['else'],
        explanation: { en: 'else handles all other cases.', bn: 'else অন্য কেসগুলো নিয়ন্ত্রণ করে।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p4-else-e2',
        question: { en: 'How many else blocks can an if have?', bn: 'একটি if এ কতটি else ব্লক থাকতে পারে?' },
        options: ['Only one', 'Multiple', 'Zero', 'Unlimited'],
        correctIndex: 0,
        explanation: { en: 'Only ONE else per if. Use elif for multiple checks.', bn: 'প্রতিটি if এ মাত্র একটি else থাকতে পারে। একাধিক চেকের জন্য elif ব্যবহার করা হয়।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p4-else-e3',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'hp = 0\nif hp > 0:\n    print("Alive")\nelif hp == 0:\n    print("Dead")\nelse:\n    print("Unknown")',
        options: ['Dead', 'Alive', 'Unknown'],
        correctIndex: 0,
        explanation: { en: 'hp == 0 matches the elif condition.', bn: 'hp == 0 elif শর্তের সাথে মিলে যায়।' },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'p4-else-e4',
        question: { en: 'Build a grade checker:', bn: 'একটি গ্রেড চেকার তৈরি করুন:' },
        blocks: ['marks = 78', 'if marks >= 80:', '    print("Distinction")', 'else:', '    print("Pass")'],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: { en: 'Check marks then print appropriate grade.', bn: 'নম্বর চেক করুন তারপর উপযুক্ত গ্রেড প্রিন্ট করুন।' },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'p4-else-e5',
        question: { en: 'Fix the elif bug:', bn: 'elif এর বাগটি ঠিক করুন:' },
        code: 'x = 5\nif x > 10:\n    print("Big")\nelif:\n    print("Small")',
        buggyLine: 4,
        explanation: { en: 'elif must have a condition: elif x <= 10:', bn: 'elif এর অবশ্যই একটি শর্ত থাকতে হবে: elif x <= 10:' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p4-exam',
    sectionId: 'p-unit4',
    order: 3,
    isProject: true,
    title: { en: "Unit Exam: Hero's Quest", bn: 'ইউনিট পরীক্ষা: হিরোর কোয়েস্ট' },
    description: { en: 'Test your if/elif/else skills.', bn: 'if/elif/else দক্ষতা পরীক্ষা করুন।' },
    difficulty: 'intermediate',
    xpReward: 250,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Exam Challenge', bn: 'পরীক্ষার চ্যালেঞ্জ' },
        body: { en: 'You will face 5 challenges combining if, elif, else and comparison operators.', bn: 'আপনি if, elif, else এবং comparison অপারেটর একত্রিত করে ৫টি চ্যালেঞ্জের সম্মুখিন হবেন।' }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p4-exam-e1',
        question: { en: 'What is printed when x = 15?', bn: 'x = 15 হলে কী প্রিন্ট হবে?' },
        code: 'x = 15\nif x > 20:\n    print("Big")\nelif x > 10:\n    print("Medium")\nelse:\n    print("Small")',
        options: ['Medium', 'Big', 'Small'],
        correctIndex: 0,
        explanation: { en: '15 is not >20, but it is >10, so "Medium" prints.', bn: '15 >20 নয়, কিন্তু এটি >10, তাই "Medium" প্রিন্ট হয়।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'p4-exam-e2',
        question: { en: 'Check if door NOT equal to blue:', bn: 'দরজাটি নীল কিনা পরীক্ষা করুন:' },
        codeTemplate: 'door = "red"\nif door ___ "blue":\n    print("Wrong door!")',
        blanks: ['!='],
        explanation: { en: '!= means "not equal to".', bn: '!= মানে "সমান নয়"।' },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'p4-exam-e3',
        question: { en: 'What does this output?', bn: 'এটি কী আউটপুট দেয়?' },
        code: 'a = True\nb = False\nif a and not b:\n    print("Quest started!")',
        options: ['Quest started!', 'Nothing', 'Error'],
        correctIndex: 0,
        explanation: { en: 'a is True, b is False, so the condition passes.', bn: 'a True, b False, তাই শর্তটি কার্যকর হয়।' },
        xpReward: 35
      },
      {
        type: 'bug_hunt',
        id: 'p4-exam-e4',
        question: { en: 'Fix the logic error:', bn: 'লজিক এরর ঠিক করুন:' },
        code: 'power = 100\nif power = 100:\n    print("Full power!")',
        buggyLine: 2,
        explanation: { en: 'Use == for comparison, not = (which is assignment).', bn: 'তুলনার জন্য == ব্যবহার করুন, = নয় (এটি এসাইমেন্ট অপারেটর)।' },
        xpReward: 40
      },
      {
        type: 'code_arrange',
        id: 'p4-exam-e5',
        question: { en: 'Arrange the dungeon door logic:', bn: 'ডাঞ্জিয়নের দরজার লজিক সাজান:' },
        blocks: ['door = "red"', 'if door == "green":', '    print("Safe!")', 'elif door == "red":', '    print("Danger!")'],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: { en: 'Define door, check green first, then check red.', bn: 'দরজা নির্ধারণ করুন, প্রথমে সবুজ চেক করুন, তারপর লালটি।' },
        xpReward: 50
      }
    ]
  }
];
