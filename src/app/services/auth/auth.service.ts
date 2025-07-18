import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthResponse } from '../../models/user.interface';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://biolink-api-835852425105.us-central1.run.app';
  private http = inject(HttpClient)
  private tokenSubject = new BehaviorSubject<string | null>(null);
  token$ = this.tokenSubject.asObservable();

  constructor() {
    this.restoreSession();
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value; // ✅ sin error
  }

  login(credentials: AuthResponse) {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        this.tokenSubject.next(response.access_token);
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('username', response.username);
      }
      )
    )
  }

  register(credentials: AuthResponse) {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, credentials);
  }

  logout() {
    this.tokenSubject.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  restoreSession() {
    if (typeof window !== undefined && typeof localStorage !== undefined) {
      const token = localStorage.getItem('token');

      if (token) {
        this.tokenSubject.next(token)
      }
    }
  }
}

