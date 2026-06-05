import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Users } from 'lucide-react';

export function ReservationConfirmation() {
  const location = useLocation();

  // داده‌هایی که از ReservationForm پاس شدن
  const state = location.state as {
    restaurantName?: string;
    restaurantImage?: string;
    date?: string;
    time?: string;
    guests?: string;
    fullName?: string;
    reservationNumber?: string;
  } | null;

  const restaurantName    = state?.restaurantName    ?? 'رستوران';
  const restaurantImage   = state?.restaurantImage   ?? '/images/restaurant-1.jpg';
  const date              = state?.date              ?? '—';
  const time              = state?.time              ?? '—';
  const guests            = state?.guests            ? `${state.guests} نفر` : '—';
  const reservationNumber = state?.reservationNumber ?? `RES-${Date.now().toString().slice(-6)}`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <div className="max-w-lg w-full">
        {/* آیکون موفقیت */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl mb-2">درخواست رزرو ثبت شد!</h1>
          <p className="text-muted-foreground">
            درخواست رزرو شما با موفقیت ثبت شد و برای رستوران ارسال گردید
          </p>
        </div>

        {/* جزئیات رزرو */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-border">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
            <img
              src={restaurantImage}
              alt={restaurantName}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium text-lg">{restaurantName}</h3>
              <p className="text-sm text-muted-foreground">
                شماره رزرو: <span dir="ltr">{reservationNumber}</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span>{guests}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>در انتظار تأیید</strong>
                <br />
                درخواست شما در حال بررسی توسط رستوران است. پس از تأیید اطلاع‌رسانی می‌شود.
              </p>
            </div>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/customer-dashboard"
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center"
          >
            مشاهده رزروهای من
          </Link>
          <Link
            to="/"
            className="flex-1 px-6 py-3 bg-white text-foreground border border-border rounded-lg hover:bg-muted transition-colors text-center"
          >
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  );
}
