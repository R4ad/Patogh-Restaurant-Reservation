import { useNavigate } from 'react-router-dom';
import { User, Store } from 'lucide-react';

export function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">پ</span>
            </div>
            <span className="text-3xl font-bold">پاتوق</span>
          </div>
          <h1 className="text-2xl mb-2">خوش آمدید</h1>
          <p className="text-muted-foreground">لطفا نوع کاربری خود را انتخاب کنید</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Card */}
          <button
            onClick={() => navigate('/login/customer')}
            className="group bg-white rounded-2xl p-8 border-2 border-border hover:border-primary transition-all text-right"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl mb-3">مشتری</h2>
            <p className="text-muted-foreground mb-6">
              برای رزرو میز در رستوران‌ها و کافه‌ها
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                جستجو و رزرو آنلاین
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                مشاهده منو و نظرات
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                مدیریت رزروها
              </li>
            </ul>
          </button>

          {/* Owner Card */}
          <button
            onClick={() => navigate('/login/owner')}
            className="group bg-white rounded-2xl p-8 border-2 border-border hover:border-primary transition-all text-right"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Store className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl mb-3">صاحب رستوران</h2>
            <p className="text-muted-foreground mb-6">
              برای مدیریت رستوران یا کافه خود
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                مدیریت رزروها
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                ویرایش منو و اطلاعات
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                گزارش‌گیری و آمار
              </li>
            </ul>
          </button>
        </div>
      </div>
    </div>
  );
}
