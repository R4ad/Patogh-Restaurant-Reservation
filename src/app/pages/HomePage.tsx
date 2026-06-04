import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, CheckCircle } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { RestaurantCard } from '../components/RestaurantCard';
import { RestaurantCardSkeleton } from '../components/shared/SkeletonLoader';
import { getRestaurants } from '../services/restaurant.service';
import type { Restaurant } from '../types';

const howItWorks = [
  { icon: Search,       title: 'جستجو کنید',         description: 'رستوران یا کافه مورد نظر خود را پیدا کنید' },
  { icon: Calendar,     title: 'زمان را انتخاب کنید', description: 'تاریخ و ساعت دلخواه خود را مشخص کنید' },
  { icon: CheckCircle,  title: 'رزرو کنید',           description: 'با چند کلیک ساده میز خود را رزرو کنید' },
];

export function HomePage() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRestaurants()
      .then(setRestaurants)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-accent to-background py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4 text-foreground">
              بهترین کافه و رستوران‌ها را پیدا کنید
              <br />
              و آنلاین رزرو کنید
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              تجربه‌ای راحت و سریع برای رزرو میز در بهترین رستوران‌ها و کافه‌های شهر
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* رستوران‌های منتخب */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl text-foreground">رستوران‌های منتخب</h2>
            <button
              onClick={() => navigate('/search')}
              className="text-primary hover:text-primary/90 transition-colors text-sm"
            >
              مشاهده همه
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <RestaurantCardSkeleton key={i} />)
              : restaurants.slice(0, 6).map((r) => (
                  <RestaurantCard
                    key={r.Id}
                    id={r.Id}
                    name={r.Name}
                    image={r.Image ?? '/images/restaurant-1.jpg'}
                    rating={r.rating ?? 0}
                    reviewCount={r.reviewCount ?? 0}
                    category={r.FoodType}
                    location={r.Location}
                    priceLevel={r.priceLevel ?? 2}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* چگونه کار می‌کند */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl text-center mb-12 text-foreground">
            چگونه کار می‌کند؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl mb-2 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
