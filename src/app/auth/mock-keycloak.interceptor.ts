import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

/**
 *
 */
interface TokenResponse{
  access_token: string;
  refresh_token: string;
}
/**
 *
 */
@Injectable()
export class MockKeycloakInterceptor implements HttpInterceptor {
  /**
   *
   * @param req
   * @param next
   * @returns Observable<HttpEvent<TokenResponse>>
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<TokenResponse>> {

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
        Authorization: 'Bearer mock-access-token'
      }});

    return next.handle(clonedReq);
  }
}
