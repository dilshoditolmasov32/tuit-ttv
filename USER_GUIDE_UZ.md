# 🎮 VR/AR Platform - Foydalanuvchi Qo'llanmasi

## 📋 Mundarija

1. [VR Module](#vr-module)
2. [AR Module](#ar-module)
3. [360° Tour](#360-tour)
4. [Boshqaruv](#boshqaruv)
5. [Xatolarni hal qilish](#xatolarni-hal-qilish)

---

## 🥽 VR Module

### Nima?

VR Module - tahfif 3D muhitda o'rganish muhiti. Shuning uchun kompyuter yoki mobil qurilmaning kamerasidan foydalanmasdan kompyuter ekranida 3D olamni ko'rishingiz mumkin.

### Boshlanish:

1. **Home** sahifasiga boring
2. **"VR Lab"** tugmasini bosing
3. **"🥽 VR Laboratoriyasi"** kartasini tanlang
4. **"Kirish"** tugmasini bosing

### Ishlash:

#### 3D Muhitni Tahlil Qilish:

- **Sichqoncha Drag** - 3D olamni atrofga aylantirishish
- **Scroll** - Zoom in/out (yaqin-uzoq)
- **W** - Oldinga harakat
- **A** - Chapga harakat
- **D** - O'ngga harakat
- **S** - Orqaga harakat
- **Space (Bo'sh Joy)** - Yuqoriga uchish
- **Ctrl** - Pastga tushish

#### Objektlarni Tanlash:

1. Sichqoncha bilan 3D object'ga **click qiling**
2. Object bozora chiqadi (sariq rangi bilan highlight bo'ladi)
3. **Left panel'da** object haqida ma'lumot chiqadi:
   - Object nomi
   - Rasm/Logo ID
   - Koordinatalari (X, Y, Z)
   - To'liq description

#### Interaktiv Objektlar:

| Object        | Rang       | Vazifasi       |
| ------------- | ---------- | -------------- |
| Server Rack 1 | 🔵 Ko'k    | Server markazi |
| Server Rack 2 | 🟢 Yashil  | 5G tarqatuvchi |
| Core Unit     | 🟠 Sariq   | Platform yuzi  |
| Network Hub   | 🟣 Magenta | Tarmoq markazi |

### UI Elementlari:

**Left Top - Info Panel:**

- Selected object nomi
- Detailed ma'lumot
- Koordinatalar
- Close (X) tugmasi

**Right Top - Stats:**

- Tanlangan object nomi
- Umumiy obstacle soni
- Live status indicator

**Left Bottom - Control Tips:**

- Barcha boshqaruv qisqartmalari
- Haqida bilgisi

**Right Bottom - Back Button:**

- VR dan chiqish (Mode selection'ga qaytish)

---

## 📱 AR Module

### Nima?

AR Module - **Augmented Reality** - kamera orqali real dunyoga 3D modellaring qo'shish mumkinligini beradi.

### Boshlanish:

1. **Home** sahifasiga boring
2. **"VR Lab"** tugmasini bosing
3. **"📱 AR Markeri"** kartasini tanlang
4. **"Kirish"** tugmasini bosing
5. **Kamera ruxsatini bering** (browser so'rasa)

### Ishlash:

#### Kamera Sozlamasi:

- Birinchi bor **"INITIALIZING..."** (Initsializatsiya) ko'rsatilishi mumkin
- Kamera yuklanishi uchun **30 soniya** kutib turing
- **"ACTIVE"** status chiqsa - tayyor!

#### Marker Deteksiyasi:

1. Ordinatalar ekranda **4 ta corner point** ko'rsatiladi
2. Marker aniqlanganida **cyan (ko'k-yashil) rang** tez chaqamaydi
3. **Confidence %** chiqadi (85-100% yaxshi)
4. **3D animated cube** chiqadi marker ustiga

#### 3D Model Boshqaruvi:

- **Desktop (Sichqoncha):**
  - **Drag qiling** - Model aylanadi (rotatsiya)
  - **Scroll** - Katta-kichik qilish (zoom)
  - **Double click** - Qayta o'rnatish

- **Mobile (Touch):**
  - **1 barmoq drag** - Rotatsiya
  - **2 barmoq pinch** - Zoom
  - **Shukunaka ko'proq vaqt** - Selection

#### Object Tanlash:

1. **Left top panel'da** - 3 ta object ro'yxati:
   - TV-Campus 3D Model
   - VR Lab Equipment
   - Broadcasting Studio
2. Birini tanlang - ma'lumot chiqadi
3. 3D model model o'zgaradi

### AR Performance:

**Right Top Stats Panel:**
| O'lchov | Nimani Jo'natadi |
|----------|-----------------|
| FPS | Frames Per Second (60+ yaxshi) |
| Signal | Marker detection % (85%+ optimal) |
| Objects | Jami AR model soni |
| Status | Connection holati |

---

## 🎬 360° Tour

### Nima?

Virtual tour - fakult kampusining panoramik videosi. Shuning uchun hamma tomondan ko'rishishingiz mumkin.

### Status:

⚠️ **Placeholder** - Hozir boshlang'ich mexanizm. Real video yuqori yuklanadi.

### Qanday Ishlaydi:

- Video dastlabki yuklanadi
- Sichqoncha bilan atrofga qarab ko'rishishingiz mumkin
- Scroll yordamida zoom

---

## 🎮 Boshqaruv Qisqartmalari

### VR Module Boshqaruvi:

```
W       → Oldinga harakat
A       → Chapga harakat
S       → Orqaga harakat
D       → O'ngga harakat
SPACE   → Yuqoriga uchish
CTRL    → Pastga tushish
CLICK   → Objektni tanlash
DRAG    → Kamerani aylantirish
SCROLL  → Zoom in/out
```

### AR Module Boshqaruvi:

```
DRAG       → Model rotatsiyasi
SCROLL     → Model zoom
PINCH      → Model zoom (mobile)
CLICK      → Object selector
```

---

## 🛠️ Xatolarni Hal Qilish

### Muammo: VR Module ishlam qolmoqda

**Tekshiringiz:**

1. JavaScript fontlar yoqilganmi?
2. Brauzer hardware acceleration qo'shilganmi? (Chrome/Firefox)
3. Terminalda xato varbarni o'qishing

**Yechim:**

```bash
# Development serverini qayta boshlang
npm run dev

# Keshni tozalashtiring
npm cache clean --force
npm install
```

### Muammo: Kamera AR'da ishlam qotgan

**Tekshiringiz:**

1. Brauzerga kamera ruxsati berilganmi?
2. Boshqa sayt camerani ishlatganmi?
3. HTTPS (localhost'da ok) yoqilganmi?

**Chrome'da:**

- Settings → Privacy and Security → Camera
- Saytni ruxsat qilishga o'zgartirinig

**Firefox'da:**

- Preferences → Privacy → Permissions → Camera
- Saytni "Allow" qiling

### Muammo: Performance sekin

**Yechim:**

1. Particle count kamaytiring `vrUtils.ts`'da (800 → 400)
2. Raycasting interval o'zgartiring (16ms → 33ms)
3. Browser tab boshqalarining ochilganligini tekshiring

### Muammo: 3D Model chiqmayapti

**Yechim:**

1. Keshni tozalashtiring (F12 → Network → Disable cache, reload)
2. Console'da xato varalarni tekshiring (F12)
3. Server running ekanligi tekshiring

---

## 📊 Texnik Ma'lumotlar

### Minimal Talablar:

- **OS**: Windows 7+, macOS 10.12+, Linux
- **Brauzer**: Chrome 60+, Firefox 55+, Safari 12+
- **Ram**: 2GB (tavsiya 4GB+)
- **Internet**: 1Mbps (video uchun 10Mbps tavsiya)

### Optimal Talablar:

- **OS**: Windows 10+, macOS Big Sur+
- **Brauzer**: Chrome/Edge 90+, Firefox 88+
- **GPU**: Dedicated graphics card
- **Ram**: 8GB+
- **Internet**: 10Mbps+

### Performance Metrics:

- VR FPS: 30-60 FPS
- AR FPS: 24-60 FPS
- Latency: <100ms
- Load Time: <5 seconds

---

## 🚀 Tips va Fokuslar

### VR'da Yaxshi Tajriba Uchun:

1. ✅ Full screen'da ekran
2. ✅ Sichqoncha va klaviatura ishlatuvchi
3. ✅ Yuqori resolution ko'rsatgichi
4. ✅ Xonada ochiqu joys
5. ✅ Kuchli internetga ulanish

### AR'da Yaxshi Tajriba Uchun:

1. ✅ Yogi fluorestali yo'rg'alashli jey
2. ✅ Kamera objekti (telefon/tablet)
3. ✅ Qirib shedora yo'q
4. ✅ AR marker'ning chuqur qo'llanma
5. ✅ Tez internet

---

## 📞 Yordam va Bog'lanish

**Xator va takliflar uchun:**

- GitHub Issues orqali
- Email: support@tuit.edu.uz
- Telefon: +998 (71) 209-56-33

**Dokumentatsiya:**

- [VR_AR_IMPLEMENTATION.md](./VR_AR_IMPLEMENTATION.md)
- [README.md](./README.md)

---

**Oxirgi Yangilanish**: 2026-04-06
**Versiya**: 1.0.0
**Status**: ✅ Production Ready

---

_Rahmat TV-Tech platformasidan foydalanganingiz uchun! 🎉_
