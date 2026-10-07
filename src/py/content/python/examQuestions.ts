export interface ExamQuestion {
  id: string;
  unit: number;
  unitTitle: { en: string; bn: string };
  question: { en: string; bn: string };
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: { en: string; bn: string };
}

export const certificationExamQuestions: ExamQuestion[] = [
  // --- Unit 1: Print & Variables ---
  {
    id: 'exam-q1',
    unit: 1,
    unitTitle: { en: 'Unit 1: First Steps & Variables', bn: 'ইউনিট ১: প্রথম পদক্ষেপ ও ভেরিয়েবল' },
    question: {
      en: 'What will be printed on the screen after executing this code?',
      bn: 'নিচের পাইথন কোডটি চালালে স্ক্রিনে ঠিক কী প্রিন্ট হবে?'
    },
    code: 'user = "রাহাত"\nprint("স্বাগতম, " + user + "!")',
    options: [
      'স্বাগতম, রাহাত!',
      'স্বাগতম, user!',
      'স্বাগতম,রাহাত!',
      'Error'
    ],
    correctIndex: 0,
    explanation: {
      en: 'String concatenation joins the string pieces with the variable value cleanly.',
      bn: 'স্ট্রিং কনক্যাটেনেশন ভেরিয়েবলের মানের সাথে স্ট্রিংগুলো জোড়া দিয়ে "স্বাগতম, রাহাত!" তৈরি করে।'
    }
  },
  {
    id: 'exam-q2',
    unit: 1,
    unitTitle: { en: 'Unit 1: First Steps & Variables', bn: 'ইউনিট ১: প্রথম পদক্ষেপ ও ভেরিয়েবল' },
    question: {
      en: 'Which variable name violates standard Python naming rules?',
      bn: 'নিচের কোন ভেরিয়েবল নামটি পাইথনের সিনট্যাক্স নিয়ম লঙ্ঘন করে?'
    },
    options: [
      '1st_score = 95',
      'user_score = 95',
      '_score = 95',
      'score_1 = 95'
    ],
    correctIndex: 0,
    explanation: {
      en: 'Variable names cannot start with a digit. 1st_score raises a SyntaxError.',
      bn: 'পাইথনে ভেরিয়েবলের নাম কখনো সংখ্যা (1st_score) দিয়ে শুরু হতে পারে না।'
    }
  },

  // --- Unit 2: Numbers & Type Conversion ---
  {
    id: 'exam-q3',
    unit: 2,
    unitTitle: { en: 'Unit 2: Math & Data Types', bn: 'ইউনিট ২: গণিত ও ডাটা টাইপ' },
    question: {
      en: 'What is the exact result and type of 15 / 3 in Python 3?',
      bn: 'পাইথনে 15 / 3 হিসাব করলে ফলাফল ও টাইপ কী হবে?'
    },
    code: 'result = 15 / 3\nprint(result, type(result))',
    options: [
      '5.0 <class \'float\'>',
      '5 <class \'int\'>',
      '5.0 <class \'int\'>',
      '3 <class \'float\'>'
    ],
    correctIndex: 0,
    explanation: {
      en: 'The standard division operator (/) in Python always yields a float (5.0), even if divided evenly.',
      bn: 'পাইথনে একক স্ল্যাশ (/) দিয়ে ভাগ করলে ফলাফল সবসময় float (5.0) হয়।'
    }
  },
  {
    id: 'exam-q4',
    unit: 2,
    unitTitle: { en: 'Unit 2: Math & Data Types', bn: 'ইউনিট ২: গণিত ও ডাটা টাইপ' },
    question: {
      en: 'If a bKash fee is calculated as `int(550.85)`, what is stored in the integer variable?',
      bn: 'যদি `int(550.85)` দিয়ে টাইপ কনভার্ট করা হয়, তবে ভেরিয়েবলে কী মান থাকবে?'
    },
    code: 'fee = int(550.85)\nprint(fee)',
    options: [
      '550',
      '551',
      '550.0',
      'Error'
    ],
    correctIndex: 0,
    explanation: {
      en: 'int() truncates the decimal portion completely, leaving 550.',
      bn: 'int() দশমিকের পরের অংশ সম্পূর্ণ কেটে ফেলে, ফলে ৫৫০ অবশিষ্ট থাকে।'
    }
  },

  // --- Unit 3: Recall Review 1 ---
  {
    id: 'exam-q5',
    unit: 3,
    unitTitle: { en: 'Unit 3: Review Storm 1', bn: 'ইউনিট ৩: রিভিউর ঝড় ১' },
    question: {
      en: 'What is the output of 23 % 5 in Python?',
      bn: 'পাইথনে 23 % 5 এর আউটপুট কত?'
    },
    code: 'print(23 % 5)',
    options: [
      '3',
      '4',
      '4.6',
      '0'
    ],
    correctIndex: 0,
    explanation: {
      en: 'The modulo operator (%) returns the remainder of the division. 23 divided by 5 is 4 with remainder 3.',
      bn: 'মডুলো অপারেটর (%) ভাগশেষ বের করে। ২৩ কে ৫ দিয়ে ভাগ করলে ভাগশেষ থাকে ৩।'
    }
  },
  {
    id: 'exam-q6',
    unit: 3,
    unitTitle: { en: 'Unit 3: Review Storm 1', bn: 'ইউনিট ৩: রিভিউর ঝড় ১' },
    question: {
      en: 'What will be printed after the age calculation and type conversion?',
      bn: 'এই কোডটি রান করলে আউটপুট কী হবে?'
    },
    code: 'birth_year = "2004"\ncurrent_year = 2026\nage = current_year - int(birth_year)\nprint(f"বয়স: {age}")',
    options: [
      'বয়স: 22',
      'বয়স: 2026',
      'TypeError',
      'বয়স: 2004'
    ],
    correctIndex: 0,
    explanation: {
      en: 'int("2004") becomes integer 2004. 2026 - 2004 = 22.',
      bn: 'int("2004") সংখ্যায় রূপান্তর হয় এবং ২০২৬ - ২০০৪ = ২২ প্রিন্ট হয়।'
    }
  },

  // --- Unit 4: Conditionals (if/elif/else) ---
  {
    id: 'exam-q7',
    unit: 4,
    unitTitle: { en: 'Unit 4: Conditions & Logic', bn: 'ইউনিট ৪: সিদ্ধান্ত ও শর্ত' },
    question: {
      en: 'Which branch executes for balance = 40 in Dhaka Metro Rail pass logic?',
      bn: 'ব্যালেন্স ৪০ টাকা হলে মেট্রোরেল পাসের এই কোডে কোন ব্রাঞ্চটি চলবে?'
    },
    code: 'balance = 40\nif balance >= 100:\n    print("ভিআইপি গেট")\nelif balance >= 30:\n    print("স্ট্যান্ডার্ড গেট")\nelse:\n    print("রিচার্জ করুন")',
    options: [
      'স্ট্যান্ডার্ড গেট',
      'ভিআইপি গেট',
      'রিচার্জ করুন',
      'ভিআইপি গেট এবং স্ট্যান্ডার্ড গেট'
    ],
    correctIndex: 0,
    explanation: {
      en: 'balance >= 100 is False, but elif balance >= 30 is True (40 >= 30), so it prints "স্ট্যান্ডার্ড গেট".',
      bn: 'প্রথম শর্ত ৪০ >= ১০০ মিথ্যা, কিন্তু elif শর্ত ৪০ >= ৩০ সত্য হওয়ায় "স্ট্যান্ডার্ড গেট" প্রিন্ট হবে।'
    }
  },
  {
    id: 'exam-q8',
    unit: 4,
    unitTitle: { en: 'Unit 4: Conditions & Logic', bn: 'ইউনিট ৪: সিদ্ধান্ত ও শর্ত' },
    question: {
      en: 'What is the output of this nested comparison expression?',
      bn: 'নিচের তুলনামূলক এক্সপ্রেশনটির আউটপুট কী?'
    },
    code: 'marks = 85\nprint(80 <= marks < 90)',
    options: [
      'True',
      'False',
      '85',
      'SyntaxError'
    ],
    correctIndex: 0,
    explanation: {
      en: 'Python supports chained comparisons. 80 <= 85 is True and 85 < 90 is True, resulting in True.',
      bn: 'পাইথনে চেইনড কম্প্যারিজন সমর্থন করে। ৮০ <= ৮৫ সত্য এবং ৮৫ < ৯০ ও সত্য, তাই ফলাফল True।'
    }
  },

  // --- Unit 5: Boolean Logic (and, or, not) ---
  {
    id: 'exam-q9',
    unit: 5,
    unitTitle: { en: 'Unit 5: Boolean Power-Up', bn: 'ইউনিট ৫: বুলিয়ান লজিক' },
    question: {
      en: 'What does this boolean expression evaluate to in Python?',
      bn: 'পাইথনে এই বুলিয়ান এক্সপ্রেশনের মান কী হবে?'
    },
    code: 'is_student = True\nhas_coupon = False\nprint(is_student or has_coupon and False)',
    options: [
      'True',
      'False',
      'None',
      'Error'
    ],
    correctIndex: 0,
    explanation: {
      en: '`and` has higher precedence than `or`. (has_coupon and False) evaluates to False. Then (True or False) evaluates to True.',
      bn: 'and এর অগ্রাধিকার or এর চেয়ে বেশি। (has_coupon and False) হলো False, এরপর (True or False) এর মান দাঁড়ায় True।'
    }
  },
  {
    id: 'exam-q10',
    unit: 5,
    unitTitle: { en: 'Unit 5: Boolean Power-Up', bn: 'ইউনিট ৫: বুলিয়ান লজিক' },
    question: {
      en: 'What will be printed when evaluating `not not (5 > 2)`?',
      bn: '`print(not not (5 > 2))` চালালে কী প্রিন্ট হবে?'
    },
    code: 'print(not not (5 > 2))',
    options: [
      'True',
      'False',
      '2',
      '5'
    ],
    correctIndex: 0,
    explanation: {
      en: '5 > 2 is True. not True is False. not False is True.',
      bn: '৫ > ২ সত্য (True)। প্রথম not একে False করে, এবং দ্বিতীয় not পুনরায় True করে।'
    }
  },

  // --- Unit 6: Loops (for, while, range, break, continue) ---
  {
    id: 'exam-q11',
    unit: 6,
    unitTitle: { en: 'Unit 6: Cosmic Loops', bn: 'ইউনিট ৬: লুপের ঘূর্ণন' },
    question: {
      en: 'What is the sum calculated by this loop?',
      bn: 'এই লুপটি চালালে total এর চূড়ান্ত মান কত হবে?'
    },
    code: 'total = 0\nfor i in range(1, 5):\n    total += i\nprint(total)',
    options: [
      '10',
      '15',
      '4',
      '5'
    ],
    correctIndex: 0,
    explanation: {
      en: 'range(1, 5) generates 1, 2, 3, 4. 1 + 2 + 3 + 4 = 10.',
      bn: 'range(1, 5) সংখ্যা তৈরি করে ১, ২, ৩, ৪। এদের যোগফল ১ + ২ + ৩ + ৪ = ১০।'
    }
  },
  {
    id: 'exam-q12',
    unit: 6,
    unitTitle: { en: 'Unit 6: Cosmic Loops', bn: 'ইউনিট ৬: লুপের ঘূর্ণন' },
    question: {
      en: 'What does this loop print when break and continue are used?',
      bn: 'এই লুপটি চালালে স্ক্রিনে কী প্রিন্ট হবে?'
    },
    code: 'output = []\nfor x in range(1, 6):\n    if x == 3:\n        continue\n    if x == 5:\n        break\n    output.append(str(x))\nprint(" ".join(output))',
    options: [
      '1 2 4',
      '1 2 3 4',
      '1 2',
      '1 2 4 5'
    ],
    correctIndex: 0,
    explanation: {
      en: 'At x=3, continue skips. At x=5, break halts the loop. So 1, 2, 4 are appended.',
      bn: 'x=3 হলে continue পরের ধাপে যায়। x=5 হলে break লুপ বন্ধ করে। ফলে ১, ২, ৪ যুক্ত হয়।'
    }
  },

  // --- Unit 7: Recall Review 2 ---
  {
    id: 'exam-q13',
    unit: 7,
    unitTitle: { en: 'Unit 7: Review Storm 2', bn: 'ইউনিট ৭: রিভিউর ঝড় ২' },
    question: {
      en: 'How many times does the inner print execute in this nested structure?',
      bn: 'এই নেস্টেড লুপে ভেতরের প্রিন্টটি সর্বমোট কয়বার রান করবে?'
    },
    code: 'count = 0\nfor i in range(3):\n    for j in range(2):\n        count += 1\nprint(count)',
    options: [
      '6',
      '5',
      '3',
      '2'
    ],
    correctIndex: 0,
    explanation: {
      en: 'Outer loop runs 3 times; for each outer step, inner loop runs 2 times. 3 * 2 = 6.',
      bn: 'বাইরের লুপ ৩ বার এবং প্রতিবারে ভেতরের লুপ ২ বার চলে। মোট ৩ × ২ = ৬ বার।'
    }
  },
  {
    id: 'exam-q14',
    unit: 7,
    unitTitle: { en: 'Unit 7: Review Storm 2', bn: 'ইউনিট ৭: রিভিউর ঝড় ২' },
    question: {
      en: 'What is the value of result after the while loop finishes?',
      bn: 'while লুপ শেষ হওয়ার পর result ভেরিয়েবলের মান কত হবে?'
    },
    code: 'n = 8\nresult = 0\nwhile n > 1:\n    n = n // 2\n    result += 1\nprint(result)',
    options: [
      '3',
      '4',
      '2',
      '8'
    ],
    correctIndex: 0,
    explanation: {
      en: 'Step 1: n=4, res=1. Step 2: n=2, res=2. Step 3: n=1, res=3. Loop terminates since n is no longer > 1.',
      bn: 'ধাপ ১: n=4, res=1। ধাপ ২: n=2, res=2। ধাপ ৩: n=1, res=3। লুপ সমাপ্ত।'
    }
  },

  // --- Unit 8: Collections (Lists & Dicts) ---
  {
    id: 'exam-q15',
    unit: 8,
    unitTitle: { en: 'Unit 8: Lists & Dictionaries', bn: 'ইউনিট ৮: ডাটার ঝুড়ি' },
    question: {
      en: 'What will print after modifying this list in Python?',
      bn: 'লিস্টে এই অপারেশনগুলো করার পর আউটপুট কী হবে?'
    },
    code: 'items = ["আম", "জাম", "লিচু"]\nitems.append("কাঁঠাল")\nitems.pop(1)\nprint(items[1])',
    options: [
      'লিচু',
      'জাম',
      'আম',
      'কাঁঠাল'
    ],
    correctIndex: 0,
    explanation: {
      en: 'After append: ["আম", "জাম", "লিচু", "কাঁঠাল"]. After pop(1) ("জাম" removed): ["আম", "লিচু", "কাঁঠাল"]. Now index 1 is "লিচু".',
      bn: 'append এর পর কাঁঠাল যোগ হয়। pop(1) দিয়ে জাম মুছে গেলে ১ নম্বর ইনডেক্সে "লিচু" চলে আসে।'
    }
  },
  {
    id: 'exam-q16',
    unit: 8,
    unitTitle: { en: 'Unit 8: Lists & Dictionaries', bn: 'ইউনিট ৮: ডাটার ঝুড়ি' },
    question: {
      en: 'How do you safely get a dictionary value without crashing if the key is missing?',
      bn: 'ডিকশনারিতে কোনো কী (key) না থাকলেও এরর ছাড়াই মান পেতে কোনটি ব্যবহার করবে?'
    },
    code: 'user = {"name": "নিনি"}\n# How to safely get "xp" with default 0?',
    options: [
      'user.get("xp", 0)',
      'user["xp", 0]',
      'user.find("xp", 0)',
      'user.xp or 0'
    ],
    correctIndex: 0,
    explanation: {
      en: 'dict.get(key, default) returns the value or default without raising a KeyError.',
      bn: '.get(key, default) মেথড নিরাপদে মান নিয়ে আসে এবং কী না থাকলে ডিফল্ট মান ফেরত দেয়।'
    }
  },

  // --- Unit 9: Functions & Scope ---
  {
    id: 'exam-q17',
    unit: 9,
    unitTitle: { en: 'Unit 9: Custom Functions', bn: 'ইউনিট ৯: নিজস্ব ফাংশন' },
    question: {
      en: 'What is the return value of calculate_total(1000)?',
      bn: 'calculate_total(1000) কল করলে কী মান ফেরত আসবে?'
    },
    code: 'def calculate_total(price, vat=5):\n    return price + (price * vat // 100)\n\nprint(calculate_total(1000))',
    options: [
      '1050',
      '1000',
      '1005',
      '50'
    ],
    correctIndex: 0,
    explanation: {
      en: 'vat uses its default value 5. 1000 + (1000 * 5 // 100) = 1000 + 50 = 1050.',
      bn: 'vat ডিফল্ট মান ৫ নেয়। ১০০০ + (১০০০ × ৫ // ১০০) = ১০০০ + ৫০ = ১০৫০।'
    }
  },
  {
    id: 'exam-q18',
    unit: 9,
    unitTitle: { en: 'Unit 9: Custom Functions', bn: 'ইউনিট ৯: নিজস্ব ফাংশন' },
    question: {
      en: 'What is the printed value of x outside the function scope?',
      bn: 'ফাংশনের বাইরের x এর মান স্ক্রিনে কী প্রিন্ট হবে?'
    },
    code: 'x = 10\ndef update_val():\n    x = 50\n    return x\n\nupdate_val()\nprint(x)',
    options: [
      '10',
      '50',
      '60',
      'UnboundLocalError'
    ],
    correctIndex: 0,
    explanation: {
      en: 'Inside update_val(), x = 50 is a local variable. The global variable x remains 10.',
      bn: 'ফাংশনের ভেতরে x = 50 একটি লোকাল ভেরিয়েবল। বাইরের গ্লোবাল x অপরিবর্তিত থেকে ১০-ই থাকে।'
    }
  },

  // --- Unit 10: Capstone Project Architecture ---
  {
    id: 'exam-q19',
    unit: 10,
    unitTitle: { en: 'Unit 10: Grand Capstone Project', bn: 'ইউনিট ১০: গ্র্যান্ড ক্যাপস্টোন প্রজেক্ট' },
    question: {
      en: 'What is the convention for ensuring a Python script runs only when executed directly?',
      bn: 'পাইথন ফাইল সরাসরি রান করলেই কেবল মূল ফাংশন চালু করার সঠিক সিনট্যাক্স কোনটি?'
    },
    options: [
      'if __name__ == "__main__":',
      'if __start__ == True:',
      'if file == "main":',
      'def __main__():'
    ],
    correctIndex: 0,
    explanation: {
      en: 'if __name__ == "__main__": is standard Python boilerplate for script entrypoints.',
      bn: 'if __name__ == "__main__": হলো পাইথনের অফিসিয়াল স্ট্যান্ডার্ড স্ক্রিপ্ট এন্ট্রি-পয়েন্ট।'
    }
  },
  {
    id: 'exam-q20',
    unit: 10,
    unitTitle: { en: 'Unit 10: Grand Capstone Project', bn: 'ইউনিট ১০: গ্র্যান্ড ক্যাপস্টোন প্রজেক্ট' },
    question: {
      en: 'What will this scorecard banner print for score = 18 out of total = 20?',
      bn: '১৮/২০ স্কোরের জন্য এই f-string ব্যানারটি কী প্রিন্ট করবে?'
    },
    code: 'score = 18\ntotal = 20\npct = (score / total) * 100\nprint(f"চলোশিখি সার্টিফিকেট: {pct:.0f}% নম্বর সহ উত্তীর্ণ!")',
    options: [
      'চলোশিখি সার্টিফিকেট: 90% নম্বর সহ উত্তীর্ণ!',
      'চলোশিখি সার্টিফিকেট: 18% নম্বর সহ উত্তীর্ণ!',
      'চলোশিখি সার্টিফিকেট: 0.9% নম্বর সহ উত্তীর্ণ!',
      'Error'
    ],
    correctIndex: 0,
    explanation: {
      en: '18 / 20 is 0.90, times 100 is 90. :.0f formats 90 with no decimal places.',
      bn: '(১৮ / ২০) × ১০০ = ৯০। ৯০% নম্বর সহ উত্তীর্ণ প্রিন্ট হবে।'
    }
  }
];
