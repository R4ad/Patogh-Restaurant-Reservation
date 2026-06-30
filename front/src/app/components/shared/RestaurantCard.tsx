import { Star, MapPin, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatRating } from '../../utils/format';

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  location: string;
  priceLevel: number;
}

export function RestaurantCard({
  id,
  name,
  image,
  rating,
  reviewCount,
  category,
  location,
  priceLevel,
}: RestaurantCardProps) {
  return (
    <Link
      to={`/restaurant/${id}`}
      className="group bg-white rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-sm">{formatRating(rating)}</span>
            <span className="text-muted-foreground text-sm">({reviewCount})</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{category}</span>
          <div className="flex items-center">
            {Array.from({ length: priceLevel }).map((_, i) => (
              <DollarSign key={i} className="w-3.5 h-3.5 text-primary" />
            ))}
            {Array.from({ length: 3 - priceLevel }).map((_, i) => (
              <DollarSign key={i + priceLevel} className="w-3.5 h-3.5 text-muted" />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
