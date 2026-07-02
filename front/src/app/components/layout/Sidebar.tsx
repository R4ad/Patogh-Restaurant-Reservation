import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, User, Settings, X, LayoutDashboard, Users, UtensilsCrossed, Clock, Heart, Bell, PlusCircle } from 'lucide-react';

interface SidebarProps {
  isManager?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isManager = false, isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();

  const customerMenuItems = [
    { icon: Home,     label: 'داشبورد',        path: '/customer-dashboard' },
    { icon: Calendar, label: 'رزروهای من',      path: '/customer-dashboard' },
    { icon: Heart,    label: 'علاقه‌مندی‌ها',   path: '/favorites' },
    { icon: Bell,     label: 'اعلان‌ها',         path: '/notifications' },
    { icon: User,     label: 'پروفایل',          path: '/customer-dashboard/profile' },
  ];

  const managerMenuItems = [
    { icon: LayoutDashboard, label: 'داشبورد',             path: '/manager-dashboard' },
    { icon: Calendar,        label: 'درخواست‌های رزرو',    path: '/manager-dashboard' },
    { icon: UtensilsCrossed, label: 'منو',                  path: '/manager-dashboard/menu' },
    { icon: Clock,           label: 'ساعات کاری',           path: '/manager-dashboard/hours' },
    { icon: PlusCircle,      label: 'ثبت رستوران جدید',    path: '/onboarding' },
    { icon: User,            label: 'پروفایل',              path: '/manager-dashboard/profile' },
  ];

  const menuItems = isManager ? managerMenuItems : customerMenuItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 right-0 h-screen bg-sidebar border-l border-sidebar-border z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 lg:p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">پ</span>
              </div>
              <span className="text-lg font-bold">پاتوق</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-sidebar-accent rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>بازگشت به خانه</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
