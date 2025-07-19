import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900">
    {/* Sidebar: fixed/static on desktop, overlay on mobile */}
    <div className="lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-72 xl:w-80 flex-shrink-0">
      <Sidebar />
    </div>
    {/* Main content: margin-left for sidebar on desktop, scrollable */}
    <div className="flex-1 z-50 flex flex-col overflow-hidden min-h-screen lg:ml-72 xl:ml-80">
      <Header />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
          {children}
        </div>
      </main>
    </div>
  </div>
);

export default MainLayout; 