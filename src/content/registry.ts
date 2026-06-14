

export interface CourseEntry {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
  color: string;
  tagline: { en: string; bn: string };
  available: boolean;
  comingSoon?: boolean;
}

export const COURSE_REGISTRY: CourseEntry[] = [
  {
    id: 'cpp',
    name: 'C++',
    nameBn: 'সি++',
    icon: '⚙️',
    color: '#6c3de8',
    tagline: { en: 'Master C++ from scratch', bn: 'শূন্য থেকে সি++ শিখুন' },
    available: true,
  },
  {
    id: 'python',
    name: 'Python',
    nameBn: 'পাইথন',
    icon: '🐍',
    color: '#10b981',
    tagline: { en: 'Learn Python the fun way', bn: 'মজায় মজায় পাইথন শিখুন' },
    available: true,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    nameBn: 'জাভাস্ক্রিপ্ট',
    icon: '🌐',
    color: '#f59e0b',
    tagline: { en: 'Build the web with JS', bn: 'জেএস দিয়ে ওয়েব বানান' },
    available: false,
    comingSoon: true,
  },
  {
    id: 'java',
    name: 'Java',
    nameBn: 'জাভা',
    icon: '☕',
    color: '#ef4444',
    tagline: { en: 'Java for everyone', bn: 'সবার জন্য জাভা' },
    available: false,
    comingSoon: true,
  },
];
