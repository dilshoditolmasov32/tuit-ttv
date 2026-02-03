
import { NavItem, StaffMember, Program, StudentProject, NewsItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: { uz: 'Asosiy', ru: 'Главная', en: 'Home' }, path: '/' },
  { id: 'about', label: { uz: 'Fakultet', ru: 'О факультете', en: 'About' }, path: '/about' },
  { id: 'programs', label: { uz: 'Yo\'nalishlar', ru: 'Направления', en: 'Programs' }, path: '/programs' },
  { id: 'projects', label: { uz: 'Loyihalar', ru: 'Проекты', en: 'Projects' }, path: '/projects' },
  { id: 'news', label: { uz: 'Yangiliklar', ru: 'Новости', en: 'News' }, path: '/news' },
  { id: 'practice', label: { uz: 'VR Lab', ru: 'VR Лаб', en: 'VR Lab' }, path: '/practice' },
  { id: 'contact', label: { uz: 'Aloqa', ru: 'Контакты', en: 'Contact' }, path: '/contact' },
];

export const NEWS: NewsItem[] = [
  {
    id: '1',
    title: { uz: 'Xalqaro VR Konferensiya 2024', ru: 'Международная VR Конференция 2024', en: 'International VR Conference 2024' },
    date: '2024-05-15',
    category: { uz: 'Tadbir', ru: 'Мероприятие', en: 'Event' },
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=1200',
    content: { uz: 'Fakultetimizda xalqaro VR mutaxassislari ishtirokida katta forum bo\'lib o\'tdi.', ru: 'На нашем факультете прошел большой форум с участием международных VR-специалистов.', en: 'A large forum with international VR specialists took place at our faculty.' }
  },
  {
    id: '2',
    title: { uz: 'Yangi 5G Laboratoriya Ochilishi', ru: 'Открытие новой лаборатории 5G', en: 'New 5G Lab Opening' },
    date: '2024-04-10',
    category: { uz: 'Yangilik', ru: 'Новости', en: 'News' },
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
    content: { uz: 'Eng so\'nggi avlod tarmoq texnologiyalarini o\'rganish uchun yangi markaz ishga tushdi.', ru: 'Запущен новый центр для изучения сетевых технологий последнего поколения.', en: 'A new center for studying latest generation network technologies has been launched.' }
  },
  {
    id: '3',
    title: { uz: 'Media-hackathon G\'oliblari', ru: 'Победители медиа-хакатона', en: 'Media-hackathon Winners' },
    date: '2024-03-22',
    category: { uz: 'Tanlov', ru: 'Конкурс', en: 'Competition' },
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
    content: { uz: 'Talabalarimiz tomonidan yaratilgan innovatsion media ilovalar yuqori baholandi.', ru: 'Инновационные медиа-приложения, созданные нашими студентами, получили высокую оценку.', en: 'Innovative media applications created by our students received high praise.' }
  }
];

export const PROJECTS: StudentProject[] = [
  {
    id: 'cyber-city-vr',
    title: { uz: 'Cyber-Tashkent VR', ru: 'Кибер-Ташкент VR', en: 'Cyber-Tashkent VR' },
    student: 'Saidov Jamshid',
    type: '3d',
    thumbnail: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800',
    description: { uz: 'Toshkentning 2050-yildagi futuristik ko\'rinishi.', ru: 'Футуристический облик Ташкента в 2050 году.', en: 'A futuristic view of Tashkent in 2050.' },
    color: '#00f2fe',
    caseStudy: {
      challenge: { uz: 'Katta hajmdagi 3D modellarni brauzerda optimal ishlashini ta\'minlash.', ru: 'Обеспечение оптимальной работы больших 3D-моделей в браузере.', en: 'Ensuring optimal performance of large 3D models in the browser.' },
      solution: { uz: 'LOD (Level of Detail) texnologiyasi va teksturalarni siqish usullaridan foydalanildi.', ru: 'Использовались технология LOD и методы сжатия текстур.', en: 'Used LOD (Level of Detail) technology and texture compression methods.' },
      outcome: { uz: '90 FPS tezlikda ishlovchi immersiv virtual shahar muhiti yaratildi.', ru: 'Создана иммерсивная виртуальная городская среда со скоростью 90 FPS.', en: 'Created an immersive virtual city environment running at 90 FPS.' }
    }
  },
  {
    id: 'ar-education',
    title: { uz: 'Interaktiv AR Kitob', ru: 'Интерактивная AR Книга', en: 'Interactive AR Book' },
    student: 'Murodova Shaxnoza',
    type: 'ar',
    thumbnail: 'https://images.unsplash.com/photo-1633174524827-db00a6b7bc74?auto=format&fit=crop&q=80&w=800',
    description: { uz: 'Fizika qonunlarini AR orqali o\'rganish platformasi.', ru: 'Платформа для изучения законов физики через AR.', en: 'A platform for studying the laws of physics through AR.' },
    color: '#a29bfe',
    caseStudy: {
      challenge: { uz: 'Haqiqiy ob\'ektlarni aniq kuzatish va virtual qatlamni joylash.', ru: 'Точное отслеживание реальных объектов и наложение виртуального слоя.', en: 'Accurate tracking of real objects and overlaying the virtual layer.' },
      solution: { uz: 'WebAR texnologiyasi va marker-based tracking tizimi qo\'llanildi.', ru: 'Применены технология WebAR и система трекинга на основе маркеров.', en: 'Applied WebAR technology and marker-based tracking system.' },
      outcome: { uz: 'Talabalar uchun murakkab laboratoriya tajribalarini uyda o\'tkazish imkoniyati.', ru: 'Возможность для студентов проводить сложные лабораторные опыты дома.', en: 'Ability for students to conduct complex laboratory experiments at home.' }
    }
  },
  {
    id: 'media-doc',
    title: { uz: 'Raqamli Avlod', ru: 'Цифровое Поколение', en: 'Digital Generation' },
    student: 'Abdullayev Aziz',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800',
    description: { uz: 'Zamonaviy media mutaxassislari haqida hujjatli film.', ru: 'Документальный фильм о современных медиа-специалистах.', en: 'A documentary about modern media specialists.' },
    color: '#ff7675',
    caseStudy: {
      challenge: { uz: 'Dinamik montaj va rang korreksiyasi orqali hissiy bog\'liqlik yaratish.', ru: 'Создание эмоциональной связи через динамичный монтаж и цветокоррекцию.', en: 'Creating emotional connection through dynamic editing and color correction.' },
      solution: { uz: 'Cinematic rang palitrasi va immersiv ovoz effektlari integratsiyasi.', ru: 'Интеграция кинематографической цветовой палитры и иммерсивных звуковых эффектов.', en: 'Integration of cinematic color palette and immersive sound effects.' },
      outcome: { uz: 'Xalqaro talabalar kinofestivalida "Eng yaxshi montaj" nominatsiyasi g\'olibi.', ru: 'Победитель в номинации «Лучший монтаж» на международном студенческом кинофестивале.', en: 'Winner of "Best Editing" at the international student film festival.' }
    }
  }
];

export const PROGRAMS: Program[] = [
  {
    id: 'teleoperator',
    title: { uz: 'Teleoperatorlik', ru: 'Телеоператорство', en: 'Tele-camerawork' },
    shortDesc: { uz: 'Professional tasvirga olish va kompozitsiya san\'ati.', ru: 'Профессиональная съемка и искусство композиции.', en: 'Professional filming and the art of composition.' },
    fullDesc: { uz: 'Ushbu yo\'nalishda talabalar zamonaviy 4K/8K kameralar bilan ishlash, yorug\'lik texnikasi va dinamik tasvirga olish sirlarini o\'rganadilar.', ru: 'На этом направлении студенты изучают работу с современными камерами 4K/8K, технику освещения и секреты динамичной съемки.', en: 'In this direction, students learn to work with modern 4K/8K cameras, lighting techniques, and the secrets of dynamic filming.' },
    icon: 'fas fa-video',
    color: '#00f2fe',
    stats: [
      { label: { uz: 'Amaliyot', ru: 'Практика', en: 'Practice' }, value: '80%' },
      { label: { uz: 'Talabalar', ru: 'Студенты', en: 'Students' }, value: '450+' }
    ]
  },
  {
    id: 'montaj',
    title: { uz: 'Video montaj', ru: 'Видео монтаж', en: 'Video Editing' },
    shortDesc: { uz: 'Post-prodakshn va vizual hikoyalar yaratish.', ru: 'Пост-продакшн и создание визуальных историй.', en: 'Post-production and visual storytelling.' },
    fullDesc: { uz: 'Adobe Premiere, DaVinci Resolve va After Effects yordamida professional montaj hamda rang korreksiyasi bo\'yicha chuqur bilim beriladi.', ru: 'Глубокое обучение профессиональному монтажу и цветокоррекции с использованием Adobe Premiere, DaVinci Resolve и After Effects.', en: 'Deep training in professional editing and color correction using Adobe Premiere, DaVinci Resolve, and After Effects.' },
    icon: 'fas fa-film',
    color: '#4facfe',
    stats: [
      { label: { uz: 'Dasturlar', ru: 'Программы', en: 'Software' }, value: '12+' },
      { label: { uz: 'Laboratoriya', ru: 'Лаборатория', en: 'Lab' }, value: 'Mac Studio' }
    ]
  },
  {
    id: 'media-tech',
    title: { uz: 'Media texnologiyalar', ru: 'Медиа технологии', en: 'Media Technologies' },
    shortDesc: { uz: 'Raqamli efir va tarmoq infratuzilmalari.', ru: 'Цифровое вещание и сетевые инфраструктуры.', en: 'Digital broadcasting and network infrastructures.' },
    fullDesc: { uz: 'Zamonaviy teleradioeshittirish tizimlari, sun\'iy yo\'ldosh aloqasi va OTT platformalarini boshqarish bo\'yicha mutaxassislar tayyorlanadi.', ru: 'Подготовка специалистов по современным системам телерадиовещания, спутниковой связи и управлению OTT-платформами.', en: 'Training specialists in modern television and radio broadcasting systems, satellite communications, and OTT platform management.' },
    icon: 'fas fa-satellite-dish',
    color: '#a29bfe',
    stats: [
      { label: { uz: 'Sertifikat', ru: 'Сертификат', en: 'Certification' }, value: 'Cisco/Avid' },
      { label: { uz: 'Hamkorlar', ru: 'Партнеры', en: 'Partners' }, value: 'MTRK' }
    ]
  },
  {
    id: 'audio',
    title: { uz: 'Ovoz rejissyorligi', ru: 'Звукорежиссура', en: 'Sound Directing' },
    shortDesc: { uz: 'Akustik dizayn va professional ovoz yozish.', ru: 'Акустический дизайн и профессиональная звукозапись.', en: 'Acoustic design and professional sound recording.' },
    fullDesc: { uz: 'Ovoz muhandisligi, kino va televideniye uchun surround sound yaratish hamda musiqiy prodakshn asoslari o\'rgatiladi.', ru: 'Обучение звукоинженерии, созданию объемного звука для кино и телевидения, а также основам музыкального продакшна.', en: 'Teaching sound engineering, creating surround sound for film and television, and the basics of music production.' },
    icon: 'fas fa-waveform',
    color: '#ff7675',
    stats: [
      { label: { uz: 'Studiya', ru: 'Студия', en: 'Studio' }, value: 'Dolby Atmos' },
      { label: { uz: 'Uskunalar', ru: 'Оборудование', en: 'Gear' }, value: 'Yamaha/SSL' }
    ]
  }
];

export const STAFF: StaffMember[] = [
  {
    id: 1,
    name: { uz: 'Prof. Alimov Mansur', ru: 'Проф. Алимов Мансур', en: 'Prof. Mansur Alimov' },
    role: { uz: 'Fakultet Dekani', ru: 'Декан факультета', en: 'Dean of Faculty' },
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
    bio: { 
      uz: 'Raqamli texnologiyalar va media-tizimlar bo\'yicha yetakchi mutaxassis. 20 yildan ortiq ilmiy tajribaga ega.', 
      ru: 'Ведущий специалист по цифровым технологиям и медиасистемам. Более 20 лет научного стажа.', 
      en: 'Leading specialist in digital technologies and media systems. More than 20 years of academic experience.' 
    },
    career: [
      { year: '2000-2005', desc: { uz: 'Toshkent Aloqa Instituti talabasi', ru: 'Студент Ташкентского института связи', en: 'Student at Tashkent Communication Institute' } },
      { year: '2015', desc: { uz: 'Texnika fanlari doktori', ru: 'Доктор технических наук', en: 'Doctor of Technical Sciences' } },
      { year: '2021', desc: { uz: 'Fakultet dekani etib tayinlangan', ru: 'Назначен деканом факультета', en: 'Appointed Dean of the Faculty' } }
    ]
  },
  {
    id: 2,
    name: { uz: 'Dr. Elena Petrova', ru: 'Д-р Елена Петрова', en: 'Dr. Elena Petrova' },
    role: { uz: 'O\'quv ishlari bo\'yicha o\'rinbosar', ru: 'Зам. декана по учебной работе', en: 'Vice Dean of Academic Affairs' },
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    bio: { uz: 'Masofaviy ta\'lim va VR-platformalar arxitektori.', ru: 'Архитектор дистанционного обучения и VR-платформ.', en: 'Architect of distance learning and VR platforms.' },
    career: [
      { year: '2012', desc: { uz: 'PhD darajasini himoya qilish', ru: 'Защита степени PhD', en: 'PhD Defense' } },
      { year: '2018', desc: { uz: 'Xalqaro hamkorlik koordinatori', ru: 'Координатор международного сотрудничества', en: 'International Cooperation Coordinator' } }
    ]
  },
  {
    id: 3,
    name: { uz: 'Azizov Sanjar', ru: 'Азизов Санжар', en: 'Azizov Sanjar' },
    role: { uz: 'VR Laboratoriya rahbari', ru: 'Руководитель VR-лаборатории', en: 'Head of VR Laboratory' },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    bio: { uz: 'O\'zbekistondagi ilk VR ta\'lim loyihalari muallifi.', ru: 'Автор первых VR-образовательных проектов в Узбекистане.', en: 'Author of the first VR educational projects in Uzbekistan.' },
    career: [
      { year: '2019', desc: { uz: 'Innovatsion Markaz asoschisi', ru: 'Основатель Инновационного центра', en: 'Founder of the Innovation Center' } },
      { year: '2023', desc: { uz: 'Yilning eng yaxshi yosh olimi', ru: 'Лучший молодой ученый года', en: 'Young Scientist of the Year' } }
    ]
  }
];

export const HISTORY = [
  { year: '1995', title: { uz: 'Asos solinishi', ru: 'Основание', en: 'Foundation' }, desc: { uz: 'Fakultet telekommunikatsiya yo\'nalishi bazasida tashkil etildi.', ru: 'Факультет был создан на базе телекоммуникационного направления.', en: 'The faculty was established on the basis of telecommunications.' } },
  { year: '2005', title: { uz: 'Media markaz', ru: 'Медиа центр', en: 'Media Center' }, desc: { uz: 'Ilk zamonaviy televizion studiya va media laboratoriya ochildi.', ru: 'Открыта первая современная телестудия и медиалаборатория.', en: 'The first modern TV studio and media lab were opened.' } },
  { year: '2018', title: { uz: 'Raqamli transformatsiya', ru: 'Цифровая трансформация', en: 'Digital Transformation' }, desc: { uz: 'VR/AR va 5G texnologiyalari o\'quv dasturiga kiritildi.', ru: 'Технологии VR/AR и 5G внедрены в учебную программу.', en: 'VR/AR and 5G technologies integrated into the curriculum.' } },
  { year: '2023', title: { uz: 'Xalqaro e\'tirof', ru: 'Международное признание', en: 'International Recognition' }, desc: { uz: 'Fakultet xalqaro ta\'lim standartlari bo\'yicha akkreditatsiyadan o\'tdi.', ru: 'Факультет прошел аккредитацию по международным стандартам.', en: 'The faculty received international accreditation.' } }
];

export const MISSIONS = [
  { icon: 'fas fa-rocket', title: { uz: 'Innovatsiya', ru: 'Инновации', en: 'Innovation' }, desc: { uz: 'Eng so\'nggi texnologiyalarni amaliyotga joriy etish.', ru: 'Внедрение новейших технологий в практику.', en: 'Implementing cutting-edge technologies into practice.' } },
  { icon: 'fas fa-users', title: { uz: 'Liderlik', ru: 'Лидерство', en: 'Leadership' }, desc: { uz: 'Soha mutaxassislarini xalqaro miqyosda tayyorlash.', ru: 'Подготовка специалистов мирового уровня.', en: 'Preparing world-class industry specialists.' } },
  { icon: 'fas fa-lightbulb', title: { uz: 'Kreativlik', ru: 'Креативность', en: 'Creativity' }, desc: { uz: 'Media va muhandislik uyg\'unligini yaratish.', ru: 'Создание гармонии медиа и инженерии.', en: 'Creating harmony between media and engineering.' } }
];

export const TRANSLATIONS = {
  uz: {
    welcome: "TV Texnologiyalari",
    heroSubtitle: "Telekommunikatsiya va media olamining kelajagini biz bilan yarating.",
    explore: "Tajribani boshlash",
    aiAssistant: "AI Yordamchi",
    askAi: "Fakultet haqida savol bering...",
    staffTitle: "AKADEMIK JAMOA",
    staffSubtitle: "Kelajak mutaxassislarini tayyorlayotgan professorlarimiz.",
    contactUs: "ALOQA",
    nameLabel: "Ismingiz",
    emailLabel: "Elektron pochta",
    messageLabel: "Xabaringiz",
    submit: "Yuborish",
    footerAbout: "Televizion texnologiyalari fakulteti - bu innovatsiyalar, media va muhandislik uyg'unligi.",
    rights: "Barcha huquqlar himoyalangan.",
    scrolldown: "Pastga skroll qiling",
    stats_students: "Talabalar",
    stats_labs: "Laboratoriyalar",
    stats_projects: "Loyihalar",
    whatIsTitle: "Televizion Texnologiyalar nima?",
    whatIsDesc: "Bu media kontentni yaratish, qayta ishlash va uzatishning yuqori texnologik olamidir. Biz talabalarga nafaqat efir ortidagi sirlarni, balki kelajakning raqamli ekotizimini qurishni o'rgatamiz.",
    vrarTitle: "VR / AR Imkoniyatlari",
    vrarDesc: "Virtual va kengaytirilgan voqelik - bu bizning o'quv jarayonimizning ajralmas qismi. Talabalarimiz murakkab muhandislik tizimlarini virtual muhitda simulyatsiya qilish imkoniyatiga ega.",
    historyTitle: "Fakultet Tarixi",
    missionsTitle: "Bizning maqsadlar",
    lab360Title: "360° Virtual Tur",
    vrStudioTitle: "VR Studio",
    vrStudioDesc: "Virtual laboratoriya xonasini kashf qiling.",
    arCamTitle: "AR Kamera",
    arCamDesc: "Haqiqiy muhitga 3D modellarni joylang.",
    pano360Title: "360° Video Player",
    pano360Desc: "Panorama videolarni tomosha qiling.",
    virtualTourBtn: "Virtual ekskursiya",
    programsTitle: "Ta'lim yo'nalishlari",
    programsSubtitle: "Kreativ va texnologik sohalarning eng yaxshi o'quv dasturlari.",
    viewProgram: "Batafsil ma'lumot",
    closeProgram: "Yopish",
    projectsTitle: "Loyihalar & Talabalar ishlari",
    projectsSubtitle: "Iste'dodli talabalarimiz tomonidan yaratilgan innovatsion yechimlar.",
    caseStudyTitle: "Case Study",
    challenge: "Muammo",
    solution: "Yechim",
    outcome: "Natija",
    gallery3D: "3D Galereya",
    newsTitle: "Yangiliklar & Tadbirlar",
    newsSubtitle: "Fakultetimiz hayotidagi eng so'nggi voqealar va innovatsiyalar.",
    contactTitle: "Aloqa & Manzil",
    contactSubtitle: "Biz bilan bog'laning yoki kampusga tashrif buyuring.",
    campusModelTitle: "3D Kampus Markazi",
    readMore: "Batafsil",
    address: "Manzil: Toshkent sh., Amir Temur ko'chasi, 108",
    phone: "Tel: +998 71 234 56 78",
    email: "Email: info@tv-tech.uz"
  },
  ru: {
    welcome: "ТВ Технологии",
    heroSubtitle: "Создавайте будущее мира телекоммуникаций и медиа вместе с нами.",
    explore: "Начать опыт",
    aiAssistant: "AI Помощник",
    askAi: "Задайте вопрос о факультете...",
    staffTitle: "АКАДЕМИЧЕСКАЯ КОМАНДА",
    staffSubtitle: "Наши профессора, готовящие специалистов будущего.",
    contactUs: "КОНТАКТЫ",
    nameLabel: "Ваше имя",
    emailLabel: "Электронная почта",
    messageLabel: "Ваше сообщение",
    submit: "Отправить",
    footerAbout: "Факультет телевизионных технологий — это сочетание инноваций, медиа и инженерии.",
    rights: "Все права защищены.",
    scrolldown: "Листайте вниз",
    stats_students: "Студентов",
    stats_labs: "Лабораторий",
    stats_projects: "Проектов",
    whatIsTitle: "Что такое ТВ Технологии?",
    whatIsDesc: "Это высокотехнологичный мир создания, обработки и передачи медиаконтента. Мы учим студентов не только секретам закулисья, но и построению цифровой экосистемы будущего.",
    vrarTitle: "Возможности VR / AR",
    vrarDesc: "Виртуальная и дополненная реальность — неотъемлемая часть нашего учебного процесса. Наши студенты имеют возможность моделировать сложные инженерные системы в виртуальной среде.",
    historyTitle: "История факультета",
    missionsTitle: "Наши цели",
    lab360Title: "360° Виртуальный тур",
    vrStudioTitle: "VR Студия",
    vrStudioDesc: "Исследуйте виртуальную лабораторию.",
    arCamTitle: "AR Камера",
    arCamDesc: "Размещайте 3D модели в реальности.",
    pano360Title: "360° Видеоплеер",
    pano360Desc: "Смотрите панорамные видео.",
    virtualTourBtn: "Виртуальная экскурсия",
    programsTitle: "Направления обучения",
    programsSubtitle: "Лучшие учебные программы в креативных и технологических сферах.",
    viewProgram: "Подробнее",
    closeProgram: "Закрыть",
    projectsTitle: "Проекты & Работы студентов",
    projectsSubtitle: "Инновационные решения, созданные нашими талантливыми студентами.",
    caseStudyTitle: "Кейс-стади",
    challenge: "Проблема",
    solution: "Решение",
    outcome: "Результат",
    gallery3D: "3D Галерея",
    newsTitle: "Новости & Мероприятия",
    newsSubtitle: "Последние события и инновации в жизни нашего факультета.",
    contactTitle: "Связь & Адрес",
    contactSubtitle: "Свяжитесь с нами или посетите наш кампус.",
    campusModelTitle: "3D Модель Кампуса",
    readMore: "Подробнее",
    address: "Адрес: г. Ташкент, ул. Амира Темура, 108",
    phone: "Тел: +998 71 234 56 78",
    email: "Email: info@tv-tech.uz"
  },
  en: {
    welcome: "TV Technologies",
    heroSubtitle: "Shape the future of telecommunications and media with us.",
    explore: "Enter Experience",
    aiAssistant: "AI Assistant",
    askAi: "Ask about the faculty...",
    staffTitle: "ACADEMIC TEAM",
    staffSubtitle: "Our professors who shape the experts of tomorrow.",
    contactUs: "CONTACT",
    nameLabel: "Your Name",
    emailLabel: "Email Address",
    messageLabel: "Your Message",
    submit: "Submit",
    footerAbout: "The Faculty of Television Technologies is a fusion of innovation, media, and engineering.",
    rights: "All rights reserved.",
    scrolldown: "Scroll down",
    stats_students: "Students",
    stats_labs: "Laboratories",
    stats_projects: "Projects",
    whatIsTitle: "What is TV Technology?",
    whatIsDesc: "It is the high-tech world of creating, processing, and transmitting media content. We teach students not only the secrets behind the scenes but also how to build the digital ecosystem of the future.",
    vrarTitle: "VR / AR Capabilities",
    vrarDesc: "Virtual and augmented reality are an integral part of our educational process. Our students have the opportunity to simulate complex engineering systems in a virtual environment.",
    historyTitle: "Faculty History",
    missionsTitle: "Our Missions",
    lab360Title: "360° Virtual Tour",
    vrStudioTitle: "VR Studio",
    vrStudioDesc: "Discover the virtual laboratory room.",
    arCamTitle: "AR Camera",
    arCamDesc: "Place 3D models into your reality.",
    pano360Title: "360° Video Player",
    pano360Desc: "Watch panoramic videos.",
    virtualTourBtn: "Virtual Tour",
    programsTitle: "Educational Directions",
    programsSubtitle: "Best training programs in creative and technological fields.",
    viewProgram: "Learn More",
    closeProgram: "Close",
    projectsTitle: "Projects & Student Works",
    projectsSubtitle: "Innovative solutions created by our talented students.",
    caseStudyTitle: "Case Study",
    challenge: "Challenge",
    solution: "Solution",
    outcome: "Outcome",
    gallery3D: "3D Gallery",
    newsTitle: "News & Events",
    newsSubtitle: "The latest events and innovations in the life of our faculty.",
    contactTitle: "Contact & Address",
    contactSubtitle: "Get in touch with us or visit our campus.",
    campusModelTitle: "3D Campus Hub",
    readMore: "Read More",
    address: "Address: Tashkent city, Amir Temur str., 108",
    phone: "Tel: +998 71 234 56 78",
    email: "Email: info@tv-tech.uz"
  }
};
