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
    Image: '/images/restaurant-1.jpg',
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
        Image: '/images/food-1.jpg',
      },
      {
        Id: 'm2',
        RestaurantId: '1',
        Name: 'چیزکیک توت فرنگی',
        Description: 'چیزکیک خانگی با سس توت فرنگی',
        Price: 65000,
        Image: '/images/food-1.jpg',
      },
      {
        Id: 'm3',
        RestaurantId: '1',
        Name: 'ساندویچ کلاب',
        Description: 'مرغ، گوشت، پنیر، سبزیجات تازه',
        Price: 125000,
        Image: '/images/food-1.jpg',
      },
      {
        Id: 'm4',
        RestaurantId: '1',
        Name: 'لاته',
        Description: 'اسپرسو با شیر داغ',
        Price: 50000,
        Image: '/images/food-1.jpg',
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
    Image: '/images/restaurant-2.jpg',
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
        Image: '/images/food-1.jpg',
      },
      {
        Id: 'm6',
        RestaurantId: '2',
        Name: 'قورمه‌سبزی',
        Description: 'خورشت سنتی با لوبیا و برنج ایرانی',
        Price: 150000,
        Image: '/images/food-1.jpg',
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
    Image: '/images/restaurant-3.jpg',
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
    Image: '/images/restaurant-4.jpg',
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
    Image: '/images/restaurant-5.jpg',
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
    Image: '/images/restaurant-6.jpg',
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
    Image: '/images/restaurant-1.jpg',
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
    Image: '/images/restaurant-2.jpg',
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
      image: '/images/restaurant-1.jpg',
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
      image: '/images/restaurant-2.jpg',
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
      image: '/images/restaurant-3.jpg',
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
      image: '/images/restaurant-4.jpg',
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
