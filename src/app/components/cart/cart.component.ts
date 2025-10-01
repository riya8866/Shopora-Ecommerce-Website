import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService, CartItem } from '../../Services/cart.service';
import { CommonModule } from '@angular/common';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { Subscription } from 'rxjs';
import { LoginService } from '../../Services/login.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [...MATERIAL_IMPORTS, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
}) 
export class CartComponent implements OnInit, OnDestroy {
  cart: CartItem[] = [];
  private sub?: Subscription;

  constructor(private cartService: CartService, private loginService: LoginService) {}

  ngOnInit() {
    this.sub = this.cartService.cart$.subscribe(items => this.cart = items);

    const userId = this.loginService.getUserId();
    if (userId) {
      this.cartService.setUser(userId);
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  remove(productId: number) {
    this.cartService.removeItem(productId);
  }

  increaseQuantity(item: CartItem) {
    this.cartService.updateItem(item.product.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.updateItem(item.product.id, item.quantity - 1);
    } else {
      this.cartService.removeItem(item.product.id);
    }
  }

  getTotal() {
    return this.cartService.getTotalPrice();
  }
}
