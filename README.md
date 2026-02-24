# FE Milestone - Trello Clone

A modern, interactive Trello-like application built with React, Tailwind CSS, and Firebase Firestore.

## 🎯 Features

### ✨ Core Functionality

- **Create & Manage Boards**: Create, edit, and delete project boards
- **Organize Lists**: Create multiple lists within each board
- **Task Management**: Add, edit, and delete cards/tasks within lists
- **Drag & Drop**: Drag cards between lists with smooth animations
- **Real-time Sync**: All changes sync instantly with Firebase

### 🎨 UI/UX Features

- **Dark Modern Theme**: Sleek dark interface with cyan/blue accents
- **Responsive Design**: Fully responsive on mobile, tablet, and desktop
- **Smooth Animations**: Interactive hover effects and scale animations
- **Beautiful Gradients**: Gradient buttons with smooth transitions
- **Glass Morphism**: Glassmorphic effects for modern aesthetics

### 🔐 Authentication

- **Google OAuth**: Sign in securely with Google account
- **Protected Routes**: Only authenticated users can access boards
- **Session Management**: Automatic logout functionality

## 📋 Tech Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS v3
- **Database**: Firebase Firestore
- **Authentication**: Firebase Google OAuth
- **Drag & Drop**: @dnd-kit library with sortable
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Router**: React Router v6

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project credentials

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd FE_MILESTONE
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup Environment Variables**
   Create a `.env` file in the project root with your Firebase credentials:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

See `.env.example` for reference.

4. **Run the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   └── Board/
│       ├── Card.jsx          # Individual task card component
│       ├── List.jsx          # List container with cards
│       └── ...
├── context/
│   └── AuthContext.jsx       # Authentication context
├── firebase/
│   └── config.js            # Firebase configuration
├── pages/
│   ├── Login.jsx            # Login page
│   ├── Dashboard.jsx        # Main dashboard with boards
│   └── BoardView.jsx        # Board detail view with lists and cards
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## 🎮 Usage Guide

### Creating a Board

1. Go to the Dashboard (home page)
2. Enter a board title in the "Create a New Board" form
3. Click "Create Board"

### Adding Lists to a Board

1. Open a board
2. Click "+ Add another list" at the bottom
3. Enter a list title

### Managing Cards

- **Add Card**: Click the input field at the bottom of a list and type
- **Edit Card**: Click the edit button and modify the content
- **Delete Card**: Click the delete button (confirm when prompted)

### Organizing Tasks

- **Drag Cards**: Drag cards between lists or reorder within a list
- **Smooth Animations**: Cards scale up when you drag them
- **Drop to Position**: Drop at any position, including the end of lists

## 🎨 Customization

### Theme Colors

Edit `src/index.css` to customize:

- Font families
- Custom animations
- Scrollbar styling

Edit `tailwind.config.js` for:

- Color schemes
- Spacing values
- Custom animations

### Styling

All components use Tailwind CSS utilities. Key color classes:

- `bg-slate-900`: Dark backgrounds
- `bg-slate-800`: Card backgrounds
- `text-cyan-300`: Primary text
- `border-purple-500/30`: Subtle borders

## 🐛 Bug Fixes & Improvements

### Recent Fixes

- ✅ Fixed card positioning when dragging to the last position in a different list
- ✅ Unified background colors to solid slate-900 for consistency
- ✅ Enhanced list interactivity with scale animations
- ✅ Improved card colors with dark theme compatibility

## 🔄 Data Structure

### Firestore Database Structure

```
boards/
├── {boardId}/
│   ├── title: string
│   ├── ownerId: string
│   ├── createdAt: timestamp
│   └── lists/
│       └── {listId}/
│           ├── title: string
│           ├── createdAt: timestamp
│           └── cards/
│               └── {cardId}/
│                   ├── content: string
│                   ├── order: number
│                   └── createdAt: timestamp
```

## 🎯 Performance Optimizations

- Real-time listeners only on active boards
- Efficient reordering with numeric order fields
- Lazy loading of cards and lists
- Optimized animations with CSS transforms
- Smooth drag-drop with dnd-kit

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## � Deployment

### Deploying to Vercel

1. **Push your code to GitHub**

```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Select your repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all Firebase configuration variables:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_FIREBASE_MEASUREMENT_ID`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

**Note**: The `vercel.json` configuration file is included to handle client-side routing correctly on Vercel. All requests are rewritten to `index.html` so React Router can handle the routing.

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues or questions:

1. Check the existing GitHub issues
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [dnd-kit Documentation](https://docs.dndkit.com)
- [Vercel Documentation](https://vercel.com/docs)

---

**Last Updated**: February 24, 2026
**Version**: 1.0.0
