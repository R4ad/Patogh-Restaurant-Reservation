import { useState } from 'react';
import { RestaurantCard } from '../components/RestaurantCard';
import { SearchBar } from '../components/SearchBar';
import { SlidersHorizontal, X } from 'lucide-react';
import { RestaurantCardSkeleton } from '../components/shared/SkeletonLoader';
import { EmptyState } from '../components/shared/EmptyState';
import { Search } from 'lucide-react';

const restaurants = [
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

export function SearchResults() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Search Summary */}
      <div className="bg-white border-b border-border sticky top-16 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchBar />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-xl p-6 border border-border sticky top-32">
              <h3 className="font-medium mb-4">فیلترها</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    محدوده قیمت
                  </label>
                  <div className="space-y-2">
                    {['ارزان', 'متوسط', 'گران', 'خیلی گران'].map((price) => (
                      <label key={price} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    امکانات
                  </label>
                  <div className="space-y-2">
                    {['Wi‑Fi', 'پارکینگ', 'فضای باز', 'غذای گیاهی'].map((facility) => (
                      <label key={facility} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl">
                {restaurants.length} رستوران یافت شد
              </h2>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/20"
                >
                  <option value="rating">بالاترین امتیاز</option>
                  <option value="price-low">ارزان‌ترین</option>
                  <option value="price-high">گران‌ترین</option>
                  <option value="distance">نزدیک‌ترین</option>
                </select>

                <button
                  onClick={() => setFilterOpen(true)}
                  className="lg:hidden px-4 py-2 bg-white border border-border rounded-lg flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  فیلتر
                </button>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <RestaurantCardSkeleton key={i} />
                ))}
              </div>
            ) : restaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} {...restaurant} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Search}
                title="نتیجه‌ای یافت نشد"
                description="لطفا فیلترها را تغییر دهید یا جستجوی دیگری انجام دهید"
                actionLabel="پاک کردن فیلترها"
                onAction={() => {}}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setFilterOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="font-medium">فیلترها</h3>
              <button onClick={() => setFilterOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {/* Same filters as desktop */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
