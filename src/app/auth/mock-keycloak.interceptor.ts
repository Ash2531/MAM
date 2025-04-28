import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockKeycloakInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //refresh token mock-logic
    if (req.url.endsWith('/token')) {
      return of(new HttpResponse({
        status: 200,
        body: {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 2000,
          token_type: 'Bearer',
          id_token: 'mock-id-token'
        }
      }));
    }


    //Injecting authorization token for others request.
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer mock-access-token`
    }});

    return next.handle(req);
  }
}
