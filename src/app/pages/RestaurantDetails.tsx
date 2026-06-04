import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Phone, ChevronLeft } from 'lucide-react';

export function RestaurantDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'menu' | 'gallery' | 'reviews' | 'info'>('menu');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guestCount, setGuestCount] = useState('2');

  const restaurant = {
    name: 'کافه نادری',
    image: 'https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=1200',
    rating: 4.8,
    reviewCount: 234,
    category: 'کافه مدرن',
    location: 'تهران، میدان ونک، خیابان گاندی',
    phone: '۰۲۱-۸۸۷۷۶۶۵۵',
    hours: 'روزهای هفته: ۱۰:۰۰ - ۲۳:۰۰',
    description: 'یک کافه مدرن با فضای دنج و منوی متنوع از قهوه‌های تخصصی و غذاهای خوشمزه',
  };

  const menuItems = [
    {
      id: 1,
      name: 'کاپوچینو',
      description: 'اسپرسو با شیر گرم و کف شیر',
      price: '۴۵,۰۰۰',
      image: 'https://images.unsplash.com/photo-1542372147193-a7aca54189cd?w=400',
    },
    {
      id: 2,
      name: 'چیزکیک توت فرنگی',
      description: 'چیزکیک خانگی با سس توت فرنگی',
      price: '۶۵,۰۰۰',
      image: 'https://images.unsplash.com/photo-1542372147193-a7aca54189cd?w=400',
    },
    {
      id: 3,
      name: 'ساندویچ کلاب',
      description: 'مرغ، گوشت، پنیر، سبزیجات تازه',
      price: '۱۲۵,۰۰۰',
      image: 'https://images.unsplash.com/photo-1778634304493-23531df07739?w=400',
    },
    {
      id: 4,
      name: 'لاته',
      description: 'اسپرسو با شیر داغ',
      price: '۵۰,۰۰۰',
      image: 'https://images.unsplash.com/photo-1542372147193-a7aca54189cd?w=400',
    },
  ];

  const availableTimes = [
    '۱۰:۰۰',
    '۱۱:۰۰',
    '۱۲:۰۰',
    '۱۳:۰۰',
    '۱۴:۰۰',
    '۱۵:۰۰',
    '۱۶:۰۰',
    '۱۷:۰۰',
    '۱۸:۰۰',
    '۱۹:۰۰',
    '۲۰:۰۰',
    '۲۱:۰۰',
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              خانه
            </Link>
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span className="text-foreground">{restaurant.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="h-64 md:h-96 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-border">
              <h1 className="text-3xl mb-4">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{restaurant.rating}</span>
                  <span className="text-muted-foreground">({restaurant.reviewCount} نظر)</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{restaurant.category}</span>
              </div>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{restaurant.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{restaurant.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>{restaurant.phone}</span>
                </div>
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
                {activeTab === 'menu' && (
                  <div className="space-y-4">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <p className="text-primary font-medium">{item.price} تومان</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'gallery' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[restaurant.image, ...Array(5).fill(restaurant.image)].map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`تصویر ${i + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-6 pb-6 border-b border-border">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-1">
                          {restaurant.rating}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          از {restaurant.reviewCount} نظر
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-sm w-8">{star} ستاره</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${Math.random() * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="border-b border-border pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">کاربر {i + 1}</span>
                            <span className="text-sm text-muted-foreground">•</span>
                            <span className="text-sm text-muted-foreground">
                              {i + 1} روز پیش
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star
                                key={j}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <p className="text-muted-foreground">
                            تجربه بسیار خوبی داشتم. کیفیت غذا و فضا عالی بود.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'info' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">درباره مجموعه</h4>
                      <p className="text-muted-foreground">{restaurant.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">امکانات</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Wi‑Fi', 'پارکینگ', 'فضای باز', 'موسیقی زنده'].map((amenity) => (
                          <span
                            key={amenity}
                            className="px-3 py-1 bg-muted rounded-full text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reservation Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-border sticky top-20">
              <h3 className="text-xl mb-4">رزرو میز</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">تاریخ</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">ساعت</label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.slice(0, 6).map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-2 rounded-lg border transition-colors ${
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
                      <option key={num} value={num}>
                        {num} نفر
                      </option>
                    ))}
                  </select>
                </div>

                <Link
                  to={`/reservation/${id}`}
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
