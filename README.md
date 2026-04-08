# TV-Tech VR/AR Platform

<div align="center">
  <img src="https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=1200" alt="TV-Tech VR/AR Platform Banner" width="800"/>
</div>

## 📋 Description

An interactive VR/AR and 3D animation educational platform for the Faculty of Television Technologies at Tashkent University of Information Technologies (TUIT). This platform provides immersive learning experiences combining virtual reality, augmented reality, and modern web technologies to enhance education in television and media technologies.

**Key Features:**

- 🌐 **Multilingual Support**: Uzbek, Russian, and English
- 🎓 **Educational Modules**: Programs, Lectures, Videos, Tests
- 🏗️ **3D Campus Environments**: Virtual campus exploration
- 📱 **AR Integration**: Augmented reality educational content
- 📰 **News & Updates**: Latest faculty news and events
- 🎯 **Student Projects**: Showcase of VR/AR student works
- 🔬 **VR Lab**: Practical VR laboratory experiences

## 🚀 Tech Stack

- **Frontend Framework**: React 19.2.4 with TypeScript
- **Build Tool**: Vite 6.2.0
- **3D Graphics**: Three.js with @react-three/fiber and @react-three/drei
- **Routing**: React Router DOM 7.13.0
- **Animations**: Framer Motion 12.30.0
- **AI Integration**: Google Gemini API (@google/genai 1.39.0)
- **Styling**: CSS with modern web standards

## 📦 Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tv-tech-vr_ar-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your Gemini API key:

   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Build for production**

   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🏗️ Project Structure

```
tv-tech-vr_ar-platform/
├── public/
├── src/
│   ├── components/
│   │   ├── Scene3D.tsx          # 3D scene component
│   │   └── ScrollTop.tsx        # Scroll to top utility
│   ├── pages/
│   │   ├── Home.tsx             # Landing page
│   │   ├── About.tsx            # Faculty information
│   │   ├── Programs.tsx         # Academic programs
│   │   ├── Projects.tsx         # Student projects showcase
│   │   ├── News.tsx             # Faculty news
│   │   ├── Contact.tsx          # Contact information
│   │   ├── Lectures.tsx         # Educational lectures
│   │   ├── Videos.tsx           # Video content
│   │   ├── Practice.tsx         # VR Lab
│   │   └── Tests.tsx            # Assessment tools
│   ├── services/
│   │   └── gemini.ts            # Gemini AI integration
│   ├── App.tsx                  # Main application component
│   ├── constants.tsx            # Application constants and data
│   ├── types.ts                 # TypeScript type definitions
│   └── index.tsx                # Application entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎯 Features

### Core Functionality

- **Immersive 3D Environments**: Explore virtual campus and laboratory spaces
- **AR Educational Content**: Interactive augmented reality learning modules
- **Multilingual Interface**: Support for Uzbek, Russian, and English languages
- **Responsive Design**: Optimized for desktop and mobile devices
- **AI-Powered Features**: Integration with Google Gemini for enhanced learning

### Educational Modules

- **Programs**: Detailed information about academic directions
- **Lectures**: Interactive lecture materials
- **Videos**: Educational video content
- **Tests**: Assessment and quiz systems
- **VR Lab**: Hands-on virtual reality experiences

### Student Showcase

- **Projects Gallery**: Display of student VR/AR projects
- **Case Studies**: Detailed project breakdowns and outcomes
- **News Feed**: Faculty announcements and events

## 🔧 Configuration

### Environment Variables

- `GEMINI_API_KEY`: Required for AI features. Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Camera Permissions

The application requests camera access for AR features. Ensure your browser allows camera permissions for full functionality.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to Tashkent University of Information Technologies.

## 👥 Contact

**Faculty of Television Technologies**

- **University**: Tashkent University of Information Technologies (TUIT)
- **Location**: Tashkent, Uzbekistan

For technical support or inquiries, please contact the development team.

## 🙏 Acknowledgments

- Built with modern web technologies and 3D graphics libraries
- Special thanks to the faculty staff and students for their contributions
- Powered by Google Gemini AI for enhanced educational experiences

---

<div align="center">
  <p>Developed with ❤️ for the Faculty of Television Technologies at TUIT</p>
</div>
