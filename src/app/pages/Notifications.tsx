import { Bell, CheckCircle, XCircle, Info } from 'lucide-react';
import { EmptyState } from '../components/shared/EmptyState';

const notifications = [
  {
    id: '1',
    type: 'success',
    title: 'رزرو شما تایید شد',
    message: 'رزرو شما در کافه نادری برای تاریخ ۱۴۰۳/۰۳/۱۵ ساعت ۱۸:۰۰ تایید شد',
    time: '۲ ساعت پیش',
    read: false,
  },
  {
    id: '2',
    type: 'error',
    title: 'رزرو رد شد',
    message: 'متاسفانه رزرو شما در رستوران سنتی شیراز به دلیل عدم ظرفیت رد شد',
    time: '۵ ساعت پیش',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'یادآوری رزرو',
    message: 'رزرو شما در کافه رویال فردا ساعت ۱۶:۰۰ است',
    time: '۱ روز پیش',
    read: true,
  },
];

export function Notifications() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">اعلان‌ها</h1>
          <p className="text-muted-foreground">
            {notifications.filter((n) => !n.read).length} اعلان خوانده نشده
          </p>
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl p-4 border transition-colors ${
                  notification.read
                    ? 'border-border'
                    : 'border-primary/30 bg-primary/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border">
            <EmptyState
              icon={Bell}
              title="اعلانی وجود ندارد"
              description="هنوز هیچ اعلانی دریافت نکرده‌اید"
            />
          </div>
        )}
      </div>
    </div>
  );
}
