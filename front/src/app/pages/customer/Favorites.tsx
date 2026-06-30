import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, X, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { RestaurantCard } from '../../components/shared/RestaurantCard';
import { EmptyState } from '../../components/shared/EmptyState';
import { getFavorites, toggleFavorite } from '../../services/favorite.service';
import type { Restaurant } from '../../types';

export function Favorites() {
  const navigate = useNavigate();
  const [favorites,   setFavorites]   = useState<Restaurant[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [isError,     setIsError]     = useState(false);
  const [removingId,  setRemovingId]  = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      setFavorites(await getFavorites());
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRemove = async (restaurantId: string, restaurantName: string) => {
    setRemovingId(restaurantId);
    try {
      await toggleFavorite(restaurantId);
      setFavorites((prev) => prev.filter((r) => r.Id !== restaurantId));
      toast.success(`${restaurantName} از علاقه‌مندی‌ها حذف شد`);
    } catch {
      toast.error('خطا در حذف از علاقه‌مندی‌ها');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">علاقه‌مندی‌ها</h1>
          <p className="text-muted-foreground">رستوران‌ها و کافه‌های مورد علاقه شما</p>
        </div>

        {/* بارگذاری */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* خطا */}
        {!isLoading && isError && (
          <div className="flex flex-col items-center py-16 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <p className="text-muted-foreground mb-4">خطا در بارگذاری علاقه‌مندی‌ها</p>
            <button onClick={load} className="text-primary hover:underline text-sm">تلاش مجدد</button>
          </div>
        )}

        {/* خالی */}
        {!isLoading && !isError && favorites.length === 0 && (
          <div className="bg-white rounded-xl border border-border">
            <EmptyState
              icon={Heart}
              title="هنوز جایی ذخیره نکرده‌اید"
              description="از صفحه‌ی رستوران‌ها علاقه‌مندی‌هایتان را ذخیره کنید"
              actionLabel="کشف رستوران‌ها"
              onAction={() => navigate('/search')}
            />
          </div>
        )}

        {/* لیست */}
        {!isLoading && !isError && favorites.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {favorites.length} رستوران ذخیره‌شده
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((r) => (
                <div key={r.Id} className="relative group">
                  {/* دکمه‌ی حذف */}
                  <button
                    onClick={() => handleRemove(r.Id, r.Name)}
                    disabled={removingId === r.Id}
                    className="absolute top-3 left-3 z-10 w-8 h-8 bg-white rounded-full shadow border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive transition-colors disabled:opacity-50"
                    title="حذف از علاقه‌مندی‌ها"
                  >
                    {removingId === r.Id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <X className="w-4 h-4" />}
                  </button>

                  <RestaurantCard
                    id={r.Id}
                    name={r.Name}
                    image={r.Image ?? '/images/restaurant-1.jpg'}
                    rating={r.rating ?? 0}
                    reviewCount={r.reviewCount ?? 0}
                    category={r.FoodType}
                    location={r.Location}
                    priceLevel={r.priceLevel ?? 2}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}