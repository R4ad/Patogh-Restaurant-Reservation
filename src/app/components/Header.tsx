import { Link, useLocation } from 'react-router-dom';
import { Menu, User, LogOut } from 'lucide-react';

interface HeaderProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
  onMenuClick?: () => void;
}

export function Header({ isLoggedIn = false, onLogout, onMenuClick }: HeaderProps) {
  const location = useLocation();
  const isDashboard = location.pathname.includes('dashboard');

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {isDashboard && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">پ</span>
              </div>
              <span className="text-xl font-bold text-foreground">پاتوق</span>
            </Link>
          </div>

          {!isDashboard && (
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                خانه
              </Link>
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                درباره ما
              </Link>
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                تماس با ما
              </Link>
            </nav>
          )}

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/customer-dashboard"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>داشبورد من</span>
                </Link>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                ورود / ثبت‌نام
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
