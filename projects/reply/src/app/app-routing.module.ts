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
import { map } from 'rxjs';

import { AuthenticationService } from './core/authentication.service';
import { MailService } from './data/mail.service';

const authorized: CanMatchFn = () => inject(AuthenticationService).authorized$;
const unauthorized: CanMatchFn = () =>
  inject(AuthenticationService).authorized$.pipe(map((a) => !a));

const mailsLoader: CanActivateFn = () =>
  inject(MailService)
    .loadMails()
    .pipe(map(() => true));

const userLoader: CanActivateFn = () =>
  inject(AuthenticationService).user$.pipe(map(() => true));

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
    canActivate: [userLoader, mailsLoader],
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
