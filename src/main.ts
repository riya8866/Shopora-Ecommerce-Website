import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; 
import { provideNoopAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),   
    provideRouter(routes),
    provideNoopAnimations()
  ]
})
.catch(err => console.error(err));
