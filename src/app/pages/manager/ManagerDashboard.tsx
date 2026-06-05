import { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Check, X, Calendar, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';

const reservationRequests = [
  {
    id: '1',
    customer: {
      name: 'محمد احمدی',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
    },
    date: '۱۴۰۳/۰۳/۱۵',
    time: '۱۸:۰۰',
    guests: 2,
    status: 'pending' as const,
    reservationNumber: 'RES-۱۲۳۴۵۶',
    notes: 'لطفا میز کنار پنجره',
  },
  {
    id: '2',
    customer: {
      name: 'سارا کریمی',
      phone: '۰۹۱۹۸۷۶۵۴۳۲',
    },
    date: '۱۴۰۳/۰۳/۱۶',
    time: '۲۰:۰۰',
    guests: 4,
    status: 'pending' as const,
    reservationNumber: 'RES-۱۲۳۴۵۷',
    notes: '',
  },
  {
    id: '3',
    customer: {
      name: 'رضا محمدی',
      phone: '۰۹۱۲۱۱۱۲۲۲۲',
    },
    date: '۱۴۰۳/۰۳/۱۴',
    time: '۱۹:۳۰',
    guests: 3,
    status: 'approved' as const,
    reservationNumber: 'RES-۱۲۳۴۵۵',
    notes: '',
  },
  {
    id: '4',
    customer: {
      name: 'مینا رضایی',
      phone: '۰۹۱۳۳۳۳۴۴۴۴',
    },
    date: '۱۴۰۳/۰۳/۱۳',
    time: '۱۷:۰۰',
    guests: 2,
    status: 'rejected' as const,
    reservationNumber: 'RES-۱۲۳۴۵۴',
    notes: '',
  },
];

export function ManagerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState(reservationRequests);

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'approved' as const } : req))
    );
    toast.success('رزرو تأیید شد ✓');
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'rejected' as const } : req))
    );
    toast.error('رزرو رد شد');
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isManager isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl mb-2">مدیریت رزروها</h1>
            <p className="text-muted-foreground">
              مشاهده و تایید درخواست‌های رزرو
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-1">در انتظار بررسی</div>
              <div className="text-3xl font-semibold text-yellow-600">{pendingCount}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-1">تایید شده امروز</div>
              <div className="text-3xl font-semibold text-green-600">{approvedCount}</div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="text-sm text-muted-foreground mb-1">کل درخواست‌ها</div>
              <div className="text-3xl font-semibold text-primary">{requests.length}</div>
            </div>
          </div>

          {/* Requests Table - Desktop */}
          <div className="hidden md:block bg-white rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-right px-6 py-4 text-sm text-muted-foreground">
                      مشتری
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
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{request.customer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {request.customer.phone}
                          </div>
                          {request.notes && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {request.notes}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">{request.date}</td>
                      <td className="px-6 py-4">{request.time}</td>
                      <td className="px-6 py-4">{request.guests} نفر</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-4">
                        {request.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors"
                              title="تایید"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors"
                              title="رد"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Requests List - Mobile */}
          <div className="md:hidden space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl p-4 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium mb-1">{request.customer.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {request.customer.phone}
                    </p>
                    <StatusBadge status={request.status} />
                  </div>
                </div>

                {request.notes && (
                  <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">{request.notes}</p>
                  </div>
                )}

                <div className="space-y-2 pb-3 border-b border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{request.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{request.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{request.guests} نفر</span>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>تایید</span>
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      <span>رد</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
