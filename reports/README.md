# گزارش‌های پروژه پاتوق

## فهرست گزارش‌ها

| فایل | عنوان | صفحات |
|------|-------|-------|
| `01-User-Stories-Report.pdf` | گزارش User Storyهای پروژه | ۱۲ صفحه |
| `02-Sprint-1-Report.pdf` | گزارش اسپرینت اول — زیرساخت و پایه‌گذاری | ۱۰ صفحه |
| `03-Sprint-2-Report.pdf` | گزارش اسپرینت دوم — توسعه قابلیت‌های اصلی | ۱۱ صفحه |
| `04-Sprint-3-Report.pdf` | گزارش اسپرینت سوم — تکمیل، امنیت و رفع باگ | ۱۵ صفحه |

## نحوه Compile کردن

### پیش‌نیاز
- XeLaTeX (از توزیع TeX Live یا MiKTeX)
- فونت Vazirmatn نصب‌شده روی سیستم
- فونت Times New Roman نصب‌شده

### دستور Compile

```bash
cd reports
xelatex 01-User-Stories-Report.tex && xelatex 01-User-Stories-Report.tex
xelatex 02-Sprint-1-Report.tex && xelatex 02-Sprint-1-Report.tex
xelatex 03-Sprint-2-Report.tex && xelatex 03-Sprint-2-Report.tex
xelatex 04-Sprint-3-Report.tex && xelatex 04-Sprint-3-Report.tex
```

> هر فایل دو بار compile می‌شود تا فهرست مطالب (TOC) به درستی ایجاد شود.

### فایل‌های خروجی
- `01-User-Stories-Report.pdf`
- `02-Sprint-1-Report.pdf`
- `03-Sprint-2-Report.pdf`
- `04-Sprint-3-Report.pdf`
