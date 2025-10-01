import { Routes } from '@angular/router';
import { ProductListComponent } from './components/container/product-list/product-list.component';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductdetailsComponent } from './components/container/productdetails/productdetails.component';
import { authGuard } from './Services/auth.guard';// 

export const routes: Routes = [

 { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductdetailsComponent }, 
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' } //wildcard
]
