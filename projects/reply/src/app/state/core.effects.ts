import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of, switchMap } from 'rxjs';

import { AuthenticationService } from '../core/auth/authentication.service';
import { BreakpointService } from '../core/breakpoint.service';
import { AccountService } from '../entity/account/account.service';
import { ContactBackend } from '../entity/contact/contact.backend';
import { CORE_ACTIONS } from './core.actions';

@Injectable()
export class CoreEffects {
  private actions$ = inject(Actions);
  private breakpointService = inject(BreakpointService);
  private authService = inject(AuthenticationService);
  private accountService = inject(AccountService);
  private contactService = inject(ContactBackend);

  updateBreakpoints = createEffect(() =>
    this.breakpointService
      .observeBreakpoints({
        ['tablet-portrait']: '(min-width: 600px)',
        ['tablet-landscape']: '(min-width: 905px)',
        ['laptop']: '(min-width: 1240px)',
        ['desktop']: '(min-width: 1440px)',
      })
      .pipe(map((to) => CORE_ACTIONS.breakpointsUpdated({ to }))),
  );

  authenticate = createEffect(() =>
    this.actions$.pipe(
      ofType(CORE_ACTIONS.authenticate),
      concatMap(({ hint }) =>
        this.authService.requestAuthorization(hint).pipe(
          switchMap((authorization) => {
            if (!authorization) return of(CORE_ACTIONS.authenticateCancelled());
            return of(null).pipe(
              concatMap(() => this.contactService.loadUser()),
              concatLatestFrom((user) => this.accountService.saveAccount(user)),
              map(([user, account]) => ({ authorization, user, account })),
              map((result) => CORE_ACTIONS.authenticateCompleted({ result })),
            );
          }),
          catchError((error) => of(CORE_ACTIONS.authenticateFailed({ error }))),
        ),
      ),
    ),
  );
}