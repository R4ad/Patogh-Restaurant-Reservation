import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/shared/Input';
import { Textarea } from '../../components/shared/Textarea';
import { Select } from '../../components/shared/Select';
import { Button } from '../../components/shared/Button';
import { FileUpload } from '../../components/shared/FileUpload';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const steps = [
  'اطلاعات پایه',
  'تماس و مدیر',
  'موقعیت مکانی',
  'ساعات کاری',
  'ظرفیت و رزرو',
  'قوانین',
  'تصاویر',
  'بررسی نهایی',
];

export function RestaurantOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    type: 'cafe',
    description: '',
    managerName: '',
    phone: '',
    email: '',
    city: 'tehran',
    address: '',
    workingDays: ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    startTime: '10:00',
    endTime: '23:00',
    capacity: '50',
    reservationDuration: '90',
    slotInterval: '30',
    maxGuests: '8',
    policy: '',
    cancellationPolicy: '',
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/owner-pending-approval');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Input
              label="نام مجموعه"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: کافه نارنج"
            />
            <Select
              label="نوع مجموعه"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'cafe', label: 'کافه' },
                { value: 'restaurant', label: 'رستوران' },
                { value: 'traditional', label: 'رستوران سنتی' },
                { value: 'fastfood', label: 'فست‌فود' },
              ]}
            />
            <Textarea
              label="توضیح کوتاه"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="توضیحی درباره مجموعه خود بنویسید..."
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <Input
              label="نام مدیر"
              required
              value={formData.managerName}
              onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
              placeholder="نام کامل مدیر مجموعه"
            />
            <Input
              label="شماره تماس"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="۰۲۱-۸۸۷۷۶۶۵۵"
            />
            <Input
              label="ایمیل"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@email.com"
              helperText="اختیاری"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Select
              label="شهر"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              options={[
                { value: 'tehran', label: 'تهران' },
                { value: 'isfahan', label: 'اصفهان' },
                { value: 'shiraz', label: 'شیراز' },
                { value: 'mashhad', label: 'مشهد' },
              ]}
            />
            <Textarea
              label="آدرس کامل"
              required
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="آدرس دقیق مجموعه خود را وارد کنید"
            />
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              نقشه تعاملی برای انتخاب موقعیت دقیق
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                روزهای کاری
              </label>
              <div className="space-y-2">
                {[
                  { value: 'saturday', label: 'شنبه' },
                  { value: 'sunday', label: 'یکشنبه' },
                  { value: 'monday', label: 'دوشنبه' },
                  { value: 'tuesday', label: 'سه‌شنبه' },
                  { value: 'wednesday', label: 'چهارشنبه' },
                  { value: 'thursday', label: 'پنجشنبه' },
                  { value: 'friday', label: 'جمعه' },
                ].map((day) => (
                  <label key={day.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.workingDays.includes(day.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            workingDays: [...formData.workingDays, day.value],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            workingDays: formData.workingDays.filter((d) => d !== day.value),
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <span>{day.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ساعت شروع"
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
              <Input
                label="ساعت پایان"
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Input
              label="ظرفیت کلی"
              type="number"
              required
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder="تعداد نفرات"
            />
            <Input
              label="مدت هر رزرو (دقیقه)"
              type="number"
              required
              value={formData.reservationDuration}
              onChange={(e) => setFormData({ ...formData, reservationDuration: e.target.value })}
              placeholder="مثال: ۹۰"
            />
            <Input
              label="فاصله بین رزروها (دقیقه)"
              type="number"
              required
              value={formData.slotInterval}
              onChange={(e) => setFormData({ ...formData, slotInterval: e.target.value })}
              placeholder="مثال: ۳۰"
            />
            <Input
              label="حداکثر تعداد نفرات در هر رزرو"
              type="number"
              required
              value={formData.maxGuests}
              onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
              placeholder="مثال: ۸"
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Textarea
              label="قوانین حضور"
              rows={4}
              value={formData.policy}
              onChange={(e) => setFormData({ ...formData, policy: e.target.value })}
              placeholder="قوانین و توضیحات برای مشتریان..."
            />
            <Textarea
              label="قوانین لغو رزرو"
              rows={4}
              value={formData.cancellationPolicy}
              onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
              placeholder="شرایط لغو رزرو را بنویسید..."
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <FileUpload
              label="لوگو و تصاویر مجموعه"
              multiple
              maxFiles={10}
              onFilesChange={setFiles}
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-medium mb-4">خلاصه اطلاعات</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-muted-foreground">نام مجموعه</dt>
                  <dd className="font-medium">{formData.name || '—'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">آدرس</dt>
                  <dd className="font-medium">{formData.address || '—'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">ظرفیت</dt>
                  <dd className="font-medium">{formData.capacity} نفر</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">تصاویر</dt>
                  <dd className="font-medium">{files.length} فایل</dd>
                </div>
              </dl>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                پس از ثبت، اطلاعات شما توسط تیم پاتوق بررسی خواهد شد و در صورت تایید، حساب کاربری شما فعال می‌شود.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm text-muted-foreground">
              مرحله {currentStep + 1} از {steps.length}
            </h2>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="hidden md:flex items-center justify-between mb-8 overflow-x-auto pb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    index < currentStep
                      ? 'bg-primary border-primary text-white'
                      : index === currentStep
                      ? 'border-primary text-primary bg-white'
                      : 'border-border text-muted-foreground bg-white'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                <span className="text-xs mt-2 text-center whitespace-nowrap">{step}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-12 h-0.5 bg-border mx-2 mb-6" />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl p-6 md:p-8 border border-border mb-6">
          <h1 className="text-2xl mb-6">{steps[currentStep]}</h1>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            icon={ChevronRight}
            iconPosition="right"
          >
            قبلی
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            icon={currentStep === steps.length - 1 ? undefined : ChevronLeft}
            iconPosition="left"
          >
            {currentStep === steps.length - 1 ? 'ثبت و ارسال' : 'بعدی'}
          </Button>
        </div>
      </div>
    </div>
  );
}
