import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './AuthService';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public authService: AuthService,
      ) {}

  canActivate(): boolean {
    return this.authService.isAuthenticated();
  }
}
