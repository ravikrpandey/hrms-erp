export const environment = {
  serverUrl: '',
  baseHref: typeof window !== 'undefined' ? window.location.origin + '/' : '/',
  pythonServerUrl: 'https://aihrms.zynotechnologies.com',
  defaultLanguage: 'Label',
  supportedLanguages: ['Label', 'TMSA'],
  production: true,
  erpUrl: 'http://localhost:4200'
};
