# Nexamine Storage - Modern File Management Application

A responsive and modern file storage web application built with React, Vite, and Tailwind CSS. This application provides a clean, intuitive interface for uploading, organizing, and managing files with a focus on user experience and modern design principles.

## ✨ Features

### Core Functionality
- **User Authentication**: Sign up, login, and logout with persistent sessions
- **File Management**: Upload, delete, rename, and download files
- **Folder Organization**: Create, rename, and delete folders with hierarchical structure
- **Drag & Drop Upload**: Intuitive file upload with progress tracking
- **Search Functionality**: Find files and folders quickly
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### UI/UX Features
- **Modern Design**: Clean, minimalistic interface with generous whitespace
- **Dark Mode Toggle**: Switch between light and dark themes
- **Grid/List View**: Toggle between different file viewing modes
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **File Type Icons**: Visual representation of different file types
- **Progress Indicators**: Real-time upload progress and loading states

### Dashboard & Analytics
- **Storage Statistics**: Visual breakdown of storage usage
- **File Type Analysis**: Categorization and size distribution
- **Recent Activity**: Track uploads and modifications
- **Storage Quota**: Monitor usage against limits

### Advanced Features
- **Bulk Operations**: Select multiple files for batch actions
- **Context Menus**: Right-click actions for quick file management
- **Breadcrumb Navigation**: Easy folder navigation
- **File Preview**: Support for various file types
- **Shared Links**: Generate shareable file links (bonus feature)

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nexamine-storage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **React Dropzone** - Drag and drop file uploads

### UI Components
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Toast notifications
- **UUID** - Unique identifier generation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📱 Responsive Design

The application is built with a mobile-first approach and includes:

- **Mobile**: Optimized touch interactions and compact layouts
- **Tablet**: Balanced layout with touch-friendly elements
- **Desktop**: Full-featured interface with keyboard shortcuts

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) with various shades
- **Gray**: Neutral grays for text and backgrounds
- **Success**: Green for positive actions
- **Error**: Red for warnings and errors

### Typography
- Clean, readable fonts with proper hierarchy
- Responsive font sizes
- Consistent spacing and line heights

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent styling with hover states
- **Inputs**: Clean form elements with focus states
- **Modals**: Smooth overlay dialogs

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_NAME=Nexamine Storage
VITE_APP_VERSION=1.0.0
```

### Tailwind Configuration
The application uses a custom Tailwind configuration with:
- Extended color palette
- Custom animations
- Responsive breakpoints
- Dark mode support

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Breadcrumbs.jsx
│   ├── CreateFolder.jsx
│   ├── FileActions.jsx
│   ├── FileExplorer.jsx
│   ├── FileGrid.jsx
│   ├── FileList.jsx
│   ├── FileUpload.jsx
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   └── StorageStats.jsx
├── contexts/           # React context providers
│   ├── AuthContext.jsx
│   ├── StorageContext.jsx
│   └── ThemeContext.jsx
├── pages/              # Page components
│   ├── AuthPage.jsx
│   └── Dashboard.jsx
├── App.jsx             # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

### Deploy to Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure build settings if needed

## 🔒 Security Features

- **Client-side validation** for all user inputs
- **Secure file handling** with proper type checking
- **XSS protection** through React's built-in sanitization
- **CSRF protection** for form submissions

## 🧪 Testing

The application includes:
- **Component testing** with React Testing Library
- **Integration testing** for user workflows
- **Responsive testing** across different screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tailwind CSS** for the amazing utility-first CSS framework
- **Framer Motion** for smooth animations
- **Lucide** for beautiful icons
- **React Dropzone** for drag and drop functionality

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using modern web technologies** 