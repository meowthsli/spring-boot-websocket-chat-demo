import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators/switchMap';

import { NbAuthService } from '../auth.service';
import { NbAuthJWTToken } from '../token.service';

@Injectable()
export class NbAuthJWTInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.getToken()
      .pipe(
        switchMap((token: NbAuthJWTToken) => {

          req = req.clone({
            url: req.url.search(/^\/api\//) > -1 ? 'http://localhost:8080' + req.url : req.url
          });

          if (token && token.getValue() && [
              this.authService.getProvider('email').getConfigValue('login.endpoint'),
              this.authService.getProvider('email').getConfigValue('register.endpoint')
            ].indexOf(req.url) < 0) {
            // const JWT = `Bearer ${token.getValue()}`;
            const JWT = token.getValue();
            req = req.clone({
              setHeaders: {
                Authorization: JWT,
              },
            });
          }
          return next.handle(req);
        }),
      );
  }

  protected get authService(): NbAuthService {
    return this.injector.get(NbAuthService);
  }
}
