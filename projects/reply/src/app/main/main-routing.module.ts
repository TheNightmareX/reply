import { inject, NgModule } from '@angular/core';
import { CanActivateFn, RouterModule, Routes } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, firstValueFrom } from 'rxjs';

import { CONTACT_ACTIONS } from '../entity/contact/contact.actions';
import { MAIL_ACTIONS } from '../entity/mail/mail.actions';
import { MAILBOX_ACTIONS } from '../entity/mailbox/mailbox.actions';
import { CONTACT_STATE } from '../state/contact/contact.state-entry';
import { CORE_STATE } from '../state/core/core.state-entry';
import { MAIL_STATE } from '../state/mail/mail.state-entry';
import { MAILBOX_STATE } from '../state/mailbox/mailbox.state-entry';
import { BaseFoundationComponent } from './base-foundation/base-foundation.component';
import { MainComponent } from './main.component';
import { UpperFoundationComponent } from './upper-foundation/upper-foundation.component';

const dataInitializer: CanActivateFn = async () => {
  const store = inject(Store);

  const authenticate$ = store
    .select(CORE_STATE.selectAuthenticated)
    .pipe(filter(Boolean));
  await firstValueFrom(authenticate$);

  store.dispatch(CONTACT_ACTIONS.loadContacts());
  store.dispatch(MAILBOX_ACTIONS.loadMailboxes());
  store.dispatch(MAIL_ACTIONS.loadMails());

  const load$ = combineLatest([
    store
      .select(CONTACT_STATE.selectContactsLoadingStatus)
      .pipe(filter((s) => s.type === 'completed')),
    store
      .select(MAILBOX_STATE.selectMailboxesLoadingStatus)
      .pipe(filter((s) => s.type === 'completed')),
    store
      .select(MAIL_STATE.selectMailsLoadingStatus)
      .pipe(filter((s) => s.type === 'completed')),
  ]);
  await firstValueFrom(load$);

  return true;
};

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [dataInitializer],
    children: [
      {
        path: '',
        component: BaseFoundationComponent,
        data: { animationId: 'base' },
        children: [
          {
            matcher: (segments) => {
              if (!segments.length) return null;
              const path = segments.join('/');
              if (path.startsWith('mail'))
                return { consumed: [], posParams: {} };
              return null;
            },
            loadChildren: () =>
              import('../mails/mails.module').then((m) => m.MailsModule),
          },
        ],
      },
      {
        path: '',
        component: UpperFoundationComponent,
        data: { animationId: 'upper' },
        children: [
          {
            path: 'compose',
            loadChildren: () =>
              import('../compose/compose.module').then((m) => m.ComposeModule),
          },
          {
            path: 'search',
            loadChildren: () =>
              import('../search/search.module').then((m) => m.SearchModule),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
