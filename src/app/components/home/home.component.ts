import { Component } from '@angular/core';
import { SearchComponent } from '../container/search/search.component';
import { Router } from '@angular/router';
import { MATERIAL_IMPORTS } from '../../material.imports';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent, ...MATERIAL_IMPORTS],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 query: string = '';

  constructor(private router: Router) {}

  // Called only when search button is clicked
  onSearch(query: string) {
    if (query && query.trim() !== '') {
      this.router.navigate(['/products'], { queryParams: { q: query } });
    } else {
      this.router.navigate(['/products']);
    }
  }
  goToProducts() {
    this.router.navigate(['/products']);
  }
}
