// ============================================================
// Patogh — Mock Data (مرکزی)
// ============================================================
// تمام mock data پروژه اینجاست.
// وقتی VITE_USE_MOCK=true باشه سرویس‌ها از اینجا می‌خونن.

import type { Restaurant, Reservation, AuthUser } from '../../types';

// ── Restaurants ──────────────────────────────────────────────

export const mockRestaurants: Restaurant[] = [
  {
    Id: '1',
    Name: 'کافه نادری',
    Description: 'یک کافه مدرن با فضای دنج و منوی متنوع از قهوه‌های تخصصی و غذاهای خوشمزه',
    Location: 'تهران، میدان ونک، خیابان گاندی',
    FoodType: 'کافه مدرن',
    StartTime: '10:00',
    EndTime: '23:00',
    IsApproved: true,
    Image: 'https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=800',
    phone: '۰۲۱-۸۸۷۷۶۶۵۵',
    rating: 4.8,
    reviewCount: 234,
    priceLevel: 2,
    MenuItems: [
      {
        Id: 'm1',
        RestaurantId: '1',
        Name: 'کاپوچینو',
        Description: 'اسپرسو با شیر گرم و کف شیر',
        Price: 45000,
        Image: 'https://images.unsplash.com/photo-1542372147193-a7aca54189cd?w=400',
      },
      {
        Id: 'm2',
        RestaurantId: '1',
        Name: 'چیزکیک توت فرنگی',
        Description: 'چیزکیک خانگی با سس توت فرنگی',
        Price: 65000,
        Image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
      },
      {
        Id: 'm3',
        RestaurantId: '1',
        Name: 'ساندویچ کلاب',
        Description: 'مرغ، گوشت، پنیر، سبزیجات تازه',
        Price: 125000,
        Image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
      },
      {
        Id: 'm4',
        RestaurantId: '1',
        Name: 'لاته',
        Description: 'اسپرسو با شیر داغ',
        Price: 50000,
        Image: 'https://images.unsplash.com/photo-1542372147193-a7aca54189cd?w=400',
      },
    ],
    Tables: [
      { Id: 't1', RestaurantId: '1', TableNumber: 1, Capacity: 2 },
      { Id: 't2', RestaurantId: '1', TableNumber: 2, Capacity: 4 },
      { Id: 't3', RestaurantId: '1', TableNumber: 3, Capacity: 4 },
      { Id: 't4', RestaurantId: '1', TableNumber: 4, Capacity: 6 },
    ],
  },
  {
    Id: '2',
    Name: 'رستوران سنتی شیراز',
    Description: 'رستوران سنتی اصیل با غذاهای محلی شیراز و فضای دکوراسیون ایرانی',
    Location: 'تهران، سعادت‌آباد',
    FoodType: 'رستوران سنتی',
    StartTime: '12:00',
    EndTime: '23:00',
    IsApproved: true,
    Image: 'https://images.unsplash.com/photo-1778785241914-7f75ca16a92d?w=800',
    phone: '۰۲۱-۲۲۳۳۴۴۵۵',
    rating: 4.9,
    reviewCount: 456,
    priceLevel: 3,
    MenuItems: [
      {
        Id: 'm5',
        RestaurantId: '2',
        Name: 'کباب کوبیده',
        Description: 'کباب کوبیده مخصوص با گوجه کبابی و برنج',
        Price: 180000,
        Image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
      },
      {
        Id: 'm6',
        RestaurantId: '2',
        Name: 'قورمه‌سبزی',
        Description: 'خورشت سنتی با لوبیا و برنج ایرانی',
        Price: 150000,
        Image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
      },
    ],
    Tables: [
      { Id: 't5', RestaurantId: '2', TableNumber: 1, Capacity: 4 },
      { Id: 't6', RestaurantId: '2', TableNumber: 2, Capacity: 6 },
      { Id: 't7', RestaurantId: '2', TableNumber: 3, Capacity: 8 },
    ],
  },
  {
    Id: '3',
    Name: 'کافه رویال',
    Description: 'فضایی شیک و مدرن با بهترین قهوه‌های تخصصی',
    Location: 'تهران، نیاوران',
    FoodType: 'کافه',
    StartTime: '09:00',
    EndTime: '22:00',
    IsApproved: true,
    Image: 'https://images.unsplash.com/photo-1522126039546-182129aa0b93?w=800',
    rating: 4.7,
    reviewCount: 189,
    priceLevel: 2,
    MenuItems: [],
    Tables: [
      { Id: 't8', RestaurantId: '3', TableNumber: 1, Capacity: 2 },
      { Id: 't9', RestaurantId: '3', TableNumber: 2, Capacity: 2 },
    ],
  },
  {
    Id: '4',
    Name: 'رستوران آریا',
    Description: 'رستوران ایرانی اصیل با منوی متنوع و فضای دلنشین',
    Location: 'تهران، الهیه',
    FoodType: 'رستوران ایرانی',
    StartTime: '12:00',
    EndTime: '24:00',
    IsApproved: true,
    Image: 'https://images.unsplash.com/photo-1778634304493-23531df07739?w=800',
    rating: 4.6,
    reviewCount: 312,
    priceLevel: 3,
    MenuItems: [],
    Tables: [
      { Id: 't10', RestaurantId: '4', TableNumber: 1, Capacity: 4 },
      { Id: 't11', RestaurantId: '4', TableNumber: 2, Capacity: 6 },
    ],
  },
  {
    Id: '5',
    Name: 'کافه آرت',
    Description: 'کافه هنری با نمایشگاه دائمی و موسیقی زنده',
    Location: 'تهران، دروس',
    FoodType: 'کافه هنری',
    StartTime: '10:00',
    EndTime: '22:00',
    IsApproved: true,
    Image: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800',
    rating: 4.8,
    reviewCount: 267,
    priceLevel: 2,
    MenuItems: [],
    Tables: [
      { Id: 't12', RestaurantId: '5', TableNumber: 1, Capacity: 2 },
      { Id: 't13', RestaurantId: '5', TableNumber: 2, Capacity: 4 },
    ],
  },
  {
    Id: '6',
    Name: 'رستوران پارسیان',
    Description: 'رستوران لوکس با غذاهای ایرانی و بین‌المللی',
    Location: 'تهران، فرمانیه',
    FoodType: 'رستوران لوکس',
    StartTime: '13:00',
    EndTime: '24:00',
    IsApproved: true,
    Image: 'https://images.unsplash.com/photo-1759216282424-a48582525298?w=800',
    rating: 4.9,
    reviewCount: 523,
    priceLevel: 3,
    MenuItems: [],
    Tables: [
      { Id: 't14', RestaurantId: '6', TableNumber: 1, Capacity: 4 },
      { Id: 't15', RestaurantId: '6', TableNumber: 2, Capacity: 8 },
    ],
  },
  // رستوران‌های pending (برای ادمین)
  {
    Id: '7',
    Name: 'کافه برگ',
    Description: 'کافه طبیعت‌محور با فضای سبز و آرامش‌بخش',
    Location: 'تهران، جردن',
    FoodType: 'کافه',
    StartTime: '09:00',
    EndTime: '21:00',
    IsApproved: false,
    Image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    rating: 0,
    reviewCount: 0,
    priceLevel: 2,
    MenuItems: [],
    Tables: [],
  },
  {
    Id: '8',
    Name: 'رستوران دلتا',
    Description: 'رستوران فست‌فود با منوی متنوع',
    Location: 'تهران، شهرک غرب',
    FoodType: 'فست فود',
    StartTime: '11:00',
    EndTime: '23:00',
    IsApproved: false,
    Image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800',
    rating: 0,
    reviewCount: 0,
    priceLevel: 1,
    MenuItems: [],
    Tables: [],
  },
];

// ── Reservations ─────────────────────────────────────────────

export const mockReservations: Reservation[] = [
  {
    id: '1',
    restaurant: {
      name: 'کافه نادری',
      image: 'https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=400',
    },
    date: '۱۴۰۳/۰۳/۱۵',
    time: '۱۸:۰۰',
    guests: 2,
    status: 'pending',
    reservationNumber: 'RES-۱۲۳۴۵۶',
  },
  {
    id: '2',
    restaurant: {
      name: 'رستوران سنتی شیراز',
      image: 'https://images.unsplash.com/photo-1778785241914-7f75ca16a92d?w=400',
    },
    date: '۱۴۰۳/۰۳/۱۰',
    time: '۲۰:۰۰',
    guests: 4,
    status: 'approved',
    reservationNumber: 'RES-۱۲۳۴۵۵',
  },
  {
    id: '3',
    restaurant: {
      name: 'کافه رویال',
      image: 'https://images.unsplash.com/photo-1522126039546-182129aa0b93?w=400',
    },
    date: '۱۴۰۳/۰۳/۰۵',
    time: '۱۶:۰۰',
    guests: 2,
    status: 'rejected',
    reservationNumber: 'RES-۱۲۳۴۵۴',
  },
  {
    id: '4',
    restaurant: {
      name: 'رستوران آریا',
      image: 'https://images.unsplash.com/photo-1778634304493-23531df07739?w=400',
    },
    date: '۱۴۰۳/۰۲/۲۵',
    time: '۱۹:۳۰',
    guests: 3,
    status: 'approved',
    reservationNumber: 'RES-۱۲۳۴۵۳',
  },
];

// ── Mock Users (برای تست لاگین) ──────────────────────────────

export const mockUsers: Record<string, AuthUser & { password: string }> = {
  '09121234567': {
    accessToken: 'mock-token-customer-abc123',
    PhoneNumber: '09121234567',
    role: 'customer',
    UserId: 'user-1',
    password: '1234',
  },
  '09129876543': {
    accessToken: 'mock-token-manager-xyz789',
    PhoneNumber: '09129876543',
    role: 'manager',
    UserId: 'user-2',
    password: '1234',
  },
};

export const mockAdmin = {
  username: 'admin',
  password: 'admin123',
  accessToken: 'mock-token-admin-super',
};
