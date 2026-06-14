import type { Lesson } from '../../schema';

export const project1Lessons: Lesson[] = [
  {
    id: 'p1-hello',
    sectionId: 'chatterbox-bot',
    order: 1,
    title: { en: 'Greeting the World', bn: 'বিশ্বকে অভিবাদন' },
    description: { en: 'Teach your robot to say its first words.', bn: 'আপনার রোবটকে তার প্রথম কথা বলা শেখান।' },
    difficulty: 'beginner',
    xpReward: 100,
    estimatedMinutes: 5,
    theory: [
      {
        heading: { en: 'Python Talk', bn: 'পাইথন কথা' },
        body: { en: 'In Python, we use `print()` to show text on the screen.', bn: 'পাইথনে স্ক্রিনে টেক্সট দেখানোর জন্য আমরা `print()` ব্যবহার করি।' },
        code: {
          code: 'print("Hello, Human!")',
          language: 'python',
          explanation: { en: 'This will display "Hello, Human!"', bn: 'এটি "Hello, Human!" প্রদর্শন করবে।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p1-e1',
        question: { en: 'How do you say "Hello" in Python?', bn: 'পাইথনে "Hello" বলতে কী ব্যবহার করা হয়?' },
        options: ['print("Hello")', 'show("Hello")', 'echo "Hello"'],
        correctIndex: 0,
        explanation: { en: '`print()` is the magic word.', bn: '`print()` হলো সেই জাদুকরী শব্দ।' },
        xpReward: 20
      }
    ]
  },
  {
    id: 'p1-input',
    sectionId: 'chatterbox-bot',
    order: 2,
    title: { en: 'Listening to Humans', bn: 'মানুষের কথা শুনছি' },
    description: { en: 'Get the user\'s name using input().', bn: 'input() ব্যবহার করে ইউজারের নাম সংগ্রহ করুন।' },
    difficulty: 'beginner',
    xpReward: 100,
    estimatedMinutes: 10,
    theory: [
      {
        heading: { en: 'Input', bn: 'ইনপুট' },
        body: { en: 'To get info from a human, we use `input()`.', bn: 'মানুষের কাছ থেকে তথ্য নিতে আমরা `input()` ব্যবহার করি।' },
        code: {
          code: 'name = input("Enter name: ")',
          language: 'python',
          explanation: { en: 'Wait for the user to type something.', bn: 'ইউজার কিছু টাইপ করা পর্যন্ত অপেক্ষা করবে।' }
        }
      }
    ],
    exercises: [
      {
        type: 'fill_blank',
        id: 'p1-e2',
        question: { en: 'Complete the code to get age:', bn: 'বয়স সংগ্রহ করতে কোডটি সম্পন্ন করুন:' },
        codeTemplate: `age = ___("Enter age: ")`,
        blanks: ['input'],
        explanation: { en: 'Use `input` to get data.', bn: 'ডাটা সংগ্রহ করতে `input` ব্যবহার করুন।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p1-vars',
    sectionId: 'chatterbox-bot',
    order: 3,
    title: { en: 'Remembering Names', bn: 'নাম মনে রাখা' },
    description: { en: 'Store names in containers called variables.', bn: 'ভেরিয়েবল নামক আধারে নাম জমা রাখুন।' },
    difficulty: 'beginner',
    xpReward: 100,
    estimatedMinutes: 5,
    theory: [
      {
        heading: { en: 'Variables', bn: 'ভেরিয়েবল' },
        body: { en: 'Variables store data for later use.', bn: 'ভেরিয়েবল পরবর্তীতে ব্যবহারের জন্য ডাটা জমা রাখে।' },
        code: {
          code: 'my_bot = "Zorg"\nprint(my_bot)',
          language: 'python',
          explanation: { en: '`my_bot` is a variable holding "Zorg".', bn: '`my_bot` একটি ভেরিয়েবল যা "Zorg" ধারণ করে।' }
        }
      }
    ],
    exercises: [
      {
        type: 'code_arrange',
        id: 'p1-e3',
        question: { en: 'Arrange to greet the user:', bn: 'ইউজারকে অভিবাদন জানাতে সাজান:' },
        blocks: ['user = "Joy"', 'print("Hi " + user)'],
        correctOrder: [0, 1],
        explanation: { en: 'Define before using.', bn: 'ব্যবহারের আগে সংজ্ঞায়িত করুন।' },
        xpReward: 50
      }
    ]
  },
  {
    id: 'p1-capstone',
    sectionId: 'chatterbox-bot',
    order: 4,
    isProject: true,
    title: { en: 'PROJECT: Construct the Bot', bn: 'প্রজেক্ট: বট তৈরি করুন' },
    description: { en: 'Combine everything to build your first Chatbot.', bn: 'সবকিছুর সমন্বয়ে আপনার প্রথম চ্যাটবট তৈরি করুন।' },
    difficulty: 'beginner',
    xpReward: 250,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Project Goals', bn: 'প্রজেক্ট লক্ষ্য' },
        body: { en: 'You will create a script that asks for a name and responds with a greeting.', bn: 'আপনি এমন একটি স্ক্রিপ্ট তৈরি করবেন যা নাম জিজ্ঞাসা করবে এবং অভিবাদনের মাধ্যমে উত্তর দেবে।' }
      }
    ],
    exercises: [
      {
        type: 'bug_hunt',
        id: 'p1-e4',
        question: { en: 'Fix the greeting bot code:', bn: 'গ্রিটিং বট কোডটি ঠিক করুন:' },
        code: 'name = input("Name?")\nprint("Hello " + name)\nprint "Welcome!"',
        buggyLine: 3,
        explanation: { en: 'In Python 3, `print` needs parentheses `()`.', bn: 'পাইথন ৩-এ `print`-এর সাথে ব্র্যাকেট `()` প্রয়োজন।' },
        xpReward: 100
      }
    ]
  }
];
