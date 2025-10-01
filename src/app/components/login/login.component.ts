import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginService } from '../../Services/login.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  activeTab: 'login' | 'register' = 'login';

  username = '';
  password = '';

  constructor(
    private loginService: LoginService,
    private cartService: CartService,
    private router: Router
  ) {}

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
  }

  onLogin() {
    if (!this.username || !this.password) {
      alert('Please enter username and password');
      return;
    }

    this.loginService.login(this.username, this.password).subscribe({
      next: (userId: number) => {
        console.log('Login success! userId =', userId);
        this.cartService.setUser(userId); // Load latest cart for this user
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Login failed. Please check your credentials.');
      },
    });
  }
}
