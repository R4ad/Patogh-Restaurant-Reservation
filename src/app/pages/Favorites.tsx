import { useState } from 'react';
import { RestaurantCard } from '../components/RestaurantCard';
import { EmptyState } from '../components/shared/EmptyState';
import { Heart } from 'lucide-react';

const savedRestaurants = [
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
];

export function Favorites() {
  const [favorites, setFavorites] = useState(savedRestaurants);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">علاقه‌مندی‌ها</h1>
          <p className="text-muted-foreground">
            رستوران‌ها و کافه‌های مورد علاقه شما
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((restaurant) => (
              <RestaurantCard key={restaurant.id} {...restaurant} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border">
            <EmptyState
              icon={Heart}
              title="هنوز جایی ذخیره نکرده‌اید"
              description="رستوران‌های مورد علاقه خود را ذخیره کنید تا راحت‌تر به آن‌ها دسترسی داشته باشید"
              actionLabel="کشف رستوران‌ها"
              onAction={() => window.location.href = '/search'}
            />
          </div>
        )}
      </div>
    </div>
  );
}
