import { useState } from 'react';
import { Input } from '../../components/shared/Input';
import { Textarea } from '../../components/shared/Textarea';
import { Button } from '../../components/shared/Button';
import { Select } from '../../components/shared/Select';
import { HelpCircle, Send } from 'lucide-react';

const faqs = [
  {
    question: 'چگونه می‌توانم رزرو کنم؟',
    answer: 'برای رزرو میز، ابتدا رستوران مورد نظر خود را جستجو کنید، سپس تاریخ و ساعت دلخواه را انتخاب کرده و فرم رزرو را تکمیل کنید.',
  },
  {
    question: 'آیا می‌توانم رزرو خود را لغو کنم؟',
    answer: 'بله، می‌توانید تا ۲۴ ساعت قبل از زمان رزرو، آن را از طریق داشبورد خود لغو کنید.',
  },
  {
    question: 'آیا هزینه‌ای برای رزرو دریافت می‌شود؟',
    answer: 'خیر، استفاده از پاتوق برای مشتریان کاملا رایگان است.',
  },
  {
    question: 'چگونه می‌دانم رزرو من تایید شده است؟',
    answer: 'پس از تایید رزرو توسط رستوران، پیامک و اعلان دریافت خواهید کرد.',
  },
];

export function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl mb-2">پشتیبانی و راهنما</h1>
          <p className="text-muted-foreground">
            ما اینجا هستیم تا به شما کمک کنیم
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div>
            <h2 className="text-xl mb-4">سوالات متداول</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="bg-white rounded-xl border border-border overflow-hidden group"
                >
                  <summary className="px-6 py-4 cursor-pointer hover:bg-muted/30 transition-colors flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-medium">{faq.question}</span>
                  </summary>
                  <div className="px-6 py-4 border-t border-border bg-muted/20">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl mb-4">تماس با پشتیبانی</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-border">
              <div className="space-y-4">
                <Input
                  label="نام و نام خانوادگی"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="نام خود را وارد کنید"
                />

                <Input
                  label="ایمیل"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com"
                />

                <Select
                  label="موضوع"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  options={[
                    { value: 'general', label: 'سوال عمومی' },
                    { value: 'reservation', label: 'مشکل رزرو' },
                    { value: 'payment', label: 'مشکل پرداخت' },
                    { value: 'other', label: 'سایر موارد' },
                  ]}
                />

                <Textarea
                  label="پیام"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="پیام خود را اینجا بنویسید..."
                />

                <Button
                  type="submit"
                  variant="primary"
                  icon={Send}
                  iconPosition="left"
                  className="w-full"
                  loading={submitted}
                >
                  {submitted ? 'ارسال شد' : 'ارسال پیام'}
                </Button>
              </div>

              {submitted && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
