import { Component} from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SearchComponent } from './components/container/search/search.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecommerce';


// showSearch: boolean = false;
//  constructor(private router: Router) {
//     this.router.events
//       .pipe(filter(event => event instanceof NavigationEnd))
//       .subscribe((event: any) => {
//          this.showSearch = event.urlAfterRedirects.startsWith('/products');
//       });
//   }
}