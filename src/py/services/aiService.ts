const API_URL = '/api/gemini';

const SYSTEM_PROMPT = `You are 'নিনি' (Nini), the friendly AI coding tutor of CholoSikhi Academy. You teach programming in Bengali (Bangla) primarily but can also respond in English. You are encouraging, patient, and explain things with real-world Bengali examples. Keep responses concise and focused on programming concepts.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const chatWithAiTutor = async (
  message: string, 
  context?: { course?: string; lesson?: string; language?: string }
): Promise<string> => {
  try {
    let contextStr = '';
    if (context?.course || context?.lesson) {
      contextStr = `\nContext: User is currently studying ${context.course || 'a course'}, lesson: ${context.lesson || 'unknown'}.`;
    }
    
    const messages = [
      { role: 'user', content: message + contextStr }
    ];

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        systemPrompt: SYSTEM_PROMPT
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to communicate with AI service');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('AI Tutor Error:', error);
    throw new Error('দুঃখিত, এই মুহূর্তে আমি উত্তর দিতে পারছি না। একটু পরে আবার চেষ্টা করুন।');
  }
};

export const getAiHint = async (
  question: string, 
  userAnswer?: string, 
  language: string = 'bn'
): Promise<string> => {
  try {
    let message = `Provide a hint for this programming question: "${question}".`;
    if (userAnswer) {
      message += `\nThe user has tried: "${userAnswer}". Tell them what they might be doing wrong, but DO NOT give the direct answer.`;
    }
    if (language === 'en') {
      message += `\nPlease provide the hint in English.`;
    } else {
      message += `\nPlease provide the hint in Bengali.`;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }],
        systemPrompt: SYSTEM_PROMPT
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get hint');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('AI Hint Error:', error);
    return language === 'en' 
      ? "Sorry, I couldn't generate a hint right now." 
      : 'দুঃখিত, আমি এই মুহূর্তে কোনো সংকেত দিতে পারছি না।';
  }
};

export const reviewCode = async (
  code: string, 
  language: string = 'bn'
): Promise<string> => {
  try {
    let message = `Please review the following code and provide feedback:\n\n\`\`\`\n${code}\n\`\`\``;
    
    if (language === 'en') {
      message += `\nPlease provide the review in English.`;
    } else {
      message += `\nPlease provide the review in Bengali.`;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }],
        systemPrompt: SYSTEM_PROMPT
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to review code');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Code Review Error:', error);
    return language === 'en'
      ? "Sorry, I couldn't review the code right now."
      : 'দুঃখিত, আমি এই মুহূর্তে কোডটি পর্যালোচনা করতে পারছি না।';
  }
};

export const chatWithHistory = async (
  messages: ChatMessage[],
  context?: { language?: string }
): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        systemPrompt: SYSTEM_PROMPT
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to communicate with AI service');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('AI Tutor Error:', error);
    throw new Error(
      context?.language === 'en' 
        ? 'Sorry, I cannot respond right now. Please try again later.'
        : 'দুঃখিত, এই মুহূর্তে আমি উত্তর দিতে পারছি না। একটু পরে আবার চেষ্টা করুন।'
    );
  }
}
