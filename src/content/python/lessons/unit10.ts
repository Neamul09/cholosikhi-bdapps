import type { Lesson } from '../../schema';

// Unit 10: The Grand Showcase — lessonIds: ['p10-start', 'p10-logic', 'p10-ui', 'p10-finish']
export const unit10Lessons: Lesson[] = [
  {
    id: 'p10-start',
    sectionId: 'p-unit10',
    order: 1,
    title: { en: 'Project Setup', bn: 'প্রজেক্ট সেটআপ' },
    description: { en: 'Plan and scaffold your final project.', bn: 'আপনার চূড়ান্ত প্রজেক্ট পরিকল্পনা করুন ও তৈরি শুরু করুন।' },
    difficulty: 'advanced',
    xpReward: 200,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'The Grand Project: Quiz Game', bn: 'গ্র্যান্ড প্রজেক্ট: কুইজ গেম' },
        body: { en: 'We will build a full quiz game! It uses: functions, lists, dicts, loops, and conditions — everything you have learned.', bn: 'আমরা একটি সম্পূর্ণ কুইজ গেম তৈরি করব! এটি ব্যবহার করে: ফাংশন, লিস্ট, dict, লুপ এবং শর্ত — আপনি যা শিখেছেন সবকিছু।' },
        code: {
          code: '# Our quiz game structure\nquestions = [\n    {"q": "Capital of Bangladesh?", "a": "Dhaka"},\n    {"q": "2 + 2?", "a": "4"},\n]\nscore = 0',
          language: 'python',
          explanation: { en: 'We store questions as a list of dicts.', bn: 'প্রশ্নগুলো dict এর লিস্ট হিসেবে জমা রাখি।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p10-start-e1',
        question: { en: 'Which structure stores question/answer pairs best?', bn: 'প্রশ্ন/উত্তর জোড়া জমা রাখার সেরা কাঠামো কোনটি?' },
        options: ['List of dicts', 'Nested lists', 'Single list', 'Separate variables'],
        correctIndex: 0,
        explanation: { en: 'Dicts give named access: q["question"] and q["answer"].', bn: 'Dict নামযুক্ত অ্যাক্সেস দেয়: q["question"] এবং q["answer"]।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'p10-start-e2',
        question: { en: 'Access the question text:', bn: 'প্রশ্নের টেক্সট অ্যাক্সেস করুন:' },
        codeTemplate: 'q = {"q": "What is 5+5?", "a": "10"}\nprint(q[___])',
        blanks: ['"q"'],
        explanation: { en: 'Use the key "q" to get the question.', bn: 'প্রশ্ন পেতে "q" কি ব্যবহার করুন।' },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p10-start-e3',
        question: { en: 'How many questions in this quiz?', bn: 'এই কুইজে কতটি প্রশ্ন?' },
        code: 'quiz = [{"q": "A?", "a": "1"}, {"q": "B?", "a": "2"}]\nprint(len(quiz))',
        options: ['2', '4', '1'],
        correctIndex: 0,
        explanation: { en: 'len() counts the number of items in the list.', bn: 'len() লিস্টে আইটেমের সংখ্যা গণনা করে।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p10-start-e4',
        question: { en: 'How do you iterate over all questions?', bn: 'সব প্রশ্নের উপর কীভাবে ইটারেট করবেন?' },
        options: ['for q in questions:', 'while questions:', 'for questions:', 'loop questions:'],
        correctIndex: 0,
        explanation: { en: 'for q in questions: loops through each question dict.', bn: 'for q in questions: প্রতিটি প্রশ্ন dict এর মধ্য দিয়ে লুপ করে।' },
        xpReward: 25
      },
      {
        type: 'code_arrange',
        id: 'p10-start-e5',
        question: { en: 'Initialize the quiz variables:', bn: 'কুইজ ভেরিয়েবল ইনিশিয়ালাইজ করুন:' },
        blocks: ['questions = []', 'score = 0', 'total = len(questions)', 'print("Quiz ready!")'],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: 'Set up the data structures first.', bn: 'প্রথমে ডাটা স্ট্রাকচার সেটআপ করুন।' },
        xpReward: 35
      }
    ]
  },
  {
    id: 'p10-logic',
    sectionId: 'p-unit10',
    order: 2,
    title: { en: 'Core Logic', bn: 'মূল লজিক' },
    description: { en: 'Build the answer-checking engine.', bn: 'উত্তর-পরীক্ষা ইঞ্জিন তৈরি করুন।' },
    difficulty: 'advanced',
    xpReward: 200,
    estimatedMinutes: 15,
    theory: [
      {
        heading: { en: 'The Quiz Engine', bn: 'কুইজ ইঞ্জিন' },
        body: { en: 'The core loop: for each question, show it, get user answer, check if correct, update score.', bn: 'মূল লুপ: প্রতিটি প্রশ্নের জন্য, দেখান, ব্যবহারকারীর উত্তর নিন, সঠিক কিনা পরীক্ষা করুন, স্কোর আপডেট করুন।' },
        code: {
          code: 'for q in questions:\n    print(q["q"])\n    ans = input("> ")\n    if ans.lower() == q["a"].lower():\n        score += 1\n        print("Correct!")\n    else:\n        print("Wrong!")',
          language: 'python',
          explanation: { en: 'Case-insensitive comparison with .lower().', bn: '.lower() দিয়ে কেস-অসংবেদনশীল তুলনা।' }
        }
      }
    ],
    exercises: [
      {
        type: 'mcq',
        id: 'p10-logic-e1',
        question: { en: 'Why use .lower() when comparing answers?', bn: 'উত্তর তুলনায় .lower() কেন ব্যবহার করবেন?' },
        options: ['Case-insensitive matching', 'Speed', 'Required by Python', 'Memory efficiency'],
        correctIndex: 0,
        explanation: { en: '"Dhaka" and "dhaka" should both be correct answers.', bn: '"Dhaka" এবং "dhaka" উভয়ই সঠিক উত্তর হওয়া উচিত।' },
        xpReward: 30
      },
      {
        type: 'fill_blank',
        id: 'p10-logic-e2',
        question: { en: 'Compare answer case-insensitively:', bn: 'কেস-অসংবেদনশীলভাবে উত্তর তুলনা করুন:' },
        codeTemplate: 'if user_ans.___ () == correct.___ ():\n    print("Right!")',
        blanks: ['lower', 'lower'],
        explanation: { en: '.lower() makes both lowercase before comparing.', bn: 'তুলনার আগে .lower() উভয়কে ছোট হাতের করে।' },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p10-logic-e3',
        question: { en: 'What is the final score after the loop?', bn: 'লুপের পরে চূড়ান্ত স্কোর কত?' },
        code: 'questions = [{"q": "1+1", "a": "2"}, {"q": "2+2", "a": "5"}]\nanswerss = ["2", "4"]\nscore = 0\nfor i, q in enumerate(questions):\n    if answerss[i] == q["a"]:\n        score += 1\nprint(score)',
        options: ['1', '2', '0'],
        correctIndex: 0,
        explanation: { en: 'Only the first answer "2" matches "2". Score = 1.', bn: 'শুধুমাত্র প্রথম উত্তর "2" মেলে "2"। স্কোর = ১।' },
        xpReward: 35
      },
      {
        type: 'mcq',
        id: 'p10-logic-e4',
        question: { en: 'What does enumerate() do?', bn: 'enumerate() কী করে?' },
        options: ['Gives index AND value', 'Sorts the list', 'Reverses the list', 'Counts items'],
        correctIndex: 0,
        explanation: { en: 'enumerate(list) yields (index, item) pairs.', bn: 'enumerate(list) (index, item) জোড়া দেয়।' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'p10-logic-e5',
        question: { en: 'Build the score calculation:', bn: 'স্কোর গণনা তৈরি করুন:' },
        blocks: ['score = 0', 'for q in questions:', '    user = input(q["q"] + " ")', '    if user.lower() == q["a"].lower():', '        score += 1'],
        correctOrder: [0, 1, 2, 3, 4],
        explanation: { en: 'Track score across all questions.', bn: 'সব প্রশ্নে স্কোর ট্র্যাক করুন।' },
        xpReward: 45
      }
    ]
  },
  {
    id: 'p10-ui',
    sectionId: 'p-unit10',
    order: 3,
    title: { en: 'User Experience', bn: 'ব্যবহারকারীর অভিজ্ঞতা' },
    description: { en: 'Add hints and polished output.', bn: 'ইঙ্গিত এবং পরিশীলিত আউটপুট যোগ করুন।' },
    difficulty: 'advanced',
    xpReward: 200,
    estimatedMinutes: 12,
    theory: [
      {
        heading: { en: 'Making It User-Friendly', bn: 'ব্যবহারকারী-বান্ধব করা' },
        body: { en: 'Add separators, scores, and feedback. Use f-strings for clean output.', bn: 'বিভাজক, স্কোর এবং ফিডব্যাক যোগ করুন। পরিষ্কার আউটপুটের জন্য f-string ব্যবহার করুন।' },
        code: {
          code: 'print("=" * 30)\nprint("  QUIZ GAME  ")\nprint("=" * 30)\n\n# After quiz:\nprint(f"\\nYour Score: {score}/{total}")\nif score == total:\n    print("Perfect Score! 🎉")',
          language: 'python',
          explanation: { en: 'f-strings embed variables in strings cleanly.', bn: 'f-string পরিষ্কারভাবে স্ট্রিংয়ে ভেরিয়েবল এম্বেড করে।' }
        }
      }
    ],
    exercises: [
      {
        type: 'fill_blank',
        id: 'p10-ui-e1',
        question: { en: 'Create a separator line of 20 dashes:', bn: '২০টি ড্যাশ দিয়ে বিভাজক রেখা তৈরি করুন:' },
        codeTemplate: 'print("___" ___ 20)',
        blanks: ['-', '*'],
        explanation: { en: '"-" * 20 repeats the dash 20 times.', bn: '"-" * 20 ড্যাশটি ২০ বার পুনরাবৃত্তি করে।' },
        xpReward: 25
      },
      {
        type: 'output_predict',
        id: 'p10-ui-e2',
        question: { en: 'What does the f-string print?', bn: 'f-string কী প্রিন্ট করে?' },
        code: 'score = 4\ntotal = 5\nprint(f"Score: {score}/{total}")',
        options: ['Score: 4/5', 'Score: score/total', 'Score: {score}/{total}'],
        correctIndex: 0,
        explanation: { en: 'f-strings replace {var} with actual values.', bn: 'f-string {var} কে আসল মান দিয়ে প্রতিস্থাপন করে।' },
        xpReward: 25
      },
      {
        type: 'mcq',
        id: 'p10-ui-e3',
        question: { en: 'Which prefix creates an f-string?', bn: 'কোন প্রিফিক্স f-string তৈরি করে?' },
        options: ['f"..."', 'format("...")', '"...".f', 'str("...")'],
        correctIndex: 0,
        explanation: { en: 'f"..." before quotes enables variable embedding.', bn: 'উদ্ধৃতির আগে f"..." ভেরিয়েবল এম্বেডিং সক্ষম করে।' },
        xpReward: 20
      },
      {
        type: 'code_arrange',
        id: 'p10-ui-e4',
        question: { en: 'Show the final quiz results:', bn: 'চূড়ান্ত কুইজ ফলাফল দেখান:' },
        blocks: ['score = 3', 'total = 5', 'pct = (score / total) * 100', 'print(f"Score: {score}/{total} ({pct:.0f}%)") '],
        correctOrder: [0, 1, 2, 3],
        explanation: { en: ':.0f formats float with 0 decimal places.', bn: ':.0f ফ্লোটকে ০ দশমিক স্থান সহ ফর্ম্যাট করে।' },
        xpReward: 40
      },
      {
        type: 'bug_hunt',
        id: 'p10-ui-e5',
        question: { en: 'Fix the f-string:', bn: 'f-string ঠিক করুন:' },
        code: 'name = "Zara"\nprint("Hello, {name}!")',
        buggyLine: 2,
        explanation: { en: 'Missing f prefix. Should be: print(f"Hello, {name}!").', bn: 'f প্রিফিক্স নেই। হওয়া উচিত: print(f"Hello, {name}!")।' },
        xpReward: 30
      }
    ]
  },
  {
    id: 'p10-finish',
    sectionId: 'p-unit10',
    order: 4,
    isProject: true,
    title: { en: 'Grand Finale!', bn: 'গ্র্যান্ড ফিনালে!' },
    description: { en: 'Complete the full quiz game. You made it!', bn: 'সম্পূর্ণ কুইজ গেম সম্পন্ন করুন। আপনি করেছেন!' },
    difficulty: 'advanced',
    xpReward: 600,
    estimatedMinutes: 20,
    theory: [
      {
        heading: { en: 'The Complete Quiz Game', bn: 'সম্পূর্ণ কুইজ গেম' },
        body: { en: 'Congratulations! You have mastered Python basics. The full game combines: dicts, lists, loops, functions, conditions, and f-strings.', bn: 'অভিনন্দন! আপনি পাইথনের মূল বিষয় আয়ত্ত করেছেন। সম্পূর্ণ গেমে একত্রিত: dict, লিস্ট, লুপ, ফাংশন, শর্ত এবং f-string।' },
        code: {
          code: 'def run_quiz(questions):\n    score = 0\n    print("=" * 30)\n    for q in questions:\n        ans = input(q["q"] + "\\n> ")\n        if ans.lower() == q["a"].lower():\n            print("✓ Correct!")\n            score += 1\n        else:\n            print(f"✗ Answer: {q[\'a\']}")\n    print(f"\\nFinal: {score}/{len(questions)}")\n\nrun_quiz([{"q": "Capital of BD?", "a": "Dhaka"}])',
          language: 'python',
          explanation: { en: 'A complete, modular quiz game in Python!', bn: 'পাইথনে একটি সম্পূর্ণ, মডুলার কুইজ গেম!' }
        }
      }
    ],
    exercises: [
      {
        type: 'output_predict',
        id: 'p10-finish-e1',
        question: { en: 'What % score is 3 out of 4?', bn: '৪টির মধ্যে ৩টি কত %?' },
        code: 'print(f"{3/4*100:.0f}%")',
        options: ['75%', '80%', '70%'],
        correctIndex: 0,
        explanation: { en: '3/4 = 0.75, times 100 = 75.', bn: '3/4 = 0.75, ১০০ গুণ = ৭৫।' },
        xpReward: 40
      },
      {
        type: 'fill_blank',
        id: 'p10-finish-e2',
        question: { en: 'Define the main quiz function:', bn: 'মূল কুইজ ফাংশন সংজ্ঞায়িত করুন:' },
        codeTemplate: '___ run_quiz(questions):\n    score = 0\n    for q in questions:\n        pass\n    return score',
        blanks: ['def'],
        explanation: { en: 'def creates the function that can be called anytime.', bn: 'def এমন ফাংশন তৈরি করে যা যেকোনো সময় কল করা যায়।' },
        xpReward: 30
      },
      {
        type: 'mcq',
        id: 'p10-finish-e3',
        question: { en: 'What is the best way to end the game?', bn: 'গেম শেষ করার সেরা উপায় কী?' },
        options: ['Print final score and percentage', 'Just stop the loop', 'Use quit()', 'raise SystemExit'],
        correctIndex: 0,
        explanation: { en: 'Graceful ending with score gives the user closure.', bn: 'স্কোর সহ সুন্দর সমাপ্তি ব্যবহারকারীকে পরিপূর্ণতা দেয়।' },
        xpReward: 30
      },
      {
        type: 'code_arrange',
        id: 'p10-finish-e4',
        question: { en: 'Arrange the complete quiz runner:', bn: 'সম্পূর্ণ কুইজ রানার সাজান:' },
        blocks: [
          'def quiz(qs):',
          '    score = 0',
          '    for q in qs:',
          '        a = input(q["q"])',
          '        if a.lower() == q["a"].lower(): score += 1',
          '    return score'
        ],
        correctOrder: [0, 1, 2, 3, 4, 5],
        explanation: { en: 'Define, init score, loop, get answer, check, return.', bn: 'সংজ্ঞায়িত করুন, স্কোর শুরু করুন, লুপ করুন, উত্তর নিন, পরীক্ষা করুন, ফেরত দিন।' },
        xpReward: 70
      },
      {
        type: 'mcq',
        id: 'p10-finish-e5',
        question: { en: 'You have completed Python! What is next?', bn: 'আপনি পাইথন সম্পন্ন করেছেন! এরপর কী?' },
        options: ['File handling & OOP', 'Relearn variables', 'Stop learning', 'Only practice'],
        correctIndex: 0,
        explanation: { en: 'Next steps: file I/O, OOP (classes), error handling, modules!', bn: 'পরবর্তী ধাপ: ফাইল I/O, OOP (ক্লাস), এরর হ্যান্ডলিং, মডিউল!' },
        xpReward: 80
      }
    ]
  }
];
