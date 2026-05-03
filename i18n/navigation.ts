import {createSharedPathnamesNavigation} from 'next-intl/navigation';
 
export const locales = ['en', 'hi', 'mr', 'as', 'bn', 'gu', 'kn', 'ml', 'or', 'pa', 'ta', 'te', 'ur'] as const;
export const localePrefix = 'always'; // Default
 
export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation({locales, localePrefix});
