import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';

const FOOD_TYPES = ['همه', 'کافه', 'رستوران سنتی', 'فست فود', 'ایتالیایی', 'ژاپنی', 'دریایی'];
const CITIES    = ['تهران', 'اصفهان', 'شیراز', 'مشهد'];
const GUESTS    = ['۱', '۲', '۳', '۴', '۵+'];

export function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query,    setQuery]    = useState(searchParams.get('q')        ?? '');
  const [city,     setCity]     = useState(searchParams.get('city')     ?? 'تهران');
  const [foodType, setFoodType] = useState(searchParams.get('foodType') ?? 'همه');
  const [guests,   setGuests]   = useState(searchParams.get('guests')   ?? '۲');

  // هماهنگ کردن فرم با URL هنگام تغییر مسیر
  useEffect(() => {
    setQuery   (searchParams.get('q')        ?? '');
    setCity    (searchParams.get('city')     ?? 'تهران');
    setFoodType(searchParams.get('foodType') ?? 'همه');
    setGuests  (searchParams.get('guests')   ?? '۲');
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim())              params.set('q',        query.trim());
    if (city && city !== 'تهران') params.set('city',     city);
    if (foodType !== 'همه')       params.set('foodType', foodType);
    if (guests !== '۲')           params.set('guests',   guests);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

        {/* جستجوی آزاد */}
        <div className="lg:col-span-1">
          <label className="block text-sm text-muted-foreground mb-2">نام رستوران</label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pr-10 pl-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="جستجو..."
            />
          </div>
        </div>

        {/* شهر */}
        <div className="lg:col-span-1">
          <label className="block text-sm text-muted-foreground mb-2">شهر</label>
          <div className="relative">
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* نوع رستوران */}
        <div className="lg:col-span-1">
          <label className="block text-sm text-muted-foreground mb-2">نوع رستوران</label>
          <select
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {FOOD_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* تعداد نفرات */}
        <div className="lg:col-span-1">
          <label className="block text-sm text-muted-foreground mb-2">تعداد نفرات</label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {GUESTS.map((g) => <option key={g} value={g}>{g} نفر</option>)}
          </select>
        </div>

        {/* دکمه جستجو */}
        <div className="lg:col-span-1 flex items-end">
          <button
            type="button"
            onClick={handleSearch}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            <span>جستجو</span>
          </button>
        </div>
      </div>
    </div>
  );
}