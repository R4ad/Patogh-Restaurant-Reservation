import { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, Info, Loader2, Check } from 'lucide-react';
import { EmptyState } from '../../components/shared/EmptyState';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  type AppNotification,
} from '../../services/notification.service';

export function Notifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [isError,       setIsError]       = useState(false);

  const load = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      setNotifications(await getNotifications());
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRead = async (notifId: string) => {
    await markAsRead(notifId);
    setNotifications((prev) => prev.map((n) => n.id === notifId ? { ...n, read: true } : n));
  };

  const handleReadAll = async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />;
      case 'error':   return <XCircle    className="w-5 h-5 text-red-600   flex-shrink-0" />;
      default:        return <Info       className="w-5 h-5 text-blue-600  flex-shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

        {/* هدر */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl mb-2">اعلان‌ها</h1>
            <p className="text-muted-foreground">
              {isLoading ? '...' : unreadCount > 0 ? `${unreadCount} اعلان خوانده‌نشده` : 'همه خوانده شده‌اند'}
            </p>
          </div>
          {!isLoading && unreadCount > 0 && (
            <button
              onClick={handleReadAll}
              className="flex items-center gap-2 text-sm text-primary hover:underline mt-1"
            >
              <Check className="w-4 h-4" />
              خواندن همه
            </button>
          )}
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
            <p className="text-muted-foreground mb-4">خطا در بارگذاری اعلان‌ها</p>
            <button onClick={load} className="text-primary hover:underline text-sm">تلاش مجدد</button>
          </div>
        )}

        {/* خالی */}
        {!isLoading && !isError && notifications.length === 0 && (
          <div className="bg-white rounded-xl border border-border">
            <EmptyState
              icon={Bell}
              title="اعلانی وجود ندارد"
              description="هنوز هیچ اعلانی دریافت نکرده‌اید"
            />
          </div>
        )}

        {/* لیست */}
        {!isLoading && !isError && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.read && handleRead(n.id)}
                className={`bg-white rounded-xl p-4 border transition-colors ${
                  n.read
                    ? 'border-border cursor-default'
                    : 'border-primary/30 bg-primary/5 cursor-pointer hover:bg-primary/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{n.title}</h3>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}