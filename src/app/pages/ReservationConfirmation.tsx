import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Users } from 'lucide-react';

export function ReservationConfirmation() {
  const reservation = {
    restaurant: {
      name: 'کافه نادری',
      image: '/images/restaurant-1.jpg',
    },
    date: '۱۴۰۳/۰۳/۱۵',
    time: '۱۸:۰۰',
    guests: '۲ نفر',
    reservationNumber: 'RES-۱۲۳۴۵۶',
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <div className="max-w-lg w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl mb-2">درخواست رزرو ثبت شد!</h1>
          <p className="text-muted-foreground">
            درخواست رزرو شما با موفقیت ثبت شد و برای رستوران ارسال گردید
          </p>
        </div>

        {/* Reservation Details Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-border">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
            <img
              src={reservation.restaurant.image}
              alt={reservation.restaurant.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-medium text-lg">{reservation.restaurant.name}</h3>
              <p className="text-sm text-muted-foreground">
                شماره رزرو: {reservation.reservationNumber}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span>{reservation.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span>{reservation.time}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span>{reservation.guests}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>در انتظار تایید</strong>
                <br />
                درخواست شما در حال بررسی توسط رستوران است. پس از تایید، پیامک دریافت خواهید کرد.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
