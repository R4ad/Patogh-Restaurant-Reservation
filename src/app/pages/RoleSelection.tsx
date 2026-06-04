import { useNavigate } from 'react-router-dom';
import { User, Store, ShieldCheck } from 'lucide-react';

export function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl">
        {/* لوگو */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">پ</span>
            </div>
            <span className="text-3xl font-bold">پاتوق</span>
          </div>
          <h1 className="text-2xl mb-2">خوش آمدید</h1>
          <p className="text-muted-foreground">لطفا نوع کاربری خود را انتخاب کنید</p>
        </div>

        {/* کارت‌های نقش اصلی */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* مشتری */}
          <button
            onClick={() => navigate('/login/customer')}
            className="group bg-white rounded-2xl p-8 border-2 border-border hover:border-primary hover:shadow-lg transition-all text-right"
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
                <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                جستجو و رزرو آنلاین
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                مشاهده منو و نظرات
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                مدیریت رزروها
              </li>
            </ul>
          </button>

          {/* صاحب رستوران */}
          <button
            onClick={() => navigate('/login/owner')}
            className="group bg-white rounded-2xl p-8 border-2 border-border hover:border-primary hover:shadow-lg transition-all text-right"
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
                <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                مدیریت رزروها
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                ویرایش منو و اطلاعات
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                گزارش‌گیری و آمار
              </li>
            </ul>
          </button>
        </div>

        {/* لینک مدیر ارشد سامانه — کمتر برجسته */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/admin/login')}
            className="group flex items-center gap-2.5 px-5 py-3 rounded-xl border border-border bg-white hover:border-primary/50 hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-primary"
          >
            <ShieldCheck className="w-4 h-4 group-hover:text-primary transition-colors" />
            ورود به پنل مدیر ارشد سامانه
          </button>
        </div>
      </div>
    </div>
  );
}
