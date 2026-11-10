export const environment = {
  serverUrl: '__WORKER_API_URL__',
  baseHref: typeof window !== 'undefined' ? window.location.origin + '/' : '/',
  pythonServerUrl: 'https://aihrms.zynotechnologies.com',
  defaultLanguage: 'Label',
  supportedLanguages: ['Label', 'TMSA'],
  production: true,
  erpUrl: ''
};
