import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Bell, User } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home,   label: 'خانه',           path: '/' },
    { icon: Search, label: 'جستجو',           path: '/search' },
    { icon: Heart,  label: 'علاقه‌مندی‌ها',  path: '/favorites' },
    { icon: Bell,   label: 'اعلان‌ها',        path: '/notifications' },
    { icon: User,   label: 'پروفایل',         path: '/customer-dashboard' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-3 px-4 flex-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
