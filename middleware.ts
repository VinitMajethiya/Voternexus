import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'hi', 'mr', 'as', 'bn', 'gu', 'kn', 'ml', 'or', 'pa', 'ta', 'te', 'ur'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});
 
export const config = {
  matcher: ['/', '/(hi|en|mr|as|bn|gu|kn|ml|or|pa|ta|te|ur)/:path*']
};
