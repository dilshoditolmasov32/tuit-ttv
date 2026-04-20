# TV-Tech VR/AR Platformasi - Asosiy Loyiha Hujjati

Ushbu hujjat Muhammad al-Xorazmiy nomidagi Toshkent Axborot Texnologiyalari Universiteti (TATU) "Televizion texnologiyalar" fakulteti uchun ishlab chiqilgan interaktiv VR/AR va 3D ta'lim platformasi haqida batafsil ma'lumot beradi. Hujjat loyiha uchun rasmiy (Word formatida) hujjat, bitiruv malakaviy ishi yoki kurs ishi yozishda tayanch material sifatida foydalanish uchun maxsus tuzilgan.

## 1. Kirish
TV-Tech VR/AR platformasi – bu virtual (VR) va to'ldirilgan borliq (AR) texnologiyalarini zamonaviy veb-texnologiyalar bilan birlashtirib, televizion va media texnologiyalari yo'nalishida ta'lim sifatini oshirishga qaratilgan innovatsion ta'lim platformasi hisoblanadi. Dastur talabalarga murakkab texnologik jarayonlarni, server uskunalarini va telekommunikatsiya laboratoriyalarini 3D muhitda, interaktiv tarzda o'rganish imkonini beradi.

## 2. Loyiha Maqsadi va Vazifalari

**Loyiha maqsadi:** 
Ta'lim jarayonini raqamlashtirish, talabalarga nazariy bilimlarni vizual va amaliy tarzda mustahkamlashlari uchun zamonaviy 3D, VR va AR texnologiyalariga asoslangan xavfsiz va qulay interaktiv muhitni taqdim etish.

**Asosiy vazifalar:**
* Interaktiv 3D laboratoriyalar (VR Lab) yaratish va uni simulyatsiya qilish.
* Haqiqiy dunyo bilan integratsiyalashgan to'ldirilgan borliq (AR) tizimlarini ishlab chiqish.
* Foydalanuvchilarga qulay bo'lgan ko'p tilli (O'zbek, Rus, Ingliz) axborot muhitini ta'minlash.
* Ta'lim modullari (o'quv dasturlari, ma'ruzalar, videolar, testlar) hamda talabalar loyihalarini namoyish etuvchi markazlashgan tizimni integratsiya qilish.

## 3. Asosiy Texnologiyalar (Tech Stack)
Loyihani dasturlash va arxitekturasini qurishda so'nggi avlod veb va 3D grafik texnologiyalaridan foydalanilgan:
* **Frontend Framework:** React 19.2 (TypeScript bilan) - interfeysni modulli, tushunarli va tezkor ishlashini ta'minlash uchun.
* **Build Tool (Yig'uvchi):** Vite 6.2 - loyihani tezkor yig'ish va ishlab chiqarish uchun optimallashtirish maqsadida.
* **3D Grafika va Animatsiya:** Three.js, @react-three/fiber, @react-three/drei - brauzerda murakkab 3D sahnalar, yorug'lik effektlari va modellarni yuqori sifatda render (chizish) qilish uchun.
* **Kinetik Animatsiyalar:** Framer Motion - komponentlar orasidagi silliq o'tishlar va zamonaviy UI animatsiyalari uchun.
* **Sun'iy Intellekt (AI):** Google Gemini API - ta'lim jarayonida aqlli yordamchi funksiyalarini taqdim etish uchun (@google/genai moduli orqali).
* **Styling (Dizayn):** Zamonaviy TailwindCSS freymvorki va maxsus CSS arxitekturasi.

## 4. Tizim Arxitekturasi va Asosiy Modullar

Loyiha mustaqil va o'zaro bog'liq ishlovchi bir nechta modullardan tashkil topgan:

### 4.1. VR Moduli (Virtual Reality - Virtual Borliq)
Bu modul talabalarga 3D o'lchamli laboratoriyada vizual va interaktiv mashg'ulotlar olib borish imkonini beradi.
* **Texnik xususiyatlari:** 3D sahna (Three.js asosida) yaratilgan. Foydalanuvchi klaviatura (W/A/S/D tugmalari) va sichqoncha yordamida erkin harakatlana oladi.
* **Interaktiv Obyektlar:** Server tizimlari (Server Racks), tarmoq markazlari (Network Hub) va Markaziy protsessor (Core Unit) kabi obyektlar dasturlashtirilgan. Obyekt ustiga bosilganda o'ziga xos animatsiya ishga tushadi va axborot paneli (Info Panel) da obyektning parametrlari (nomi, X/Y/Z koordinatalari, xususiyatlari) namoyish etiladi.
* **Dasturiy mexanika:** Obyektlarni aniqlash va tanlash uchun Raycasting (nurlarni tortish) texnologiyasi ishlatilgan. Zarrachalar (particles) va dinamik yorug'lik effektlari tizim realizmini oshiradi.

### 4.2. AR Moduli (Augmented Reality - To'ldirilgan Borliq)
Kompyuter yoki mobil qurilma kamerasi orqali real dunyo ustiga 3D obyektlarni tasvirlashga mo'ljallangan modul.
* **Texnik xususiyatlari:** Kamera oqimi (HTMLMediaStream API) yordamida obyektlar vizualizatsiyasi. Markerlarni aniqlash simulyatsiyasi (Edge detection).
* **Boshqaruv:** Sensorli ekran (touch) imo-ishoralari (bir barmoq bilan aylantirish, ikki barmoq bilan masshtablash/zoom) va sichqoncha yordamida obyektni to'liq boshqarish imkoniyati qo'shilgan.
* **Monitoring:** Tizim ishlash tezligini (FPS) va marker signali kuchini (Confidence) jonli kuzatuvchi maxsus Performance Monitoring paneli ishlab chiqilgan.

### 4.3. 360° Panoramik Tur moduli
Talabalarga TUIT kampusining infratuzilmasi bilan masofadan tanishish imkonini beruvchi virtual sayohat (Virtual Tour) mexanizmi (joriy qilinish bosqichida). Foydalanuvchi 360 gradusda atrofni kuzatib, vizual tajribaga ega bo'ladi.

## 5. UI/UX Dizayn va Interfeys Yechimlari
Platforma dizayni so'nggi trendlardan hisoblangan "Glassmorphism" (oynasimon effektlar) uslubida yaratilgan. Bu foydalanuvchiga zamonaviy va premium dastur hissini beradi.
* **Dizayn konsepsiyasi (Dark Mode):** Asosiy interfeys qorong'i fonda, yorqin neon (zangori, ko'k, magenta) ranglar aksenti bilan ishlangan.
* **Tipografiya:** O'qishga qulay bo'lgan, zamonaviy "Space Grotesk" va "Plus Jakarta Sans" shriftlaridan foydalanilgan.
* **Moslashuvchanlik (Responsive):** Dastur turli xil ekran o'lchamlariga (Shaxsiy kompyuterlar, noutbuklar, planshet va mobil telefonlar) avtomatik moslashadi.

## 6. Loyihaning Afzalliklari va Natijalari
1. **Yuqori ishlash ko'rsatkichi (Performance):** 3D grafikalar va zarrachalar soni qat'iy optimallashtirilgan bo'lib, tizim o'rtacha 45-60 FPS tezlikda barqaror ishlaydi. Resurslar (Memory overhead) minimal darajada sarflanadi.
2. **Kengaytiriluvchi Arxitektura:** TypeScript yordamida yozilgan qat'iy turlangan (Type-Safe) kod bazasi kelajakda haqiqiy ARToolkit, WebXR va yangi 3D modellarni osongina qo'shish imkonini beradi.
3. **Ta'limdagi Samara:** Murakkab uskunalarini xavfsiz va tushunarli virtual muhitda o'rganish amaliyot va nazariyaning mukammal uyg'unligini ta'minlaydi.

## 7. O'rnatish va Ishga Tushirish Qoidalari
Loyihani ishga tushirish uchun quyidagi amallar ketma-ketligi bajariladi:

**Talab etiladigan dasturlar:** Node.js (16+ versiya) va npm/yarn paket menejeri.

1. **Repozitoriyni yuklab olish:**
   `git clone <repository-url>`
2. **Kutubxonalarni o'rnatish:**
   `npm install`
3. **Muhit o'zgaruvchilarini sozlash:**
   Loyiha ildiz papkasida `.env.local` faylini yaratish va Gemini API kalitini kiritish:
   `GEMINI_API_KEY=sizning_api_kalitingiz`
4. **Dasturni test (development) rejimida ishga tushirish:**
   `npm run dev`
5. **Dasturni tayyor (production) holatiga yig'ish:**
   `npm run build`

## 8. Xulosa
TV-Tech VR/AR platformasi – bu ta'lim jarayonini raqamlashtirish, interaktiv ta'limni keng joriy etish yo'lidagi muvaffaqiyatli amaliy loyihadir. Dastur zamonaviy React, TypeScript va Three.js ekotizimlarini o'zida mukammal birlashtirgan holda, axborot texnologiyalari va televideniye yo'nalishidagi talabalar uchun ishonchli, tezkor va foydali ta'lim muhitini yaratib bera oladi.
