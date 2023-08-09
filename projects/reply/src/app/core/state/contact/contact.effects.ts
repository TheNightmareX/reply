import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of } from 'rxjs';

import { ContactBackend } from '@/app/data/contact/contact.backend';

import { CONTACT_ACTIONS } from './contact.actions';

@Injectable()
export class ContactEffects {
  private actions$ = inject(Actions);
  private contactService = inject(ContactBackend);

  loadContacts = createEffect(() =>
    this.actions$.pipe(
      ofType(CONTACT_ACTIONS.loadContacts),
      concatMap(() => this.contactService.loadContacts()),
      map((result) => CONTACT_ACTIONS.loadContactsCompleted({ result })),
      catchError((error) => of(CONTACT_ACTIONS.loadContactsFailed({ error }))),
    ),
  );
}
