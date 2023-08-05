import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AuthenticationBackend } from '../core/auth/authentication.backend';
import { Authorization } from '../core/auth/authorization.service';

const AUTHORIZATION: Authorization = {
  token: 'demo',
  issuedAt: new Date(),
  lifespan: 99999999999,
};

@Injectable()
export class DemoAuthenticationBackend implements AuthenticationBackend {
  requestAuthorization(): Observable<Authorization> {
    return of(AUTHORIZATION);
  }
  revokeAuthorization(): Observable<void> {
    return of(undefined);
  }
}
