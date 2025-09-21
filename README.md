# MindEase AI Companion 🧠✨

<div align="center">

<img src="public/assets/android-chrome-192x192.png" alt="MindEase AI Companion" width="80" height="80" />

<h3>🌟 Privacy-First AI Wellness Companion 🌟</h3>

<p><em>Personalized mental health support • Professional-grade design</em></p>

<!-- Animated badges with gradient effects -->
<p>
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=16&pause=1000&color=5965E0&center=true&vCenter=true&width=435&lines=AI-Powered+Mental+Wellness;Privacy-First+Architecture;Beautiful+Gradient+Animations;Empathetic+Conversations" alt="Typing SVG" />
</p>

[![Website](https://img.shields.io/badge/🌐_Live_Demo-mindease--ai--companion.me-5965e0?style=for-the-badge&labelColor=0f172a)](https://mindease-ai-companion.me)
[![GitHub Stars](https://img.shields.io/github/stars/OrbitWork/MindEase-AI-Companion?style=for-the-badge&color=5965e0&labelColor=0f172a)](https://github.com/OrbitWork/MindEase-AI-Companion/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-5965e0.svg?style=for-the-badge&labelColor=0f172a)](LICENSE)
[![Forks](https://img.shields.io/github/forks/OrbitWork/MindEase-AI-Companion?style=for-the-badge&color=0f766e&labelColor=0f172a)](https://github.com/OrbitWork/MindEase-AI-Companion/network/members)

</div>

---

## 🎭 Signature Visual Experience

<div align="center">

### ✨ Crafted with Premium Animations ✨

| Feature | Description | Impact |
|---------|-------------|---------|
| 🌊 **Gradient Drift** | Mesmerizing color transitions | Creates depth & calmness |
| 📜 **Reveal-on-Scroll** | Elements gracefully appear | Premium feel & engagement |
| 🎯 **Micro-interactions** | Responsive hover effects | Professional polish |
| 🌓 **Theme Transitions** | Smooth light/dark switching | Seamless UX |
| ♿ **Accessibility-First** | Respects motion preferences | Inclusive design |

</div>

```css
/* Example: Signature Gradient Animation */
@keyframes gradientDrift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.hero-gradient {
  background: linear-gradient(-45deg, #5965e0, #0f766e, #f59e0b, #ef4444);
  background-size: 400% 400%;
  animation: gradientDrift 15s ease infinite;
}
```

---

## 🚀 Quick Start

<details>
<summary><strong>📦 Installation & Setup</strong></summary>

```bash
# 🔥 Clone the repository
git clone https://github.com/OrbitWork/MindEase-AI-Companion.git
cd MindEase-AI-Companion

# 📚 Install dependencies
npm install

# 🔧 Environment setup
cp .env.example .env

# ✏️ Configure your API keys
# - OpenAI API Key (for AI conversations)
# - YouTube Data API Key (for wellness content)
# - Firebase Config (for user data & authentication)

# 🚀 Launch development server
npm run dev

# 🌐 Open http://localhost:3000
```

</details>

---

## ⭐ Core Features

<div align="center">

<table>
<tr>
<td width="50%">

### 🤖 **Empathetic AI Assistant**
- **OpenAI-Powered** conversations
- **Context-aware** responses
- **Personalized** coping strategies
- **Mental health** guidance
- **24/7 availability**

</td>
<td width="50%">

### 📊 **Smart Wellness Tracking**
- **Daily mood** check-ins
- **Visual stress** indicators
- **Persistent** data storage
- **Progress** analytics
- **Personalized** insights

</td>
</tr>
<tr>
<td width="50%">

### 🎥 **Curated Content Hub**
- **YouTube** meditation videos
- **Ambient** soundscapes
- **Sleep** stories
- **Guided** relaxation
- **Stress-aware** recommendations

</td>
<td width="50%">

### 🎨 **Premium Design System**
- **Gradient** animations
- **Light/Dark** themes
- **Micro-interactions**
- **WCAG compliant**
- **Mobile-responsive**

</td>
</tr>
</table>

</div>

---

## 🛠️ Technology Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=nodejs,express,html,css,js,firebase,git&theme=dark" alt="Tech Stack" />

<br/>

**Backend:** Node.js • Express.js • RESTful APIs  
**Frontend:** Vanilla JS • CSS3 • HTML5 • ES6 Modules  
**Database:** Firebase Firestore • Real-time sync  
**Authentication:** Firebase Auth • Secure & scalable  
**AI Integration:** OpenAI GPT • Natural conversations  
**Content:** YouTube Data API v3 • Rich media  
**ML Features:** face-api.js • Optional mood detection  

</div>

---

## 📸 Visual Showcase

<div align="center">

<details>
<summary><strong>🖼️ Screenshots & Previews</strong></summary>

<br/>

<img src="docs/screenshot-home.png" alt="Homepage with gradient animations" width="600"/>
<p><em>🏠 Homepage featuring signature gradient drift animations</em></p>

<br/>

<img src="docs/screenshot-chat.png" alt="AI Chat Interface" width="600"/>
<p><em>🤖 Empathetic AI conversations with beautiful UI</em></p>

<br/>

<img src="docs/screenshot-dashboard.png" alt="Personal Dashboard" width="600"/>
<p><em>📈 Personal wellness dashboard with interactive elements</em></p>

</details>

</div>

---

## 🔐 Privacy & Security

<div align="center">

### 🛡️ **Privacy-First Architecture**

</div>

| Security Feature | Implementation | Benefit |
|------------------|----------------|---------|
| 🔒 **User Data Control** | Personal Firebase accounts | Complete ownership |
| 🎯 **Scoped Access** | User-specific Firestore rules | Data isolation |
| 🚫 **Zero Tracking** | No third-party analytics | True privacy |
| ✋ **Explicit Consent** | Permission-based features | User choice |
| 🔐 **API Protection** | Server-side key management | Secure integration |

<div align="center">

> ⚠️ **Medical Disclaimer:** MindEase is a wellness companion, not medical software. Always consult healthcare professionals for serious mental health concerns.

</div>

---

## 📂 Project Architecture

<details>
<summary><strong>🏗️ Detailed File Structure</strong></summary>

```
MindEase-AI-Companion/
├── 📁 node_modules/          # Dependencies
├── 📁 public/                # Static assets
│   ├── 📁 assets/            # Images & media
│   │   ├── 🖼️ logo.png
│   │   ├── 📱 favicons/
│   │   ├── 🧠 models/        # Face detection models
│   │   ├── 🎵 sounds/        # Ambient audio
│   │   └── 📚 stories/       # Sleep stories
│   ├── 📁 css/               # Stylesheets
│   │   ├── 🏠 home.css
│   │   ├── 💬 chat.css
│   │   ├── 📊 dashboard.css
│   │   └── 📚 resource.css
│   ├── 📁 js/                # Client-side logic
│   │   ├── 🔥 firebase-config.js
│   │   ├── 🏠 home.js
│   │   ├── 💬 chat.js
│   │   ├── 📊 dashboard.js
│   │   └── 📚 resource.js
│   └── 📄 *.html             # Pages
├── ⚙️ server.js              # Express server
├── 📦 package.json           # Dependencies
├── 🔐 .env                   # Environment variables
└── 📖 README.md              # This file
```

</details>

---

## 🌟 Getting Started Guide

<div align="center">

### 1️⃣ **Prerequisites**
Node.js 18+ • Git • Firebase Account • OpenAI API Key

### 2️⃣ **API Keys Required**
```env
OPENAI_API_KEY=your_openai_key_here
YOUTUBE_API_KEY=your_youtube_key_here
# Firebase config in firebase-config.js
```

### 3️⃣ **Development Workflow**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run test     # Run test suite
npm run deploy   # Deploy to hosting
```

</div>

---

## 🤝 Contributing

<div align="center">

We welcome contributions! Here's how to get involved:

[![Contributors](https://contrib.rocks/image?repo=OrbitWork/MindEase-AI-Companion)](https://github.com/OrbitWork/MindEase-AI-Companion/graphs/contributors)

</div>

<details>
<summary><strong>📋 Contribution Guidelines</strong></summary>

### 🔄 **Development Process**
1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** Pull Request

### 🎯 **Areas for Contribution**
- 🎨 UI/UX improvements
- 🤖 AI conversation enhancements
- 📱 Mobile responsiveness
- ♿ Accessibility features
- 🔧 Performance optimizations
- 📖 Documentation updates

### 🧪 **Code Standards**
- ESLint configuration
- Prettier formatting
- Semantic commit messages
- Comprehensive testing
- Documentation updates

</details>

---

## 📊 Project Stats

<div align="center">

<!-- Overall stats -->
<img src="https://github-readme-stats.vercel.app/api?username=OrbitWork&show_icons=true&theme=tokyonight&hide_border=true&bg_color=0d1117&cache_seconds=86400" alt="GitHub Stats" />

<br/>

<!-- Streak stats -->
<img src="https://streak-stats.demolab.com?user=OrbitWork&theme=tokyonight&hide_border=true&background=0d1117" alt="Contribution Streak" />

<br/>

<!-- Optional: Pinned repo -->
<img src="https://github-readme-stats.vercel.app/api/pin/?username=OrbitWork&repo=MindEase-AI-Companion&theme=tokyonight&hide_border=true" alt="Pinned Repo" />

</div>

---

## 📄 License & Legal

<div align="center">

**MIT License** - see [LICENSE](LICENSE) file for details

<img src="https://img.shields.io/badge/License-MIT-5965e0.svg?style=for-the-badge&labelColor=0f172a" alt="MIT License" />

This project is open-source and available under the MIT License.

</div>

---

## 📞 Connect & Support

<div align="center">

<table>
<tr>
<td align="center">

### 🐛 **Issues & Bugs**
[![GitHub Issues](https://img.shields.io/github/issues/OrbitWork/MindEase-AI-Companion?style=for-the-badge&color=ef4444&labelColor=0f172a)](https://github.com/OrbitWork/MindEase-AI-Companion/issues)

Report bugs and request features

</td>
<td align="center">

### 💬 **Discussions**
[![GitHub Discussions](https://img.shields.io/badge/GitHub-Discussions-5965e0?style=for-the-badge&labelColor=0f172a)](https://github.com/OrbitWork/MindEase-AI-Companion/discussions)

Community support and ideas

</td>
<td align="center">

### 👨‍💻 **Maintainer**
[![GitHub Profile](https://img.shields.io/badge/GitHub-@OrbitWork-0f766e?style=for-the-badge&labelColor=0f172a)](https://github.com/OrbitWork)

Project lead and maintainer

</td>
</tr>
</table>

</div>

---

<div align="center">

### Built with passion for mental wellness and digital privacy 

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=18&pause=1000&color=5965E0&center=true&vCenter=true&width=435&lines=Thank+you+for+visiting!;Star+⭐+if+helpful!;Happy+coding!+🚀" alt="Thank you message" />

<br/>

**⭐ Star this repository** if MindEase helps you on your wellness journey!

</div>

---

<div align="center">
<sub>Made with ❤️ by <a href="https://github.com/OrbitWork">@OrbitWork</a></sub>
</div>
