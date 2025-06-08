import { ChineseCharacter, PinyinSyllable } from '../types';

// Mandarin Chinese initials (consonants)
export const INITIALS = [
  '',
  'b',
  'p',
  'm',
  'f',
  'd',
  't',
  'n',
  'l',
  'g',
  'k',
  'h',
  'j',
  'q',
  'x',
  'zh',
  'ch',
  'sh',
  'r',
  'z',
  'c',
  's',
  'y',
  'w',
];

// Mandarin Chinese finals (vowels/endings)
export const FINALS = [
  'a',
  'o',
  'e',
  'i',
  'u',
  'ü',
  'ai',
  'ei',
  'ao',
  'ou',
  'an',
  'en',
  'ang',
  'eng',
  'ong',
  'er',
  'ia',
  'ie',
  'iao',
  'iou',
  'ian',
  'in',
  'iang',
  'ing',
  'iong',
  'ua',
  'uo',
  'uai',
  'uei',
  'uan',
  'uen',
  'uang',
  'ueng',
  'üe',
  'üan',
  'ün',
];

// Valid syllable combinations (simplified set)
export const VALID_SYLLABLES: ChineseCharacter[] = [
  // Common syllables with their corresponding hanzi characters
  { hanzi: '妈', pinyin: 'ma', tone: 1 },
  { hanzi: '麻', pinyin: 'ma', tone: 2 },
  { hanzi: '马', pinyin: 'ma', tone: 3 },
  { hanzi: '骂', pinyin: 'ma', tone: 4 },
  { hanzi: '吗', pinyin: 'ma', tone: 5 },

  { hanzi: '爸', pinyin: 'ba', tone: 4 },
  { hanzi: '八', pinyin: 'ba', tone: 1 },
  { hanzi: '把', pinyin: 'ba', tone: 3 },

  { hanzi: '他', pinyin: 'ta', tone: 1 },
  { hanzi: '她', pinyin: 'ta', tone: 1 },
  { hanzi: '它', pinyin: 'ta', tone: 1 },
  { hanzi: '踏', pinyin: 'ta', tone: 4 },

  { hanzi: '大', pinyin: 'da', tone: 4 },
  { hanzi: '打', pinyin: 'da', tone: 3 },
  { hanzi: '答', pinyin: 'da', tone: 2 },

  { hanzi: '你', pinyin: 'ni', tone: 3 },
  { hanzi: '泥', pinyin: 'ni', tone: 2 },
  { hanzi: '逆', pinyin: 'ni', tone: 4 },

  { hanzi: '我', pinyin: 'wo', tone: 3 },
  { hanzi: '握', pinyin: 'wo', tone: 4 },
  { hanzi: '卧', pinyin: 'wo', tone: 4 },

  { hanzi: '好', pinyin: 'hao', tone: 3 },
  { hanzi: '豪', pinyin: 'hao', tone: 2 },
  { hanzi: '号', pinyin: 'hao', tone: 4 },
  { hanzi: '毫', pinyin: 'hao', tone: 2 },

  { hanzi: '来', pinyin: 'lai', tone: 2 },
  { hanzi: '赖', pinyin: 'lai', tone: 4 },

  { hanzi: '去', pinyin: 'qu', tone: 4 },
  { hanzi: '取', pinyin: 'qu', tone: 3 },
  { hanzi: '趣', pinyin: 'qu', tone: 4 },

  { hanzi: '是', pinyin: 'shi', tone: 4 },
  { hanzi: '十', pinyin: 'shi', tone: 2 },
  { hanzi: '石', pinyin: 'shi', tone: 2 },
  { hanzi: '诗', pinyin: 'shi', tone: 1 },

  { hanzi: '中', pinyin: 'zhong', tone: 1 },
  { hanzi: '种', pinyin: 'zhong', tone: 3 },
  { hanzi: '重', pinyin: 'zhong', tone: 4 },

  { hanzi: '人', pinyin: 'ren', tone: 2 },
  { hanzi: '认', pinyin: 'ren', tone: 4 },
  { hanzi: '仁', pinyin: 'ren', tone: 2 },

  { hanzi: '一', pinyin: 'yi', tone: 1 },
  { hanzi: '二', pinyin: 'er', tone: 4 },
  { hanzi: '三', pinyin: 'san', tone: 1 },
  { hanzi: '四', pinyin: 'si', tone: 4 },
  { hanzi: '五', pinyin: 'wu', tone: 3 },
  { hanzi: '六', pinyin: 'liu', tone: 4 },
  { hanzi: '七', pinyin: 'qi', tone: 1 },
  { hanzi: '八', pinyin: 'ba', tone: 1 },
  { hanzi: '九', pinyin: 'jiu', tone: 3 },
  { hanzi: '十', pinyin: 'shi', tone: 2 },

  { hanzi: '天', pinyin: 'tian', tone: 1 },
  { hanzi: '地', pinyin: 'di', tone: 4 },
  { hanzi: '山', pinyin: 'shan', tone: 1 },
  { hanzi: '水', pinyin: 'shui', tone: 3 },
  { hanzi: '火', pinyin: 'huo', tone: 3 },
  { hanzi: '木', pinyin: 'mu', tone: 4 },
  { hanzi: '金', pinyin: 'jin', tone: 1 },
  { hanzi: '土', pinyin: 'tu', tone: 3 },

  { hanzi: '吃', pinyin: 'chi', tone: 1 },
  { hanzi: '喝', pinyin: 'he', tone: 1 },
  { hanzi: '看', pinyin: 'kan', tone: 4 },
  { hanzi: '听', pinyin: 'ting', tone: 1 },
  { hanzi: '说', pinyin: 'shuo', tone: 1 },
  { hanzi: '读', pinyin: 'du', tone: 2 },
  { hanzi: '写', pinyin: 'xie', tone: 3 },

  { hanzi: '今', pinyin: 'jin', tone: 1 },
  { hanzi: '明', pinyin: 'ming', tone: 2 },
  { hanzi: '昨', pinyin: 'zuo', tone: 2 },
  { hanzi: '年', pinyin: 'nian', tone: 2 },
  { hanzi: '月', pinyin: 'yue', tone: 4 },
  { hanzi: '日', pinyin: 'ri', tone: 4 },

  { hanzi: '白', pinyin: 'bai', tone: 2 },
  { hanzi: '黑', pinyin: 'hei', tone: 1 },
  { hanzi: '红', pinyin: 'hong', tone: 2 },
  { hanzi: '绿', pinyin: 'lü', tone: 4 },
  { hanzi: '蓝', pinyin: 'lan', tone: 2 },
  { hanzi: '黄', pinyin: 'huang', tone: 2 },

  { hanzi: '小', pinyin: 'xiao', tone: 3 },
  { hanzi: '大', pinyin: 'da', tone: 4 },
  { hanzi: '高', pinyin: 'gao', tone: 1 },
  { hanzi: '低', pinyin: 'di', tone: 1 },
  { hanzi: '长', pinyin: 'chang', tone: 2 },
  { hanzi: '短', pinyin: 'duan', tone: 3 },

  { hanzi: '东', pinyin: 'dong', tone: 1 },
  { hanzi: '西', pinyin: 'xi', tone: 1 },
  { hanzi: '南', pinyin: 'nan', tone: 2 },
  { hanzi: '北', pinyin: 'bei', tone: 3 },

  { hanzi: '家', pinyin: 'jia', tone: 1 },
  { hanzi: '学', pinyin: 'xue', tone: 2 },
  { hanzi: '校', pinyin: 'xiao', tone: 4 },
  { hanzi: '工', pinyin: 'gong', tone: 1 },
  { hanzi: '作', pinyin: 'zuo', tone: 4 },

  { hanzi: '爱', pinyin: 'ai', tone: 4 },
  { hanzi: '想', pinyin: 'xiang', tone: 3 },
  { hanzi: '知', pinyin: 'zhi', tone: 1 },
  { hanzi: '道', pinyin: 'dao', tone: 4 },
  { hanzi: '会', pinyin: 'hui', tone: 4 },
  { hanzi: '能', pinyin: 'neng', tone: 2 },

  { hanzi: '什', pinyin: 'shen', tone: 2 },
  { hanzi: '么', pinyin: 'me', tone: 5 },
  { hanzi: '哪', pinyin: 'na', tone: 3 },
  { hanzi: '里', pinyin: 'li', tone: 3 },
  { hanzi: '谁', pinyin: 'shei', tone: 2 },
  { hanzi: '怎', pinyin: 'zen', tone: 3 },
  { hanzi: '样', pinyin: 'yang', tone: 4 },

  { hanzi: '很', pinyin: 'hen', tone: 3 },
  { hanzi: '太', pinyin: 'tai', tone: 4 },
  { hanzi: '真', pinyin: 'zhen', tone: 1 },
  { hanzi: '非', pinyin: 'fei', tone: 1 },
  { hanzi: '常', pinyin: 'chang', tone: 2 },

  // Add more comprehensive syllables
  { hanzi: '不', pinyin: 'bu', tone: 4 },
  { hanzi: '没', pinyin: 'mei', tone: 2 },
  { hanzi: '有', pinyin: 'you', tone: 3 },
  { hanzi: '也', pinyin: 'ye', tone: 3 },
  { hanzi: '都', pinyin: 'dou', tone: 1 },
  { hanzi: '还', pinyin: 'hai', tone: 2 },
  { hanzi: '就', pinyin: 'jiu', tone: 4 },
  { hanzi: '只', pinyin: 'zhi', tone: 3 },
  { hanzi: '可', pinyin: 'ke', tone: 3 },
  { hanzi: '以', pinyin: 'yi', tone: 3 },

  { hanzi: '在', pinyin: 'zai', tone: 4 },
  { hanzi: '上', pinyin: 'shang', tone: 4 },
  { hanzi: '下', pinyin: 'xia', tone: 4 },
  { hanzi: '前', pinyin: 'qian', tone: 2 },
  { hanzi: '后', pinyin: 'hou', tone: 4 },
  { hanzi: '左', pinyin: 'zuo', tone: 3 },
  { hanzi: '右', pinyin: 'you', tone: 4 },
  { hanzi: '旁', pinyin: 'pang', tone: 2 },

  { hanzi: '开', pinyin: 'kai', tone: 1 },
  { hanzi: '关', pinyin: 'guan', tone: 1 },
  { hanzi: '进', pinyin: 'jin', tone: 4 },
  { hanzi: '出', pinyin: 'chu', tone: 1 },
  { hanzi: '走', pinyin: 'zou', tone: 3 },
  { hanzi: '跑', pinyin: 'pao', tone: 3 },
  { hanzi: '飞', pinyin: 'fei', tone: 1 },
  { hanzi: '坐', pinyin: 'zuo', tone: 4 },
  { hanzi: '站', pinyin: 'zhan', tone: 4 },
  { hanzi: '躺', pinyin: 'tang', tone: 3 },
];

// Tone markers for pinyin display with proper Unicode accented characters
export const TONE_VOWELS = {
  a: ['a', 'ā', 'á', 'ǎ', 'à', 'a'],
  o: ['o', 'ō', 'ó', 'ǒ', 'ò', 'o'],
  e: ['e', 'ē', 'é', 'ě', 'è', 'e'],
  i: ['i', 'ī', 'í', 'ǐ', 'ì', 'i'],
  u: ['u', 'ū', 'ú', 'ǔ', 'ù', 'u'],
  ü: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
} as const;

// Function to validate syllable combinations
export function isValidSyllable(initial: string, final: string): boolean {
  // Basic validation rules for Mandarin syllables
  const syllable = initial + final;
  return VALID_SYLLABLES.some((char) => char.pinyin === syllable);
}

// Function to get a random valid syllable
export function getRandomSyllable(): PinyinSyllable {
  const randomChar =
    VALID_SYLLABLES[Math.floor(Math.random() * VALID_SYLLABLES.length)];
  const pinyin = randomChar.pinyin;

  // Extract initial and final from pinyin
  let initial = '';
  let final = pinyin;

  for (const init of INITIALS) {
    if (init && pinyin.startsWith(init)) {
      initial = init;
      final = pinyin.substring(init.length);
      break;
    }
  }

  return {
    initial,
    final,
    tone: randomChar.tone,
  };
}

// Function to convert syllable to hanzi for TTS
export function syllableToHanzi(syllable: PinyinSyllable): string {
  const pinyinText = syllable.initial + syllable.final;
  const match = VALID_SYLLABLES.find(
    (char) => char.pinyin === pinyinText && char.tone === syllable.tone
  );
  return match ? match.hanzi : '的'; // fallback character
}

// Function to format pinyin with proper tone marks
export function formatPinyinWithTones(syllable: PinyinSyllable): string {
  const pinyinText = syllable.initial + syllable.final;
  const tone = syllable.tone;

  if (tone === 5 || tone < 1 || tone > 4) {
    return pinyinText; // neutral tone or invalid tone has no mark
  }

  // Priority order for tone mark placement: a, o, e, then first vowel found
  const tonePriority = ['a', 'o', 'e', 'i', 'u', 'ü'];

  for (const vowel of tonePriority) {
    if (pinyinText.includes(vowel)) {
      const toneVowel = TONE_VOWELS[vowel as keyof typeof TONE_VOWELS][tone];
      return pinyinText.replace(vowel, toneVowel);
    }
  }

  return pinyinText;
}
