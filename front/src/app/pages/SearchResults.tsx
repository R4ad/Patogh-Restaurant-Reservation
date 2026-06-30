import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Search, AlertCircle } from 'lucide-react';
import { RestaurantCard } from '../components/shared/RestaurantCard';
import { SearchBar } from '../components/shared/SearchBar';
import { RestaurantCardSkeleton } from '../components/shared/SkeletonLoader';
import { EmptyState } from '../components/shared/EmptyState';
import { getRestaurants } from '../services/restaurant.service';
import type { Restaurant } from '../types';

type SortKey = 'rating' | 'price-low' | 'price-high';

const PRICE_LABELS: Record<number, string> = { 1: 'ارزان', 2: 'متوسط', 3: 'گران' };

export function SearchResults() {
  const [searchParams] = useSearchParams();

  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [isLoading,      setIsLoading]      = useState(true);
  const [isError,        setIsError]        = useState(false);
  const [filterOpen,     setFilterOpen]     = useState(false);
  const [sortBy,         setSortBy]         = useState<SortKey>('rating');
  const [selectedPrices,    setSelectedPrices]    = useState<number[]>([]);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<string[]>(() => {
    const ft = searchParams.get('foodType');
    return ft ? [ft] : [];
  });

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    getRestaurants()
      .then(setAllRestaurants)
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  // هماهنگ‌سازی فیلتر نوع غذا با تغییر URL
  useEffect(() => {
    const ft = searchParams.get('foodType');
    setSelectedFoodTypes(ft ? [ft] : []);
  }, [searchParams]);

  // نوع غذاهای موجود در داده — پویا
  const availableFoodTypes = useMemo(
    () => [...new Set(allRestaurants.map((r) => r.FoodType))].filter(Boolean).sort(),
    [allRestaurants],
  );

  // فیلتر + مرتب‌سازی — سمت کلاینت
  const results = useMemo(() => {
    const q = (searchParams.get('q') ?? '').toLowerCase();
    let list = [...allRestaurants];

    // جستجوی متنی
    if (q) {
      list = list.filter(
        (r) =>
          r.Name.toLowerCase().includes(q) ||
          r.FoodType.toLowerCase().includes(q) ||
          r.Location.toLowerCase().includes(q),
      );
    }

    // فیلتر نوع غذا
    if (selectedFoodTypes.length > 0) {
      list = list.filter((r) => selectedFoodTypes.includes(r.FoodType));
    }

    // فیلتر قیمت
    if (selectedPrices.length > 0) {
      list = list.filter((r) => selectedPrices.includes(r.priceLevel ?? 2));
    }

    // مرتب‌سازی
    if (sortBy === 'rating')     list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sortBy === 'price-low')  list.sort((a, b) => (a.priceLevel ?? 2) - (b.priceLevel ?? 2));
    if (sortBy === 'price-high') list.sort((a, b) => (b.priceLevel ?? 2) - (a.priceLevel ?? 2));

    return list;
  }, [allRestaurants, searchParams, selectedFoodTypes, selectedPrices, sortBy]);

  const togglePrice    = (p: number) =>
    setSelectedPrices((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  const toggleFoodType = (t: string) =>
    setSelectedFoodTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const clearFilters = () => {
    setSelectedPrices([]);
    setSelectedFoodTypes([]);
    setSortBy('rating');
  };

  const hasActiveFilters = selectedPrices.length > 0 || selectedFoodTypes.length > 0;

  const FilterPanel = () => (
    <div className="space-y-6">

      {/* فیلتر نوع غذا */}
      {availableFoodTypes.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3">نوع رستوران</p>
          <div className="space-y-2">
            {availableFoodTypes.map((t) => (
              <label key={t} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFoodTypes.includes(t)}
                  onChange={() => toggleFoodType(t)}
                  className="rounded accent-primary"
                />
                <span className="text-sm">{t}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* فیلتر قیمت */}
      <div>
        <p className="text-sm font-medium mb-3">محدوده قیمت</p>
        <div className="space-y-2">
          {[1, 2, 3].map((p) => (
            <label key={p} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedPrices.includes(p)}
                onChange={() => togglePrice(p)}
                className="rounded accent-primary"
              />
              <span className="text-sm">{PRICE_LABELS[p]}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">

      {/* نوار جستجو */}
      <div className="bg-white border-b border-border sticky top-16 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchBar />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* فیلتر — دسکتاپ */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-xl p-6 border border-border sticky top-32">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">فیلترها</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-primary hover:underline">
                    پاک کردن
                  </button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* نتایج */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl">
                {isLoading
                  ? 'در حال جستجو...'
                  : isError
                  ? 'خطا در بارگذاری'
                  : `${results.length} رستوران یافت شد`}
              </h2>
              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/20 text-sm"
                >
                  <option value="rating">بالاترین امتیاز</option>
                  <option value="price-low">ارزان‌ترین</option>
                  <option value="price-high">گران‌ترین</option>
                </select>
                <button
                  onClick={() => setFilterOpen(true)}
                  className="lg:hidden px-4 py-2 bg-white border border-border rounded-lg flex items-center gap-2 text-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  فیلتر
                  {hasActiveFilters && (
                    <span className="bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {selectedPrices.length + selectedFoodTypes.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* حالت بارگذاری */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <RestaurantCardSkeleton key={i} />)}
              </div>
            )}

            {/* حالت خطا */}
            {!isLoading && isError && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="w-14 h-14 text-destructive mb-4" />
                <h3 className="text-lg mb-2">خطا در بارگذاری رستوران‌ها</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  متأسفانه مشکلی پیش آمد. لطفاً دوباره تلاش کنید
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  تلاش مجدد
                </button>
              </div>
            )}

            {/* حالت خالی */}
            {!isLoading && !isError && results.length === 0 && (
              <EmptyState
                icon={Search}
                title="نتیجه‌ای یافت نشد"
                description="لطفاً فیلترها را تغییر دهید یا جستجوی دیگری انجام دهید"
                actionLabel="پاک کردن فیلترها"
                onAction={clearFilters}
              />
            )}

            {/* نتایج */}
            {!isLoading && !isError && results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((r) => (
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
            )}
          </div>
        </div>
      </div>

      {/* Drawer موبایل */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="font-medium">فیلترها</h3>
              <button onClick={() => setFilterOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <FilterPanel />
            </div>
            <div className="p-4 border-t border-border bg-white">
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                نمایش نتایج ({results.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}