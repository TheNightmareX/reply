import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { MailboxBackend } from '@/app/entity/mailbox/mailbox.backend';

import { MAILBOX_ACTIONS } from './mailbox.actions';

@Injectable()
export class MailboxEffects {
  private actions$ = inject(Actions);
  private mailboxService = inject(MailboxBackend);

  loadMailboxes = createEffect(() =>
    this.actions$.pipe(
      ofType(MAILBOX_ACTIONS.loadMailboxes),
      exhaustMap(() =>
        this.mailboxService.loadMailboxes().pipe(
          map((result) => MAILBOX_ACTIONS.loadMailboxesCompleted({ result })),
          catchError((error) =>
            of(MAILBOX_ACTIONS.loadMailboxesFailed({ error })),
          ),
        ),
      ),
    ),
  );
}
