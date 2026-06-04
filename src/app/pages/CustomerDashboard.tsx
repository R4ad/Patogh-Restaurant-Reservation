import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { StatusBadge } from '../components/StatusBadge';
import { Calendar, Clock, Users, MoreVertical } from 'lucide-react';

const reservations = [
  {
    id: '1',
    restaurant: {
      name: 'کافه نادری',
      image: '/images/restaurant-1.jpg',
    },
    date: '۱۴۰۳/۰۳/۱۵',
    time: '۱۸:۰۰',
    guests: 2,
    status: 'pending' as const,
    reservationNumber: 'RES-۱۲۳۴۵۶',
  },
  {
    id: '2',
    restaurant: {
      name: 'رستوران سنتی شیراز',
      image: '/images/restaurant-2.jpg',
    },
    date: '۱۴۰۳/۰۳/۱۰',
    time: '۲۰:۰۰',
    guests: 4,
    status: 'approved' as const,
    reservationNumber: 'RES-۱۲۳۴۵۵',
  },
  {
    id: '3',
    restaurant: {
      name: 'کافه رویال',
      image: '/images/restaurant-3.jpg',
    },
    date: '۱۴۰۳/۰۳/۰۵',
    time: '۱۶:۰۰',
    guests: 2,
    status: 'rejected' as const,
    reservationNumber: 'RES-۱۲۳۴۵۴',
  },
  {
    id: '4',
    restaurant: {
      name: 'رستوران آریا',
      image: '/images/restaurant-4.jpg',
    },
    date: '۱۴۰۳/۰۲/۲۵',
    time: '۱۹:۳۰',
    guests: 3,
    status: 'approved' as const,
    reservationNumber: 'RES-۱۲۳۴۵۳',
  },
];

export function CustomerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">رزروهای من</h1>
            <p className="text-muted-foreground">
              مشاهده و مدیریت رزروهای خود
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-1">در انتظار تایید</div>
              <div className="text-3xl font-semibold text-yellow-600">۱</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-1">تایید شده</div>
              <div className="text-3xl font-semibold text-green-600">۲</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-1">کل رزروها</div>
              <div className="text-3xl font-semibold text-primary">۴</div>
            </div>
          </div>

          {/* Reservations List - Desktop */}
          <div className="hidden md:block bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-right px-6 py-4 text-sm text-muted-foreground">
                      رستوران
                    </th>
                    <th className="text-right px-6 py-4 text-sm text-muted-foreground">
                      تاریخ
                    </th>
                    <th className="text-right px-6 py-4 text-sm text-muted-foreground">
                      ساعت
                    </th>
                    <th className="text-right px-6 py-4 text-sm text-muted-foreground">
                      تعداد نفرات
                    </th>
                    <th className="text-right px-6 py-4 text-sm text-muted-foreground">
                      وضعیت
                    </th>
                    <th className="text-right px-6 py-4 text-sm text-muted-foreground">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={reservation.restaurant.image}
                            alt={reservation.restaurant.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium">{reservation.restaurant.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {reservation.reservationNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{reservation.date}</td>
                      <td className="px-6 py-4">{reservation.time}</td>
                      <td className="px-6 py-4">{reservation.guests} نفر</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={reservation.status} />
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reservations List - Mobile */}
          <div className="md:hidden space-y-4">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="bg-white rounded-xl p-4 border border-border">
                <div className="flex items-start gap-3 mb-4">
                  <img
                    src={reservation.restaurant.image}
                    alt={reservation.restaurant.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{reservation.restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {reservation.reservationNumber}
                    </p>
                    <StatusBadge status={reservation.status} />
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{reservation.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{reservation.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{reservation.guests} نفر</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
