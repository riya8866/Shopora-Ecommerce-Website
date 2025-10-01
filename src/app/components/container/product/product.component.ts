import { Component, Input, SimpleChanges } from '@angular/core';
import { Product } from '../../../Services/product.service';
import { MATERIAL_IMPORTS } from '../../../material.imports';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../Services/cart.service';
import { AddtocartbuttonComponent } from '../../cart/addtocartbutton/addtocartbutton.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [...MATERIAL_IMPORTS, CommonModule, AddtocartbuttonComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product!: Product;

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && !this.product) {
      console.warn('Product input is undefined!');
    }
  }

  goToDetails(id: number) {
    this.router.navigate(['/products', id]);
  }

 
}
