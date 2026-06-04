import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Users, ChevronLeft } from 'lucide-react';

export function ReservationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    description: '',
  });

  const reservation = {
    restaurant: {
      name: 'کافه نادری',
      image: '/images/restaurant-1.jpg',
    },
    date: '۱۴۰۳/۰۳/۱۵',
    time: '۱۸:۰۰',
    guests: '۲ نفر',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/reservation-confirmation');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            خانه
          </Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <Link to={`/restaurant/${id}`} className="hover:text-primary transition-colors">
            {reservation.restaurant.name}
          </Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span className="text-foreground">تکمیل رزرو</span>
        </div>

        <h1 className="text-3xl mb-8">تکمیل اطلاعات رزرو</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 border border-border">
              <h2 className="text-xl mb-6">اطلاعات شخصی</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    نام و نام خانوادگی *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="نام کامل خود را وارد کنید"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    شماره موبایل *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    توضیحات (اختیاری)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="در صورت نیاز، درخواست خاصی دارید؟"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  ثبت درخواست رزرو
                </button>

                <p className="text-sm text-muted-foreground text-center">
                  با ثبت درخواست، درخواست شما برای رستوران ارسال می‌شود و پس از تایید، پیامک تایید دریافت خواهید کرد
                </p>
              </div>
            </form>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-border sticky top-20">
              <h3 className="text-lg mb-4">خلاصه رزرو</h3>

              <div className="mb-4">
                <img
                  src={reservation.restaurant.image}
                  alt={reservation.restaurant.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-medium text-lg">{reservation.restaurant.name}</h4>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span>{reservation.date}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>{reservation.time}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>{reservation.guests}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
