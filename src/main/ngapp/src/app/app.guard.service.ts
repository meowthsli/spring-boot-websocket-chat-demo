import { Injectable } from '@angular/core';
import { NbAuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable()
export class AppGuardService {

  constructor(private authService: NbAuthService, private router: Router) { }

  public canActivate() {
    return this.authService.isAuthenticated()
      .pipe(
        tap(authenticated => {
          if (!authenticated) {
            this.router.navigate(['auth/login']);
          }
        }),
      );
  }

}
