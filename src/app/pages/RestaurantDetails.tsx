import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, ChevronLeft, Loader2 } from 'lucide-react';
import { getRestaurantById } from '../services/restaurant.service';
import type { Restaurant } from '../types';

// ساعت‌های ممکن بین StartTime و EndTime
function buildTimeSlots(start: string, end: string): string[] {
  try {
    const [sh, sm] = start.split(':').map(Number);
    const [eh] = end.split(':').map(Number);
    const slots: string[] = [];
    for (let h = sh + (sm > 0 ? 1 : 0); h < eh; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`);
    }
    return slots.length ? slots : ['12:00', '13:00', '14:00', '15:00', '18:00', '19:00'];
  } catch {
    return ['12:00', '13:00', '14:00', '15:00', '18:00', '19:00'];
  }
}

function formatPrice(price: number): string {
  return price.toLocaleString('fa-IR') + ' تومان';
}

export function RestaurantDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'menu' | 'gallery' | 'reviews' | 'info'>('menu');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guestCount, setGuestCount] = useState('2');
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getRestaurantById(id)
      .then(setRestaurant)
      .catch(() => setError('رستوران پیدا نشد'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{error || 'رستوران پیدا نشد'}</p>
          <button onClick={() => navigate(-1)} className="text-primary hover:underline">
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  const timeSlots = buildTimeSlots(restaurant.StartTime, restaurant.EndTime);

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">خانه</Link>
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <Link to="/search" className="hover:text-primary transition-colors">رستوران‌ها</Link>
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span className="text-foreground">{restaurant.Name}</span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="h-64 md:h-96 overflow-hidden">
        <img
          src={restaurant.Image ?? '/images/restaurant-1.jpg'}
          alt={restaurant.Name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* محتوای اصلی */}
          <div className="lg:col-span-2">
            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-border">
              <h1 className="text-3xl mb-4">{restaurant.Name}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {(restaurant.rating ?? 0) > 0 && (
                  <>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{restaurant.rating}</span>
                      <span className="text-muted-foreground">({restaurant.reviewCount} نظر)</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                  </>
                )}
                <span className="text-muted-foreground">{restaurant.FoodType}</span>
              </div>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{restaurant.Location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span dir="ltr">{restaurant.StartTime} – {restaurant.EndTime}</span>
                </div>
                {restaurant.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    <span>{restaurant.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="flex border-b border-border overflow-x-auto">
                {(['menu', 'gallery', 'reviews', 'info'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab === 'menu' && 'منو'}
                    {tab === 'gallery' && 'گالری'}
                    {tab === 'reviews' && 'نظرات'}
                    {tab === 'info' && 'اطلاعات'}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* منو */}
                {activeTab === 'menu' && (
                  <div className="space-y-4">
                    {restaurant.MenuItems.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        منویی ثبت نشده است
                      </p>
                    ) : (
                      restaurant.MenuItems.map((item) => (
                        <div key={item.Id} className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                          <img
                            src={item.Image ?? '/images/food-1.jpg'}
                            alt={item.Name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium mb-1">{item.Name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{item.Description}</p>
                            <p className="text-primary font-medium">{formatPrice(item.Price)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* گالری */}
                {activeTab === 'gallery' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <img
                        key={i}
                        src={restaurant.Image ?? '/images/restaurant-1.jpg'}
                        alt={`تصویر ${i + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* نظرات */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {(restaurant.rating ?? 0) > 0 && (
                      <div className="flex items-center gap-6 pb-6 border-b border-border">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-primary mb-1">{restaurant.rating}</div>
                          <div className="text-sm text-muted-foreground">از {restaurant.reviewCount} نظر</div>
                        </div>
                        <div className="flex-1 space-y-2">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-2">
                              <span className="text-sm w-8">{star} ستاره</span>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400" style={{ width: `${star * 18}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-muted-foreground text-center py-4">نظرات از API دریافت می‌شوند</p>
                  </div>
                )}

                {/* اطلاعات */}
                {activeTab === 'info' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">درباره مجموعه</h4>
                      <p className="text-muted-foreground">{restaurant.Description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">ساعت کاری</h4>
                      <p className="text-muted-foreground" dir="ltr">{restaurant.StartTime} – {restaurant.EndTime}</p>
                    </div>
                    {restaurant.Tables.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">میزها</h4>
                        <div className="flex flex-wrap gap-2">
                          {restaurant.Tables.map((t) => (
                            <span key={t.Id} className="px-3 py-1 bg-muted rounded-full text-sm">
                              میز {t.TableNumber} — {t.Capacity} نفره
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* کارت رزرو */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-border sticky top-20">
              <h3 className="text-xl mb-4">رزرو میز</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">تاریخ</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">ساعت</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.slice(0, 9).map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                          selectedTime === time
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-white border-border hover:border-primary'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">تعداد نفرات</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>{num} نفر</option>
                    ))}
                  </select>
                </div>

                <Link
                  to={`/reservation/${id}`}
                  state={{ restaurantId: id, date: selectedDate, time: selectedTime, guests: guestCount }}
                  className="block w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center"
                >
                  ادامه رزرو
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
