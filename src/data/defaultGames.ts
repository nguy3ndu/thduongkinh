import { Game } from '../types/game';
import countrysideImage from '../assets/images/edu_countryside_habitat_1793886784008.jpg';
import cityImage from '../assets/images/edu_city_habitat_1793886784936.jpg';
import solarSystemImage from '../assets/images/edu_solar_system_1793886786285.jpg';
import forestImage from '../assets/images/edu_forest_ecosystem_1793886785436.jpg';

export const PRESET_IMAGES = {
  countryside16x9: countrysideImage,
  city16x9: cityImage,
  solarSystem16x9: solarSystemImage,
  forest16x9: forestImage,
};

export const SVG_ASSETS = {
  fieldMouse: `${import.meta.env.BASE_URL}assets/games/chuot-anh.jpg`,
  cityMouse: `${import.meta.env.BASE_URL}assets/games/chuot-em.jpg`,
  deer: `${import.meta.env.BASE_URL}assets/games/chuot-anh.jpg`,
  astronaut: `${import.meta.env.BASE_URL}assets/games/chuot-em.jpg`,
  sunMascot: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="38" fill="%23f59e0b"/><circle cx="60" cy="60" r="32" fill="%23fbbf24"/><circle cx="50" cy="52" r="5" fill="%231e293b"/><circle cx="70" cy="52" r="5" fill="%231e293b"/><circle cx="52" cy="50" r="1.5" fill="%23fff"/><circle cx="72" cy="50" r="1.5" fill="%23fff"/><path d="M48 68 Q60 80 72 68" stroke="%23b45309" stroke-width="3" stroke-linecap="round" fill="none"/></svg>`,
};

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, '');

export const DEFAULT_GAMES: Game[] = [
  {
    id: 'game-noi-y-chuot-anh-em',
    title: 'Trò Chơi Nối Ý',
    type: 'matching',
    description: 'Mô tả trò chơi học tập tương tác cho học sinh.',
    gradeLevel: 'Lớp 3',
    subject: 'Tiếng Việt',
    thumbnail: `${BASE_URL}/assets/games/thumbnail.jpg`,
    aspectRatio: '16:9',
    tags: ['Tự tạo', '16:9', 'Tiếng Việt'],
    createdAt: '2026-11-06',
    updatedAt: '2026-11-06',
    isCustom: true,
    timeLimitSeconds: 120,
    instruction: 'Hãy quan sát và nối đúng các đối tượng tương ứng nhé!',
    matchPairs: [
      {
        id: 'p1',
        leftText: 'chuột anh',
        leftImage: `${BASE_URL}/assets/games/chuot-anh.jpg`,
        rightText: 'Môi trường 1 (Ảnh 16:9)',
        rightImage: `${BASE_URL}/assets/games/nong-thon.jpg`,
        hint: 'Tuyệt vời! Em đã ghép đúng.',
      },
      {
        id: 'p2',
        leftText: 'chuột em',
        leftImage: `${BASE_URL}/assets/games/chuot-em.jpg`,
        rightText: 'Môi trường 2 (Ảnh 16:9)',
        rightImage: `${BASE_URL}/assets/games/thanh-pho.jpg`,
        hint: 'Rất chính xác!',
      },
    ],
  },
];
