import 'hammerjs';

import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, inject, NgModule } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import {
  BrowserModule,
  DomSanitizer,
  HammerModule,
  SafeValue,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LayoutProjectionModule } from '@layout-projection/angular';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ScrollingModule } from '@reply/scrolling';
import { catchError, map, of } from 'rxjs';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LaunchScreenComponent } from './core/launch-screen/launch-screen.component';
import { LOCAL_STORAGE } from './core/native-api.tokens';
import { APP_PREPARER, AppPreparer } from './core/preparation';
import { ACCOUNT_ACTIONS } from './core/state/account/account.actions';
import { AccountEffects } from './core/state/account/account.effects';
import { ACCOUNT_STATE } from './core/state/account/account.state-entry';
import { ContactEffects } from './core/state/contact/contact.effects';
import { CONTACT_STATE } from './core/state/contact/contact.state-entry';
import { CoreEffects } from './core/state/core.effects';
import { CORE_STATE } from './core/state/core.state-entry';
import { MailEffects } from './core/state/mail/mail.effects';
import { MAIL_STATE } from './core/state/mail/mail.state-entry';
import { MailboxEffects } from './core/state/mailbox/mailbox.effects';
import { MAILBOX_STATE } from './core/state/mailbox/mailbox.state-entry';
import { LogoComponent } from './shared/logo/logo.component';

// TODO: attachment
// TODO: image
// TODO: schedule
// TODO: gestures on cards
// TODO: mail list lazy loading
// TODO: mail total displaying
// TODO: better mail html render
// TODO: settings page with mailbox management

// TODO: contact database
// TODO: list all accounts in auth page and use non-prompt authentication process
// TODO: extract sync logics from services to some "synchronizers"

@NgModule({
  declarations: [AppComponent, LaunchScreenComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    HammerModule,
    HttpClientModule,
    LayoutProjectionModule.forRoot(),
    ScrollingModule.forRoot(),
    StoreModule.forRoot(),
    EffectsModule.forRoot(),
    StoreModule.forFeature(CORE_STATE),
    EffectsModule.forFeature(CoreEffects),
    StoreModule.forFeature(ACCOUNT_STATE),
    EffectsModule.forFeature(AccountEffects),
    StoreModule.forFeature(CONTACT_STATE),
    EffectsModule.forFeature(ContactEffects),
    StoreModule.forFeature(MAIL_STATE),
    EffectsModule.forFeature(MailEffects),
    StoreModule.forFeature(MAILBOX_STATE),
    EffectsModule.forFeature(MailboxEffects),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    environment.backend,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatButtonModule,
    AppRoutingModule,
    LogoComponent,
  ],
  providers: [
    {
      provide: LOCAL_STORAGE,
      useValue: window.localStorage,
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const iconRegistry = inject(MatIconRegistry);
        const domSanitizer = inject(DomSanitizer);
        const trusted = (v: string): SafeValue =>
          domSanitizer.bypassSecurityTrustResourceUrl(v);
        return () => {
          iconRegistry.setDefaultFontSetClass();
          iconRegistry.registerFontClassAlias(
            'filled',
            'material-icons mat-ligature-font',
          );
          iconRegistry.addSvgIconSet(trusted('assets/icons.svg'));
        };
      },
    },
    {
      provide: APP_PREPARER,
      multi: true,
      useFactory: (): AppPreparer => {
        const iconRegistry = inject(MatIconRegistry);
        return () => {
          const loadAllSvgIconSets = () =>
            iconRegistry.getNamedSvgIcon('').pipe(catchError(() => of(null)));
          return loadAllSvgIconSets();
        };
      },
    },
    {
      provide: APP_PREPARER,
      multi: true,
      useFactory: (): AppPreparer => {
        const store = inject(Store);
        store.dispatch(ACCOUNT_ACTIONS.loadAccounts());
        return () =>
          store
            .select(ACCOUNT_STATE.selectAccountsLoadingStatus)
            .pipe(map((s) => s.type === 'completed'));
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
