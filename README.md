# ClubConnect 🎓

> Connect with peers across clubs, showcase your skills, and build a reputation that follows you beyond campus.

## 📁 Project Structure

```
sita/
├── frontend/           ← Vanilla HTML/CSS/JS (landing page)
│   ├── index.html      
│   ├── style.css       
│   └── script.js       
└── app/                ← React + Firebase SPA
    ├── src/
    │   ├── firebase.js         ← ⚠️ Add your Firebase config here
    │   ├── App.jsx             ← Main router
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   └── pages/
    │       ├── Home.jsx
    │       ├── Discover.jsx
    │       ├── Clubs.jsx
    │       ├── Requests.jsx
    │       ├── Leaderboard.jsx
    │       ├── Admin.jsx
    │       ├── MyProfile.jsx
    │       ├── Login.jsx
    │       └── Signup.jsx
    └── package.json
```

## 🚀 Quick Start

### Step 1 — Setup Firebase

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Create a new project
3. Click **Add App → Web** and copy the config
4. Open `app/src/firebase.js` and paste your config:

```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

5. Enable **Authentication** → Sign-in methods → **Email/Password** and **Google**
6. Enable **Firestore Database** → Start in **test mode**

### Step 2 — Run the React App

```bash
cd app
npm run dev
```

Open **http://localhost:5173** in your browser.

### Step 3 — View the Landing Page

Open `frontend/index.html` directly in your browser (double-click or drag into browser).

## 🔥 Firebase Collections

| Collection     | Description |
|----------------|-------------|
| `users`        | User profiles — name, bio, skills, points |
| `clubs`        | Club data — name, description, members |
| `skills`       | Skills posted by users |
| `requests`     | Skill exchange requests between users |
| `leaderboard`  | Leaderboard entries with points |

## 🛠️ Tech Stack

- **Frontend** — HTML5, CSS3, Vanilla JS
- **App** — React 18 + Vite
- **Router** — React Router v6
- **Auth** — Firebase Authentication (Email + Google)
- **Database** — Firebase Firestore
