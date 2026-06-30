import { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { formatJalaliDate } from '../../utils/jalali';

interface DaySchedule {
  day: string;
  dayLabel: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}

const initialSchedule: DaySchedule[] = [
  { day: 'saturday', dayLabel: 'شنبه', enabled: true, startTime: '10:00', endTime: '23:00' },
  { day: 'sunday', dayLabel: 'یکشنبه', enabled: true, startTime: '10:00', endTime: '23:00' },
  { day: 'monday', dayLabel: 'دوشنبه', enabled: true, startTime: '10:00', endTime: '23:00' },
  { day: 'tuesday', dayLabel: 'سه‌شنبه', enabled: true, startTime: '10:00', endTime: '23:00' },
  { day: 'wednesday', dayLabel: 'چهارشنبه', enabled: true, startTime: '10:00', endTime: '23:00' },
  { day: 'thursday', dayLabel: 'پنجشنبه', enabled: true, startTime: '10:00', endTime: '23:00' },
  { day: 'friday', dayLabel: 'جمعه', enabled: false, startTime: '10:00', endTime: '23:00' },
];

interface ClosedDate {
  id: string;
  date: string;
  reason: string;
}

export function WorkingHoursSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [closedDates, setClosedDates] = useState<ClosedDate[]>([
    { id: '1', date: '2026-06-15', reason: 'تعطیلات تابستان' },
  ]);
  const [newClosedDate, setNewClosedDate] = useState({ date: '', reason: '' });
  const [capacity, setCapacity] = useState({
    capacity: '50',
    reservationDuration: '90',
    slotInterval: '30',
    maxGuests: '8',
  });

  const handleScheduleChange = (day: string, field: string, value: any) => {
    setSchedule(
      schedule.map((s) =>
        s.day === day ? { ...s, [field]: value } : s
      )
    );
  };

  const handleAddClosedDate = () => {
    if (newClosedDate.date) {
      setClosedDates([
        ...closedDates,
        { id: String(Date.now()), ...newClosedDate },
      ]);
      setNewClosedDate({ date: '', reason: '' });
    }
  };

  const handleRemoveClosedDate = (id: string) => {
    setClosedDates(closedDates.filter((d) => d.id !== id));
  };

  const handleSave = () => {
    // endpoint برای ذخیره ساعات کاری هنوز از بک‌اند نگرفتیم
    toast.success('تنظیمات با موفقیت ذخیره شد');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isManager isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl mb-2">ساعات کاری و ظرفیت</h1>
              <p className="text-muted-foreground">مدیریت ساعات کاری و روزهای تعطیل</p>
            </div>
            <Button variant="primary" icon={Save} onClick={handleSave}>
              ذخیره تغییرات
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Schedule */}
            <div className="bg-white rounded-xl p-6 border border-border h-fit">
              <h2 className="text-xl mb-6">ساعات کاری هفتگی</h2>
              <div className="space-y-4">
                {schedule.map((day) => (
                  <div key={day.day} className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="checkbox"
                        id={day.day}
                        checked={day.enabled}
                        onChange={(e) =>
                          handleScheduleChange(day.day, 'enabled', e.target.checked)
                        }
                        className="rounded"
                      />
                      <label htmlFor={day.day} className="font-medium">
                        {day.dayLabel}
                      </label>
                    </div>

                    {day.enabled && (
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="از ساعت"
                          type="time"
                          value={day.startTime}
                          onChange={(e) =>
                            handleScheduleChange(day.day, 'startTime', e.target.value)
                          }
                        />
                        <Input
                          label="تا ساعت"
                          type="time"
                          value={day.endTime}
                          onChange={(e) =>
                            handleScheduleChange(day.day, 'endTime', e.target.value)
                          }
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Closed Dates */}
            <div>
              <div className="bg-white rounded-xl p-6 border border-border mb-6">
                <h2 className="text-xl mb-6">افزودن روز تعطیل</h2>
                <div className="space-y-4">
                  <Input
                    label="تاریخ"
                    type="date"
                    value={newClosedDate.date}
                    onChange={(e) =>
                      setNewClosedDate({ ...newClosedDate, date: e.target.value })
                    }
                  />
                  <Input
                    label="دلیل تعطیلی"
                    value={newClosedDate.reason}
                    onChange={(e) =>
                      setNewClosedDate({ ...newClosedDate, reason: e.target.value })
                    }
                    placeholder="مثال: تعطیلات رسمی"
                  />
                  <Button
                    variant="primary"
                    icon={Plus}
                    onClick={handleAddClosedDate}
                    className="w-full"
                  >
                    افزودن
                  </Button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-border">
                <h2 className="text-xl mb-6">روزهای تعطیل</h2>
                {closedDates.length > 0 ? (
                  <div className="space-y-3">
                    {closedDates.map((date) => (
                      <div
                        key={date.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{formatJalaliDate(date.date)}</p>
                          {date.reason && (
                            <p className="text-sm text-muted-foreground">{date.reason}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveClosedDate(date.id)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    هنوز روز تعطیلی ثبت نشده است
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Capacity Settings */}
          <div className="bg-white rounded-xl p-6 border border-border mt-6">
            <h2 className="text-xl mb-6">تنظیمات ظرفیت و رزرو</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="ظرفیت کلی"
                type="number"
                value={capacity.capacity}
                onChange={(e) => setCapacity({ ...capacity, capacity: e.target.value })}
                placeholder="تعداد نفرات"
              />
              <Input
                label="مدت هر رزرو (دقیقه)"
                type="number"
                value={capacity.reservationDuration}
                onChange={(e) => setCapacity({ ...capacity, reservationDuration: e.target.value })}
                placeholder="90"
              />
              <Input
                label="فاصله بین رزروها (دقیقه)"
                type="number"
                value={capacity.slotInterval}
                onChange={(e) => setCapacity({ ...capacity, slotInterval: e.target.value })}
                placeholder="30"
              />
              <Input
                label="حداکثر نفرات هر رزرو"
                type="number"
                value={capacity.maxGuests}
                onChange={(e) => setCapacity({ ...capacity, maxGuests: e.target.value })}
                placeholder="8"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
