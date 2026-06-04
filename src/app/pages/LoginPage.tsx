import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState('');
  const isOwner = location.pathname.includes('owner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/otp-verify', { state: { phone } });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Image Side */}
        <div className="hidden lg:block relative">
          <img
            src="https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=1200"
            alt="کافه"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 flex items-end">
            <div className="p-12 text-white">
              <h2 className="text-4xl mb-4">به پاتوق خوش آمدید</h2>
              <p className="text-lg text-white/90">
                بهترین رستوران‌ها و کافه‌ها را کشف کنید و به راحتی رزرو کنید
              </p>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">پ</span>
                </div>
                <span className="text-3xl font-bold">پاتوق</span>
              </div>
              <h1 className="text-2xl mb-2">
                ورود / ثبت‌نام {isOwner ? 'صاحب رستوران' : 'مشتری'}
              </h1>
              <p className="text-muted-foreground">
                لطفا شماره موبایل خود را وارد کنید
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 border border-border">
              <div className="mb-6">
                <label className="block text-sm text-muted-foreground mb-2">
                  شماره موبایل
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                ادامه
              </button>

              <p className="text-sm text-muted-foreground text-center mt-4">
                با ورود، شما{' '}
                <a href="#" className="text-primary hover:underline">
                  قوانین و مقررات
                </a>{' '}
                پاتوق را می‌پذیرید
              </p>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isOwner ? 'مشتری هستید؟' : 'صاحب رستوران یا کافه هستید؟'}{' '}
                <button
                  onClick={() => navigate(isOwner ? '/login/customer' : '/login/owner')}
                  className="text-primary hover:underline"
                >
                  {isOwner ? 'ورود مشتری' : 'ورود مدیریت'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
