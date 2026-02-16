import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  
  // Only show breadcrumb on review and checkout pages
  if (location.pathname !== '/review' && location.pathname !== '/checkout') {
    return null;
  }

  return (
    <div className="w-full bg-slate-100 py-2 dark:bg-gray-800"> {/* Normal positioning in document flow */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-2 text-xs sm:text-sm">
          <div className="flex items-center whitespace-nowrap">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs ${location.pathname === '/review' ? 'bg-accent text-white' : 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200'}`}>
              1
            </span>
            <Link
              to="/review"
              className={`ml-1 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${location.pathname === '/review' ? 'font-bold text-accent' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Review
            </Link>
          </div>

          <span className="hidden sm:block mx-1 text-gray-400 dark:text-gray-500">/</span>
          <span className="sm:hidden text-gray-400 dark:text-gray-500 mx-1">-</span>

          <div className="flex items-center whitespace-nowrap">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs ${location.pathname === '/checkout' ? 'bg-accent text-white' : 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200'}`}>
              2
            </span>
            <Link
              to="/checkout"
              className={`ml-1 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${location.pathname === '/checkout' ? 'font-bold text-accent' : 'text-gray-500 dark:text-gray-400'}`}
            >
              Info Pemesan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;