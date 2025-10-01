import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductService } from '../../../Services/product.service';
import { ProductComponent } from '../product/product.component';
import { MATERIAL_IMPORTS } from '../../../material.imports';
import { SearchComponent } from '../search/search.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductComponent,
    ...MATERIAL_IMPORTS,
    SearchComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  providers: [ProductService],
})
export class ProductListComponent {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';
  isLoading: boolean = true;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}
  //productlist = inject(ProductService);

  ngOnInit(): void {
    this.getProductDetails();

    this.route.queryParams.subscribe((params) => {
      const q = params['q'] || '';
      this.searchQuery = q;
      if (q) {
        this.applyFilter();          //filters without button
      }
    });
  }

  //products$: Observable<Product[]> = inject(ProductService).getProducts();

  getProductDetails() {
    this.isLoading = true;
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = [...data];
      this.isLoading = false;

      // re-apply filter if query param exists
      if (this.searchQuery) {
        this.applyFilter();
      }
    });
  }

  // Handles search from search bar
  onSearch(query: string) {
    this.searchQuery = query;
    this.applyFilter();
  }

   applyFilter() {
    if (!this.products.length) return; // wait until products are loaded

    const q = this.searchQuery.trim().toLowerCase();

    if (q === '') {
      // reset to all products
      this.filteredProducts = [...this.products];
      return;
    }
    // const regex = new RegExp(`\\b${q}\\b`, 'i'); // \b = word boundary
    this.filteredProducts = this.products.filter(p =>
      p.title?.toLowerCase().includes(q)||
  p.description?.toLowerCase().includes(q)
    );
  }
}
