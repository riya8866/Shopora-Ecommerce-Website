import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface ApiCart {
  id: number;
  userId: number;
  date: string;
  products: { productId: number; quantity: number }[];
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  private apiUrl = 'https://fakestoreapi.com/carts';
  private productApiUrl = 'https://fakestoreapi.com/products';

  private userId: number | null = null;
  private currentCartId: number | null = null;

  constructor(private http: HttpClient) {}

  /** Set the logged-in user and load their latest cart */
  setUser(userId: number) {
    this.userId = userId;
    this.loadCartFromApi();
  }

  private get items(): CartItem[] {
    return this.cartSubject.getValue();
  }

  /** Load the most recent cart for this user */
  public loadCartFromApi() {
    if (!this.userId) {
      console.warn('No user logged in, cannot load cart');
      return;
    }

    this.http.get<ApiCart[]>(this.apiUrl).subscribe({
      next: (carts) => {
        const userCarts = carts.filter(c => c.userId === this.userId);

        if (!userCarts.length) {
          // No cart exists for this user yet
          this.cartSubject.next([]);
          this.currentCartId = null;
          return;
        }

        // Pick latest cart by date
        const latestCart = userCarts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

        this.currentCartId = latestCart.id;

        if (!latestCart.products?.length) {
          this.cartSubject.next([]);
          return;
        }

        // Fetch product details for each cart item
        const requests = latestCart.products.map(p =>
          this.http.get<Product>(`${this.productApiUrl}/${p.productId}`).pipe(
            catchError(() =>
              of({
                id: p.productId,
                title: 'Unknown Product',
                price: 0,
                description: '',
                category: '',
                image: ''
              } as Product)
            )
          )
        );

        forkJoin(requests).subscribe((products) => {
          const items: CartItem[] = products.map((product, idx) => ({
            product,
            quantity: latestCart.products[idx].quantity
          }));
          this.cartSubject.next(items);
        });
      },
      error: (err) => console.error('Failed to load carts', err)
    });
  }

  /** Save the cart back to API (POST or PUT) */
  private saveCart(items: CartItem[]) {
    if (!this.userId) {
      console.error('No user set for cart');
      return;
    }

    const payload = {
      userId: this.userId,
      date: new Date().toISOString(),
      products: items.map(i => ({
        productId: i.product.id,
        quantity: i.quantity
      }))
    };

    if (!this.currentCartId) {
      // Create new cart
      this.http.post<ApiCart>(this.apiUrl, payload).subscribe({
        next: (res) => {
          console.log('Cart created via POST', res);
          this.currentCartId = res.id;
        },
        error: (err) => console.error('Failed to create cart', err)
      });
    } else {
      // Update existing cart
      this.http.put(`${this.apiUrl}/${this.currentCartId}`, payload).subscribe({
        next: (res) => console.log('Cart updated via PUT', res),
        error: (err) => console.error('Failed to update cart', err)
      });
    }
  }

  /** Add an item */
  addItem(product: Product, quantity: number = 1) {
    const existing = this.items.find(i => i.product.id === product.id);
    const updatedItems = [...this.items];

    if (existing) {
      existing.quantity += quantity;
    } else {
      updatedItems.push({ product, quantity });
    }

    this.cartSubject.next(updatedItems);
    this.saveCart(updatedItems);
  }

  /** Remove an item */
  removeItem(productId: number) {
    const updatedItems = this.items.filter(i => i.product.id !== productId);

    if (updatedItems.length === 0) {
      this.clearCart();
    } else {
      this.cartSubject.next(updatedItems);
      this.saveCart(updatedItems);
    }
  }

  /** Update item quantity */
  updateItem(productId: number, quantity: number) {
    const updatedItems = this.items.map(i =>
      i.product.id === productId ? { ...i, quantity } : i
    );

    this.cartSubject.next(updatedItems);
    this.saveCart(updatedItems);
  }

  /** Clear the cart (DELETE API) */
  clearCart() {
    if (!this.currentCartId) {
      console.error('No cart to delete');
      return;
    }

    this.cartSubject.next([]);

    this.http.delete(`${this.apiUrl}/${this.currentCartId}`).subscribe({
      next: (res) => {
        console.log('Cart deleted via DELETE', res);
        this.currentCartId = null;
      },
      error: (err) => console.error('Failed to delete cart', err)
    });
  }

  /** Total price */
  getTotalPrice(): number {
    return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }
}
