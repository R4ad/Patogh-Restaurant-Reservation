import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from '../components/shared/Button';

export function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary mb-4">۴۰۴</h1>
          <h2 className="text-3xl mb-2">صفحه مورد نظر یافت نشد</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            متاسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button variant="primary" icon={Home} iconPosition="right">
              بازگشت به خانه
            </Button>
          </Link>
          <Link to="/search">
            <Button variant="outline" icon={Search} iconPosition="right">
              جستجوی رستوران‌ها
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
