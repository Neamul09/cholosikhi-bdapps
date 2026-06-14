import type { Lesson } from '../../schema';

export const unit1Lessons: Lesson[] = [
  {
    id: 'c1-hello',
    sectionId: 'c-unit1',
    order: 1,
    title: { en: 'Hello C++!', bn: 'হ্যালো সি++!' },
    description: { en: 'Meet the language of systems.', bn: 'সিস্টেমের ভাষার সাথে পরিচিত হোন।' },
    difficulty: 'beginner',
    xpReward: 300,
    estimatedMinutes: 20,
    theory: [
      {
        heading: { en: 'Output with cout', bn: 'cout দিয়ে আউটপুট' },
        body: { en: 'In C++, we use `std::cout <<` to display text. Don\'t forget the semicolon `;` at the end of each statement!', bn: 'সি++ এ টেক্সট দেখাতে আমরা `std::cout <<` ব্যবহার করি। প্রতিটি স্টেটমেন্টের শেষে সেমিকোলন `;` দিতে ভুলবেন না!' },
        code: { code: '#include <iostream>\n\nint main() {\n  std::cout << "Hi!";\n  return 0;\n}', language: 'cpp', explanation: { en: 'A simple C++ program.', bn: 'একটি সাধারণ সি++ প্রোগ্রাম।' } }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c1h-e1',
        question: { en: 'Which object is used for output in C++?', bn: 'সি++ এ আউটপুটের জন্য কোন অবজেক্টটি ব্যবহৃত হয়?' },
        options: ['cout', 'cin', 'print', 'printf'],
        correctIndex: 0,
        explanation: { en: 'cout stands for "character output".', bn: 'cout মানে হলো "character output"।' },
        xpReward: 10
      },
      {
        type: 'fill_blank',
        id: 'c1h-e2',
        question: { en: 'Complete the output arrows:', bn: 'আউটপুট অ্যারোগুলো সম্পূর্ণ করুন:' },
        codeTemplate: `cout ___ "Hi";`,
        blanks: ['<<'],
        explanation: { en: 'Output arrows point AWAY from cout.', bn: 'আউটপুট অ্যারোগুলো cout থেকে বাইরের দিকে থাকে।' },
        xpReward: 10
      },
      {
        type: 'bug_hunt',
        id: 'c1h-e3',
        question: { en: 'Find the missing character:', bn: 'অনুপস্থিত ক্যারেক্টারটি খুঁজুন:' },
        code: `cout << "Hello";
cout << "Hi"`,
        buggyLine: 2,
        explanation: { en: 'C++ statements must end with a semicolon ;', bn: 'সি++ স্টেটমেন্ট অবশ্যই সেমিকোলন ; দিয়ে শেষ হতে হবে।' },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'c1h-e4',
        question: { en: 'What is the output?', bn: 'আউটপুট কী?' },
        code: `cout << 2 + 3;`,
        options: ['5', '2+3', 'Error'],
        correctIndex: 0,
        explanation: { en: 'Calculates before outputting.', bn: 'আউটপুট দেওয়ার আগে হিসাব করে।' },
        xpReward: 15
      },
      {
        type: 'code_arrange',
        id: 'c1h-e5',
        question: { en: 'Basic structure order:', bn: 'বেসিক স্ট্রাকচারের ক্রম:' },
        blocks: ['#include <iostream>', 'int main() {', '  return 0;', '}'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Include first, then main, then return.', bn: 'প্রথমে include, তারপর main, সবশেষে return।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'c1h-e6',
        question: { en: 'What does << denote?', bn: '<< কী নির্দেশ করে?' },
        options: ['Insertion Operator', 'Extraction Operator', 'Addition', 'Less than'],
        correctIndex: 0,
        explanation: { en: 'It inserts data into the output stream.', bn: 'এটি আউটপুট স্ট্রিমে ডাটা ঢোকায়।' },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'c1h-e7',
        question: { en: 'Use the standard namespace:', bn: 'স্ট্যান্ডার্ড নেমস্পেস ব্যবহার করুন:' },
        codeTemplate: `using ___ std;`,
        blanks: ['namespace'],
        explanation: { en: 'using namespace std simplifies code.', bn: 'using namespace std কোডকে সহজ করে।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'c1h-e8',
        question: { en: 'Find the typo in namespace:', bn: 'নেমস্পেসের টাইপো খুঁজুন:' },
        code: `#include <iostream>
using NameSpace std;`,
        buggyLine: 2,
        explanation: { en: 'C++ is case sensitive. Use "namespace".', bn: 'সি++ কেস সেনসিটিভ। "namespace" ব্যবহার করুন।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c1h-e9',
        question: { en: 'Integrated check:', bn: 'সমন্বিত পরীক্ষা:' },
        code: `cout << "Hi " << "User";`,
        options: ['Hi User', 'HiUser', 'Error'],
        correctIndex: 0,
        explanation: { en: 'Chaining << works for multiple items.', bn: 'একাধিক আইটেমের জন্য << চেইনিং কাজ করে।' },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'c1h-e10',
        question: { en: 'Output three separate items:', bn: 'তিনটি আলাদা আইটেম আউটপুট দিন:' },
        blocks: ['cout << "A";', 'cout << "B";', 'cout << "C";'],
        correctOrder: [0, 1, 2],
        explanation: { en: 'Sequential flow.', bn: 'ক্রমিক প্রবাহ।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'c1h-e11',
        question: { en: 'How to move to a new line?', bn: 'নতুন লাইনে কীভাবে যাবেন?' },
        options: ['endl', 'newline', 'next', 'break'],
        correctIndex: 0,
        explanation: { en: 'endl stands for "end line".', bn: 'endl মানে হলো "end line"।' },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'c1h-e12',
        question: { en: 'Newline using special char:', bn: 'স্পেশাল ক্যারেক্টার ব্যবহার করে নতুন লাইন:', },
        codeTemplate: `cout << "Hi\\___";`,
        blanks: ['n'],
        explanation: { en: '\\n is the newline escape character.', bn: '\\n হলো নিউলাইন এস্কেপ ক্যারেক্টার।' },
        xpReward: 15
      },
      {
        type: 'bug_hunt',
        id: 'c1h-e13',
        question: { en: 'Find incorrect operator:', bn: 'ভুল অপারেটরটি খুঁজুন:' },
        code: `cout << "Hi";
cout >> "Hello";`,
        buggyLine: 2,
        explanation: { en: 'cout uses <<, not >>.', bn: 'cout-এ << ব্যবহৃত হয়, >> নয়।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c1h-e14',
        question: { en: 'Predict result:', bn: 'ফলাফল অনুমান করুন:' },
        code: `cout << "Total:" << 100;`,
        options: ['Total:100', 'Total: 100', 'Error'],
        correctIndex: 0,
        explanation: { en: 'No space unless you add it in quotes.', bn: 'কোটের ভিতরে না দিলে কোনো স্পেস থাকবে না।' },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'c1h-e15',
        question: { en: 'Main function boundary:', bn: 'মেইন ফাংশন সীমানা:' },
        blocks: ['int main()', '{', '  cout << "X";', '}'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Braces {} define the function body.', bn: 'ব্র্যাসেস {} ফাংশন বডি ডিফাইন করে।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'c1h-e16',
        question: { en: 'What is <iostream>?', bn: '<iostream> কী?' },
        options: ['Header file', 'Variable', 'Function', 'Comment'],
        correctIndex: 0,
        explanation: { en: 'It identifies input/output streams.', bn: 'এটি ইনপুট/আউটপুট স্ট্রিম নির্দেশ করে।' },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'c1h-e17',
        question: { en: 'Preprocessing command:', bn: 'প্রি-প্রসেসিং কমান্ড:' },
        codeTemplate: `___ <iostream>`,
        blanks: ['#include'],
        explanation: { en: '#include tells compiler to use a library.', bn: '#include কম্পাইলারকে একটি লাইব্রেরি ব্যবহার করতে বলে।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c1h-e18',
        question: { en: 'Ultimate Predict:', bn: 'চূড়ান্ত অনুমান:' },
        code: `cout << "10" << 20;`,
        options: ['1020', '30', 'Error'],
        correctIndex: 0,
        explanation: { en: 'Joins string "10" and number 20 as text.', bn: 'স্ট্রিং "10" এবং সংখ্যা 20 কে টেক্সট হিসেবে যুক্ত করে।' },
        xpReward: 40
      }
    ]
  },
  {
    id: 'c1-input',
    sectionId: 'c-unit1',
    order: 2,
    title: { en: 'Machine Inputs', bn: 'মেশিন ইনপুট' },
    description: { en: 'Read data using cin.', bn: 'cin ব্যবহার করে ডাটা পড়ুন।' },
    difficulty: 'beginner',
    xpReward: 300,
    estimatedMinutes: 20,
    theory: [
      {
        heading: { en: 'Input with cin', bn: 'cin দিয়ে ইনপুট' },
        body: { en: 'Use `std::cin >> variable;` to take input from the user. Note that arrows point TOWARDS the variable.', bn: 'ইউজারের কাছ থেকে ইনপুট নিতে `std::cin >> variable;` ব্যবহার করুন। লক্ষ্য করুন অ্যারোগুলো ভেরিয়েবলের দিকে থাকে।' },
        code: { code: 'int age;\ncin >> age;', language: 'cpp', explanation: { en: 'Reads age.', bn: 'বয়স পড়ছে।' } }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c1i-e1',
        question: { en: 'Which object reads user input?', bn: 'কোন অবজেক্টটি ইউজার ইনপুট পড়ে?' },
        options: ['cin', 'cout', 'scanf', 'read'],
        correctIndex: 0,
        explanation: { en: 'cin stands for "character input".', bn: 'cin মানে হলো "character input"।' },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'c1i-e2',
        question: { en: 'Extraction Operator:', bn: 'এক্সট্রাকশন অপারেটর:', },
        codeTemplate: `cin ___ val;`,
        blanks: ['>>'],
        explanation: { en: 'Extraction arrows point right >>.', bn: 'এক্সট্রাকশন অ্যারোগুলো ডানে >> থাকে।' },
        xpReward: 15
      },
      {
        type: 'bug_hunt',
        id: 'c1i-e3',
        question: { en: 'Fix input bug:', bn: 'ইনপুট বাগ ঠিক করুন:' },
        code: `int x;
cin << x;`,
        buggyLine: 2,
        explanation: { en: 'cin uses >>, not <<.', bn: 'cin-এ >> ব্যবহৃত হয়, << নয়।' },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'c1i-e4',
        question: { en: 'Predict (User types 7):', bn: 'অনুমান করুন (ইউজার ৭ টাইপ করেছে):' },
        code: `int x;\ncin >> x;\ncout << x + 1;`,
        options: ['7', '8', '71'],
        correctIndex: 1,
        explanation: { en: 'Reads 7 and adds 1.', bn: '৭ পড়ছে এবং ১ যোগ করছে।' },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'c1i-e5',
        question: { en: 'Read then show:', bn: 'আগে পড়ুন তারপর দেখান:' },
        blocks: ['int n;', 'cin >> n;', 'cout << n;'],
        correctOrder: [0, 1, 2],
        explanation: { en: 'Declare, input, output.', bn: 'ডিক্লেয়ার, ইনপুট, আউটপুট।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'c1i-e6',
        question: { en: 'When does cin stop reading a word?', bn: 'cin কখন একটি শব্দ পড়া বন্ধ করে?' },
        options: ['At whitespace (space/tab)', 'Only at newline', 'Never'],
        correctIndex: 0,
        explanation: { en: 'Standard cin stops at the first space.', bn: 'স্ট্যান্ডার্ড cin প্রথম স্পেসেই থেমে যায়।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'c1i-e7',
        question: { en: 'Store input in "y":', bn: '"y"-এ ইনপুট জমা করুন:', },
        codeTemplate: `___ >> y;`,
        blanks: ['cin'],
        explanation: { en: 'Input stream usage.', bn: 'ইনপুট স্ট্রিং ব্যবহার।' },
        xpReward: 10
      },
      {
        type: 'bug_hunt',
        id: 'c1i-e8',
        question: { en: 'Find missing semicolon:', bn: 'অনুপস্থিত সেমিকোলন খুঁজুন:' },
        code: `int val\ncin >> val;`,
        buggyLine: 1,
        explanation: { en: 'Declaration should end with ;', bn: 'ডিক্লেয়ারেশন অবশ্যই ; দিয়ে শেষ হবে।' },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'c1i-e9',
        question: { en: 'Predict logic:', bn: 'লজিক অনুমান করুন:' },
        code: `int a, b;\ncin >> a >> b;\n// User types 1 2\ncout << a + b;`,
        options: ['12', '3', 'Error'],
        correctIndex: 1,
        explanation: { en: 'Chaining cin reads multiple values.', bn: 'cin চেইনিং একাধিক মান পড়ে।' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'c1i-e10',
        question: { en: 'Interaction flow:', bn: 'ইন্টারঅ্যাকশন ফ্লো:' },
        blocks: ['cout << "Enter:";', 'cin >> x;', 'cout << "Got it";'],
        correctOrder: [0, 1, 2],
        explanation: { en: 'Prompt first, then listen.', bn: 'আগে প্রম্পট, তারপর শোনা।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'c1i-e11',
        question: { en: 'Can cin read a decimal number into an int?', bn: 'cin কি একটি দশমিক সংখ্যাকে int-এ পড়তে পারে?' },
        options: ['Yes (truncates)', 'No', 'Error'],
        correctIndex: 0,
        explanation: { en: 'It will truncate the decimal part.', bn: 'এটি দশমিক অংশটি বাদ দিয়ে দিবে।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'c1i-e12',
        question: { en: 'Prompt the user:', bn: 'ইউজারকে প্রম্পট দিন:', },
        codeTemplate: `___ << "Value?";\ncin >> x;`,
        blanks: ['cout'],
        explanation: { en: 'cout usually precedes cin.', bn: 'cout সাধারণত cin-এর আগে থাকে।' },
        xpReward: 15
      },
      {
        type: 'bug_hunt',
        id: 'c1i-e13',
        question: { en: 'Find type error:', bn: 'টাইপ এরর খুঁজুন:' },
        code: `string name;\ncout << "Name?";\ncin << name;`,
        buggyLine: 3,
        explanation: { en: 'Still using << for cin!', bn: 'cin-এর জন্য এখনো << ব্যবহার হচ্ছে!' },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'c1i-e14',
        question: { en: 'Integrated result:', bn: 'সমন্বিত ফলাফল:' },
        code: `int x = 10;\ncin >> x;\n// User types 5\ncout << x;`,
        options: ['10', '5', 'Error'],
        correctIndex: 1,
        explanation: { en: 'Input overwrites existing value.', bn: 'ইনপুট বর্তমান মানকে পরিবর্তন করে দেয়।' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'c1i-e15',
        question: { en: 'Multi-input step:', bn: 'মাল্টি-ইনপুট ধাপ:' },
        blocks: ['int a, b;', 'cin >> a;', 'cin >> b;'],
        correctOrder: [0, 1, 2],
        explanation: { en: 'Step-by-step reading.', bn: 'ধাপে ধাপে পড়া।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'c1i-e16',
        question: { en: 'What if input fails?', bn: 'ইনপুট ফেইল করলে কী হয়?' },
        options: ['Program sets error flag', 'Computer blows up', 'Nothing'],
        correctIndex: 0,
        explanation: { en: 'cin enters a fail state.', bn: 'cin একটি ফেইল স্টেটে প্রবেশ করে।' },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'c1i-e17',
        question: { en: 'Get double input:', bn: 'ডাবল ইনপুট নিন:', },
        codeTemplate: `___ price;\ncin >> price;`,
        blanks: ['double'],
        explanation: { en: 'double is for decimal numbers.', bn: 'double দশমিক সংখ্যার জন্য ব্যবহৃত হয়।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c1i-e18',
        question: { en: 'Final input logic:', bn: 'চূড়ান্ত ইনপুট লজিক:' },
        code: `string s;\ncin >> s;\n// User types "A B C"\ncout << s;`,
        options: ['A B C', 'A', 'Error'],
        correctIndex: 1,
        explanation: { en: 'cin only reads until first space!', bn: 'cin শুধু প্রথম স্পেস পর্যন্ত পড়ে!' },
        xpReward: 50
      }
    ]
  },
  {
    id: 'c1-vars',
    sectionId: 'c-unit1',
    order: 3,
    title: { en: 'Typed Boxes', bn: 'টাইপড বক্স' },
    description: { en: 'Values must have a type.', bn: 'মান অবশ্যই একটি টাইপের হতে হবে।' },
    difficulty: 'beginner',
    xpReward: 300,
    estimatedMinutes: 20,
    theory: [
      {
        heading: { en: 'Declaring Variables', bn: 'ভেরিয়েবল ডিক্লেয়ার করা' },
        body: { en: 'C++ is "statically typed". You must say if it\'s an `int` (number), `string` (text), or `double` (decimal).', bn: 'সি++ হলো "statically typed"। আপনাকে অবশ্যই বলতে হবে এটি `int` (সংখ্যা), `string` (টেক্সট) নাকি `double` (দশমিক)।' },
        code: { code: 'int score = 10;\nstring name = "Joe";', language: 'cpp', explanation: { en: 'Defined types.', bn: 'ডিফাইন করা টাইপ।' } }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c1v-e1',
        question: { en: 'Which type is for whole numbers?', bn: 'পূর্ণ সংখ্যার জন্য কোন টাইপ ব্যবহৃত হয়?' },
        options: ['int', 'double', 'string', 'bool'],
        correctIndex: 0,
        explanation: { en: 'int stands for integer.', bn: 'int মানে হলো ইন্টিজার।' },
        xpReward: 10
      },
      {
        type: 'fill_blank',
        id: 'c1v-e2',
        question: { en: 'Create a string:', bn: 'একটি স্ট্রিং তৈরি করুন:', },
        codeTemplate: `___ myText = "Hi";`,
        blanks: ['string'],
        explanation: { en: 'string is for text.', bn: 'string টেক্সটের জন্য ব্যবহৃত হয়।' },
        xpReward: 15
      },
      {
        type: 'bug_hunt',
        id: 'c1v-e3',
        question: { en: 'Find missing semicolon:', bn: 'অনুপস্থিত সেমিকোলন খুঁজুন:' },
        code: `string name = "Bot";
int score = 10`,
        buggyLine: 2,
        explanation: { en: 'Every declaration ends with ;', bn: 'প্রতিটি ডিক্লেয়ারেশন ; দিয়ে শেষ হয়।' },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'c1v-e4',
        question: { en: 'Predict result:', bn: 'ফলাফল অনুমান করুন:' },
        code: `int a = 2, b = 3;\ncout << a * b;`,
        options: ['5', '6', '23'],
        correctIndex: 1,
        explanation: { en: '2 multiplied by 3 is 6.', bn: '২ গুণ ৩ হলো ৬।' },
        xpReward: 15
      },
      {
        type: 'code_arrange',
        id: 'c1v-e5',
        question: { en: 'Order of operation:', bn: 'অপারেশনের ক্রম:' },
        blocks: ['int x;', 'x = 10;', 'cout << x;'],
        correctOrder: [0, 1, 2],
        explanation: { en: 'Declare before use.', bn: 'ব্যবহারের আগে ডিক্লেয়ার করুন।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'c1v-e6',
        question: { en: 'Which type is for 3.14?', bn: '৩.১৪ এর জন্য কোন টাইপ ব্যবহৃত হয়?' },
        options: ['int', 'string', 'double', 'char'],
        correctIndex: 2,
        explanation: { en: 'double holds decimal points.', bn: 'double দশমিক বিন্দু ধারণ করে।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'c1v-e7',
        question: { en: 'Declare multiple integers:', bn: 'একাধিক ইন্টিজার ডিক্লেয়ার করুন:', },
        codeTemplate: `int a ___ b = 10;`,
        blanks: [','],
        explanation: { en: 'Comma separates names in same type.', bn: 'কমা একই টাইপের নামগুলোকে আলাদা করে।' },
        xpReward: 15
      },
      {
        type: 'bug_hunt',
        id: 'c1v-e8',
        question: { en: 'Find name error:', bn: 'নামের এরর খুঁজুন:' },
        code: `int my score = 100;`,
        buggyLine: 1,
        explanation: { en: 'Spaces are not allowed in names.', bn: 'নামে স্পেস অনুমোদিত নয়।' },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'c1v-e9',
        question: { en: 'Predict behavior:', bn: 'আচরণ অনুমান করুন:' },
        code: `int x = 5.9;\ncout << x;`,
        options: ['5', '5.9', '6'],
        correctIndex: 0,
        explanation: { en: 'int truncates the decimal!', bn: 'int দশমিক অংশ বাদ দিয়ে দেয়!' },
        xpReward: 35
      },
      {
        type: 'code_arrange',
        id: 'c1v-e10',
        question: { en: 'Memory swap logic:', bn: 'মেমোরি সোয়াপ লজিক:' },
        blocks: ['int t = a;', 'a = b;', 'b = t;'],
        correctOrder: [0, 1, 2],
        explanation: { en: 'Saving old value to t.', bn: 'পুরাতন মান t-তে সেভ করা হচ্ছে।' },
        xpReward: 40
      },
      {
        type: 'mcq',
        id: 'c1v-e11',
        question: { en: 'What is initialization?', bn: 'ইনিশিয়ালাইজেশন কী?' },
        options: ['Giving a variable its first value', 'Starting the computer', 'Deleting code'],
        correctIndex: 0,
        explanation: { en: 'Setting value during declaration.', bn: 'ডিক্লেয়ারেশনের সময় মান সেট করা।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'c1v-e12',
        question: { en: 'Boolean value:', bn: 'বুলিয়ান মান:', },
        codeTemplate: `___ isCool = true;`,
        blanks: ['bool'],
        explanation: { en: 'bool holds true or false.', bn: 'bool true বা false ধারণ করে।' },
        xpReward: 15
      },
      {
        type: 'bug_hunt',
        id: 'c1v-e13',
        question: { en: 'Find declaration error:', bn: 'ডিক্লেয়ারেশন এরর খুঁজুন:' },
        code: `int x = 10\ncout << x;`,
        buggyLine: 1,
        explanation: { en: 'Missing ; again.', bn: 'আবারো ; নেই।' },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'c1v-e14',
        question: { en: 'Predict result:', bn: 'ফলাফল অনুমান করুন:' },
        code: `string x = "5", y = "2";\ncout << x + y;`,
        options: ['7', '52', 'Error'],
        correctIndex: 1,
        explanation: { en: 'Strings join, they don\'t add!', bn: 'স্ট্রিং যুক্ত হয়, যোগ হয় না!' },
        xpReward: 35
      },
      {
        type: 'code_arrange',
        id: 'c1v-e15',
        question: { en: 'Calculate area:', bn: 'ক্ষেত্রফল বের করুন:' },
        blocks: ['int w = 10, h = 5;', 'int a = w * h;', 'cout << a;'],
        correctOrder: [0, 1, 2],
        explanation: { en: 'Math with variables.', bn: 'ভেরিয়েবল দিয়ে গণিত।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'c1v-e16',
        question: { en: 'Which is a reserved keyword?', bn: 'কোনটি একটি সংরক্ষিত কীওয়ার্ড?' },
        options: ['int', 'myInt', 'score1', 'val'],
        correctIndex: 0,
        explanation: { en: 'int is reserved for C++ types.', bn: 'int সি++ টাইপের জন্য সংরক্ষিত।' },
        xpReward: 15
      },
      {
        type: 'fill_blank',
        id: 'c1v-e17',
        question: { en: 'Assign later:', bn: 'পরে অ্যাসাইন করুন:', },
        codeTemplate: `int x;\nx ___ 50;`,
        blanks: ['='],
        explanation: { en: 'Setting value after declaration.', bn: 'ডিক্লেয়ারেশনের পর মান সেট করা।' },
        xpReward: 15
      },
      {
        type: 'output_predict',
        id: 'c1v-e18',
        question: { en: 'Ultimate Predict:', bn: 'চূড়ান্ত অনুমান:' },
        code: `int x = 10;\nx = x + 1;\ncout << x;`,
        options: ['10', '11', 'Error'],
        correctIndex: 1,
        explanation: { en: 'Value updated to 11.', bn: 'মান ১১-তে আপডেট করা হয়েছে।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'c1-exam',
    sectionId: 'c-unit1',
    order: 4,
    title: { en: 'UNIT 1 EXAM', bn: 'ইউনিট ১ পরীক্ষা' },
    description: { en: 'Qualify for Unit 2.', bn: 'ইউনিট ২-এর জন্য যোগ্যতা অর্জন করুন।' },
    difficulty: 'intermediate',
    xpReward: 500,
    estimatedMinutes: 25,
    theory: [{ heading: { en: 'Recall', bn: 'স্মরণ' }, body: { en: 'Prove your C++ mastery.', bn: 'আপনার সি++ দক্ষতা প্রমাণ করুন।' } }],
    exercises: [
      {
        type: 'mcq',
        id: 'c1x-e1',
        question: { en: 'Correct hello world:', bn: 'সঠিক হ্যালো ওয়ার্ল্ড:' },
        options: ['cout << "Hi";', 'cin << "Hi";', 'cout >> "Hi";', 'print("Hi");'],
        correctIndex: 0,
        explanation: { en: 'Standard output syntax.', bn: 'স্ট্যান্ডার্ড আউটপুট সিনট্যাক্স।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'c1x-e2',
        question: { en: 'Read integer y:', bn: 'ইন্টিজার y পড়ুন:', },
        codeTemplate: `int y;\n___ >> y;`,
        blanks: ['cin'],
        explanation: { en: 'Input stream.', bn: 'ইনপুট স্ট্রিং।' },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'c1x-e3',
        question: { en: 'Find semicolon bug:', bn: 'সেমিকোলন বাগ খুঁজুন:' },
        code: `cout << "Result: ";
cout << 100`,
        buggyLine: 2,
        explanation: { en: 'Missing ; at end.', bn: 'শেষে ; নেই।' },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'c1x-e4',
        question: { en: 'Predict behavior:', bn: 'আচরণ অনুমান করুন:' },
        code: `int x = 10;\ncout << x / 3;`,
        options: ['3', '3.33', '3.0'],
        correctIndex: 0,
        explanation: { en: 'Integer division drops decimal part.', bn: 'ইন্টিজার ভাগফল দশমিক অংশ বাদ দেয়।' },
        xpReward: 40
      },
      {
        type: 'code_arrange',
        id: 'c1x-e5',
        question: { en: 'Complete Program:', bn: 'সম্পূর্ণ প্রোগ্রাম:' },
        blocks: ['#include <iostream>', 'using namespace std;', 'int main() {', '  return 0;', '}'],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: { en: 'Full skeleton sequence.', bn: 'সম্পূর্ণ কঙ্কাল সিকোয়েন্স।' },
        xpReward: 50
      },
      {
        type: 'mcq',
        id: 'c1x-e6',
        question: { en: 'Which type for "Hello"?', bn: '"Hello" এর জন্য কোন টাইপ?' },
        options: ['string', 'int', 'double', 'char'],
        correctIndex: 0,
        explanation: { en: 'Text needs string.', bn: 'টেক্সটের জন্য string প্রয়োজন।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'c1x-e7',
        question: { en: 'Join two strings:', bn: 'দুটি স্ট্রিং যুক্ত করুন:' },
        codeTemplate: `cout << "Hi " ___ name;`,
        blanks: ['<<'],
        explanation: { en: 'Chaining output.', bn: 'আউটপুট চেইনিং।' },
        xpReward: 20
      },
      {
        type: 'bug_hunt',
        id: 'c1x-e8',
        question: { en: 'Find cin bug:', bn: 'cin বাগ খুঁজুন:' },
        code: `int x;\ncin << x;`,
        buggyLine: 2,
        explanation: { en: 'Extraction operator is >>.', bn: 'এক্সট্রাকশন অপারেটর হলো >>।' },
        xpReward: 40
      },
      {
        type: 'output_predict',
        id: 'c1x-e9',
        question: { en: 'Complex math:', bn: 'জটিল গণিত:' },
        code: `int a = 5, b = 2;\ncout << a % b;`,
        options: ['1', '2', '2.5'],
        correctIndex: 0,
        explanation: { en: '% is remainder. 5 divided by 2 has remainder 1.', bn: '% হলো ভাগশেষ। ৫ কে ২ দিয়ে ভাগ করলে ভাগশেষ ১ থাকে।' },
        xpReward: 50
      },
      {
        type: 'code_arrange',
        id: 'c1x-e10',
        question: { en: 'Prompt interaction:', bn: 'প্রম্পট ইন্টারঅ্যাকশন:' },
        blocks: ['string name;', 'cout << "Name?";', 'cin >> name;', 'cout << "Hi " << name;'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Logical sequence.', bn: 'যুক্তিসঙ্গত ক্রম।' },
        xpReward: 60
      },
      {
        type: 'mcq',
        id: 'c1x-e11',
        question: { en: 'What is \\n?', bn: '\\n কী?' },
        options: ['Newline char', 'Number char', 'No char', 'Normal char'],
        correctIndex: 0,
        explanation: { en: 'Moves output to the next line.', bn: 'আউটপুটকে পরবর্তী লাইনে সরিয়ে দেয়।' },
        xpReward: 25
      },
      {
        type: 'fill_blank',
        id: 'c1x-e12',
        question: { en: 'Assign decimal value:', bn: 'দশমিক মান অ্যাসাইন করুন:', },
        codeTemplate: `___ pi = 3.14;`,
        blanks: ['double'],
        explanation: { en: 'Floating point type.', bn: 'ফ্লোটিং পয়েন্ট টাইপ।' },
        xpReward: 30
      },
      {
        type: 'bug_hunt',
        id: 'c1x-e13',
        question: { en: 'Find case error:', bn: 'কেস এরর খুঁজুন:' },
        code: `cout << "Ready";
Cout << "Hi";`,
        buggyLine: 2,
        explanation: { en: 'It should be lowercase cout.', bn: 'এটি ছোট হাতের cout হতে হবে।' },
        xpReward: 30
      },
      {
        type: 'output_predict',
        id: 'c1x-e14',
        question: { en: 'Predict behavior (User types Hi):', bn: 'আচরণ অনুমান করুন (ইউজার Hi টাইপ করেছে):' },
        code: `string s;\ncin >> s;\ncout << "Recv:" << s;`,
        options: ['Recv:Hi', 'Recv: Hi', 'Error'],
        correctIndex: 0,
        explanation: { en: 'Joins text directly.', bn: 'টেক্সট সরাসরি যুক্ত করে।' },
        xpReward: 40
      },
      {
        type: 'code_arrange',
        id: 'c1x-e15',
        question: { en: 'Multi-statement:', bn: 'মাল্টি-স্টেটমেন্ট:' },
        blocks: ['int x = 10;', 'x = x + 10;', 'cout << x;'],
        correctOrder: [0, 1, 2],
        explanation: { en: 'Sequential update.', bn: 'ক্রমিক আপডেট।' },
        xpReward: 40
      },
      {
        type: 'mcq',
        id: 'c1x-e16',
        question: { en: 'Which is NOT a valid name?', bn: 'কোনটি বৈধ্য নাম নয়?' },
        options: ['_val', 'val123', '123val', 'val_'],
        correctIndex: 2,
        explanation: { en: 'Cannot start with a digit.', bn: 'অঙ্ক (digit) দিয়ে শুরু করা যাবে না।' },
        xpReward: 35
      },
      {
        type: 'fill_blank',
        id: 'c1x-e17',
        question: { en: 'Add semicolon:', bn: 'সেমিকোলন যোগ করুন:', },
        codeTemplate: `return 0___`,
        blanks: [';'],
        explanation: { en: 'Every statement ends with ;', bn: 'প্রতিটি স্টেটমেন্ট ; দিয়ে শেষ হয়।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c1x-e18',
        question: { en: 'Master Predict:', bn: 'মাস্টার অনুমান:' },
        code: `int a = 10, b = 20;\na = b;\ncout << a;`,
        options: ['10', '20', 'Error'],
        correctIndex: 1,
        explanation: { en: 'a became 20.', bn: 'a ২০ হয়ে গিয়েছিল।' },
        xpReward: 50
      }
    ]
  }
];
