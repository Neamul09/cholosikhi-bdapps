import type { Lesson } from '../../schema';

// C++ Unit 8: Data Clusters — lessonIds: ['c8-arrays', 'c8-strings', 'c8-exam']
export const unit8Lessons: Lesson[] = [
  {
    id: 'c8-arrays',
    sectionId: 'c-unit8',
    order: 1,
    title: { en: 'The Data Warehouse', bn: 'ডাটা গুদামঘর' },
    description: { en: 'Store collections of data with C++ arrays.', bn: 'C++ অ্যারে দিয়ে ডাটার সংগ্রহ জমা রাখুন।' },
    difficulty: 'intermediate',
    xpReward: 140,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'C++ Arrays', bn: 'C++ অ্যারে' },
        body: { en: 'Arrays store multiple values of the same type. Fixed size. Indexed from 0.', bn: 'অ্যারে একই টাইপের একাধিক মান জমা রাখে। নির্দিষ্ট আকার। ০ থেকে ইনডেক্স করা।' },
        code: {
          code: 'int scores[5] = {90, 85, 92, 78, 88};\ncout << scores[0];  // 90\ncout << scores[4];  // 88\nscores[2] = 95;     // modify',
          language: 'cpp',
          explanation: { en: 'Declare with type[size]. Access with [index].', bn: 'type[size] দিয়ে ঘোষণা করুন। [index] দিয়ে অ্যাক্সেস করুন।' }
        }
      },
      {
        heading: { en: 'Iterating Arrays', bn: 'অ্যারে ইটারেট করা' },
        body: { en: 'Use sizeof(arr)/sizeof(arr[0]) to get array size. Or use range-based for.', bn: 'অ্যারের আকার পেতে sizeof(arr)/sizeof(arr[0]) ব্যবহার করুন। অথবা রেঞ্জ-ভিত্তিক for ব্যবহার করুন।' },
        code: {
          code: 'int nums[] = {1, 2, 3, 4, 5};\nint size = sizeof(nums) / sizeof(nums[0]);\nfor (int i = 0; i < size; i++) {\n  cout << nums[i] << " ";\n}',
          language: 'cpp',
          explanation: { en: 'Loops through all array elements.', bn: 'সব অ্যারে উপাদানের মধ্য দিয়ে লুপ করে।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c8-arrays-e1',
        question: { en: 'What is the index of the last element in int arr[5]?', bn: 'int arr[5] এ শেষ উপাদানের ইনডেক্স কত?' },
        options: ['4', '5', '0', '6'],
        correctIndex: 0,
        explanation: { en: 'Size 5 means indices 0-4. Last is index 4.', bn: 'আকার ৫ মানে ইনডেক্স 0-4। শেষটি ইনডেক্স 4।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'c8-arrays-e2',
        question: { en: 'Declare an array of 3 integers:', bn: '৩টি পূর্ণ সংখ্যার একটি অ্যারে ঘোষণা করুন:' },
        codeTemplate: '___ nums[3] = {1, 2, 3};',
        blanks: ['int'],
        explanation: { en: 'The type comes first, then name[size].', bn: 'প্রথমে টাইপ, তারপর name[size]।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c8-arrays-e3',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'int arr[] = {10, 20, 30};\ncout << arr[1] + arr[2];',
        options: ['50', '30', '60'],
        correctIndex: 0,
        explanation: { en: 'arr[1]=20, arr[2]=30. 20+30=50.', bn: 'arr[1]=20, arr[2]=30। 20+30=50।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'c8-arrays-e4',
        question: { en: 'Can you resize an array in C++?', bn: 'C++ এ কি অ্যারের আকার পরিবর্তন করা যায়?' },
        options: ['No, fixed size', 'Yes, with resize()', 'Yes, automatically', 'Only with pointers'],
        correctIndex: 0,
        explanation: { en: 'C-style arrays are fixed size. Use vector for dynamic.', bn: 'C-স্টাইল অ্যারে নির্দিষ্ট আকার। ডাইনামিকের জন্য vector ব্যবহার করুন।' },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'c8-arrays-e5',
        question: { en: 'Find the out-of-bounds bug:', bn: 'out-of-bounds বাগ খুঁজুন:' },
        code: 'int arr[3] = {1, 2, 3};\ncout << arr[3];',
        buggyLine: 2,
        explanation: { en: 'arr[3] is out of bounds (valid: 0,1,2). Undefined behavior!', bn: 'arr[3] সীমার বাইরে (বৈধ: 0,1,2)। অপরিজ্ঞাত আচরণ!' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'c8-strings',
    sectionId: 'c-unit8',
    order: 2,
    title: { en: 'The Message Board', bn: 'বার্তা বোর্ড' },
    description: { en: 'Work with C++ strings and string operations.', bn: 'C++ স্ট্রিং এবং স্ট্রিং অপারেশন নিয়ে কাজ করুন।' },
    difficulty: 'intermediate',
    xpReward: 140,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'C++ string', bn: 'C++ string' },
        body: { en: 'Use #include <string> and std::string. Supports +, ==, .length(), .substr(), .find().', bn: '#include <string> এবং std::string ব্যবহার করুন। +, ==, .length(), .substr(), .find() সমর্থন করে।' },
        code: {
          code: '#include <string>\nusing namespace std;\n\nstring name = "Hero";\ncout << name.length() << endl; // 4\ncout << name + " World" << endl; // Hero World\ncout << name.substr(0, 2); // He',
          language: 'cpp',
          explanation: { en: 'String has many useful built-in methods.', bn: 'String এ অনেক দরকারী বিল্ট-ইন মেথড আছে।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'c8-strings-e1',
        question: { en: 'Which header do you need for C++ string?', bn: 'C++ string এর জন্য কোন হেডার লাগবে?' },
        options: ['<string>', '<iostream>', '<cstring>', '<text>'],
        correctIndex: 0,
        explanation: { en: '#include <string> enables std::string.', bn: '#include <string> std::string সক্ষম করে।' },
        xpReward: 20
      },
      {
        type: 'fill_blank',
        id: 'c8-strings-e2',
        question: { en: 'Get string length:', bn: 'স্ট্রিংয়ের দৈর্ঘ্য পান:' },
        codeTemplate: 'string s = "Hello";\ncout << s.___();',
        blanks: ['length'],
        explanation: { en: '.length() returns the number of characters.', bn: '.length() অক্ষরের সংখ্যা ফেরত দেয়।' },
        xpReward: 20
      },
      {
        type: 'output_predict',
        id: 'c8-strings-e3',
        question: { en: 'What is printed?', bn: 'কী প্রিন্ট হবে?' },
        code: 'string a = "Cpp";\nstring b = "Sikhi";\ncout << a + b;',
        options: ['CholoSikhi', 'Cholo Sikhi', 'Error'],
        correctIndex: 0,
        explanation: { en: '+ concatenates strings in C++.', bn: 'C++ এ + স্ট্রিং একত্রিত করে।' },
        xpReward: 20
      },
      {
        type: 'mcq',
        id: 'c8-strings-e4',
        question: { en: 'How do you compare two strings in C++?', bn: 'C++ এ দুটি স্ট্রিং কীভাবে তুলনা করবেন?' },
        options: ['str1 == str2', 'strcmp(str1, str2)', 'str1.compare(str2)', 'All work for std::string'],
        correctIndex: 3,
        explanation: { en: 'For std::string, == works naturally!', bn: 'std::string এর জন্য == স্বাভাবিকভাবে কাজ করে!' },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'c8-strings-e5',
        question: { en: 'Build a greeting with the user name:', bn: 'ব্যবহারকারীর নাম সহ অভিবাদন তৈরি করুন:' },
        blocks: ['string name;', 'cout << "Enter name: ";', 'cin >> name;', 'cout << "Hello, " + name + "!";'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Declare, prompt, get input, greet.', bn: 'ঘোষণা, প্রম্পট, ইনপুট নিন, অভিবাদন জানান।' },
        xpReward: 35
      }
    ]
  },
  {
    id: 'c8-exam',
    sectionId: 'c-unit8',
    order: 3,
    isProject: true,
    title: { en: 'Unit Exam: Data Clusters', bn: 'ইউনিট পরীক্ষা: ডাটা ক্লাস্টার' },
    description: { en: 'Test arrays and string skills.', bn: 'অ্যারে এবং স্ট্রিং দক্ষতা পরীক্ষা করুন।' },
    difficulty: 'intermediate',
    xpReward: 350,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'Arrays & Strings Exam', bn: 'অ্যারে ও স্ট্রিং পরীক্ষা' },
        body: { en: 'Arrays: fixed size, indexed from 0. Strings: use <string>, support +, ==, .length().', bn: 'অ্যারে: নির্দিষ্ট আকার, ০ থেকে ইনডেক্স। স্ট্রিং: <string> ব্যবহার করুন, +, ==, .length() সমর্থন করে।' }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'c8-exam-e1',
        question: { en: 'What is the sum?', bn: 'যোগফল কত?' },
        code: 'int nums[] = {5, 10, 15};\nint total = 0;\nfor (int n : nums) total += n;\ncout << total;',
        options: ['30', '15', '5'],
        correctIndex: 0,
        explanation: { en: '5+10+15 = 30.', bn: '৫+১০+১৫ = ৩০।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'c8-exam-e2',
        question: { en: 'Get first 3 chars of a string:', bn: 'একটি স্ট্রিংয়ের প্রথম ৩টি অক্ষর নিন:' },
        codeTemplate: 'string s = "Kingdom";\ncout << s.___(0, 3);',
        blanks: ['substr'],
        explanation: { en: 'substr(start, length) extracts a substring.', bn: 'substr(start, length) একটি সাবস্ট্রিং বের করে।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'c8-exam-e3',
        question: { en: 'Accessing arr[size] causes?', bn: 'arr[size] অ্যাক্সেস করলে কী হয়?' },
        options: ['Undefined behavior', 'Returns 0', 'Error at compile', 'Returns last item'],
        correctIndex: 0,
        explanation: { en: 'Out of bounds = undefined behavior. Very dangerous!', bn: 'সীমার বাইরে = অপরিজ্ঞাত আচরণ। খুব বিপজ্জনক!' },
        xpReward: 25
      },
      {
        type: 'bug_hunt',
        id: 'c8-exam-e4',
        question: { en: 'Fix the string comparison:', bn: 'স্ট্রিং তুলনা ঠিক করুন:' },
        code: 'string s = "hello";\nif (s = "hello") {\n  cout << "Match";\n}',
        buggyLine: 2,
        explanation: { en: '= assigns (always true!). Use == for comparison.', bn: '= নির্ধারণ করে (সবসময় true!)। তুলনার জন্য == ব্যবহার করুন।' },
        xpReward: 35
      },
      {
        type: 'code_arrange',
        id: 'c8-exam-e5',
        question: { en: 'Find maximum value in array:', bn: 'অ্যারেতে সর্বোচ্চ মান খুঁজুন:' },
        blocks: ['int arr[] = {3, 7, 1, 9, 4};', 'int maxVal = arr[0];', 'for (int x : arr) {', '  if (x > maxVal) maxVal = x;', '}', 'cout << maxVal;'],
        correctOrder: [0, 1, 2, 3, 4, 5],
        explanation: { en: 'Track max by comparing each element.', bn: 'প্রতিটি উপাদান তুলনা করে max ট্র্যাক করুন।' },
        xpReward: 55
      }
    ]
  }
];
