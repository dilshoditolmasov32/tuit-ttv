import {
  HistoryItem,
  NavItem,
  StaffMember,
  Program,
  StudentProject,
  NewsItem,
} from "./types";

export const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: { uz: "Bosh sahifa", ru: "Главная", en: "Home" },
    path: "/",
  },
  {
    id: "about",
    label: { uz: "Fakultet haqida", ru: "О факультете", en: "About" },
    path: "/about",
  },
  {
    id: "programs",
    label: { uz: "Ta'lim yo'nalishlari", ru: "Направления", en: "Programs" },
    path: "/programs",
  },
  {
    id: "projects",
    label: { uz: "Loyihalar", ru: "Проекты", en: "Projects" },
    path: "/projects",
  },
  {
    id: "news",
    label: { uz: "Yangiliklar", ru: "Новости", en: "News" },
    path: "/news",
  },
  {
    id: "practice",
    label: { uz: "VR laboratoriyasi", ru: "VR Лаб", en: "VR Lab" },
    path: "/practice",
  },
  {
    id: "contact",
    label: { uz: "Aloqa", ru: "Контакты", en: "Contact" },
    path: "/contact",
  },
];

export const NEWS: NewsItem[] = [
  {
    id: "1",
    title: {
      uz: "Xalqaro VR konferensiyasi – 2026",
      ru: "Международная VR конференция 2026",
      en: "International VR Conference 2026",
    },
    date: "2024-05-15",
    category: { uz: "Tadbir", ru: "Мероприятие", en: "Event" },
    image:
      "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=1200",
    content: {
      uz: "Fakultetimizda xalqaro VR mutaxassislari ishtirokida keng ko'lamli forum bo'lib o'tdi.",
      ru: "На нашем факультете прошел масштабный форум с участием международных VR-специалистов.",
      en: "A large forum with international VR specialists took place at our faculty.",
    },
  },
  {
    id: "2",
    title: {
      uz: "Yangi 5G laboratoriyasining ochilish marosimi",
      ru: "Открытие новой лаборатории 5G",
      en: "New 5G Lab Opening",
    },
    date: "2024-04-10",
    category: { uz: "Yangilik", ru: "Новости", en: "News" },
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    content: {
      uz: "So'nggi avlod tarmoq texnologiyalarini tadqiq etishga mo'ljallangan yangi markaz faoliyat boshladi.",
      ru: "Запущен новый центр для изучения сетевых технологий последнего поколения.",
      en: "A new center for studying latest generation network technologies has been launched.",
    },
  },
  {
    id: "3",
    title: {
      uz: "Media-xakaton g'oliblari aniqlandi",
      ru: "Победители медиа-хакатона",
      en: "Media-hackathon Winners",
    },
    date: "2024-03-22",
    category: { uz: "Tanlov", ru: "Конкурс", en: "Competition" },
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200",
    content: {
      uz: "Talabalarimiz tomonidan ishlab chiqilgan innovatsion media ilovalar hakamlar tomonidan yuqori baholandi.",
      ru: "Инновационные медиа-приложения, созданные нашими студентами, получили высокую оценку.",
      en: "Innovative media applications created by our students received high praise.",
    },
  },
];

export const PROJECTS: StudentProject[] = [
  {
    id: "cyber-city-vr",
    title: {
      uz: "Cyber-Tashkent VR",
      ru: "Кибер-Ташкент VR",
      en: "Cyber-Tashkent VR",
    },
    student: "Saidov Jamshid",
    type: "3d",
    thumbnail:
      "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800",
    description: {
      uz: "Toshkent shahrining 2050-yildagi futuristik qiyofasi.",
      ru: "Футуристический облик Ташкента в 2050 году.",
      en: "A futuristic view of Tashkent in 2050.",
    },
    color: "#00f2fe",
    caseStudy: {
      challenge: {
        uz: "Katta hajmli 3D modellarning brauzerda barqaror ishlashini ta'minlash.",
        ru: "Обеспечение оптимальной работы больших 3D-моделей в браузере.",
        en: "Ensuring optimal performance of large 3D models in the browser.",
      },
      solution: {
        uz: "LOD (Level of Detail) texnologiyasi va teksturalarni siqish usullari tatbiq etildi.",
        ru: "Использовались технология LOD и методы сжатия текстур.",
        en: "Used LOD (Level of Detail) technology and texture compression methods.",
      },
      outcome: {
        uz: "90 FPS chastotada ishlovchi immersiv virtual shahar muhiti yaratildi.",
        ru: "Создана иммерсивная виртуальная городская среда со скоростью 90 FPS.",
        en: "Created an immersive virtual city environment running at 90 FPS.",
      },
    },
  },
  {
    id: "ar-education",
    title: {
      uz: "Interaktiv AR kitob",
      ru: "Интерактивная AR книга",
      en: "Interactive AR Book",
    },
    student: "Murodova Shaxnoza",
    type: "ar",
    thumbnail:
      "https://images.unsplash.com/photo-1633174524827-db00a6b7bc74?auto=format&fit=crop&q=80&w=800",
    description: {
      uz: "Fizika qonunlarini AR texnologiyasi yordamida o'rganish platformasi.",
      ru: "Платформа для изучения законов физики через AR.",
      en: "A platform for studying the laws of physics through AR.",
    },
    color: "#a29bfe",
    caseStudy: {
      challenge: {
        uz: "Real ob'ektlarni aniq kuzatish va virtual qatlamni muvofiqlashtirish.",
        ru: "Точное отслеживание реальных объектов и наложение виртуального слоя.",
        en: "Accurate tracking of real objects and overlaying the virtual layer.",
      },
      solution: {
        uz: "WebAR texnologiyasi va markerli kuzatuv (marker-based tracking) tizimi qo'llanildi.",
        ru: "Применены технология WebAR и система трекинга на основе маркеров.",
        en: "Applied WebAR technology and marker-based tracking system.",
      },
      outcome: {
        uz: "Talabalar uchun murakkab laboratoriya tajribalarini masofadan o'tkazish imkoniyati yaratildi.",
        ru: "Возможность для студентов проводить сложные лабораторные опыты на дому.",
        en: "Ability for students to conduct complex laboratory experiments at home.",
      },
    },
  },
  {
    id: "media-doc",
    title: {
      uz: "Raqamli avlod",
      ru: "Цифровое Поколение",
      en: "Digital Generation",
    },
    student: "Abdullayev Aziz",
    type: "video",
    thumbnail:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800",
    description: {
      uz: "Zamonaviy media mutaxassislari hayoti haqida hujjatli film.",
      ru: "Документальный фильм о современных медиа-специалистах.",
      en: "A documentary about modern media specialists.",
    },
    color: "#ff7675",
    caseStudy: {
      challenge: {
        uz: "Dinamik montaj va rang korreksiyasi orqali hissiy ta'sirchanlikka erishish.",
        ru: "Создание эмоциональной связи через динамичный монтаж и цветокоррекцию.",
        en: "Creating emotional connection through dynamic editing and color correction.",
      },
      solution: {
        uz: "Kinematografik ranglar palitrasi va immersiv ovoz effektlari integratsiyasi amalga oshirildi.",
        ru: "Интеграция кинематографической цветовой палитры и иммерсивных звуковых эффектов.",
        en: "Integration of cinematic color palette and immersive sound effects.",
      },
      outcome: {
        uz: "Xalqaro talabalar kinofestivalida «Eng yaxshi montaj» nominatsiyasi g'olibi bo'ldi.",
        ru: "Победитель в номинации «Лучший монтаж» на международном студенческом кинофестивале.",
        en: 'Winner of "Best Editing" at the international student film festival.',
      },
    },
  },
];

export const PROGRAMS: Program[] = [
  {
    id: "tv-tech-bachelor",
    title: {
      uz: "Televizion texnologiyalar",
      ru: "Телевизионные технологии",
      en: "Television Technologies",
    },
    shortDesc: {
      uz: "60611100 kodli bakalavriat ta'lim yo'nalishi.",
      ru: "Бакалаврское направление с кодом 60611100.",
      en: "Bachelor's program with code 60611100.",
    },
    fullDesc: {
      uz: "TATUning rasmiy \"Televizion va media texnologiyalar\" sahifasida ushbu yo'nalish bakalavriat dasturi sifatida ko'rsatilgan. Yo'nalish televideniye, media uzatish, studiya tizimlari va audiovizual kontent bilan ishlashga oid fundamental tayyorgarlikni qamrab oladi.",
      ru: "На официальной странице ТУИТ «Телевизионные и медиа технологии» это направление указано как бакалаврская программа. Подготовка охватывает основы телевидения, медиа-передачи, студийных систем и работы с аудиовизуальным контентом.",
      en: "On TUIT's official Television and Media Technologies page, this track is listed as the bachelor's program. It covers core preparation in television, media transmission, studio systems, and audiovisual content workflows.",
    },
    icon: "fas fa-video",
    color: "#00f2fe",
    stats: [
      {
        label: { uz: "Kod", ru: "Код", en: "Code" },
        value: "60611100",
      },
      {
        label: { uz: "Bosqich", ru: "Уровень", en: "Level" },
        value: { uz: "Bakalavriat", ru: "Бакалавриат", en: "Bachelor's" },
      },
      {
        label: { uz: "Turi", ru: "Тип", en: "Type" },
        value: { uz: "Ta'lim yo'nalishi", ru: "Направление", en: "Academic direction" },
      },
      {
        label: { uz: "Kafedra", ru: "Кафедра", en: "Department" },
        value: {
          uz: "Televizion va media texnologiyalar",
          ru: "Телевизионные и медиа технологии",
          en: "Television and Media Technologies",
        },
      },
    ],
    sourceLabel: {
      uz: "TATU rasmiy sahifasi",
      ru: "Официальная страница ТУИТ",
      en: "Official TUIT page",
    },
    sourceUrl: "https://tuit.uz/televizion-va-media-texnologiyalar",
  },
  {
    id: "tv-tech-master",
    title: {
      uz: "Televizion texnologiyalar",
      ru: "Телевизионные технологии",
      en: "Television Technologies",
    },
    shortDesc: {
      uz: "70610701 kodli magistratura mutaxassisligi.",
      ru: "Магистерская специальность с кодом 70610701.",
      en: "Master's specialty with code 70610701.",
    },
    fullDesc: {
      uz: "Rasmiy kafedra sahifasida magistratura mutaxassisligi sifatida keltirilgan ushbu dastur televizion tizimlar, media uzatish, signal ishlovi va studiya jarayonlarini chuqurroq o'rganishga yo'naltirilgan.",
      ru: "На официальной странице кафедры эта программа указана как магистерская специальность и ориентирована на углубленное изучение телевизионных систем, медиа-передачи, обработки сигналов и студийных процессов.",
      en: "Listed on the official department page as a master's specialty, this program is oriented toward advanced study of television systems, media transmission, signal processing, and studio workflows.",
    },
    icon: "fas fa-film",
    color: "#4facfe",
    stats: [
      {
        label: { uz: "Kod", ru: "Код", en: "Code" },
        value: "70610701",
      },
      {
        label: { uz: "Bosqich", ru: "Уровень", en: "Level" },
        value: { uz: "Magistratura", ru: "Магистратура", en: "Master's" },
      },
      {
        label: { uz: "Turi", ru: "Тип", en: "Type" },
        value: { uz: "Mutaxassislik", ru: "Специальность", en: "Specialty" },
      },
      {
        label: { uz: "Kafedra", ru: "Кафедра", en: "Department" },
        value: {
          uz: "Televizion va media texnologiyalar",
          ru: "Телевизионные и медиа технологии",
          en: "Television and Media Technologies",
        },
      },
    ],
    sourceLabel: {
      uz: "TATU rasmiy sahifasi",
      ru: "Официальная страница ТУИТ",
      en: "Official TUIT page",
    },
    sourceUrl: "https://tuit.uz/televizion-va-media-texnologiyalar",
  },
  {
    id: "animation-master",
    title: {
      uz: "Multiplikatsion filmlar texnologiyalari",
      ru: "Технологии мультипликационных фильмов",
      en: "Animation Film Technologies",
    },
    shortDesc: {
      uz: "70611101 kodli magistratura mutaxassisligi.",
      ru: "Магистерская специальность с кодом 70611101.",
      en: "Master's specialty with code 70611101.",
    },
    fullDesc: {
      uz: "Ushbu magistratura dasturi rasmiy ro'yxatda media va animatsiya yo'nalishidagi alohida mutaxassislik sifatida berilgan. Dastur animatsion kontent yaratish, vizual hikoya, ishlab chiqarish jarayoni va raqamli media texnologiyalariga ixtisoslashgan yo'nalishni anglatadi.",
      ru: "Эта магистерская программа указана в официальном перечне как отдельная специальность в области медиа и анимации. Направление связано с созданием анимационного контента, визуальным сторителлингом, производственным процессом и цифровыми медиа технологиями.",
      en: "This master's program is listed officially as a distinct media and animation specialty. It reflects specialization in animation content creation, visual storytelling, production workflows, and digital media technologies.",
    },
    icon: "fas fa-clapperboard",
    color: "#a29bfe",
    stats: [
      {
        label: { uz: "Kod", ru: "Код", en: "Code" },
        value: "70611101",
      },
      {
        label: { uz: "Bosqich", ru: "Уровень", en: "Level" },
        value: { uz: "Magistratura", ru: "Магистратура", en: "Master's" },
      },
      {
        label: { uz: "Turi", ru: "Тип", en: "Type" },
        value: { uz: "Mutaxassislik", ru: "Специальность", en: "Specialty" },
      },
      {
        label: { uz: "Kafedra", ru: "Кафедра", en: "Department" },
        value: {
          uz: "Televizion va media texnologiyalar",
          ru: "Телевизионные и медиа технологии",
          en: "Television and Media Technologies",
        },
      },
    ],
    sourceLabel: {
      uz: "TATU rasmiy sahifasi",
      ru: "Официальная страница ТУИТ",
      en: "Official TUIT page",
    },
    sourceUrl: "https://tuit.uz/televizion-va-media-texnologiyalar",
  },
  {
    id: "cgd-master",
    title: {
      uz: "Kompyuter grafikasi va dizayn",
      ru: "Компьютерная графика и дизайн",
      en: "Computer Graphics and Design",
    },
    shortDesc: {
      uz: "70210402 kodli magistratura mutaxassisligi.",
      ru: "Магистерская специальность с кодом 70210402.",
      en: "Master's specialty with code 70210402.",
    },
    fullDesc: {
      uz: "Rasmiy ro'yxatda magistratura mutaxassisligi sifatida berilgan bu yo'nalish kompyuter grafikasi, vizual dizayn, media interfeyslar va raqamli kontent ishlab chiqish bo'yicha chuqurlashtirilgan tayyorgarlikni bildiradi.",
      ru: "В официальном перечне это направление указано как магистерская специальность и отражает углубленную подготовку по компьютерной графике, визуальному дизайну, медиа-интерфейсам и созданию цифрового контента.",
      en: "In the official list, this track appears as a master's specialty focused on advanced preparation in computer graphics, visual design, media interfaces, and digital content production.",
    },
    icon: "fas fa-bezier-curve",
    color: "#ff9f43",
    stats: [
      {
        label: { uz: "Kod", ru: "Код", en: "Code" },
        value: "70210402",
      },
      {
        label: { uz: "Bosqich", ru: "Уровень", en: "Level" },
        value: { uz: "Magistratura", ru: "Магистратура", en: "Master's" },
      },
      {
        label: { uz: "Turi", ru: "Тип", en: "Type" },
        value: { uz: "Mutaxassislik", ru: "Специальность", en: "Specialty" },
      },
      {
        label: { uz: "Kafedra", ru: "Кафедра", en: "Department" },
        value: {
          uz: "Televizion va media texnologiyalar",
          ru: "Телевизионные и медиа технологии",
          en: "Television and Media Technologies",
        },
      },
    ],
    sourceLabel: {
      uz: "TATU rasmiy sahifasi",
      ru: "Официальная страница ТУИТ",
      en: "Official TUIT page",
    },
    sourceUrl: "https://tuit.uz/televizion-va-media-texnologiyalar",
  },
  {
    id: "av-tech-master",
    title: {
      uz: "Audio-videotexnologiyalar",
      ru: "Аудио- и видеотехнологии",
      en: "Audio and Video Technologies",
    },
    shortDesc: {
      uz: "70611006 kodli magistratura mutaxassisligi.",
      ru: "Магистерская специальность с кодом 70611006.",
      en: "Master's specialty with code 70611006.",
    },
    fullDesc: {
      uz: "Kafedraning rasmiy sahifasida ko'rsatilgan ushbu magistratura yo'nalishi audio va video tizimlar, yozuv va uzatish texnologiyalari hamda zamonaviy audiovizual ishlab chiqarish infratuzilmasiga ixtisoslashgan.",
      ru: "Эта магистерская программа указана на официальной странице кафедры и специализируется на аудио- и видеосистемах, технологиях записи и передачи, а также современной аудиовизуальной производственной инфраструктуре.",
      en: "Listed on the official department page, this master's program specializes in audio and video systems, recording and transmission technologies, and modern audiovisual production infrastructure.",
    },
    icon: "fas fa-headphones",
    color: "#ff6b6b",
    stats: [
      {
        label: { uz: "Kod", ru: "Код", en: "Code" },
        value: "70611006",
      },
      {
        label: { uz: "Bosqich", ru: "Уровень", en: "Level" },
        value: { uz: "Magistratura", ru: "Магистратура", en: "Master's" },
      },
      {
        label: { uz: "Turi", ru: "Тип", en: "Type" },
        value: { uz: "Mutaxassislik", ru: "Специальность", en: "Specialty" },
      },
      {
        label: { uz: "Kafedra", ru: "Кафедра", en: "Department" },
        value: {
          uz: "Televizion va media texnologiyalar",
          ru: "Телевизионные и медиа технологии",
          en: "Television and Media Technologies",
        },
      },
    ],
    sourceLabel: {
      uz: "TATU rasmiy sahifasi",
      ru: "Официальная страница ТУИТ",
      en: "Official TUIT page",
    },
    sourceUrl: "https://tuit.uz/televizion-va-media-texnologiyalar",
  },
  {
    id: "lighting-master",
    title: {
      uz: "Maxsus yoritish texnologiyalari",
      ru: "Технологии специального освещения",
      en: "Special Lighting Technologies",
    },
    shortDesc: {
      uz: "70611007 kodli magistratura mutaxassisligi.",
      ru: "Магистерская специальность с кодом 70611007.",
      en: "Master's specialty with code 70611007.",
    },
    fullDesc: {
      uz: "Rasmiy dasturlar ro'yxatida alohida magistratura mutaxassisligi sifatida berilgan bu yo'nalish studiya, sahna va media ishlab chiqarish jarayonlaridagi maxsus yoritish yechimlariga ixtisoslashgan.",
      ru: "В официальном перечне программ это отдельная магистерская специальность, ориентированная на специальные световые решения для студии, сцены и медиа-производства.",
      en: "In the official program list, this appears as a separate master's specialty focused on special lighting solutions for studio, stage, and media production settings.",
    },
    icon: "fas fa-lightbulb",
    color: "#feca57",
    stats: [
      {
        label: { uz: "Kod", ru: "Код", en: "Code" },
        value: "70611007",
      },
      {
        label: { uz: "Bosqich", ru: "Уровень", en: "Level" },
        value: { uz: "Magistratura", ru: "Магистратура", en: "Master's" },
      },
      {
        label: { uz: "Turi", ru: "Тип", en: "Type" },
        value: { uz: "Mutaxassislik", ru: "Специальность", en: "Specialty" },
      },
      {
        label: { uz: "Kafedra", ru: "Кафедра", en: "Department" },
        value: {
          uz: "Televizion va media texnologiyalar",
          ru: "Телевизионные и медиа технологии",
          en: "Television and Media Technologies",
        },
      },
    ],
    sourceLabel: {
      uz: "TATU rasmiy sahifasi",
      ru: "Официальная страница ТУИТ",
      en: "Official TUIT page",
    },
    sourceUrl: "https://tuit.uz/televizion-va-media-texnologiyalar",
  },
];

export const STAFF: StaffMember[] = [
  {
    id: 1,
    name: {
      uz: "Nazirova Elmira Shodmonovna",
      ru: "Назирова Эльмира Шодмоновна",
      en: "Elmira Shodmonovna Nazirova",
    },
    role: {
      uz: "Televizion texnologiyalar fakulteti dekani",
      ru: "Декан факультета телевизионных технологий",
      en: "Dean of the Television Technologies Faculty",
    },
    image: "https://static.tuit.uz/uploads/1/FjqjRMgOtPG39zg3SdZxjutHpiwYbQUC.png",
    email: "e.nazirova@tuit.uz",
    profileUrl: "https://tuit.uz/televizion-texnologiyalar",
    office: {
      uz: "Qabul vaqti: chorshanba-payshanba, 16:00-18:00",
      ru: "Часы приема: среда-четверг, 16:00-18:00",
      en: "Office hours: Wednesday-Thursday, 16:00-18:00",
    },
    bio: {
      uz: "Fakultetning bakalavriat va magistratura yo'nalishlaridagi o'quv, ilmiy hamda ma'muriy jarayonlarni boshqaradi.",
      ru: "Руководит учебными, научными и административными процессами на факультете.",
      en: "Listed on the official TUIT page as the faculty dean and oversees the faculty's bachelor's and master's programs.",
    },
    highlights: [
      {
        uz: "Xizmat telefoni: (+99871) 238-65-28",
        ru: "Рабочий телефон: (+99871) 238-65-28",
        en: "Official contact: (+99871) 238-65-28",
      },
      {
        uz: "2 ta bakalavriat va 5 ta magistratura yo'nalishi koordinatori",
        ru: "Координирует 2 бакалаврские и 5 магистерских программ",
        en: "Works with 2 bachelor's and 5 master's programs",
      },
      {
        uz: "TATU rasmiy veb-sayti ma'lumotlari asosida",
        ru: "На основе официального сайта ТУИТ",
        en: "Source: official TUIT faculty page",
      },
    ],
    career: [
      {
        year: "2025-yil",
        desc: {
          uz: "2025-yil 25-iyul holatiga ko'ra fakultet dekani lavozimida faoliyat yuritmoqda.",
          ru: "По состоянию на 25.07.2025 занимает должность декана факультета.",
          en: "Shown as the faculty dean on the official page updated on 25 Jul 2025.",
        },
      },
      {
        year: "2025-yil",
        desc: {
          uz: "QozMU magistrantlari stajirovkasi doirasida xalqaro delegatsiyaga taqdimot o'tkazdi.",
          ru: "Провела презентацию для международной делегации магистрантов КазНУ.",
          en: "Represented the faculty during the KazNU master's internship program.",
        },
      },
      {
        year: "Hozirda",
        desc: {
          uz: "Asosiy qabul vaqtlari: chorshanba va payshanba kunlari soat 16:00 dan 18:00 gacha.",
          ru: "Основные часы приема: среда и четверг с 16:00 до 18:00.",
          en: "Main office hours: Wednesday-Thursday 16:00-18:00.",
        },
      },
    ],
  },
  {
    id: 2,
    name: {
      uz: "Mo'minov Sanjar Sailqulovich",
      ru: "Муминов Санжар Саилкулович",
      en: "Sanjar Sailqulovich Muminov",
    },
    role: {
      uz: "Yoshlar masalalari bo'yicha dekan muovini",
      ru: "Заместитель декана по делам молодежи",
      en: "Vice Dean for Youth Affairs",
    },
    image: "https://static.tuit.uz/uploads/1/O6fylzqhiDdN4pqQgm_70NcxzvlAjQHM.png",
    email: "s.muminov@tuit.uz",
    profileUrl: "https://tuit.uz/televizion-texnologiyalar",
    office: {
      uz: "Qabul vaqti: har kuni, 15:00-18:00",
      ru: "Часы приема: ежедневно, 15:00-18:00",
      en: "Office hours: every day, 15:00-18:00",
    },
    bio: {
      uz: "Talabalarning tashabbuslari, ijtimoiy faolligi va yoshlar siyosati bo'yicha fakultetdagi mas'ul rahbar.",
      ru: "Ответственный руководитель по молодежной политике и студенческим инициативам на факультете.",
      en: "Listed on the official faculty page as the lead for youth affairs, supporting student initiatives and community activity.",
    },
    highlights: [
      {
        uz: "Bog'lanish uchun: (+99871) 238-65-75",
        ru: "Для связи: (+99871) 238-65-75",
        en: "Official contact: (+99871) 238-65-75",
      },
      {
        uz: "Talabalar bilan ishlash bo'yicha doimiy qabul",
        ru: "Постоянный прием по вопросам работы со студентами",
        en: "Receives visitors daily from 15:00 to 18:00",
      },
      {
        uz: "Talabalar ijtimoiy loyihalari koordinatori",
        ru: "Координатор социальных студенческих проектов",
        en: "Real faculty representative for student affairs",
      },
    ],
    career: [
      {
        year: "2025-yilda",
        desc: {
          uz: "Fakultet yoshlar masalalari bo'yicha dekan muovini lavozimida tasdiqlangan.",
          ru: "Утвержден в должности заместителя декана по делам молодежи.",
          en: "Shown on the official 25 Jul 2025 page as Vice Dean for Youth Affairs.",
        },
      },
      {
        year: "Hozirda",
        desc: {
          uz: "Talaba-yoshlar tashabbuslarini qo'llab-quvvatlash va muvofiqlashtirish.",
          ru: "Поддержка и координация инициатив студентов.",
          en: "Coordinates student support and youth initiatives.",
        },
      },
    ],
  },
  {
    id: 3,
    name: {
      uz: "Tuyakov Oybek Auyezxojayevich",
      ru: "Туяков Ойбек Ауезхожаевич",
      en: "Oybek Auyezkhojayevich Tuyakov",
    },
    role: {
      uz: "O'quv ishlari bo'yicha dekan muovini",
      ru: "Заместитель декана по учебной работе",
      en: "Vice Dean of Academic Affairs",
    },
    image: "https://static.tuit.uz/uploads/1/gY26Z9QWU7kWb-p9NHzSSZwYyMUN7wxo.png",
    email: "o.tuyakov@tuit.uz",
    profileUrl: "https://tuit.uz/televizion-texnologiyalar",
    office: {
      uz: "Qabul vaqti: har kuni, 15:00-18:00",
      ru: "Часы приема: ежедневно, 15:00-18:00",
      en: "Office hours: every day, 15:00-18:00",
    },
    bio: {
      uz: "Fakultetda o'quv jarayonini tashkil etish, dars jadvallari va akademik muvofiqlashtirish bo'yicha mas'ul.",
      ru: "Ответственный за организацию учебного процесса, расписание и академическую координацию.",
      en: "Listed on the official faculty page as Vice Dean of Academic Affairs, overseeing academic coordination and study processes.",
    },
    highlights: [
      {
        uz: "Aloqa: (+99871) 238-65-75",
        ru: "Контакт: (+99871) 238-65-75",
        en: "Official contact: (+99871) 238-65-75",
      },
      {
        uz: "Akademik o'zlashtirish va dars jarayonlari nazorati",
        ru: "Контроль академической успеваемости и учебного процесса",
        en: "Supports academic tracks and learning operations",
      },
      {
        uz: "TATU o'quv bo'limi bilan yaqin hamkorlik",
        ru: "Тесное сотрудничество с учебным отделом ТУИТ",
        en: "Source: official TUIT faculty page",
      },
    ],
    career: [
      {
        year: "2025-yilda",
        desc: {
          uz: "O'quv ishlari bo'yicha dekan muovini sifatida o'quv tizimini raqamlashtirishda ishtirok etmoqda.",
          ru: "Участвует в цифровизации учебной системы в качестве замдекана.",
          en: "Shown on the official 25 Jul 2025 page as Vice Dean of Academic Affairs.",
        },
      },
      {
        year: "Hozirda",
        desc: {
          uz: "Akademik masalalar bo'yicha qabul: har kuni 15:00 dan 18:00 gacha.",
          ru: "Прием по академическим вопросам: ежедневно с 15:00 до 18:00.",
          en: "Office hours: daily 15:00-18:00, contact: o.tuyakov@tuit.uz.",
        },
      },
    ],
  },
];

export const HISTORY: HistoryItem[] = [
  {
    year: "2009-yil",
    dateLabel: {
      uz: "01.04.2009 va 04.06.2009",
      ru: "01.04.2009 и 04.06.2009",
      en: "Apr 1, 2009 and Jun 4, 2009",
    },
    title: {
      uz: "Fakultetning rasmiy tashkil etilishi",
      ru: "Официальное создание факультета",
      en: "Official Faculty Launch",
    },
    desc: {
      uz: "O'zbekiston Respublikasi Prezidentining PQ-1088 va PQ-1123 sonli qarorlari asosida TATUda Televizion texnologiyalar fakulteti faoliyati yo'lga qo'yildi.",
      ru: "На основании постановлений Президента PQ-1088 и PQ-1123 в ТУИТ был создан факультет телевизионных технологий.",
      en: "TUIT launched the Television Technologies Faculty under Presidential resolutions PQ-1088 and PQ-1123.",
    },
    facts: [
      {
        uz: "2009-yildan boshlab maxsus sirtqi bo'lim ham ish boshlagan.",
        ru: "С 2009 года также было открыто специальное заочное отделение.",
        en: "A special external study format also started in 2009.",
      },
      {
        uz: "Asosiy maqsad – O'zbekiston Milliy teleradiokompaniyasi uchun kadrlar tayyorlash.",
        ru: "Основная цель – подготовка кадров для НТРК Узбекистана.",
        en: "Its mission was to train specialists for Uzbekistan's National TV and Radio Company.",
      },
    ],
    metricLabel: {
      uz: "Huquqiy asoslar",
      ru: "Правовые основы",
      en: "Founding resolutions",
    },
    metricValue: "2 ta qaror",
    sourceLabel: {
      uz: "TATU fakultet sahifasi",
      ru: "Страница факультета ТУИТ",
      en: "TUIT faculty page",
    },
    sourceUrl: "https://tuit.uz/televizion-texnologiyalar",
  },
  {
    year: "2011-yil",
    dateLabel: {
      uz: "01.08.2011",
      ru: "01.08.2011",
      en: "Aug 1, 2011",
    },
    title: {
      uz: "Mutaxassislik kafedralarining ochilishi",
      ru: "Открытие профильных кафедр",
      en: "Specialized Departments Opened",
    },
    desc: {
      uz: "2011-yil avgust oyida 'Televideniye, radioeshittirish studiyalari va jihozlari' kafedrasi tashkil etilib, keyinchalik zamonaviy nomlarga o'zgartirildi.",
      ru: "В августе 2011 года была создана кафедра 'Телевизионные, радиовещательные студии и оборудование'.",
      en: "From Aug 1, 2011, the 'Television and Radio Broadcasting Studios and Equipment' department opened.",
    },
    facts: [
      {
        uz: "Kafedra O'zMTRK bilan yaqin korporativ hamkorlikda mutaxassislar tayyorlaydi.",
        ru: "Кафедра готовит специалистов в тесном сотрудничестве с НТРК.",
        en: "The department trains specialists in cooperation with the National Broadcaster of Uzbekistan.",
      },
      {
        uz: "Bitiruvchilar soni yiliga o'rtacha 60-70 nafarni tashkil etadi.",
        ru: "Количество выпускников составляет в среднем 60-70 человек в год.",
        en: "Around 60-70 bachelor's students graduate each year.",
      },
    ],
    metricLabel: {
      uz: "Tashkil etilgan sana",
      ru: "Дата создания",
      en: "Launch date",
    },
    metricValue: "Avgust",
    sourceLabel: {
      uz: "Telestudiya tizimlari kafedrasi",
      ru: "Кафедра систем телестудии",
      en: "Television Studio Systems and Applications",
    },
    sourceUrl: "https://tuit.uz/telestudia-tizimlari-va-ilovalari",
  },
  {
    year: "2013-yil",
    dateLabel: {
      uz: "28.06.2013",
      ru: "28.06.2013",
      en: "Jun 28, 2013",
    },
    title: {
      uz: "Audiovizual texnologiyalar yo'nalishining shakllanishi",
      ru: "Формирование аудиовизуального направления",
      en: "Audiovisual Track Formation",
    },
    desc: {
      uz: "Vazirlar Mahkamasining 188-sonli qarori bilan universitet tuzilmasi optimallashtirildi va audiovizual yo'nalishlar rivojlantirildi.",
      ru: "Постановлением Кабмина №188 была оптимизирована структура университета.",
      en: "Following Cabinet Resolution No. 188, the university structure was updated.",
    },
    facts: [
      {
        uz: "Kompyuter grafikasi va dizayn yo'nalishi 2011-yildan rivojlantirila boshlandi.",
        ru: "Направление компьютерной графики начало развиваться с 2011 года.",
        en: "The 'Computer Graphics and Design' track started in 2011.",
      },
      {
        uz: "Bugungi kunga qadar ushbu sohada 700 dan ortiq mutaxassis tayyorlandi.",
        ru: "На сегодняшний день подготовлено более 700 специалистов.",
        en: "More than 700 bachelor's graduates prepared in this field.",
      },
    ],
    metricLabel: {
      uz: "Normativ hujjat",
      ru: "Нормативный документ",
      en: "Key resolution",
    },
    metricValue: "VMQ-188",
    sourceLabel: {
      uz: "Audiovizual texnologiyalar",
      ru: "Аудиовизуальные технологии",
      en: "Audiovisual Technologies Department",
    },
    sourceUrl: "https://tuit.uz/de/audiovizual-texnologiyalar",
  },
  {
    year: "2023-yil",
    dateLabel: {
      uz: "15.09.2023",
      ru: "15.09.2023",
      en: "Sep 15, 2023",
    },
    title: {
      uz: "Kafedralarning birlashtirilishi",
      ru: "Объединение кафедр",
      en: "Departments Consolidated",
    },
    desc: {
      uz: "Akademik salohiyatni oshirish maqsadida audiovizual va telestudiya tizimlari kafedralari yagona 'Televizion va media texnologiyalar' kafedrasiga birlashtirildi.",
      ru: "В целях повышения потенциала кафедры были объединены в единую кафедру 'Телевизионные и медиа технологии'.",
      en: "Departments merged into the new 'Television and Media Technologies' department.",
    },
    facts: [
      {
        uz: "Rasmiy buyruq raqami: 573-01.",
        ru: "Номер официального приказа: 573-01.",
        en: "Order number: 573-01.",
      },
      {
        uz: "Bu bosqich fakultetning media va studiya yo'nalishlarini yagona klasterga birlashtirdi.",
        ru: "Этот этап объединил медийные и студийные направления в единый кластер.",
        en: "This step brought media and studio tracks into one structure.",
      },
    ],
    metricLabel: {
      uz: "Kafedralar optimallashuvi",
      ru: "Оптимизация кафедр",
      en: "Merged departments",
    },
    metricValue: "2 tadan 1 taga",
    sourceLabel: {
      uz: "TATU rasmiy ma'lumotlari",
      ru: "Официальные данные ТУИТ",
      en: "Television Studio Systems page",
    },
    sourceUrl: "https://tuit.uz/telestudia-tizimlari-va-ilovalari",
  },
  {
    year: "2025-yil",
    dateLabel: {
      uz: "25.07.2025",
      ru: "25.07.2025",
      en: "Jul 25, 2025",
    },
    title: {
      uz: "Zamonaviy akademik tuzilma",
      ru: "Современная академическая структура",
      en: "Current Academic Structure",
    },
    desc: {
      uz: "Hozirgi kunda fakultet tarkibida 2 ta bakalavriat va 5 ta magistratura yo'nalishi mavjud bo'lib, ular zamonaviy media sanoati talablariga to'liq javob beradi.",
      ru: "В настоящее время на факультете действуют 2 бакалаврские и 5 магистерских программ.",
      en: "The faculty currently lists 2 bachelor's and 5 master's programs.",
    },
    facts: [
      {
        uz: "Bakalavriat kodi: 60611100 – Televizion texnologiyalar.",
        ru: "Код бакалавриата: 60611100 – Телевизионные технологии.",
        en: "Bachelor code: 60611100.",
      },
      {
        uz: "Ma'lumotlar oxirgi marta 2025-yilning 25-iyulida yangilangan.",
        ru: "Данные в последний раз обновлены 25 июля 2025 года.",
        en: "Last updated on 25 Jul 2025.",
      },
    ],
    metricLabel: {
      uz: "Jami ta'lim yo'nalishlari",
      ru: "Всего учебных направлений",
      en: "Current programs",
    },
    metricValue: "7 ta",
    sourceLabel: {
      uz: "Fakultet rasmiy sahifasi",
      ru: "Официальная страница факультета",
      en: "Current faculty page",
    },
    sourceUrl: "https://tuit.uz/televizion-texnologiyalar",
  },
];


export const MISSIONS = [
  {
    icon: "fas fa-rocket",
    title: { uz: "Innovatsiya", ru: "Инновации", en: "Innovation" },
    desc: {
      uz: "Eng so'nggi texnologiyalarni amaliyotga joriy etish.",
      ru: "Внедрение новейших технологий в практику.",
      en: "Implementing cutting-edge technologies into practice.",
    },
  },
  {
    icon: "fas fa-users",
    title: { uz: "Liderlik", ru: "Лидерство", en: "Leadership" },
    desc: {
      uz: "Soha mutaxassislarini xalqaro miqyosda tayyorlash.",
      ru: "Подготовка специалистов мирового уровня.",
      en: "Preparing world-class industry specialists.",
    },
  },
  {
    icon: "fas fa-lightbulb",
    title: { uz: "Kreativlik", ru: "Креативность", en: "Creativity" },
    desc: {
      uz: "Media va muhandislik uyg'unligini yaratish.",
      ru: "Создание гармонии медиа и инженерии.",
      en: "Creating harmony between media and engineering.",
    },
  },
];

export const TRANSLATIONS = {
  uz: {
    welcome: "Televizion texnologiyalari fakulteti",
    heroSubtitle: "Zamonaviy media texnologiyalari – kelajak poydevori.",
    explore: "Tajribani boshlash",
    aiAssistant: "AI Yordamchi",
    askAi: "Fakultet haqida savol bering...",
    staffTitle: "Bizning Jamoa",
    staffSubtitle: "Kelajak mutaxassislarini tayyorlayotgan professorlarimiz.",
    contactUs: "ALOQA",
    nameLabel: "Ismingiz",
    emailLabel: "Elektron pochta",
    messageLabel: "Xabaringiz",
    submit: "Yuborish",
    footerAbout:
      "Televizion texnologiyalari fakulteti - bu innovatsiyalar, media va muhandislik uyg'unligidir.",
    rights: "Barcha huquqlar himoyalangan.",
    scrolldown: "Pastga skroll qiling",
    stats_students: "Talabalar",
    stats_labs: "Laboratoriyalar",
    stats_projects: "Loyihalar",
    whatIsTitle: "Televizion texnologiyalar nima?",
    whatIsDesc:
      "Bu zamonaviy media, televideniye va raqamli axborot texnologiyalari sohasida yuqori malakali mutaxassislar tayyorlovchi ta’lim yo‘nalishidir. Fakultetda talabalar video ishlab chiqarish, signal uzatish, multimedia tizimlari va raqamli kontent yaratish bo‘yicha chuqur bilim hamda amaliy ko‘nikmalarga ega bo‘ladilar.",
    vrarTitle: "VR / AR imkoniyatlari",
    vrarDesc:
      "Virtual va kengaytirilgan voqelik — o'quv jarayonimizning ajralmas qismidir. Talabalarimiz murakkab muhandislik tizimlarini virtual muhitda simulyatsiya qilish imkoniyatiga ega.",
    historyTitle: "Fakultet tarixi",
    missionsTitle: "Bizning maqsadlarimiz",
    lab360Title: "360° virtual tur",
    vrStudioTitle: "VR studiya",
    vrStudioDesc: "Virtual laboratoriya xonasini kashf qiling.",
    arCamTitle: "AR kamera",
    arCamDesc: "Haqiqiy muhitga 3D modellarni joylashtiring.",
    pano360Title: "360° videopleyer",
    pano360Desc: "Panorama videolarni tomosha qiling.",
    virtualTourBtn: "Virtual ekskursiya",
    programsTitle: "Ta'lim yo'nalishlari",
    programsSubtitle:
      "TATU rasmiy sahifasidagi bakalavriat va magistratura yo'nalishlari asosida yangilangan ro'yxat.",
    viewProgram: "Batafsil ma'lumot",
    closeProgram: "Yopish",
    projectsTitle: "Loyihalar va talabalar ishlari",
    projectsSubtitle:
      "Iste'dodli talabalarimiz tomonidan yaratilgan innovatsion yechimlar.",
    caseStudyTitle: "Keys tadqiqoti",
    challenge: "Muammo",
    solution: "Yechim",
    outcome: "Natija",
    gallery3D: "3D galereya",
    newsTitle: "Yangiliklar va tadbirlar",
    newsSubtitle:
      "Fakultetimiz hayotidagi eng so'nggi voqealar va innovatsiyalar.",
    contactTitle: "Aloqa va manzil",
    contactSubtitle: "Biz bilan bog'laning yoki kampusga tashrif buyuring.",
    campusModelTitle: "3D kampus markazi",
    readMore: "Batafsil",
    address: "Manzil: Toshkent sh., Amir Temur ko'chasi, 108",
    phone: "Tel: +998 71 238 65 47",
    email: "Email: info@tv-tech.uz",
  },
  ru: {
    welcome: "ФАКУЛЬТЕТ ТЕЛЕВИЗИОННЫХ ТЕХНОЛОГИЙ",
    heroSubtitle: "Современные медиатехнологии — фундамент будущего.",
    explore: "Начать опыт",
    aiAssistant: "AI Помощник",
    askAi: "Задайте вопрос о факультете...",
    staffTitle: "Наша команда",
    staffSubtitle: "Наши профессора, готовящие специалистов будущего.",
    contactUs: "КОНТАКТЫ",
    nameLabel: "Ваше имя",
    emailLabel: "Электронная почта",
    messageLabel: "Ваше сообщение",
    submit: "Отправить",
    footerAbout:
      "Факультет телевизионных технологий — это сочетание инноваций, медиа и инженерии.",
    rights: "Все права защищены.",
    scrolldown: "Листайте вниз",
    stats_students: "Студентов",
    stats_labs: "Лабораторий",
    stats_projects: "Проектов",
    whatIsTitle: "Что такое ТВ Технологии?",
    whatIsDesc:
      "Направление образования, готовящее высококвалифицированных специалистов в области современных медиа, телевидения и цифровых информационных технологий. На факультете студенты получают глубокие знания и практические навыки в области видеопроизводства, передачи сигналов, мультимедийных систем и создания цифрового контента.",
    vrarTitle: "Возможности VR / AR",
    vrarDesc:
      "Виртуальная и дополненная реальность — неотъемлемая часть нашего учебного процесса. Наши студенты имеют возможность моделировать сложные инженерные системы в виртуальной среде.",
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
    programsSubtitle:
      "Обновленный список на основе официальных бакалаврских и магистерских программ ТУИТ.",
    viewProgram: "Подробнее",
    closeProgram: "Закрыть",
    projectsTitle: "Проекты и работы студентов",
    projectsSubtitle:
      "Инновационные решения, созданные нашими талантливыми студентами.",
    caseStudyTitle: "Кейс-стади",
    challenge: "Проблема",
    solution: "Решение",
    outcome: "Результат",
    gallery3D: "3D Галерея",
    newsTitle: "Новости и мероприятия",
    newsSubtitle: "Последние события и инновации в жизни нашего факультета.",
    contactTitle: "Связь и адрес",
    contactSubtitle: "Свяжитесь с нами или посетите наш кампус.",
    campusModelTitle: "3D Модель Кампуса",
    readMore: "Подробнее",
    address: "Адрес: г. Ташкент, ул. Амира Темура, 108",
    phone: "Тел: +998 71 238 65 47",
    email: "Email: info@tv-tech.uz",
  },
  en: {
    welcome: "FACULTY OF TELEVISION TECHNOLOGIES",
    heroSubtitle: "Modern media technologies are the foundation of the future.",
    explore: "Enter Experience",
    aiAssistant: "AI Assistant",
    askAi: "Ask about the faculty...",
    staffTitle: "Our Team",
    staffSubtitle: "Our professors who shape the experts of tomorrow.",
    contactUs: "CONTACT",
    nameLabel: "Your Name",
    emailLabel: "Email Address",
    messageLabel: "Your Message",
    submit: "Submit",
    footerAbout:
      "The Faculty of Television Technologies is a fusion of innovation, media, and engineering.",
    rights: "All rights reserved.",
    scrolldown: "Scroll down",
    stats_students: "Students",
    stats_labs: "Laboratories",
    stats_projects: "Projects",
    whatIsTitle: "What is TV Technology?",
    whatIsDesc:
      "Is a field of education that trains highly qualified specialists in the field of modern media, television, and digital information technologies. At the faculty, students will gain in-depth knowledge and practical skills in video production, signal transmission, multimedia systems, and digital content creation.",
    vrarTitle: "VR / AR Capabilities",
    vrarDesc:
      "Virtual and augmented reality are an integral part of our educational process. Our students have the opportunity to simulate complex engineering systems in a virtual environment.",
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
    programsSubtitle:
      "Updated list based on official TUIT bachelor's and master's programs.",
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
    newsSubtitle:
      "The latest events and innovations in the life of our faculty.",
    contactTitle: "Contact & Address",
    contactSubtitle: "Get in touch with us or visit our campus.",
    campusModelTitle: "3D Campus Hub",
    readMore: "Read More",
    address: "Address: Tashkent city, Amir Temur str., 108",
    phone: "Tel: +998 71 238 65 47",
    email: "Email: info@tv-tech.uz",
  },
};
