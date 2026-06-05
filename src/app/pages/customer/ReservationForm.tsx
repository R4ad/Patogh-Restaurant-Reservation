import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Calendar, Clock, Users, ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { getRestaurantById } from '../../services/restaurant.service';
import type { Restaurant } from '../../types';

export function ReservationForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // state که از RestaurantDetails پاس شده
  const stateData = location.state as {
    restaurantId?: string;
    date?: string;
    time?: string;
    guests?: string;
  } | null;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: user?.PhoneNumber ?? '',
    description: '',
  });

  // بارگذاری اطلاعات رستوران
  useEffect(() => {
    const restaurantId = stateData?.restaurantId ?? id;
    if (!restaurantId) { setIsLoadingRestaurant(false); return; }

    getRestaurantById(restaurantId)
      .then(setRestaurant)
      .catch(console.error)
      .finally(() => setIsLoadingRestaurant(false));
  }, [id, stateData?.restaurantId]);

  // پیش‌پر کردن شماره از auth
  useEffect(() => {
    if (user?.PhoneNumber) {
      setFormData((prev) => ({ ...prev, phone: user.PhoneNumber }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: وقتی endpoint رزرو از بک‌اند اومد اینجا API call می‌شه
      // await createReservation({ ... });

      // فعلاً simulate می‌کنیم
      await new Promise((res) => setTimeout(res, 600));
      toast.success('درخواست رزرو ارسال شد — منتظر تأیید رستوران باشید');
      navigate('/reservation-confirmation', {
        state: {
          restaurantName: restaurant?.Name ?? 'رستوران',
          restaurantImage: restaurant?.Image,
          date: stateData?.date ?? '—',
          time: stateData?.time ?? '—',
          guests: stateData?.guests ?? '2',
          fullName: formData.fullName,
          reservationNumber: `RES-${Date.now().toString().slice(-6)}`,
        },
      });
    } catch {
      toast.error('خطایی پیش آمد، دوباره تلاش کنید');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">خانه</Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          {restaurant && (
            <>
              <Link to={`/restaurant/${id}`} className="hover:text-primary transition-colors">
                {restaurant.Name}
              </Link>
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </>
          )}
          <span className="text-foreground">تکمیل رزرو</span>
        </div>

        <h1 className="text-3xl mb-8">تکمیل اطلاعات رزرو</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* فرم */}
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
                    dir="ltr"
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
                    placeholder="مثال: لطفاً میز کنار پنجره"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'در حال ارسال...' : 'ثبت درخواست رزرو'}
                </button>

                <p className="text-sm text-muted-foreground text-center">
                  با ثبت درخواست، رستوران آن را بررسی می‌کند و پس از تأیید، اطلاع‌رسانی می‌شود
                </p>
              </div>
            </form>
          </div>

          {/* خلاصه رزرو */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-border sticky top-20">
              <h3 className="text-lg mb-4">خلاصه رزرو</h3>

              {isLoadingRestaurant ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <img
                      src={restaurant?.Image ?? '/images/restaurant-1.jpg'}
                      alt={restaurant?.Name ?? 'رستوران'}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-medium text-lg">{restaurant?.Name ?? '—'}</h4>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="w-5 h-5 flex-shrink-0" />
                      <span>{stateData?.date || 'تاریخ انتخاب نشده'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="w-5 h-5 flex-shrink-0" />
                      <span>{stateData?.time || 'ساعت انتخاب نشده'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Users className="w-5 h-5 flex-shrink-0" />
                      <span>{stateData?.guests ? `${stateData.guests} نفر` : '—'}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
