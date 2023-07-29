import { inject, Injectable, NgModule } from '@angular/core';
import {
  CanActivateFn,
  CanMatchFn,
  DefaultTitleStrategy,
  RouterModule,
  RouterStateSnapshot,
  Routes,
  TitleStrategy,
} from '@angular/router';
import { combineLatest, first, map } from 'rxjs';

import { AuthenticationService } from './core/auth/authentication.service';
import { ContactService } from './data/contact/contact.service';
import { MailDatabase } from './data/mail/mail.database';
import { MailService } from './data/mail/mail.service';
import { MailboxService } from './data/mailbox/mailbox.service';

const authorized: CanMatchFn = () =>
  inject(AuthenticationService).authorization$.pipe(map((a) => !!a));
const unauthorized: CanMatchFn = () =>
  inject(AuthenticationService).authorization$.pipe(map((a) => !a));

const dataInitializer: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const contactService = inject(ContactService);
  const mailboxService = inject(MailboxService);
  const mailService = inject(MailService);
  const mailDb = inject(MailDatabase);
  return combineLatest([
    authService.user$,
    contactService.loadContacts(),
    mailboxService.loadMailboxes(),
    mailDb.clear(),
    mailService.loadMails(),
  ]).pipe(
    first(),
    map(() => true),
  );
};

const routes: Routes = [
  {
    path: '',
    canMatch: [unauthorized],
    children: [
      {
        path: 'auth',
        data: { animationId: 'auth' },
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: '**',
        redirectTo: 'auth',
      },
    ],
  },
  {
    path: '',
    canMatch: [authorized],
    canActivate: [dataInitializer],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'mailboxes/Inbox/mails',
      },
      {
        path: '',
        data: { animationId: 'main' },
        loadChildren: () =>
          import('./main/main.module').then((m) => m.MainModule),
      },
      {
        path: '**',
        redirectTo: 'mailboxes/Inbox/mails',
      },
    ],
  },
];

@Injectable()
export class AppTitleStrategy extends DefaultTitleStrategy {
  override buildTitle(snapshot: RouterStateSnapshot): string | undefined {
    const title = super.buildTitle(snapshot);
    return title && `${title} | Reply`;
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: AppTitleStrategy }],
})
export class AppRoutingModule {}
