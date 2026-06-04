import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OTPInput } from '../components/shared/OTPInput';
import { Button } from '../components/shared/Button';
import { ChevronLeft } from 'lucide-react';

export function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phone || '۰۹۱۲۳۴۵۶۷۸۹';
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOTPComplete = (otp: string) => {
    console.log('OTP:', otp);
    setTimeout(() => {
      navigate('/customer-dashboard');
    }, 500);
  };

  const handleResend = () => {
    setTimer(120);
    setCanResend(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">پ</span>
              </div>
              <span className="text-2xl font-bold">پاتوق</span>
            </div>
            <h1 className="text-2xl mb-2">تایید شماره موبایل</h1>
            <p className="text-muted-foreground">
              کد تایید به شماره <span className="font-medium text-foreground">{phoneNumber}</span> ارسال شد
            </p>
          </div>

          <div className="mb-6">
            <OTPInput length={6} onComplete={handleOTPComplete} />
          </div>

          <div className="text-center mb-6">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-primary hover:underline"
              >
                ارسال مجدد کد
              </button>
            ) : (
              <p className="text-muted-foreground text-sm">
                ارسال مجدد کد تا {formatTime(timer)}
              </p>
            )}
          </div>

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ویرایش شماره موبایل
          </button>
        </div>
      </div>
    </div>
  );
}
