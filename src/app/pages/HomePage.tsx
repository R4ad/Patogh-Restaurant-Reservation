import { SearchBar } from '../components/SearchBar';
import { RestaurantCard } from '../components/RestaurantCard';
import { Search, Calendar, CheckCircle } from 'lucide-react';

const featuredRestaurants = [
  {
    id: '1',
    name: 'کافه نادری',
    image: 'https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=800',
    rating: 4.8,
    reviewCount: 234,
    category: 'کافه مدرن',
    location: 'تهران، میدان ونک',
    priceLevel: 2,
  },
  {
    id: '2',
    name: 'رستوران سنتی شیراز',
    image: 'https://images.unsplash.com/photo-1778785241914-7f75ca16a92d?w=800',
    rating: 4.9,
    reviewCount: 456,
    category: 'رستوران سنتی',
    location: 'تهران، سعادت‌آباد',
    priceLevel: 3,
  },
  {
    id: '3',
    name: 'کافه رویال',
    image: 'https://images.unsplash.com/photo-1522126039546-182129aa0b93?w=800',
    rating: 4.7,
    reviewCount: 189,
    category: 'کافه',
    location: 'تهران، نیاوران',
    priceLevel: 2,
  },
  {
    id: '4',
    name: 'رستوران آریا',
    image: 'https://images.unsplash.com/photo-1778634304493-23531df07739?w=800',
    rating: 4.6,
    reviewCount: 312,
    category: 'رستوران ایرانی',
    location: 'تهران، الهیه',
    priceLevel: 3,
  },
  {
    id: '5',
    name: 'کافه آرت',
    image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800',
    rating: 4.8,
    reviewCount: 267,
    category: 'کافه هنری',
    location: 'تهران، دروس',
    priceLevel: 2,
  },
  {
    id: '6',
    name: 'رستوران پارسیان',
    image: 'https://images.unsplash.com/photo-1759216282424-a48582525298?w=800',
    rating: 4.9,
    reviewCount: 523,
    category: 'رستوران لوکس',
    location: 'تهران، فرمانیه',
    priceLevel: 3,
  },
];

const howItWorks = [
  {
    icon: Search,
    title: 'جستجو کنید',
    description: 'رستوران یا کافه مورد نظر خود را پیدا کنید',
  },
  {
    icon: Calendar,
    title: 'زمان را انتخاب کنید',
    description: 'تاریخ و ساعت دلخواه خود را مشخص کنید',
  },
  {
    icon: CheckCircle,
    title: 'رزرو کنید',
    description: 'با چند کلیک ساده میز خود را رزرو کنید',
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
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

      {/* Featured Restaurants */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl text-foreground">رستوران‌های منتخب</h2>
            <button className="text-primary hover:text-primary/90 transition-colors">
              مشاهده همه
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} {...restaurant} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
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
