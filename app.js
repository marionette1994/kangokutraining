// =============================================================
// 鍛帳 (Tanchō) — 監獄トレーニング稽古録
// PWA build: React 18 UMD + Recharts UMD, no ES module imports
// =============================================================

const {
  useState,
  useEffect,
  useMemo
} = React;
const {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} = Recharts;

// =========================
// ICONS — inline SVG (lucide-style, thin strokes for washi feel)
// =========================
const Icon = ({
  children,
  size = 16,
  strokeWidth = 1.75,
  className = ""
}) => /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: strokeWidth,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: className,
  style: {
    display: "inline-block",
    verticalAlign: "middle"
  }
}, children);
const Plus = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "5",
  x2: "12",
  y2: "19"
}), /*#__PURE__*/React.createElement("line", {
  x1: "5",
  y1: "12",
  x2: "19",
  y2: "12"
}));
const Minus = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("line", {
  x1: "5",
  y1: "12",
  x2: "19",
  y2: "12"
}));
const ChevronLeft = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("polyline", {
  points: "15 18 9 12 15 6"
}));
const ChevronUp = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("polyline", {
  points: "18 15 12 9 6 15"
}));
const ChevronDown = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("polyline", {
  points: "6 9 12 15 18 9"
}));
const X = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("line", {
  x1: "18",
  y1: "6",
  x2: "6",
  y2: "18"
}), /*#__PURE__*/React.createElement("line", {
  x1: "6",
  y1: "6",
  x2: "18",
  y2: "18"
}));
const Check = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("polyline", {
  points: "20 6 9 17 4 12"
}));
const Trash2 = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("polyline", {
  points: "3 6 5 6 21 6"
}), /*#__PURE__*/React.createElement("path", {
  d: "M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
}), /*#__PURE__*/React.createElement("path", {
  d: "M10 11v6"
}), /*#__PURE__*/React.createElement("path", {
  d: "M14 11v6"
}), /*#__PURE__*/React.createElement("path", {
  d: "M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2"
}));
const HistoryIcon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M3 3v5h5"
}), /*#__PURE__*/React.createElement("path", {
  d: "M3.05 13A9 9 0 106 5.3L3 8"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 7v5l4 2"
}));
const Home = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "9 22 9 12 15 12 15 22"
}));
const BookOpen = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"
}));
const Copy = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("rect", {
  x: "9",
  y: "9",
  width: "13",
  height: "13",
  rx: "2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
}));
const FileText = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "14 2 14 8 20 8"
}), /*#__PURE__*/React.createElement("line", {
  x1: "16",
  y1: "13",
  x2: "8",
  y2: "13"
}), /*#__PURE__*/React.createElement("line", {
  x1: "16",
  y1: "17",
  x2: "8",
  y2: "17"
}));
const TrendingUp = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("polyline", {
  points: "23 6 13.5 15.5 8.5 10.5 1 18"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "17 6 23 6 23 12"
}));

// =========================
// EXERCISE DATA — 六技 (Six Techniques)
// =========================
const EXERCISES = {
  pushup: {
    id: 'pushup',
    name: '腕立て',
    nameFull: 'プッシュアップ',
    nameEn: 'PUSHUP',
    target: '胸・三頭・前肩',
    steps: [{
      n: '壁立て伏せ',
      en: 'Wall Pushup',
      beg: '1×10',
      int: '2×25',
      adv: '3×50'
    }, {
      n: 'インクラインプッシュアップ',
      en: 'Incline Pushup',
      beg: '1×10',
      int: '2×20',
      adv: '3×40'
    }, {
      n: 'ニーリングプッシュアップ',
      en: 'Kneeling Pushup',
      beg: '1×10',
      int: '2×15',
      adv: '3×30'
    }, {
      n: 'ハーフプッシュアップ',
      en: 'Half Pushup',
      beg: '1×8',
      int: '2×12',
      adv: '3×25'
    }, {
      n: 'フルプッシュアップ',
      en: 'Full Pushup',
      beg: '1×5',
      int: '2×10',
      adv: '2×20'
    }, {
      n: 'クローズプッシュアップ',
      en: 'Close Pushup',
      beg: '1×5',
      int: '2×10',
      adv: '2×20'
    }, {
      n: 'アンイーブンプッシュアップ',
      en: 'Uneven Pushup',
      beg: '1×5',
      int: '2×10',
      adv: '2×20'
    }, {
      n: 'ハーフ片手腕立て',
      en: 'Half One-Arm Pushup',
      beg: '1×5',
      int: '2×10',
      adv: '2×20'
    }, {
      n: 'レバープッシュアップ',
      en: 'Lever Pushup',
      beg: '1×5',
      int: '2×10',
      adv: '2×20'
    }, {
      n: '片手腕立て伏せ',
      en: 'One-Arm Pushup',
      beg: '1×5',
      int: '2×8',
      adv: '1×100',
      master: true
    }]
  },
  squat: {
    id: 'squat',
    name: '屈立',
    nameFull: 'スクワット',
    nameEn: 'SQUAT',
    target: '大腿・臀部',
    steps: [{
      n: 'ショルダースタンドスクワット',
      en: 'Shoulderstand Squat',
      beg: '1×10',
      int: '2×25',
      adv: '3×50'
    }, {
      n: 'ジャックナイフスクワット',
      en: 'Jackknife Squat',
      beg: '1×10',
      int: '2×20',
      adv: '3×40'
    }, {
      n: 'サポーテッドスクワット',
      en: 'Supported Squat',
      beg: '1×10',
      int: '2×15',
      adv: '3×30'
    }, {
      n: 'ハーフスクワット',
      en: 'Half Squat',
      beg: '1×8',
      int: '2×35',
      adv: '2×50'
    }, {
      n: 'フルスクワット',
      en: 'Full Squat',
      beg: '1×5',
      int: '2×10',
      adv: '2×30'
    }, {
      n: 'クローズスクワット',
      en: 'Close Squat',
      beg: '1×5',
      int: '2×10',
      adv: '2×20'
    }, {
      n: 'アンイーブンスクワット',
      en: 'Uneven Squat',
      beg: '1×5',
      int: '2×10',
      adv: '2×20'
    }, {
      n: 'ハーフ片足スクワット',
      en: 'Half One-Leg Squat',
      beg: '1×5',
      int: '2×10',
      adv: '2×20'
    }, {
      n: 'アシスト片足スクワット',
      en: 'Assisted One-Leg Squat',
      beg: '1×5',
      int: '2×10',
      adv: '2×20'
    }, {
      n: '片足スクワット',
      en: 'One-Leg Squat',
      beg: '1×5',
      int: '2×10',
      adv: '2×50',
      master: true
    }]
  },
  pullup: {
    id: 'pullup',
    name: '懸垂',
    nameFull: 'プルアップ',
    nameEn: 'PULLUP',
    target: '背中・二頭',
    steps: [{
      n: 'バーティカルプル',
      en: 'Vertical Pull',
      beg: '1×10',
      int: '2×20',
      adv: '3×40'
    }, {
      n: 'ホリゾンタルプル',
      en: 'Horizontal Pull',
      beg: '1×10',
      int: '2×20',
      adv: '3×30'
    }, {
      n: 'ジャックナイフプルアップ',
      en: 'Jackknife Pullup',
      beg: '1×10',
      int: '2×15',
      adv: '3×20'
    }, {
      n: 'ハーフプルアップ',
      en: 'Half Pullup',
      beg: '1×8',
      int: '2×11',
      adv: '2×15'
    }, {
      n: 'フルプルアップ',
      en: 'Full Pullup',
      beg: '1×5',
      int: '2×8',
      adv: '2×10'
    }, {
      n: 'クローズプルアップ',
      en: 'Close Pullup',
      beg: '1×5',
      int: '2×8',
      adv: '2×10'
    }, {
      n: 'アンイーブンプルアップ',
      en: 'Uneven Pullup',
      beg: '1×5',
      int: '2×7',
      adv: '2×9'
    }, {
      n: 'ハーフ片手懸垂',
      en: 'Half One-Arm Pullup',
      beg: '1×4',
      int: '2×6',
      adv: '2×8'
    }, {
      n: 'アシスト片手懸垂',
      en: 'Assisted One-Arm Pullup',
      beg: '1×3',
      int: '2×5',
      adv: '2×7'
    }, {
      n: '片手懸垂',
      en: 'One-Arm Pullup',
      beg: '1×1',
      int: '2×3',
      adv: '1×6',
      master: true
    }]
  },
  legraise: {
    id: 'legraise',
    name: '挙脚',
    nameFull: 'レッグレイズ',
    nameEn: 'LEG RAISE',
    target: '腹直筋・腸腰筋',
    steps: [{
      n: 'ニータック',
      en: 'Knee Tuck',
      beg: '1×10',
      int: '2×25',
      adv: '3×40'
    }, {
      n: 'フラットニーレイズ',
      en: 'Flat Knee Raise',
      beg: '1×10',
      int: '2×20',
      adv: '3×35'
    }, {
      n: 'フラットベントレッグレイズ',
      en: 'Flat Bent Leg Raise',
      beg: '1×10',
      int: '2×15',
      adv: '3×30'
    }, {
      n: 'フロッグレイズ',
      en: 'Frog Raise',
      beg: '1×8',
      int: '2×15',
      adv: '3×25'
    }, {
      n: 'フラットストレートレッグレイズ',
      en: 'Flat Straight Leg Raise',
      beg: '1×5',
      int: '2×10',
      adv: '2×20'
    }, {
      n: 'ハンギングニーレイズ',
      en: 'Hanging Knee Raise',
      beg: '1×5',
      int: '2×10',
      adv: '2×15'
    }, {
      n: 'ハンギングベントレッグレイズ',
      en: 'Hanging Bent Leg Raise',
      beg: '1×5',
      int: '2×10',
      adv: '2×15'
    }, {
      n: 'ハンギングフロッグレイズ',
      en: 'Hanging Frog Raise',
      beg: '1×5',
      int: '2×10',
      adv: '2×15'
    }, {
      n: 'パーシャルストレートレッグレイズ',
      en: 'Partial Straight Leg Raise',
      beg: '1×5',
      int: '2×8',
      adv: '2×15'
    }, {
      n: 'ハンギングストレートレッグレイズ',
      en: 'Hanging Straight Leg Raise',
      beg: '1×5',
      int: '2×10',
      adv: '2×30',
      master: true
    }]
  },
  bridge: {
    id: 'bridge',
    name: '橋反',
    nameFull: 'ブリッジ',
    nameEn: 'BRIDGE',
    target: '脊柱・後鎖',
    steps: [{
      n: 'ショートブリッジ',
      en: 'Short Bridge',
      beg: '1×10',
      int: '2×25',
      adv: '3×50'
    }, {
      n: 'ストレートブリッジ',
      en: 'Straight Bridge',
      beg: '1×10',
      int: '2×20',
      adv: '3×40'
    }, {
      n: 'アングルドブリッジ',
      en: 'Angled Bridge',
      beg: '1×8',
      int: '2×20',
      adv: '3×30'
    }, {
      n: 'ヘッドブリッジ',
      en: 'Head Bridge',
      beg: '1×8',
      int: '2×15',
      adv: '2×25'
    }, {
      n: 'ハーフブリッジ',
      en: 'Half Bridge',
      beg: '1×8',
      int: '2×15',
      adv: '2×20'
    }, {
      n: 'フルブリッジ',
      en: 'Full Bridge',
      beg: '1×6',
      int: '2×10',
      adv: '2×15'
    }, {
      n: 'ウォールウォーキングブリッジ(下)',
      en: 'Wall Walking Bridge Down',
      beg: '1×3',
      int: '2×6',
      adv: '2×10'
    }, {
      n: 'ウォールウォーキングブリッジ(上)',
      en: 'Wall Walking Bridge Up',
      beg: '1×2',
      int: '2×4',
      adv: '2×8'
    }, {
      n: 'クロージングブリッジ',
      en: 'Closing Bridge',
      beg: '1×1',
      int: '2×3',
      adv: '2×6'
    }, {
      n: 'スタンドトゥスタンドブリッジ',
      en: 'Stand-to-Stand Bridge',
      beg: '1×1',
      int: '2×3',
      adv: '2×30',
      master: true
    }]
  },
  hspu: {
    id: 'hspu',
    name: '倒立',
    nameFull: '逆立ち腕立て',
    nameEn: 'HANDSTAND PUSHUP',
    target: '肩・三頭',
    steps: [{
      n: 'ウォールヘッドスタンド',
      en: 'Wall Headstand',
      beg: '30秒',
      int: '1分',
      adv: '2分'
    }, {
      n: 'クロウスタンド',
      en: 'Crow Stand',
      beg: '10秒',
      int: '30秒',
      adv: '1分'
    }, {
      n: 'ウォールハンドスタンド',
      en: 'Wall Handstand',
      beg: '30秒',
      int: '1分',
      adv: '2分'
    }, {
      n: 'ハーフ逆立ち腕立て',
      en: 'Half HSPU',
      beg: '1×5',
      int: '2×10',
      adv: '2×20'
    }, {
      n: '逆立ち腕立て',
      en: 'Handstand Pushup',
      beg: '1×5',
      int: '2×8',
      adv: '2×12'
    }, {
      n: 'クローズ逆立ち腕立て',
      en: 'Close HSPU',
      beg: '1×5',
      int: '2×8',
      adv: '2×10'
    }, {
      n: 'アンイーブン逆立ち腕立て',
      en: 'Uneven HSPU',
      beg: '1×5',
      int: '2×7',
      adv: '2×9'
    }, {
      n: 'ハーフ片手逆立ち腕立て',
      en: 'Half One-Arm HSPU',
      beg: '1×4',
      int: '2×6',
      adv: '2×8'
    }, {
      n: 'レバー逆立ち腕立て',
      en: 'Lever HSPU',
      beg: '1×3',
      int: '2×4',
      adv: '2×6'
    }, {
      n: '片手逆立ち腕立て',
      en: 'One-Arm HSPU',
      beg: '1×1',
      int: '2×2',
      adv: '1×5',
      master: true
    }]
  }
};
const EX_LIST = Object.values(EXERCISES);
const STORAGE_KEY = 'tancho-state-v1';

// Kanji numerals for step display
const KANJI_NUM = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const kanjiNum = n => KANJI_NUM[n] || String(n);

// =========================
// HELPERS
// =========================
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const formatDate = s => {
  const [y, m, d] = s.split('-');
  return `${y}年${parseInt(m)}月${parseInt(d)}日`;
};
const formatDateShort = s => {
  const [, m, d] = s.split('-');
  return `${parseInt(m)}/${parseInt(d)}`;
};
const dateLabel = s => {
  if (s === todayStr()) return '本日';
  const today = new Date(todayStr());
  const target = new Date(s);
  const diff = Math.round((today - target) / 86400000);
  if (diff === 1) return '昨日';
  if (diff < 7) return `${diff}日前`;
  return formatDate(s);
};
const initialState = {
  currentSteps: {
    pushup: 1,
    squat: 1,
    pullup: 1,
    legraise: 1,
    bridge: 1,
    hspu: 1
  },
  workouts: []
};
const generateMarkdown = (date, workouts) => {
  if (workouts.length === 0) return '';
  const lines = [`## 鍛帳 — ${formatDate(date)}`, ''];
  const ordered = [...workouts].reverse();
  ordered.forEach(w => {
    const ex = EXERCISES[w.exerciseId];
    const stepData = ex.steps[w.step - 1];
    const total = w.sets.reduce((a, b) => a + b, 0);
    const isTime = stepData.beg.includes('秒') || stepData.beg.includes('分');
    const unit = isTime ? '秒' : '回';
    lines.push(`### ${ex.nameFull} ・ 第${kanjiNum(w.step)}段${stepData.master ? ' 極' : ''}`);
    lines.push(`**${stepData.n}** _(${stepData.en})_`);
    lines.push(`- 稽古: ${w.sets.join(' / ')} → 計 ${total} ${unit}`);
    lines.push(`- 皆伝: ${stepData.adv}`);
    if (w.note) lines.push(`- 覚書: ${w.note}`);
    lines.push('');
  });
  return lines.join('\n').trim();
};

// =========================
// SEAL COMPONENT — the red hanko stamp
// =========================
const Seal = ({
  children,
  size = 40,
  className = ""
}) => /*#__PURE__*/React.createElement("div", {
  className: `inline-flex items-center justify-center font-mincho ${className}`,
  style: {
    width: size,
    height: size,
    backgroundColor: '#B0322B',
    color: '#F0E6D2',
    fontWeight: 700,
    fontSize: size * 0.5,
    lineHeight: 1,
    letterSpacing: 0,
    borderRadius: 2,
    boxShadow: 'inset 0 0 0 1px rgba(240,230,210,0.15)',
    transform: 'rotate(-2deg)',
    textShadow: '0 0 1px rgba(0,0,0,0.2)'
  }
}, children);

// =========================
// MAIN APP
// =========================
function App() {
  const [tab, setTab] = useState('home');
  const [data, setData] = useState(initialState);
  const [loaded, setLoaded] = useState(false);
  const [detailEx, setDetailEx] = useState(null);
  const [logTarget, setLogTarget] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [exportDate, setExportDate] = useState(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
    } catch (e) {
      console.warn('load failed', e);
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('save failed', e);
    }
  }, [data, loaded]);
  const setStep = (exId, step) => {
    const s = Math.max(1, Math.min(10, step));
    setData(d => ({
      ...d,
      currentSteps: {
        ...d.currentSteps,
        [exId]: s
      }
    }));
  };
  const addWorkout = w => {
    setData(d => ({
      ...d,
      workouts: [{
        ...w,
        id: Date.now()
      }, ...d.workouts]
    }));
  };
  const deleteWorkout = id => {
    setData(d => ({
      ...d,
      workouts: d.workouts.filter(w => w.id !== id)
    }));
  };
  const lastWorkoutFor = exId => data.workouts.find(w => w.exerciseId === exId);
  if (!loaded) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen washi-bg flex items-center justify-center",
      style: {
        color: '#7A6E5C'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-mincho tracking-widest text-sm"
    }, "開帳中..."));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen washi-bg",
    style: {
      color: '#1F1B15',
      paddingBottom: '5.5rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "washi-fibers min-h-screen"
  }, /*#__PURE__*/React.createElement("header", {
    className: "px-5 pt-8 pb-4 border-b-2 border-double",
    style: {
      borderColor: '#2B2621',
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2rem)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-3"
  }, /*#__PURE__*/React.createElement(Seal, {
    size: 44
  }, "鍛"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "font-brush leading-none",
    style: {
      fontSize: '2.5rem',
      color: '#1F1B15'
    }
  }, "鍛帳"), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] mt-0.5 tracking-[0.4em]",
    style: {
      color: '#7A6E5C'
    }
  }, "TAN・CHŌ"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAboutOpen(true),
    className: "p-2",
    style: {
      color: '#7A6E5C'
    },
    "aria-label": "解説"
  }, /*#__PURE__*/React.createElement(BookOpen, {
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-xs mt-3 flex items-center gap-2",
    style: {
      color: '#7A6E5C'
    }
  }, /*#__PURE__*/React.createElement("span", null, formatDate(todayStr())), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#C4B896'
    }
  }, "·"), /*#__PURE__*/React.createElement("span", null, "稽古 ", data.workouts.length, " 度"))), /*#__PURE__*/React.createElement("main", {
    className: "relative"
  }, tab === 'home' && /*#__PURE__*/React.createElement(HomeView, {
    currentSteps: data.currentSteps,
    lastWorkoutFor: lastWorkoutFor,
    onSelectExercise: setDetailEx,
    onLog: exId => setLogTarget(exId)
  }), tab === 'log' && /*#__PURE__*/React.createElement(LogView, {
    currentSteps: data.currentSteps,
    onLog: exId => setLogTarget(exId)
  }), tab === 'history' && /*#__PURE__*/React.createElement(HistoryView, {
    workouts: data.workouts,
    onDelete: deleteWorkout,
    onExport: date => setExportDate(date)
  })), /*#__PURE__*/React.createElement("nav", {
    className: "fixed bottom-0 left-0 right-0 z-30 border-t-2 border-double",
    style: {
      backgroundColor: '#EFE5CB',
      borderColor: '#2B2621',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3"
  }, [{
    id: 'home',
    label: '表紙',
    icon: Home
  }, {
    id: 'log',
    label: '稽古',
    icon: Plus
  }, {
    id: 'history',
    label: '帳面',
    icon: HistoryIcon
  }].map(({
    id,
    label,
    icon: Ico
  }, i) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => setTab(id),
    className: `py-3 flex flex-col items-center gap-1 relative ${i > 0 ? 'border-l' : ''}`,
    style: {
      color: tab === id ? '#B0322B' : '#7A6E5C',
      borderColor: '#C4B896'
    }
  }, /*#__PURE__*/React.createElement(Ico, {
    size: 20,
    strokeWidth: tab === id ? 2.25 : 1.5
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mincho text-[11px] tracking-[0.3em]",
    style: {
      fontWeight: tab === id ? 700 : 400
    }
  }, label), tab === id && /*#__PURE__*/React.createElement("div", {
    className: "absolute top-0 left-1/2 h-0.5 w-8",
    style: {
      backgroundColor: '#B0322B',
      transform: 'translateX(-50%)'
    }
  }))))), detailEx && /*#__PURE__*/React.createElement(ExerciseDetail, {
    exercise: EXERCISES[detailEx],
    currentStep: data.currentSteps[detailEx],
    workouts: data.workouts.filter(w => w.exerciseId === detailEx),
    onClose: () => setDetailEx(null),
    onSetStep: s => setStep(detailEx, s),
    onLog: () => {
      setLogTarget(detailEx);
      setDetailEx(null);
    }
  }), logTarget && /*#__PURE__*/React.createElement(LogSheet, {
    exercise: EXERCISES[logTarget],
    currentStep: data.currentSteps[logTarget],
    onClose: () => setLogTarget(null),
    onSave: w => {
      addWorkout(w);
      setLogTarget(null);
    }
  }), aboutOpen && /*#__PURE__*/React.createElement(AboutModal, {
    onClose: () => setAboutOpen(false)
  }), exportDate && /*#__PURE__*/React.createElement(ExportModal, {
    date: exportDate,
    workouts: data.workouts.filter(w => w.date === exportDate),
    onClose: () => setExportDate(null)
  })));
}

// =========================
// SECTION HEADER — reusable washi-style heading
// =========================
const SectionHeader = ({
  kanji,
  ruby,
  right
}) => /*#__PURE__*/React.createElement("div", {
  className: "mb-4 flex items-end justify-between"
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "font-mincho text-[10px] tracking-[0.4em] mb-1",
  style: {
    color: '#7A6E5C'
  }
}, ruby), /*#__PURE__*/React.createElement("h2", {
  className: "font-mincho font-bold text-2xl leading-none",
  style: {
    color: '#1F1B15'
  }
}, kanji)), right);

// =========================
// HOME VIEW — 表紙
// =========================
function HomeView({
  currentSteps,
  lastWorkoutFor,
  onSelectExercise,
  onLog
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "px-5 pt-6 pb-4"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    kanji: "六技",
    ruby: "ROKU-GI · SIX TECHNIQUES"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, EX_LIST.map(ex => {
    const step = currentSteps[ex.id];
    const stepData = ex.steps[step - 1];
    const last = lastWorkoutFor(ex.id);
    return /*#__PURE__*/React.createElement("button", {
      key: ex.id,
      onClick: () => onSelectExercise(ex.id),
      className: "text-left relative overflow-hidden card-washi p-4"
    }, /*#__PURE__*/React.createElement(CornerBrackets, null), /*#__PURE__*/React.createElement("div", {
      className: "absolute top-1 right-1 font-mincho text-[10px] px-1.5 py-0.5 tracking-widest",
      style: {
        color: '#7A6E5C'
      }
    }, String(step).padStart(2, '0'), "/十"), /*#__PURE__*/React.createElement("div", {
      className: "font-mincho text-[10px] tracking-[0.3em] mb-1",
      style: {
        color: '#7A6E5C'
      }
    }, ex.nameEn), /*#__PURE__*/React.createElement("div", {
      className: "font-mincho font-bold text-2xl leading-tight",
      style: {
        color: '#1F1B15'
      }
    }, ex.name), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] mt-0.5 mb-3",
      style: {
        color: '#7A6E5C'
      }
    }, ex.nameFull), /*#__PURE__*/React.createElement("div", {
      className: "flex items-baseline gap-1 mb-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-brush leading-none",
      style: {
        fontSize: '3.5rem',
        color: '#B0322B'
      }
    }, kanjiNum(step)), /*#__PURE__*/React.createElement("div", {
      className: "font-mincho text-lg",
      style: {
        color: '#B0322B'
      }
    }, "段")), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] leading-snug min-h-[2.5em] mb-3",
      style: {
        color: '#4A4239'
      }
    }, stepData.n, stepData.master && /*#__PURE__*/React.createElement("span", {
      className: "ml-1",
      style: {
        color: '#B0322B'
      }
    }, "極")), /*#__PURE__*/React.createElement("div", {
      className: "font-mincho text-[10px] pt-2 border-t",
      style: {
        color: '#7A6E5C',
        borderColor: '#C4B896'
      }
    }, last ? /*#__PURE__*/React.createElement("span", null, "前回 · ", dateLabel(last.date)) : /*#__PURE__*/React.createElement("span", null, "未稽古")), /*#__PURE__*/React.createElement("div", {
      onClick: e => {
        e.stopPropagation();
        onLog(ex.id);
      },
      className: "absolute bottom-2 right-2 w-7 h-7 flex items-center justify-center",
      style: {
        backgroundColor: '#B0322B',
        color: '#F0E6D2',
        boxShadow: '0 1px 2px rgba(31,27,21,0.2)'
      }
    }, /*#__PURE__*/React.createElement(Plus, {
      size: 14,
      strokeWidth: 2.25
    })));
  })));
}
const CornerBrackets = () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
  className: "absolute top-0 left-0 w-2 h-2 border-t border-l",
  style: {
    borderColor: '#2B2621'
  }
}), /*#__PURE__*/React.createElement("span", {
  className: "absolute top-0 right-0 w-2 h-2 border-t border-r",
  style: {
    borderColor: '#2B2621'
  }
}), /*#__PURE__*/React.createElement("span", {
  className: "absolute bottom-0 left-0 w-2 h-2 border-b border-l",
  style: {
    borderColor: '#2B2621'
  }
}), /*#__PURE__*/React.createElement("span", {
  className: "absolute bottom-0 right-0 w-2 h-2 border-b border-r",
  style: {
    borderColor: '#2B2621'
  }
}));

// =========================
// LOG VIEW — 稽古
// =========================
function LogView({
  currentSteps,
  onLog
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "px-5 pt-6 pb-4"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    kanji: "本日の稽古",
    ruby: "KEIKO · SESSION"
  }), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, EX_LIST.map(ex => {
    const step = currentSteps[ex.id];
    const stepData = ex.steps[step - 1];
    return /*#__PURE__*/React.createElement("button", {
      key: ex.id,
      onClick: () => onLog(ex.id),
      className: "w-full card-washi p-4 flex items-center gap-4 relative"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-brush leading-none w-12 text-center",
      style: {
        fontSize: '2.5rem',
        color: '#B0322B'
      }
    }, kanjiNum(step)), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 text-left"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-mincho font-bold text-lg",
      style: {
        color: '#1F1B15'
      }
    }, ex.name), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px]",
      style: {
        color: '#4A4239'
      }
    }, stepData.n), /*#__PURE__*/React.createElement("div", {
      className: "font-mincho text-[10px] mt-1",
      style: {
        color: '#7A6E5C'
      }
    }, "皆伝 ", stepData.adv)), /*#__PURE__*/React.createElement(Plus, {
      size: 18,
      strokeWidth: 2.25,
      style: {
        color: '#B0322B'
      }
    }));
  })));
}

// =========================
// HISTORY VIEW — 帳面
// =========================
function HistoryView({
  workouts,
  onDelete,
  onExport
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickedDate, setPickedDate] = useState(todayStr());
  const grouped = useMemo(() => {
    const g = {};
    workouts.forEach(w => {
      if (!g[w.date]) g[w.date] = [];
      g[w.date].push(w);
    });
    return Object.entries(g).sort((a, b) => a[0] < b[0] ? 1 : -1);
  }, [workouts]);
  const availableDates = useMemo(() => {
    return [...new Set(workouts.map(w => w.date))].sort((a, b) => a < b ? 1 : -1);
  }, [workouts]);
  const handlePickedExport = () => {
    if (workouts.some(w => w.date === pickedDate)) {
      onExport(pickedDate);
      setPickerOpen(false);
    }
  };
  if (workouts.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "px-5 pt-12 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-mincho text-[10px] tracking-[0.4em] mb-4",
      style: {
        color: '#7A6E5C'
      }
    }, "未記録"), /*#__PURE__*/React.createElement("div", {
      className: "font-mincho text-sm",
      style: {
        color: '#4A4239'
      }
    }, "まだ稽古の記録がありません"), /*#__PURE__*/React.createElement("div", {
      className: "text-xs mt-2",
      style: {
        color: '#7A6E5C'
      }
    }, "最初の一段を刻みましょう"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "px-5 pt-6 pb-4"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    kanji: "帳面",
    ruby: "CHŌMEN · LEDGER",
    right: /*#__PURE__*/React.createElement("button", {
      onClick: () => setPickerOpen(true),
      className: "font-mincho text-[10px] tracking-[0.25em] px-3 py-1.5 border flex items-center gap-1.5",
      style: {
        color: '#B0322B',
        borderColor: '#B0322B'
      }
    }, /*#__PURE__*/React.createElement(FileText, {
      size: 12
    }), "写し")
  }), /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, grouped.map(([date, items]) => /*#__PURE__*/React.createElement("div", {
    key: date
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-3 mb-2 pb-1 border-b",
    style: {
      borderColor: '#2B2621'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mincho font-bold text-lg",
    style: {
      color: '#1F1B15'
    }
  }, dateLabel(date)), /*#__PURE__*/React.createElement("span", {
    className: "font-mincho text-[10px]",
    style: {
      color: '#7A6E5C'
    }
  }, formatDate(date)), /*#__PURE__*/React.createElement("span", {
    className: "flex-1"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => onExport(date),
    className: "font-mincho text-[10px] tracking-widest flex items-center gap-1",
    style: {
      color: '#B0322B'
    },
    title: "この日を写す"
  }, /*#__PURE__*/React.createElement(Copy, {
    size: 11
  }), "写")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, items.map(w => {
    const ex = EXERCISES[w.exerciseId];
    const stepData = ex.steps[w.step - 1];
    const total = w.sets.reduce((s, r) => s + r, 0);
    const isTime = stepData.beg.includes('秒') || stepData.beg.includes('分');
    return /*#__PURE__*/React.createElement("div", {
      key: w.id,
      className: "card-washi p-3 flex gap-3 relative"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-brush leading-none w-10 text-center pt-0.5",
      style: {
        fontSize: '1.75rem',
        color: '#B0322B'
      }
    }, kanjiNum(w.step)), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-baseline gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-mincho font-bold text-base",
      style: {
        color: '#1F1B15'
      }
    }, ex.name), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] truncate",
      style: {
        color: '#7A6E5C'
      }
    }, stepData.n)), /*#__PURE__*/React.createElement("div", {
      className: "font-mincho text-xs mt-1",
      style: {
        color: '#1F1B15'
      }
    }, w.sets.map((r, i) => /*#__PURE__*/React.createElement("span", {
      key: i
    }, i > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#C4B896'
      }
    }, " · "), r)), /*#__PURE__*/React.createElement("span", {
      className: "ml-2",
      style: {
        color: '#7A6E5C'
      }
    }, "計 ", total, isTime ? '秒' : '回')), w.note && /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] mt-1 italic",
      style: {
        color: '#4A4239'
      }
    }, "「", w.note, "」")), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (confirm('この記録を削除しますか?')) onDelete(w.id);
      },
      className: "p-1",
      style: {
        color: '#B29A76'
      }
    }, /*#__PURE__*/React.createElement(Trash2, {
      size: 14
    })));
  }))))), pickerOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 backdrop-blur flex items-center justify-center p-4",
    style: {
      backgroundColor: 'rgba(31,27,21,0.6)'
    },
    onClick: () => setPickerOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "washi-bg washi-fibers border-2 max-w-sm w-full",
    style: {
      borderColor: '#B0322B'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-4 border-b flex items-center justify-between",
    style: {
      borderColor: '#C4B896'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] tracking-[0.3em]",
    style: {
      color: '#7A6E5C'
    }
  }, "EXPORT"), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho font-bold text-xl",
    style: {
      color: '#1F1B15'
    }
  }, "日付を指定")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPickerOpen(false),
    style: {
      color: '#7A6E5C'
    }
  }, /*#__PURE__*/React.createElement(X, {
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-5 space-y-4"
  }, /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: pickedDate,
    onChange: e => setPickedDate(e.target.value),
    max: todayStr(),
    className: "w-full font-mincho text-sm px-3 py-2 border input-washi"
  }), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] tracking-widest",
    style: {
      color: '#7A6E5C'
    }
  }, workouts.some(w => w.date === pickedDate) ? `${workouts.filter(w => w.date === pickedDate).length} 件の記録` : 'この日の記録はありません'), availableDates.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] tracking-[0.3em] mb-1.5",
    style: {
      color: '#7A6E5C'
    }
  }, "記録済みの日"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1.5 max-h-32 overflow-y-auto"
  }, availableDates.map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    onClick: () => setPickedDate(d),
    className: "font-mincho text-[10px] px-2 py-1 border",
    style: d === pickedDate ? {
      color: '#F0E6D2',
      backgroundColor: '#B0322B',
      borderColor: '#B0322B'
    } : {
      color: '#4A4239',
      borderColor: '#C4B896'
    }
  }, formatDateShort(d))))), /*#__PURE__*/React.createElement("button", {
    onClick: handlePickedExport,
    disabled: !workouts.some(w => w.date === pickedDate),
    className: "w-full py-3 font-mincho font-bold text-lg tracking-widest",
    style: workouts.some(w => w.date === pickedDate) ? {
      backgroundColor: '#B0322B',
      color: '#F0E6D2'
    } : {
      backgroundColor: '#D5C9AC',
      color: '#7A6E5C',
      cursor: 'not-allowed'
    }
  }, /*#__PURE__*/React.createElement(FileText, {
    size: 16,
    className: "inline mr-1",
    strokeWidth: 2.25
  }), "写しを取る")))));
}

// =========================
// EXERCISE DETAIL — 段位詳細
// =========================
function ExerciseDetail({
  exercise,
  currentStep,
  workouts,
  onClose,
  onSetStep,
  onLog
}) {
  const stepData = exercise.steps[currentStep - 1];
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-40 washi-bg overflow-y-auto",
    style: {
      paddingBottom: '5.5rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "washi-fibers min-h-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-5 pt-6 pb-4 border-b-2 border-double sticky top-0 washi-bg washi-fibers z-10 flex items-center justify-between",
    style: {
      borderColor: '#2B2621',
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1.5rem)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "flex items-center gap-1 -ml-1",
    style: {
      color: '#4A4239'
    }
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-mincho text-xs tracking-widest"
  }, "戻る")), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] tracking-[0.3em]",
    style: {
      color: '#7A6E5C'
    }
  }, exercise.nameEn), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho font-bold text-xl",
    style: {
      color: '#1F1B15'
    }
  }, exercise.name))), /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-6 border-b",
    style: {
      borderColor: '#C4B896'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-4 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-brush leading-none",
    style: {
      fontSize: '5.5rem',
      color: '#B0322B'
    }
  }, kanjiNum(currentStep)), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho font-bold text-lg -mt-2",
    style: {
      color: '#B0322B'
    }
  }, "段")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 pt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] tracking-[0.3em]",
    style: {
      color: '#7A6E5C'
    }
  }, "現段 · CURRENT"), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho font-bold text-xl leading-tight mt-1",
    style: {
      color: '#1F1B15'
    }
  }, stepData.n, stepData.master && /*#__PURE__*/React.createElement("span", {
    className: "ml-2 font-brush text-2xl",
    style: {
      color: '#B0322B'
    }
  }, "極")), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] mt-0.5",
    style: {
      color: '#7A6E5C'
    }
  }, stepData.en))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2 mt-4"
  }, /*#__PURE__*/React.createElement(StandardCard, {
    label: "初伝",
    en: "SHODEN",
    value: stepData.beg
  }), /*#__PURE__*/React.createElement(StandardCard, {
    label: "中伝",
    en: "CHŪDEN",
    value: stepData.int
  }), /*#__PURE__*/React.createElement(StandardCard, {
    label: "皆伝",
    en: "KAIDEN",
    value: stepData.adv,
    highlight: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mt-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onLog,
    className: "flex-1 py-3 font-mincho font-bold text-lg tracking-widest",
    style: {
      backgroundColor: '#B0322B',
      color: '#F0E6D2'
    }
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 16,
    className: "inline mr-1",
    strokeWidth: 2.5
  }), "稽古を記す"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onSetStep(currentStep - 1),
    disabled: currentStep <= 1,
    className: "px-3 border disabled:opacity-30 disabled:cursor-not-allowed",
    style: {
      borderColor: '#4A4239',
      color: '#4A4239'
    },
    "aria-label": "段を戻す"
  }, /*#__PURE__*/React.createElement(ChevronDown, {
    size: 18
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => onSetStep(currentStep + 1),
    disabled: currentStep >= 10,
    className: "px-3 border disabled:opacity-30 disabled:cursor-not-allowed",
    style: {
      borderColor: '#4A4239',
      color: '#4A4239'
    },
    "aria-label": "段を進める"
  }, /*#__PURE__*/React.createElement(ChevronUp, {
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] mt-2 text-center tracking-widest",
    style: {
      color: '#7A6E5C'
    }
  }, "皆伝に至れば ↑ で次段へ")), workouts.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-6 border-b",
    style: {
      borderColor: '#C4B896'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-3"
  }, /*#__PURE__*/React.createElement(TrendingUp, {
    size: 12,
    style: {
      color: '#B0322B'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] tracking-[0.3em]",
    style: {
      color: '#7A6E5C'
    }
  }, "推移 · PROGRESS")), /*#__PURE__*/React.createElement(ProgressChart, {
    workouts: workouts,
    exercise: exercise,
    currentStep: currentStep
  })), /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] tracking-[0.3em] mb-3",
    style: {
      color: '#7A6E5C'
    }
  }, "十段の型 · TEN STEPS"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1"
  }, exercise.steps.map((s, i) => {
    const num = i + 1;
    const isCurrent = num === currentStep;
    const isPast = num < currentStep;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => onSetStep(num),
      className: `w-full text-left flex items-center gap-3 p-3 border`,
      style: isCurrent ? {
        borderColor: '#B0322B',
        backgroundColor: '#EBDFC0',
        borderWidth: 2
      } : {
        borderColor: '#C4B896',
        backgroundColor: 'rgba(240,230,210,0.4)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-brush leading-none w-9 text-center",
      style: {
        fontSize: '1.75rem',
        color: isCurrent ? '#B0322B' : isPast ? '#4A4239' : '#B29A76'
      }
    }, kanjiNum(num)), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-mincho text-sm leading-tight",
      style: {
        color: isCurrent ? '#1F1B15' : isPast ? '#4A4239' : '#7A6E5C',
        fontWeight: isCurrent ? 700 : 500
      }
    }, s.n, s.master && /*#__PURE__*/React.createElement("span", {
      className: "ml-1",
      style: {
        color: '#B0322B'
      }
    }, "極")), /*#__PURE__*/React.createElement("div", {
      className: "font-mincho text-[10px] mt-0.5",
      style: {
        color: '#7A6E5C'
      }
    }, s.beg, " · ", s.int, " · ", s.adv)), isPast && /*#__PURE__*/React.createElement(Check, {
      size: 14,
      style: {
        color: '#7A6E5C'
      }
    }));
  }))), workouts.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "px-5 pb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] tracking-[0.3em] mb-3",
    style: {
      color: '#7A6E5C'
    }
  }, "近日の稽古"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, workouts.slice(0, 5).map(w => {
    const total = w.sets.reduce((s, r) => s + r, 0);
    return /*#__PURE__*/React.createElement("div", {
      key: w.id,
      className: "card-washi p-3 flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "font-mincho text-[10px] w-16",
      style: {
        color: '#7A6E5C'
      }
    }, dateLabel(w.date)), /*#__PURE__*/React.createElement("div", {
      className: "font-brush w-8",
      style: {
        fontSize: '1.5rem',
        color: '#B0322B',
        lineHeight: 1
      }
    }, kanjiNum(w.step)), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 font-mincho text-xs",
      style: {
        color: '#1F1B15'
      }
    }, w.sets.join(' · '), /*#__PURE__*/React.createElement("span", {
      className: "ml-2",
      style: {
        color: '#7A6E5C'
      }
    }, "計", total)));
  })))));
}
function StandardCard({
  label,
  en,
  value,
  highlight
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "p-2 border relative",
    style: highlight ? {
      borderColor: '#B0322B',
      backgroundColor: '#EBDFC0',
      borderWidth: 2
    } : {
      borderColor: '#C4B896',
      backgroundColor: 'rgba(240,230,210,0.4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[9px] tracking-[0.2em] mb-1",
    style: {
      color: highlight ? '#B0322B' : '#7A6E5C'
    }
  }, en), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho font-bold text-base leading-none",
    style: {
      color: highlight ? '#1F1B15' : '#4A4239'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-sm mt-1",
    style: {
      color: highlight ? '#1F1B15' : '#4A4239'
    }
  }, value));
}

// =========================
// LOG SHEET — 稽古を記す
// =========================
function LogSheet({
  exercise,
  currentStep,
  onClose,
  onSave
}) {
  const stepData = exercise.steps[currentStep - 1];
  const [date, setDate] = useState(todayStr());
  const [sets, setSets] = useState(['', '', '']);
  const [note, setNote] = useState('');
  const updateSet = (i, val) => {
    const v = val.replace(/[^0-9]/g, '');
    setSets(arr => arr.map((s, idx) => idx === i ? v : s));
  };
  const addSet = () => setSets(arr => [...arr, '']);
  const removeSet = i => setSets(arr => arr.filter((_, idx) => idx !== i));
  const canSave = sets.some(s => s !== '' && parseInt(s) > 0);
  const isTime = stepData.beg.includes('秒') || stepData.beg.includes('分');
  const handleSave = () => {
    const validSets = sets.map(s => parseInt(s)).filter(n => !isNaN(n) && n > 0);
    if (validSets.length === 0) return;
    onSave({
      date,
      exerciseId: exercise.id,
      step: currentStep,
      sets: validSets,
      note: note.trim()
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 backdrop-blur flex items-end sm:items-center justify-center",
    style: {
      backgroundColor: 'rgba(31,27,21,0.5)'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "washi-bg washi-fibers border-t-2 sm:border-2 w-full sm:max-w-md sm:m-4 max-h-[90vh] overflow-y-auto",
    style: {
      borderColor: '#B0322B'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-4 border-b flex items-center justify-between",
    style: {
      borderColor: '#C4B896'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] tracking-[0.3em]",
    style: {
      color: '#7A6E5C'
    }
  }, "RECORD"), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho font-bold text-xl",
    style: {
      color: '#1F1B15'
    }
  }, "稽古を記す")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      color: '#7A6E5C'
    }
  }, /*#__PURE__*/React.createElement(X, {
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-5 space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-washi p-3 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-brush leading-none w-10 text-center",
    style: {
      fontSize: '2rem',
      color: '#B0322B'
    }
  }, kanjiNum(currentStep)), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho font-bold text-base",
    style: {
      color: '#1F1B15'
    }
  }, exercise.name, " · ", exercise.nameFull), /*#__PURE__*/React.createElement("div", {
    className: "text-xs",
    style: {
      color: '#4A4239'
    }
  }, stepData.n), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] mt-0.5",
    style: {
      color: '#7A6E5C'
    }
  }, "皆伝目標 ", stepData.adv))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "font-mincho text-[10px] tracking-[0.3em] block mb-1.5",
    style: {
      color: '#7A6E5C'
    }
  }, "日付"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: date,
    onChange: e => setDate(e.target.value),
    max: todayStr(),
    className: "w-full font-mincho text-sm px-3 py-2 border input-washi"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-1.5"
  }, /*#__PURE__*/React.createElement("label", {
    className: "font-mincho text-[10px] tracking-[0.3em]",
    style: {
      color: '#7A6E5C'
    }
  }, "稽古 · SETS × REPS"), /*#__PURE__*/React.createElement("button", {
    onClick: addSet,
    className: "font-mincho text-[10px] tracking-widest flex items-center gap-1",
    style: {
      color: '#B0322B'
    }
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 12,
    strokeWidth: 2.5
  }), " 一組追加")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, sets.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-xs w-16",
    style: {
      color: '#7A6E5C'
    }
  }, "第", kanjiNum(i + 1), "組"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    inputMode: "numeric",
    value: s,
    onChange: e => updateSet(i, e.target.value),
    placeholder: isTime ? '秒' : '回',
    className: "flex-1 font-mincho px-3 py-2 border input-washi"
  }), sets.length > 1 && /*#__PURE__*/React.createElement("button", {
    onClick: () => removeSet(i),
    className: "p-1",
    style: {
      color: '#B29A76'
    }
  }, /*#__PURE__*/React.createElement(Minus, {
    size: 14
  })))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "font-mincho text-[10px] tracking-[0.3em] block mb-1.5",
    style: {
      color: '#7A6E5C'
    }
  }, "覚書(任意)"), /*#__PURE__*/React.createElement("textarea", {
    value: note,
    onChange: e => setNote(e.target.value),
    rows: 2,
    placeholder: "型・呼吸・調子など",
    className: "w-full px-3 py-2 border text-sm resize-none input-washi"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: handleSave,
    disabled: !canSave,
    className: "w-full py-3 font-mincho font-bold text-lg tracking-widest",
    style: canSave ? {
      backgroundColor: '#B0322B',
      color: '#F0E6D2'
    } : {
      backgroundColor: '#D5C9AC',
      color: '#7A6E5C',
      cursor: 'not-allowed'
    }
  }, /*#__PURE__*/React.createElement(Check, {
    size: 16,
    className: "inline mr-1",
    strokeWidth: 2.5
  }), "記帳"))));
}

// =========================
// ABOUT MODAL — 序
// =========================
function AboutModal({
  onClose
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 backdrop-blur flex items-center justify-center p-4",
    style: {
      backgroundColor: 'rgba(31,27,21,0.6)'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "washi-bg washi-fibers border-2 max-w-md w-full max-h-[85vh] overflow-y-auto",
    style: {
      borderColor: '#B0322B'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-4 border-b flex items-center justify-between",
    style: {
      borderColor: '#C4B896'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-3"
  }, /*#__PURE__*/React.createElement(Seal, {
    size: 32
  }, "序"), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho font-bold text-xl",
    style: {
      color: '#1F1B15'
    }
  }, "鍛帳について")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      color: '#7A6E5C'
    }
  }, /*#__PURE__*/React.createElement(X, {
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-5 space-y-4 text-sm leading-relaxed",
    style: {
      color: '#1F1B15'
    }
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("span", {
    className: "font-brush",
    style: {
      fontSize: '1.5em',
      color: '#B0322B'
    }
  }, "鍛帳"), "は、ポール・ウェイド著『Convict Conditioning』の自重鍛錬体系を、和の帳面の形式で記録するための道具です。 六技それぞれを", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#B0322B',
      fontWeight: 700
    }
  }, "十段"), "に分けて、少しずつ強度を上げていきます。"), /*#__PURE__*/React.createElement("div", {
    className: "border-l-2 pl-3",
    style: {
      borderColor: '#B0322B'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] tracking-[0.3em] mb-1",
    style: {
      color: '#7A6E5C'
    }
  }, "手引き · USAGE"), /*#__PURE__*/React.createElement("ol", {
    className: "space-y-1.5 list-decimal list-inside font-mincho",
    style: {
      color: '#4A4239'
    }
  }, /*#__PURE__*/React.createElement("li", null, "各技の現段を選ぶ"), /*#__PURE__*/React.createElement("li", null, "稽古ごとに組・回数を記帳する"), /*#__PURE__*/React.createElement("li", null, "皆伝に至ったら次の段へ進む"), /*#__PURE__*/React.createElement("li", null, "「極」は到達の頂き(第十段)"))), /*#__PURE__*/React.createElement("div", {
    className: "border-l-2 pl-3",
    style: {
      borderColor: '#4A4239'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] tracking-[0.3em] mb-1",
    style: {
      color: '#7A6E5C'
    }
  }, "心得 · PRINCIPLES"), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-1.5 list-disc list-inside font-mincho",
    style: {
      color: '#4A4239'
    }
  }, /*#__PURE__*/React.createElement("li", null, "急がず、一段を十分に固める"), /*#__PURE__*/React.createElement("li", null, "関節と腱を時間をかけて練る"), /*#__PURE__*/React.createElement("li", null, "型の質を、回数の量に優先させる"), /*#__PURE__*/React.createElement("li", null, "知行合一 —— 記して行い、行いて記す"))), /*#__PURE__*/React.createElement("p", {
    className: "font-mincho text-[10px] tracking-widest pt-2 border-t",
    style: {
      color: '#7A6E5C',
      borderColor: '#C4B896'
    }
  }, "記録は端末に保管されます · DATA SAVED LOCALLY"))));
}

// =========================
// PROGRESS CHART
// =========================
function ProgressChart({
  workouts,
  exercise,
  currentStep
}) {
  const chartData = useMemo(() => {
    return [...workouts].reverse().slice(-20).map(w => ({
      date: w.date,
      dateLabel: w.date.slice(5).replace('-', '/'),
      max: Math.max(...w.sets),
      total: w.sets.reduce((a, b) => a + b, 0),
      step: w.step,
      sets: w.sets
    }));
  }, [workouts]);
  const stats = useMemo(() => {
    const currentStepWorkouts = workouts.filter(w => w.step === currentStep);
    const bestMax = currentStepWorkouts.length ? Math.max(...currentStepWorkouts.flatMap(w => w.sets)) : 0;
    const bestTotal = currentStepWorkouts.length ? Math.max(...currentStepWorkouts.map(w => w.sets.reduce((a, b) => a + b, 0))) : 0;
    return {
      sessions: workouts.length,
      bestMax,
      bestTotal
    };
  }, [workouts, currentStep]);
  if (chartData.length < 1) return null;
  const CustomDot = props => {
    const {
      cx,
      cy,
      payload,
      index
    } = props;
    if (cx === undefined || cy === undefined) return null;
    const prevStep = index > 0 ? chartData[index - 1].step : null;
    const stepChanged = prevStep !== null && prevStep !== payload.step;
    return /*#__PURE__*/React.createElement("g", null, stepChanged && /*#__PURE__*/React.createElement("line", {
      x1: cx,
      y1: 0,
      x2: cx,
      y2: 140,
      stroke: "#B0322B",
      strokeWidth: 1,
      strokeDasharray: "2 2",
      opacity: 0.4
    }), /*#__PURE__*/React.createElement("circle", {
      cx: cx,
      cy: cy,
      r: 4,
      fill: "#B0322B",
      stroke: "#F0E6D2",
      strokeWidth: 2
    }));
  };
  const CustomTooltip = ({
    active,
    payload
  }) => {
    if (!active || !payload || !payload.length) return null;
    const d = payload[0].payload;
    const stepData = exercise.steps[d.step - 1];
    return /*#__PURE__*/React.createElement("div", {
      className: "border-2 px-3 py-2 text-xs font-mincho",
      style: {
        backgroundColor: '#F5EDD8',
        borderColor: '#B0322B',
        color: '#1F1B15'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: '#4A4239'
      }
    }, formatDate(d.date)), /*#__PURE__*/React.createElement("div", {
      className: "mt-1",
      style: {
        color: '#B0322B',
        fontWeight: 700
      }
    }, "第", kanjiNum(d.step), "段 · ", stepData.n), /*#__PURE__*/React.createElement("div", {
      className: "mt-1"
    }, "最高: ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 700
      }
    }, d.max), /*#__PURE__*/React.createElement("span", {
      className: "ml-2",
      style: {
        color: '#7A6E5C'
      }
    }, "計 ", d.total)), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] mt-0.5",
      style: {
        color: '#7A6E5C'
      }
    }, d.sets.join(' / ')));
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2 mb-4"
  }, /*#__PURE__*/React.createElement(StatBox, {
    label: "稽古",
    en: "SESSIONS",
    value: stats.sessions
  }), /*#__PURE__*/React.createElement(StatBox, {
    label: `第${kanjiNum(currentStep)}段最高`,
    en: `MAX @ S${String(currentStep).padStart(2, '0')}`,
    value: stats.bestMax || '—',
    highlight: true
  }), /*#__PURE__*/React.createElement(StatBox, {
    label: `第${kanjiNum(currentStep)}段合計`,
    en: `TOTAL @ S${String(currentStep).padStart(2, '0')}`,
    value: stats.bestTotal || '—'
  })), chartData.length === 1 ? /*#__PURE__*/React.createElement("div", {
    className: "card-washi p-4 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] tracking-widest mb-1",
    style: {
      color: '#7A6E5C'
    }
  }, "初回のみ"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-mincho",
    style: {
      color: '#4A4239'
    }
  }, "二度目の稽古で推移が現れます")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card-washi p-2 pt-3"
  }, /*#__PURE__*/React.createElement(ResponsiveContainer, {
    width: "100%",
    height: 160
  }, /*#__PURE__*/React.createElement(LineChart, {
    data: chartData,
    margin: {
      top: 8,
      right: 12,
      bottom: 0,
      left: -24
    }
  }, /*#__PURE__*/React.createElement(CartesianGrid, {
    stroke: "#C4B896",
    strokeDasharray: "2 4",
    vertical: false
  }), /*#__PURE__*/React.createElement(XAxis, {
    dataKey: "dateLabel",
    stroke: "#B29A76",
    tick: {
      fontSize: 9,
      fill: '#7A6E5C',
      fontFamily: '"Shippori Mincho B1", serif'
    },
    tickLine: false,
    axisLine: {
      stroke: '#B29A76'
    }
  }), /*#__PURE__*/React.createElement(YAxis, {
    stroke: "#B29A76",
    tick: {
      fontSize: 9,
      fill: '#7A6E5C',
      fontFamily: '"Shippori Mincho B1", serif'
    },
    tickLine: false,
    axisLine: false,
    width: 32,
    allowDecimals: false
  }), /*#__PURE__*/React.createElement(Tooltip, {
    content: /*#__PURE__*/React.createElement(CustomTooltip, null),
    cursor: {
      stroke: '#B29A76',
      strokeDasharray: '2 2'
    }
  }), /*#__PURE__*/React.createElement(Line, {
    type: "monotone",
    dataKey: "max",
    stroke: "#B0322B",
    strokeWidth: 2,
    dot: /*#__PURE__*/React.createElement(CustomDot, null),
    activeDot: {
      r: 6,
      fill: '#B0322B',
      stroke: '#F0E6D2',
      strokeWidth: 2
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[9px] tracking-widest mt-2 flex items-center justify-between",
    style: {
      color: '#7A6E5C'
    }
  }, /*#__PURE__*/React.createElement("span", null, "最高回数の推移"), /*#__PURE__*/React.createElement("span", {
    className: "flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-3 h-px",
    style: {
      backgroundColor: '#B0322B'
    }
  }), " 段位変更"))));
}
function StatBox({
  label,
  en,
  value,
  highlight
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "p-2 border",
    style: highlight ? {
      borderColor: '#B0322B',
      backgroundColor: '#EBDFC0',
      borderWidth: 2
    } : {
      borderColor: '#C4B896',
      backgroundColor: 'rgba(240,230,210,0.4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[9px] tracking-widest",
    style: {
      color: highlight ? '#B0322B' : '#7A6E5C'
    }
  }, en), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] mt-0.5",
    style: {
      color: highlight ? '#4A4239' : '#7A6E5C'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "font-brush text-2xl leading-none mt-0.5",
    style: {
      color: highlight ? '#B0322B' : '#1F1B15'
    }
  }, value));
}

// =========================
// EXPORT MODAL — 写しを取る
// =========================
function ExportModal({
  date,
  workouts,
  onClose
}) {
  const md = useMemo(() => generateMarkdown(date, workouts), [date, workouts]);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(md);
      } else {
        const ta = document.createElement('textarea');
        ta.value = md;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('copy failed', e);
    }
  };
  const download = () => {
    const blob = new Blob([md], {
      type: 'text/markdown;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `鍛帳_${date}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[60] backdrop-blur flex items-end sm:items-center justify-center",
    style: {
      backgroundColor: 'rgba(31,27,21,0.6)'
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "washi-bg washi-fibers border-t-2 sm:border-2 w-full sm:max-w-lg sm:m-4 max-h-[90vh] flex flex-col",
    style: {
      borderColor: '#B0322B'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-4 border-b flex items-center justify-between flex-shrink-0",
    style: {
      borderColor: '#C4B896'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-3"
  }, /*#__PURE__*/React.createElement(Seal, {
    size: 32
  }, "写"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] tracking-[0.3em]",
    style: {
      color: '#7A6E5C'
    }
  }, "MARKDOWN"), /*#__PURE__*/React.createElement("div", {
    className: "font-mincho font-bold text-xl",
    style: {
      color: '#1F1B15'
    }
  }, formatDate(date)))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      color: '#7A6E5C'
    }
  }, /*#__PURE__*/React.createElement(X, {
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-4 flex-1 overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-mincho text-[10px] tracking-[0.25em] mb-2 flex items-center justify-between",
    style: {
      color: '#7A6E5C'
    }
  }, /*#__PURE__*/React.createElement("span", null, "PREVIEW · ", workouts.length, " 件"), /*#__PURE__*/React.createElement("span", null, "Obsidian Daily Note へ貼付")), /*#__PURE__*/React.createElement("pre", {
    className: "p-3 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-words font-mincho border",
    style: {
      backgroundColor: '#F5EDD8',
      borderColor: '#C4B896',
      color: '#1F1B15'
    }
  }, md)), /*#__PURE__*/React.createElement("div", {
    className: "px-5 py-4 border-t flex-shrink-0 flex gap-2",
    style: {
      borderColor: '#C4B896'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: download,
    className: "px-4 py-3 border font-mincho text-xs tracking-widest",
    style: {
      borderColor: '#4A4239',
      color: '#4A4239'
    },
    title: "ファイルとして保存"
  }, /*#__PURE__*/React.createElement(FileText, {
    size: 14,
    className: "inline mr-1"
  }), ".md"), /*#__PURE__*/React.createElement("button", {
    onClick: copy,
    className: "flex-1 py-3 font-mincho font-bold text-lg tracking-widest transition-colors",
    style: copied ? {
      backgroundColor: '#4A6741',
      color: '#F0E6D2'
    } : {
      backgroundColor: '#B0322B',
      color: '#F0E6D2'
    }
  }, copied ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 16,
    className: "inline mr-1",
    strokeWidth: 2.5
  }), "写し完了") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Copy, {
    size: 16,
    className: "inline mr-1",
    strokeWidth: 2.5
  }), "写しを取る")))));
}

// =========================
// MOUNT
// =========================
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(App, null));
