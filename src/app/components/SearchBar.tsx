import { Search, MapPin, Users, Calendar } from 'lucide-react';

export function SearchBar() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-1">
          <label className="block text-sm text-muted-foreground mb-2">شهر</label>
          <div className="relative">
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select className="w-full pr-10 pl-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
              <option>تهران</option>
              <option>اصفهان</option>
              <option>شیراز</option>
              <option>مشهد</option>
            </select>
          </div>
        </div>

        <div className="lg:col-span-1">
          <label className="block text-sm text-muted-foreground mb-2">نوع رستوران</label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select className="w-full pr-10 pl-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
              <option>همه</option>
              <option>کافه</option>
              <option>رستوران سنتی</option>
              <option>فست فود</option>
            </select>
          </div>
        </div>

        <div className="lg:col-span-1">
          <label className="block text-sm text-muted-foreground mb-2">تعداد نفرات</label>
          <div className="relative">
            <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select className="w-full pr-10 pl-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
              <option>۱ نفر</option>
              <option>۲ نفر</option>
              <option>۳ نفر</option>
              <option>۴ نفر</option>
              <option>۵+ نفر</option>
            </select>
          </div>
        </div>

        <div className="lg:col-span-1">
          <label className="block text-sm text-muted-foreground mb-2">تاریخ</label>
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="date"
              className="w-full pr-10 pl-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="lg:col-span-1 flex items-end">
          <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            <Search className="w-5 h-5" />
            <span>جستجو</span>
          </button>
        </div>
      </div>
    </div>
  );
}
