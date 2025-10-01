import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, switchMap, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

interface LoginResponse {
  token: string;
}

interface User {
  id: number;
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class LoginService {
  private apiUrl = 'https://fakestoreapi.com';
  private loggedIn = false;
  private currentUserId: number | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loggedIn = !!localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        this.currentUserId = +storedUserId;
      }
    }
  }

  login(username: string, password: string): Observable<number> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, {
      username,
      password,
    }).pipe(
      switchMap((response: LoginResponse) => {
        if (response.token && isPlatformBrowser(this.platformId)) {
          this.loggedIn = true;
          localStorage.setItem('token', response.token);
        }
        return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
          map(users => {
            const found = users.find(u => u.username === username && u.password === password);
            if (!found) {
              throw new Error('User not found');
            }
            this.currentUserId = found.id;
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('userId', String(found.id));
            }
            return found.id;
          })
        );
      })
    );
  }

  logout(): void {
    this.loggedIn = false;
    this.currentUserId = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getUserId(): number | null {
    return this.currentUserId;
  }
}
