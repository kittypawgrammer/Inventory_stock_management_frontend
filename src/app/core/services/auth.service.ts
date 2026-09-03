import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // LocalStorage flag used only to gate the UI. This is NOT real authentication
  // and holds no user identity or token - it is a stand-in until a real auth API exists.
  private readonly AUTH_KEY = 'is_logged_in';

  constructor(private readonly router: Router) {}

  // Stub: always logs the user in by setting the flag. Replace with a real
  // authentication call (token storage, expiry) when the backend supports it.
  login(): void {
    localStorage.setItem(this.AUTH_KEY, 'true');
  }

  // Stub: signup behaves exactly like login for now.
  signup(): void {
    localStorage.setItem(this.AUTH_KEY, 'true');
  }

  // Clears the flag and sends the user back to the login screen.
  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.router.navigate(['/login']);
  }

  // Reads the flag; localStorage access can throw if cookies/storage are blocked.
  isLoggedIn(): boolean {
    return localStorage.getItem(this.AUTH_KEY) === 'true';
  }
}
