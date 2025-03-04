/* import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
 */
  import { bootstrapApplication } from '@angular/platform-browser';
  import { AppComponent } from './app/app.component';
  import { appConfig } from './app/app.config';
  
  // Utiliser la configuration définie dans app.config.ts
  bootstrapApplication(AppComponent, appConfig)
    .catch(err => console.error(err));