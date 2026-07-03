import type { Lesson } from '../../schema';

// Helper to create unique exercises for Unit 1
export const unit1Lessons: Lesson[] = [
  {
    id: 'p1-hello',
    sectionId: 'p-unit1',
    order: 1,
    title: { en: 'Hello World!', bn: 'হ্যালো ওয়ার্ল্ড!' },
    description: { en: 'Your first step into Python coding.', bn: 'পাইথন কোডিংয়ে আপনার প্রথম ধাপ।' },
    difficulty: 'beginner',
    xpReward: 300,
    estimatedMinutes: 20,
    theory: [
      {
        heading: { en: 'Displaying Text', bn: 'টেক্সট প্রদর্শন' },
        body: { en: 'In Python, we use the `print()` function to show text on the screen. The text must be enclosed in quotes like "this".', bn: 'পাইথনে স্ক্রিনে টেক্সট দেখাতে আমরা `print()` ফাংশন ব্যবহার করি। টেক্সট অবশ্যই (" ") এভাবে উদ্ধৃতি চিহ্নের মধ্যে থাকতে হবে।' },
        code: { code: 'print("Hi!")', language: 'python', explanation: { en: 'Outputs Hi!', bn: 'এটিHi! আউটপুট দেয়।' } }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p1h-e1',
        question: { en: 'Which function is used to show output?', bn: 'আউটপুট দেখানোর জন্য কোন ফাংশনটি ব্যবহৃত হয়?' },
        options: ['print()', 'output()', 'show()', 'say()'],
        correctIndex: 0,
        explanation: { en: 'print() is the standard output function.', bn: 'print() হলো স্ট্যান্ডার্ড আউটপুট ফাংশন।' },
        xpReward: 10
      },
      {
        type: 'fill_blank',
        id: 'p1h-e2',
        question: { en: 'Complete the code to print "Go":', bn: '"Go" প্রিন্ট করতে কোডটি সম্পূর্ণ করুন:' },
        codeTemplate: `___("Go")`,
        blanks: ['print'],
        explanation: { en: 'Always use lowercase print.', bn: 'সবসময় ছোট হাতের print ব্যবহার করুন।' },
        xpReward: 10
      },
      {
        type: 'bug_hunt',
        id: 'p1h-e3',
        question: { en: 'Find the mistake:', bn: 'ভুলটি খুঁজে বের করুন:' },
        code: `print("Starting...")
name = "Bot"
print(Hello)
print("Done")`,
        buggyLine: 3,
        explanation: { en: 'Text needs quotes like "Hello".', bn: 'টেক্সটের জন্য "Hello"-র মতো কোট প্রয়োজন।' },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'p1h-e4',
        question: { en: 'What will be printed?', bn: 'এখানে কী প্রিন্ট হবে?' },
        code: `print("3 + 2")`,
        options: ['5', '3 + 2', 'Error'],
        correctIndex: 1,
        explanation: { en: 'Quotes make it a literal string.', bn: 'কোট একে একটি লিটারাল স্ট্রিং করে দেয়।' },
        xpReward: 15
      },
      {
        type: 'code_arrange',
        id: 'p1h-e5',
        question: { en: 'Arrange to print two lines:', bn: 'দুটি লাইন প্রিন্ট করতে সাজান:' },
        blocks: ['print("Two")', 'print("One")'],
        correctOrder: [1, 0],
        explanation: { en: 'Python runs code line by line.', bn: 'পাইথনে ধাপে ধাপে কোড রান হয়' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'p1h-e6',
        question: { en: 'Which quotes can we use?', bn: 'আমরা কোন উদ্ধৃতি চিহ্ন ব্যবহার করতে পারি?' },
        options: ['Only double " "', 'Only single \' \'', 'Both " " and \' \'', 'None'],
        correctIndex: 2,
        explanation: { en: 'Both single and double quotes work fine.', bn: 'সিঙ্গেল এবং ডাবল উভয় উদ্ধৃতি চিহ্নই পাইথনে কাজ করে।' },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'p1h-e7',
        question: { en: 'Print the number 5 without quotes:', bn: 'উদ্ধৃতি চিহ্ন ছাড়াই ৫ সংখ্যাটি প্রিন্ট করুন:' },
        codeTemplate: `print(___)`,
        blanks: ['5'],
        explanation: { en: 'Numbers don\'t strictly need quotes.', bn: 'সংখ্যার জন্য সবসময় উদ্ধৃতি চিহ্ন প্রয়োজন হয় না।' },
        xpReward: 10
      },
      {
        type: 'bug_hunt',
        id: 'p1h-e8',
        question: { en: 'Fix the typo:', bn: 'টাইপোটি ঠিক করুন:' },
        code: `print("Hello")
Print("Welcome")`,
        buggyLine: 2,
        explanation: { en: 'Python is case-sensitive. Use print, not Print.', bn: 'পাইথন কেস-সেনসিটিভ। Print নয়, print ব্যবহার করুন।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p1h-e9',
        question: { en: 'Guess the result:', bn: 'ফলাফল অনুমান করুন:' },
        code: `print(10 + 10)`,
        options: ['1010', '20', 'Error'],
        correctIndex: 1,
        explanation: { en: 'Without quotes, it calculates!', bn: 'উদ্ধৃতি চিহ্ন ছাড়া এটি ক্যালকুলেট করে!' },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p1h-e10',
        question: { en: 'Show a sequence:', bn: 'একটি সিকোয়েন্স দেখান:' },
        blocks: ['print("Set")', 'print("Ready")', 'print("Go")'],
        correctOrder: [1, 0, 2],
        explanation: { en: 'Order of execution matters.', bn: 'কোড রান করার ক্রম গুরুত্বপূর্ণ।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p1h-e11',
        question: { en: 'How to print "Hello" and "World" on the same line?', bn: 'একই লাইনে "Hello" এবং "World" কীভাবে প্রিন্ট করবেন?' },
        options: ['print("Hello" + "World")', 'print("Hello" , "World")', 'Both are valid', 'None'],
        correctIndex: 2,
        explanation: { en: 'Comma (,) or Plus (+) can join them.', bn: 'কমা (,) বা প্লাস (+) চিহ্ন ব্যবহার করে তাদের যুক্ত করা যায়।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p1h-e12',
        question: { en: 'Use a comma to join:', bn: 'যুক্ত করতে কমা ব্যবহার করুন:' },
        codeTemplate: `print("Age:"___ 25)`,
        blanks: [','],
        explanation: { en: 'Wait, no. Just use comma.', bn: 'অপেক্ষা করুন, না। শুধু কমা ব্যবহার করুন। ' },
        xpReward: 15
      },
      {
        type: 'bug_hunt',
        id: 'p1h-e13',
        question: { en: 'Unclosed string bug:', bn: 'আনক্লোজড স্ট্রিং বাগ:' },
        code: `print("System Ready")
print("Mission Start)`,
        buggyLine: 2,
        explanation: { en: 'Every quote needs a closing pair.', bn: 'প্রতিটি উদ্ধৃতির একটি ক্লোজিং পেয়ার প্রয়োজন।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p1h-e14',
        question: { en: 'Multiplication check:', bn: 'গুণ পরীক্ষা:' },
        code: `print(5 * 2)`,
        options: ['52', '10', '7'],
        correctIndex: 1,
        explanation: { en: '* is used for multiplication.', bn: 'গুণের জন্য (*) চিহ্ন ব্যবহৃত হয়।' },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p1h-e15',
        question: { en: 'Nested logic:', bn: 'নেস্টেড লজিক:' },
        blocks: ['print("Result is:")', 'print(10 + 5)'],
        correctOrder: [0, 1],
        explanation: { en: 'Sequence logic.', bn: 'সিকোয়েন্স লজিক।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p1h-e16',
        question: { en: 'Which of these is a Python file extension?', bn: 'এদের মধ্যে কোনটি পাইথন ফাইল এক্সটেনশন?' },
        options: ['.js', '.cpp', '.txt', '.py'],
        correctIndex: 3,
        explanation: { en: '.py marks a Python file.', bn: '.py পাইথন ফাইল নির্দেশ করে।' },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'p1h-e17',
        question: { en: 'Join two strings with space:', bn: 'স্পেস দিয়ে দুটি স্ট্রিং যোগ করুন:' },
        codeTemplate: `print("Hi" ___ " " + "User")`,
        blanks: ['+'],
        explanation: { en: '+ joins strings (concatenation).', bn: '+ স্ট্রিং যুক্ত করে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p1h-e18',
        question: { en: 'Final output check:', bn: 'চূড়ান্ত আউটপুট পরীক্ষা:' },
        code: `print("py." + "cholosikhi")`,
        options: ['py.cholosikhi', 'py cholosikhi', 'Error'],
        correctIndex: 0,
        explanation: { en: '+ joins without adding a space automatically.', bn: '+ স্পেস ছাড়া অটোমেটিক যুক্ত করে।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p1-input',
    sectionId: 'p-unit1',
    order: 2,
    title: { en: 'Talking to Users', bn: 'ইউজারদের সাথে কথা বলা' },
    description: { en: 'Listen to what the user has to say.', bn: 'ইউজার কী বলতে চায় তা শুনুন।' },
    difficulty: 'beginner',
    xpReward: 300,
    estimatedMinutes: 20,
    theory: [
      {
        heading: { en: 'The input() function', bn: 'input() ফাংশন' },
        body: { en: 'Use `input()` and wait for the user to type something.', bn: '`input()` ব্যবহার করে ইউজারের টাইপ করার জন্য অপেক্ষা করুন।' },
        code: { code: 'name = input("Name? ")', language: 'python', explanation: { en: 'Stores text in name.', bn: 'name-এ টেক্সট জমিয়ে রাখে।' } }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p1i-e1',
        question: { en: 'Which function gets user typing?', bn: 'কোন ফাংশনটি ইউজারের টাইপিং গ্রহণ করে?' },
        options: ['get()', 'read()', 'listen()', 'input()'],
        correctIndex: 3,
        explanation: { en: 'input() is the standard way to get user input.', bn: 'input() হলো ইউজার ইনপুট নেওয়ার স্ট্যান্ডার্ড উপায়।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p1i-e2',
        question: { en: 'Store input in "res":', bn: '"res"-এ ইনপুট জমা করুন:', },
        codeTemplate: `res = ___("Enter:")`,
        blanks: ['input'],
        explanation: { en: 'input() stops the code until Enter is pressed.', bn: 'Enter না চাপা পর্যন্ত input() কোড থামিয়ে রাখে।' },
        xpReward: 15
      },
      {
        type: 'bug_hunt',
        id: 'p1i-e3',
        question: { en: 'Fix the input prompt:', bn: 'ইনপুট প্রম্পটটি ঠিক করুন:' },
        code: `print("Enter name:")
name = input Who?`,
        buggyLine: 2,
        explanation: { en: 'Prompt needs parentheses () and quotes.', bn: 'প্রম্পটের জন্য প্যারেন্থেসিস () এবং উদ্ধৃতি প্রয়োজন।' },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p1i-e4',
        question: { en: 'Predict logic (User types "cholosikhi"):', bn: 'লজিক অনুমান করুন (ইউজার "cholosikhi" টাইপ করেছে):' },
        code: `val = input()\nprint("Hi " + val)`,
        options: ['Hi cholosikhi', 'Hi val', 'Error'],
        correctIndex: 0,
        explanation: { en: 'Variable holds the user input.', bn: 'ভেরিয়েবল ইউজারের input ধারণ করে।' },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p1i-e5',
        question: { en: 'Input then Output:', bn: 'আগে input তারপর output:' },
        blocks: ['print(msg)', 'msg = input()'],
        correctOrder: [1, 0],
        explanation: { en: 'Must get data before showing it.', bn: 'ডাটা দেখানোর আগে input নিতে হবে।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p1i-e6',
        question: { en: 'What is returned by input() by default?', bn: 'input() ডিফল্টভাবে কী রিটার্ন করে?' },
        options: ['String', 'Number', 'Boolean', 'None'],
        correctIndex: 0,
        explanation: { en: 'It always returns text (a string).', bn: 'এটি সবসময় টেক্সট (স্ট্রিং) রিটার্ন করে।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p1i-e7',
        question: { en: 'Ask for Age:', bn: 'বয়স জিজ্ঞাসা করুন:', },
        codeTemplate: `age = ___("Age?")`,
        blanks: ['input'],
        explanation: { en: 'Use input() function.', bn: 'input() ফাংশন ব্যবহার করুন।' },
        xpReward: 10
      },
      {
        type: 'bug_hunt',
        id: 'p1i-e8',
        question: { en: 'Mismatched variable:', bn: 'ভেরিয়েবলের অমিল:' },
        code: `a = input()\nprint(A)`,
        buggyLine: 2,
        explanation: { en: 'a is not A. Python is case sensitive!', bn: 'a আর A এক নয়। পাইথন কেস সেনসিটিভ!' },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p1i-e9',
        question: { en: 'Predict (User types 10):', bn: 'অনুমান করুন (ইউজার ১০ টাইপ করেছে):' },
        code: `x = input() + "0"`,
        options: ['100', '10', '20'],
        correctIndex: 0,
        explanation: { en: 'Joins "10" and "0" as strings.', bn: '"10" এবং "0" কে স্ট্রিং হিসেবে যোগ করে।' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'p1i-e10',
        question: { en: 'Complex swap:', bn: 'জটিল অদলবদল:' },
        blocks: ['i = input()', 'print(j)', 'j = i'],
        correctOrder: [0, 2, 1],
        explanation: { en: 'Value is being transferred to j', bn: 'মান j তে স্থানান্তরিত হচ্ছে।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'p1i-e11',
        question: { en: 'Can we use input() without a prompt?', bn: 'প্রম্পট ছাড়া কি input() ব্যবহার করা যায়?' },
        options: ['No', 'Only in C++', 'Yes'],
        correctIndex: 2,
        explanation: { en: 'Yes, it just waits for typing.', bn: 'হ্যাঁ, এটি টাইপ করার জন্য অপেক্ষা করে।' },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'p1i-e12',
        question: { en: 'Store the string input in "text":', bn: 'string ইনপুটটি "text" এ জমা করুন:', },
        codeTemplate: `___ = input()`,
        blanks: ['text'],
        explanation: { en: 'Basic variable assignment.', bn: 'বেসিক ভেরিয়েবল অ্যাসাইনমেন্ট।' },
        xpReward: 10
      },
      {
        type: 'bug_hunt',
        id: 'p1i-e13',
        question: { en: 'Input with logic error:', bn: 'লজিক এররসহ ইনপুট:' },
        code: `print("Wait...")\nx = input("Type:")\nPrint(x)`,
        buggyLine: 3,
        explanation: { en: 'Case sensitive error (Print).', bn: 'কেস সেনসিটিভ এরর (Print)।' },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p1i-e14',
        question: { en: 'Assume (User types Hi):', bn: 'অনুমান করুন (ইউজার Hi টাইপ করেছে):' },
        code: `print(input("Say Hi: "))`,
        options: ['Hi', 'Say Hi: Hi', 'Error'],
        correctIndex: 0,
        explanation: { en: 'It outputs the received Input.', bn: 'এটি প্রাপ্ত ইনপুটটিকে আউটপুট হিসেবে দেয়।' },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p1i-e15',
        question: { en: 'Three step greet:', bn: 'তিন ধাপের শুভেচ্ছা:' },
        blocks: ['print("Hello")', 'print("Welcome " + n)', 'n = input()'],
        correctOrder: [0, 2, 1],
        explanation: { en: 'Greets after getting name.', bn: 'নাম input নেওয়ার পর শুভেচ্ছা জানায়।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'p1i-e16',
        question: { en: 'Does input() work on web pages?', bn: 'ওয়েব পেজে কি input() কাজ করে?' },
        options: ['Yes, in console', 'No, only on paper', 'Always'],
        correctIndex: 0,
        explanation: { en: 'It works in all Python consoles.', bn: 'এটি সব পাইথন কনসোলে কাজ করে।' },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'p1i-e17',
        question: { en: 'Concatenate input:', bn: 'ইনপুট কনক্যাটেনেট (যোগ) করুন:' },
        codeTemplate: `print("You: " + ___( ))`,
        blanks: ['input'],
        explanation: { en: 'Inline input usage.', bn: 'এটি ইনলাইন ইনপুটের ব্যবহার।' },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'p1i-e18',
        question: { en: 'Final test (User types 5):', bn: 'চূড়ান্ত পরীক্ষা (ইউজার ৫ টাইপ করেছে):' },
        code: `a = input()\nb = input()\n# User types 5 then 5\nprint(a + b)`,
        options: ['10', '55', 'Error'],
        correctIndex: 1,
        explanation: { en: 'Strings join, not add mathematically! "5"+"5"="55".', bn: 'স্ট্রিংগুলো পাশাপাশি যুক্ত হয়, গাণিতিক যোগ নয়! "5"+"5"="55"।' },
        xpReward: 40
      }
    ]
  },
  {
    id: 'p1-vars',
    sectionId: 'p-unit1',
    order: 3,
    title: { en: 'Memory Boxes', bn: 'স্মৃতি বাক্স' },
    description: { en: 'Storing data in variables.', bn: 'ভেরিয়বলে ডাটা সংরক্ষণ করা।' },
    difficulty: 'beginner',
    xpReward: 300,
    estimatedMinutes: 20,
    theory: [
      {
        heading: { en: 'Assignment', bn: 'অ্যাসাইনমেন্ট' },
        body: { en: 'Variables are names or containers for data. Use `=` to store a value.', bn: 'ভেরিয়েবল হলো ডাটার নাম বা কন্টেইনার। একটি ভ্যালু স্টোর করতে `=` ব্যবহার করুন।' },
        code: { code: 'score = 100', language: 'python', explanation: { en: 'Stores 100 in "score"', bn: 'এটি "score" এ ১০০ সংরক্ষণ করে।' } }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p1v-e1',
        question: { en: 'Which is used for assignment?', bn: 'অ্যাসাইনমেন্টের জন্য কোনটি ব্যবহৃত হয়?' },
        options: ['=', '==', ':', '->'],
        correctIndex: 0,
        explanation: { en: 'Single (=) sets the value.', bn: 'সিঙ্গেল (=) ভ্যালু সেট করে।' },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'p1v-e2',
        question: { en: 'Set x to 5:', bn: 'x এ ৫ স্টোর করুন:', },
        codeTemplate: `x ___ 5`,
        blanks: ['='],
        explanation: { en: 'Assigning a number.', bn: 'এখানে একটি সংখ্যা অ্যাসাইন করা হচ্ছে।' },
        xpReward: 10
      },
      {
        type: 'bug_hunt',
        id: 'p1v-e3',
        question: { en: 'Invalid name:', bn: 'অবৈধ্য নাম:' },
        code: `player = "Joy"
10_score = 10
my_name = "Name"`,
        buggyLine: 2,
        explanation: { en: 'Variables cannot start with a number.', bn: 'ভেরিয়েবল এর নাম সংখ্যা দিয়ে শুরু হতে পারে না।' },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p1v-e4',
        question: { en: 'Predict:', bn: 'অনুমান করুন:' },
        code: `a = 1\na = 2\nprint(a)`,
        options: ['1', '2', 'Error'],
        correctIndex: 1,
        explanation: { en: 'Value of "a" was updated to 2.', bn: '"a" এর ভ্যালু 2 এ আপডেট করা হয়েছিল।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p1v-e6',
        question: { en: 'Which is a valid variable name?', bn: 'কোনটি একটি বৈধ্য ভেরিয়েবল নাম?' },
        options: ['my_score', 'my-score', 'my score', '1score'],
        correctIndex: 0,
        explanation: { en: 'Underscores are allowed, hyphens and spaces are not.', bn: 'আন্ডারস্কোর ব্যবহার করা যাবে কিন্তু হাইফেন এবং স্পেস ব্যবহার করা যাবে না।' },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'p1v-e7',
        question: { en: 'Type of "Joy":', bn: '"Joy"-এর টাইপ:', },
        codeTemplate: `name = "Joy" # this is a ___`,
        blanks: ['string'],
        explanation: { en: 'Text data is called a string.', bn: 'টেক্সট ডাটাকে স্ট্রিং বলা হয়।' },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'p1v-e8',
        question: { en: 'Find error:', bn: 'এরর খুঁজুন:' },
        code: `x = 5\nprint(y)`,
        buggyLine: 2,
        explanation: { en: 'y is never defined.', bn: 'y ডিফাইন করা হয়নি।' },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p1v-e9',
        question: { en: 'Predict result:', bn: 'ফলাফল অনুমান করুন:' },
        code: `a = "10"\nb = "5"\nprint(a + b)`,
        options: ['15', '105', 'Error'],
        correctIndex: 1,
        explanation: { en: 'Strings just join together.', bn: 'স্ট্রিংগুলো শুধু একসাথে যুক্ত হয়।' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'p1v-e10',
        question: { en: 'Reassignment:', bn: 'পুনরায় অ্যাসাইনমেন্ট:' },
        blocks: ['x = 10', 'x = x + 5', 'print(x)'],
        correctOrder: [0, 1, 2],
        explanation: { en: 'x was 10, then updated to 15. So, the output is 15.', bn: 'x ১০ ছিল, তারপর ১৫-তে আপডেট করা হয়েছে। তাই আউটপুট 15' },
        xpReward: 35
      },
      {
        type: 'mcq',
        id: 'p1v-e11',
        question: { en: 'What is dynamic typing?', bn: 'ডাইনামিক টাইপিং কী?' },
        options: ['Changing variable type later', 'Using static colors', 'Moving boxes'],
        correctIndex: 0,
        explanation: { en: 'Python allows changing from number to text easily.', bn: 'পাইথন সহজে সংখ্যাকে টেক্সটে পরিবর্তন করতে সাহায্য করে' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p1v-e12',
        question: { en: 'Assign a & b to 0 (Multiple Assignment)', bn: 'a ও b কে 0 তে এসাইন করুন (মাল্টিপল অ্যাসাইনমেন্ট)', },
        codeTemplate: `a = b = ___`,
        blanks: ['0'],
        explanation: { en: 'Setting both to zero.', bn: 'উভয়কে জিরোতে সেট করা হয়েছে' },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'p1v-e13',
        question: { en: 'Find typo:', bn: 'টাইপো খুঁজুন:' },
        code: `my_val = 10\nprint(myval)`,
        buggyLine: 2,
        explanation: { en: 'Missing underscore in print.', bn: 'প্রিন্টে আন্ডারস্কোর নেই।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p1v-e14',
        question: { en: 'Integrated test:', bn: 'ইন্টিগ্রেটেড টেস্ট:' },
        code: `x = 5\ny = x\nx = 10\nprint(y)`,
        options: ['5', '10', 'Error'],
        correctIndex: 0,
        explanation: { en: 'y took the value of x when it was 5.', bn: 'x যখন ৫ ছিল তখন y তার ভ্যালু নিয়ে নিয়েছিল।' },
        xpReward: 40
      },
      {
        type: 'code_arrange',
        id: 'p1v-e15',
        question: { en: 'Complex math:', bn: 'জটিল গণিত:' },
        blocks: ['n = 100', 'n = n / 2', 'print(n)'],
        correctOrder: [0, 1, 2],
        explanation: { en: 'Division results in 50.', bn: 'ভাগফল ৫০ আসবে' },
        xpReward: 35
      },
      {
        type: 'mcq',
        id: 'p1v-e16',
        question: { en: 'Which name represents Good Practice?', bn: 'কোন নামটি গুড প্র্যাকটিস নির্দেশ করে?' },
        options: ['total_score', 'ts123', 'a', 'x'],
        correctIndex: 0,
        explanation: { en: 'Descriptive names are best for humans.', bn: 'মানুষের জন্য বর্ণনামূলক নাম ব্যাবহার করা সবচেয়ে ভালো।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'p1v-e17',
        question: { en: 'Reset variable to 0:', bn: 'ভেরিয়েবল 0 তে রিসেট করুন:', },
        codeTemplate: `count = 1\ncount = ___`,
        blanks: ['0'],
        explanation: { en: 'Resetting value.', bn: 'ভ্যালু রিসেট করা হয়েছে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p1v-e18',
        question: { en: 'Ultimate Predict:', bn: 'চূড়ান্ত অনুমান:' },
        code: `a = 5\nb = 2\nprint(a ** b)`,
        options: ['10', '25', '7'],
        correctIndex: 1,
        explanation: { en: '** is the power operator. 5 to the power 2 is 25.', bn: '** হলো পাওয়ার অপারেটর। ৫ টু দ্য পাওয়ার ২ হলো ২৫।' },
        xpReward: 50
      }
    ]
  },
  {
    id: 'p1-exam',
    sectionId: 'p-unit1',
    order: 4,
    title: { en: 'UNIT 1 EXAM', bn: 'ইউনিট ১ পরীক্ষা' },
    description: { en: 'Test your foundation.', bn: 'আপনার শিখন টেস্ট করুন।' },
    difficulty: 'intermediate',
    xpReward: 500,
    estimatedMinutes: 25,
    theory: [{ heading: { en: 'Final Check', bn: 'চূড়ান্ত যাচাই' }, body: { en: 'Foundations mastered?', bn: 'ভিত্তিগুলো আয়ত্ত হয়েছে তো?' } }],
    exercises: [
      {
        type: 'mcq',
        id: 'p1x-e1',
        question: { en: 'Find the correct print syntax:', bn: 'সঠিক প্রিন্ট সিনট্যাক্সটি খুঁজে বের করুন:' },
        options: ['print("Hi")', 'print Hi', 'Print("Hi")', 'print("Hi)'],
        correctIndex: 0,
        explanation: { en: 'Needs parentheses and quotes.', bn: 'প্যারেন্থেসিস এবং উদ্ধৃতি প্রয়োজন।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'p1x-e2',
        question: { en: 'Complete input code:', bn: 'ইনপুট কোডটি সম্পূর্ণ করুন:' },
        codeTemplate: `v = ___("?")`,
        blanks: ['input'],
        explanation: { en: 'Basic input function', bn: 'বেসিক ইনপুট ফাংশন' },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'p1x-e3',
        question: { en: 'Identify typo:', bn: 'টাইপো শনাক্ত করুন:' },
        code: `x = 10\nprint(X)`,
        buggyLine: 2,
        explanation: { en: 'x is lowercase.', bn: 'x ছোট হাতের।' },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'p1x-e4',
        question: { en: 'Predict mixed output:', bn: 'মিশ্র আউটপুট অনুমান করুন:' },
        code: `print("Age:", 5 + 5)`,
        options: ['Age: 10', 'Age: 5+5', 'Error'],
        correctIndex: 0,
        explanation: { en: 'Combines text and calculation.', bn: 'টেক্সট এবং ক্যালকুলেশন একত্রিত করে ব্যবহার করা হয়েছে।' },
        xpReward: 40
      },
      {
        type: 'code_arrange',
        id: 'p1x-e5',
        question: { en: 'Standard interaction sequence:', bn: 'স্ট্যান্ডার্ড ইন্টারঅ্যাকশন সিকোয়েন্স:' },
        blocks: ['name = input()', 'print("Hi")', 'print("Welcome " + name)'],
        correctOrder: [1, 0, 2],
        explanation: { en: 'Greeting sequence.', bn: 'শুভেচ্ছা সিকোয়েন্স।' },
        xpReward: 40
      },
      {
        type: 'mcq',
        id: 'p1x-e6',
        question: { en: 'Which variable name is ILLEGAL?', bn: 'কোন ভ্যারিয়েবল নামটি অবৈধ?' },
        options: ['class', 'my_class', 'Class', 'c'],
        correctIndex: 0,
        explanation: { en: '"class" is a reserved keyword.', bn: '"class" একটি সংরক্ষিত কীওয়ার্ড।' },
        xpReward: 35
      },
      {
        type: 'fill_blank',
        id: 'p1x-e7',
        question: { en: 'Join text and variable:', bn: 'টেক্সট এবং ভেরিয়েবল যুক্ত করুন:' },
        codeTemplate: `n = "User"\nprint("Hi " ___ n)`,
        blanks: ['+'],
        explanation: { en: 'This is string concatenation.', bn: 'এটি স্ট্রিং কনক্যাটেনেশন।' },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'p1x-e8',
        question: { en: 'Find logic bug:', bn: 'লজিকে বাগ খুঁজুন:' },
        code: `count = 10\ncount = count - 1\nprint(count) # expect 10`,
        buggyLine: 2,
        explanation: { en: 'Updated line subtracted 1.', bn: 'আপডেটেড লাইন count থেকে ১ বিয়োগ করেছে।' },
        xpReward: 40
      },
      {
        type: 'output_predict',
        id: 'p1x-e9',
        question: { en: 'Predict math order:', bn: 'ম্যাথের অর্ডার অনুমান করুন:' },
        code: `print(2 + 3 * 2)`,
        options: ['10', '8', '7'],
        correctIndex: 1,
        explanation: { en: 'Multiplication comes before addition. 3*2=6, 6+2=8.', bn: 'যোগের আগে গুণ হয়। ৩*২=৬, ৬+২=৮।' },
        xpReward: 45
      },
      {
        type: 'code_arrange',
        id: 'p1x-e10',
        question: { en: 'Value swap:', bn: 'ভ্যালু অদলবদল:' },
        blocks: ['temp = a', 'b = temp', 'a = b',],
        correctOrder: [0, 2, 1],
        explanation: { en: 'Using temp is standard for swapping.', bn: 'অদলবদলের জন্য টেম্প (temp) ব্যবহার একটি স্ট্যান্ডার্ড।' },
        xpReward: 50
      },
      {
        type: 'mcq',
        id: 'p1x-e11',
        question: { en: 'What does this output:\nx = 5\nprint(type(x))', bn: 'এর আউটপুট কী হবে:\nx = 5\nprint(type(x))' },
        options: ['<class \'int\'>', '<class \'str\'>', '5', 'Error'],
        correctIndex: 0,
        explanation: { en: '5 is an integer.', bn: '৫ একটি ইন্টিজার।' },
        xpReward: 40
      },
      {
        type: 'fill_blank',
        id: 'p1x-e12',
        question: { en: 'Convert input to number:', bn: 'ইনপুটকে সংখ্যায় পরিবর্তন করুন:' },
        codeTemplate: `n = ___(input())`,
        blanks: ['int'],
        explanation: { en: 'int() converts text to integer.', bn: 'int() টেক্সটকে ইন্টিজারে পরিবর্তন করে।' },
        xpReward: 35
      },
      {
        type: 'bug_hunt',
        id: 'p1x-e13',
        question: { en: 'Mismatched quotes:', bn: 'অমিল উদ্ধৃতি:' },
        code: `name = "cholosikhi"
msg = "Hello'`,
        buggyLine: 2,
        explanation: { en: 'Must use same type of quotes to open and close.', bn: 'খুলতে এবং বন্ধ করতে অবশ্যই একই ধরণের কোট ব্যবহার করতে হবে।' },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'p1x-e14',
        question: { en: 'Predict (User types 5):', bn: 'অনুমান করুন (ইউজার ৫ টাইপ করেছে):' },
        code: `x = input()\nprint(int(x) * 2)`,
        options: ['10', '52', 'Error'],
        correctIndex: 0,
        explanation: { en: 'x was converted to int, so that mathematical operation works properly.', bn: 'x ইন্টিজারে কনভার্ট হয়েছে, যাতে ম্যাথমেটিকাল অপারেশন ঠিকভাবে কাজ করে।' },
        xpReward: 45
      },
      {
        type: 'code_arrange',
        id: 'p1x-e15',
        question: { en: 'Multi-line story:', bn: 'মাল্টি-লাইন স্টোরি:' },
        blocks: ['print("Once")', 'print("Time")', 'print("Upon a")'],
        correctOrder: [0, 2, 1],
        explanation: { en: 'Stacking lines.', bn: 'লাইনগুলো স্ট্যাক করা হচ্ছে।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'p1x-e16',
        question: { en: 'Find REVERSED assignment:', bn: 'বিপরীত অ্যাসাইনমেন্ট খুঁজুন:' },
        options: ['10 = x', 'x = 10', 'x == 10'],
        correctIndex: 0,
        explanation: { en: 'You can\'t assign a variable to a number literal.', bn: 'আপনি একটি সংখ্যা লিটারালের সাথে ভেরিয়েবল অ্যাসাইন করতে পারবেন না।' },
        xpReward: 40
      },
      {
        type: 'fill_blank',
        id: 'p1x-e17',
        question: { en: 'Check for emptiness:', bn: 'শূন্যতা পরীক্ষা করুন:' },
        codeTemplate: `empty = ___`,
        blanks: ['""'],
        explanation: { en: 'Representing empty string.', bn: 'খালি স্ট্রিং প্রকাশ করা হচ্ছে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'p1x-e18',
        question: { en: 'Super Recall Output:', bn: 'সুপার রিকল আউটপুট:' },
        code: `x = 5\nx += 10\nprint(x)`,
        options: ['15', '510', 'Error'],
        correctIndex: 0,
        explanation: { en: '+= adds and updates. 5 + 10 = 15.', bn: '+= যোগ করে এবং আপডেট করে। ৫ + ১০ = ১৫।' },
        xpReward: 60
      }
    ]
  }
];
