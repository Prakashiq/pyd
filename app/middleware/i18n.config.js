import i18n from 'i18n';
import path from 'path';
 
i18n.configure({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  queryParameter: 'lang',
  directory: __dirname + '/locales',
  api: {
    '__': 'translate',  
    '__n': 'translateN' 
  },
});
 
export default i18n;