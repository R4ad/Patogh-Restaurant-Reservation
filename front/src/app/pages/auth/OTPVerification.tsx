import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { OTPInput } from '../../components/shared/OTPInput';
import { useAuth } from '../../context/AuthContext';
import { sendOTP } from '../../services/auth.service';
import { IS_MOCK } from '../../services/client';

export function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP } = useAuth();

  const phoneNumber: string = location.state?.phone ?? '';
  const isNewUserFromState: boolean = location.state?.isNewUser ?? false;
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // اگه بدون state آمدیم برگرد
  useEffect(() => {
    if (!phoneNumber) navigate('/login');
  }, [phoneNumber, navigate]);

  // تایمر
  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const id = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleOTPComplete = async (otp: string) => {
    setError('');
    setIsLoading(true);
    try {
      const { hasIncompleteProfile } = await verifyOTP({ PhoneNumber: phoneNumber, Code: otp });
      // پروفایل ناقص (رمز ندارد، چه کاربر جدید چه قدیمی) → تکمیل پروفایل
      // پروفایل کامل → AuthContext به داشبورد مناسب redirect کرده است
      if (hasIncompleteProfile || isNewUserFromState) {
        navigate('/complete-profile', { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'کد وارد شده اشتباه است');
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendOTP({ PhoneNumber: phoneNumber });
      setTimer(120);
      setCanResend(false);
      setError('');
    } catch {
      setError('ارسال مجدد کد با مشکل مواجه شد');
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          بازگشت
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
          {/* لوگو */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">پ</span>
              </div>
              <span className="text-2xl font-bold">پاتوق</span>
            </div>
            <h1 className="text-2xl mb-2">تأیید شماره موبایل</h1>
            <p className="text-muted-foreground">
              کد تأیید به شماره{' '}
              <span className="font-medium text-foreground" dir="ltr">
                {phoneNumber}
              </span>{' '}
              ارسال شد
            </p>
            {IS_MOCK && (
              <p className="text-xs text-yellow-600 bg-yellow-50 border border-yellow-200 rounded px-2 py-1 mt-3 inline-block">
                حالت تست — هر کدی قبول می‌شه
              </p>
            )}
          </div>

          {/* ورودی OTP */}
          <div className="mb-6">
            <OTPInput
              length={6}
              onComplete={handleOTPComplete}
              disabled={isLoading}
            />
          </div>

          {/* loading */}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-primary text-sm mb-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              در حال تأیید...
            </div>
          )}

          {/* پیام خطا */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-3 mb-4 text-center">
              {error}
            </div>
          )}

          {/* تایمر / ارسال مجدد */}
          <div className="text-center mb-4">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-primary hover:underline text-sm"
              >
                ارسال مجدد کد
              </button>
            ) : (
              <p className="text-muted-foreground text-sm">
                ارسال مجدد تا <span dir="ltr">{formatTime(timer)}</span>
              </p>
            )}
          </div>

          {/* ویرایش شماره */}
          <div className="text-center">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ویرایش شماره موبایل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
