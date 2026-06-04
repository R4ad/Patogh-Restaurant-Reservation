import { useState } from 'react';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { IS_MOCK } from '../../services/client';

export function AdminLogin() {
  const { adminLogin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await adminLogin({ Username: username, Password: password });
      // redirect در AuthContext انجام می‌شه
    } catch (err) {
      setError(err instanceof Error ? err.message : 'نام کاربری یا رمز عبور اشتباه است');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* لوگو */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">پنل مدیریت</h1>
          <p className="text-muted-foreground text-sm">پاتوق — ورود مدیر ارشد سامانه</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-border p-8">
          {IS_MOCK && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs rounded-lg px-3 py-2 mb-6 text-center">
              حالت تست — کاربری: <span dir="ltr" className="font-mono">admin</span> / رمز: <span dir="ltr" className="font-mono">admin123</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">نام کاربری</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="admin"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">رمز عبور</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="رمز عبور"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 font-medium"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              ورود به پنل
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
