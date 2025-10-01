import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { CartService } from '../../../Services/cart.service';
import { Product } from '../../../Services/product.service';
import { CommonModule } from '@angular/common';
import { MATERIAL_IMPORTS } from '../../../material.imports';

@Component({
  selector: 'app-addtocartbutton',
  standalone: true,
  imports: [CommonModule, ...MATERIAL_IMPORTS],
  templateUrl: './addtocartbutton.component.html',
  styleUrls: ['./addtocartbutton.component.css']
})
export class AddtocartbuttonComponent implements OnInit, OnDestroy {
  private _product: Product | null = null;
  private product$ = new BehaviorSubject<Product | null>(null);

  @Input()
  set product(v: Product | null) {
    this._product = v;
    this.product$.next(v);
  }

  get product(): Product | null {
    return this._product;
  }

  quantity = 0;
  private sub?: Subscription;

  constructor(private cartService: CartService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.sub = combineLatest([this.product$, this.cartService.cart$]).subscribe({
      next: ([product, cartItems]) => {
        if (!product) {
          this.quantity = 0;
        } else {
          const found = cartItems.find(ci => ci.product.id === product.id);
          this.quantity = found ? found.quantity : 0;
        }
        this.cd.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.product$.complete();
  }

  addToCart() {
    if (!this._product) return;
    this.cartService.addItem(this._product, 1);
    this.quantity += 1;
    this.cd.markForCheck();
  }

  increment() {
    if (!this._product) return;
    this.cartService.updateItem(this._product.id, this.quantity + 1);
  }

  decrement() {
    if (!this._product) return;

    if (this.quantity > 1) {
      this.cartService.updateItem(this._product.id, this.quantity - 1);
    } else {
      this.quantity = 0;
      this.cartService.removeItem(this._product.id);
    }

    this.cd.markForCheck();
  }
}
