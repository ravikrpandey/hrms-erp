import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './app/environments/environment';

if (environment.production) {
  enableProdMode();
  if (window) {
    window.console.log = () => { }
    window.console.error = () => { }
    window.console.warn = () => { }
    window.console.info = () => { }
    window.console.clear = () => { }
  }
} else {
  // if (window) {
  //   window.console.log = () => { }
  //   window.console.error = () => { }
  //   window.console.warn = () => { }
  //   window.console.info = () => { }
  //   window.console.clear = () => { }
  // }
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
