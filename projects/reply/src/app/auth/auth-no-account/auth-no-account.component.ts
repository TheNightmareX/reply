import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, tap, withLatestFrom } from 'rxjs';

import { AUTHENTICATION_ACTIONS } from '@/app/core/authentication.actions';
import { CORE_STATE } from '@/app/state/core/core.state-entry';

@Component({
  selector: 'rpl-auth-no-account',
  templateUrl: './auth-no-account.component.html',
  styleUrls: ['./auth-no-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthNoAccountComponent {
  private store = inject(Store);

  buttonClick = new EventEmitter();

  busy$ = this.store
    .select(CORE_STATE.selectAuthenticationStatus)
    .pipe(map((s) => s.type === 'completed'));

  constructor() {
    this.buttonClick
      .pipe(
        withLatestFrom(this.busy$),
        filter(([_, busy]) => !busy),
        tap(() => this.store.dispatch(AUTHENTICATION_ACTIONS.authenticate({}))),
      )
      .subscribe();
  }
}
