import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { Router } from '@angular/router';
import {
  bufferCount,
  combineLatestWith,
  distinctUntilChanged,
  filter,
  map,
  merge,
  startWith,
  timer,
} from 'rxjs';

import { environment } from '@/environments/environment';

import { injectAnimationIdFactory } from './core/animations';
import {
  AuthenticationService,
  Authorization,
} from './core/authentication.service';
import { BreakpointMap, BREAKPOINTS } from './core/breakpoint.service';
import { INITIALIZER } from './core/initialization';
import { GOOGLE_APIS } from './google-backend/google-apis.token';

@Component({
  selector: 'rpl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('routes', [
      transition('auth => main', [
        group([
          query(':leave [data-route-animation-target]', [
            animate(`100ms ${AnimationCurves.STANDARD_CURVE}`),
            style({ opacity: 0 }),
          ]),
          query(
            ':enter rpl-side-nav:not(.expanded)',
            [
              style({ transform: 'translateX(-100%)' }),
              animate(`225ms ${AnimationCurves.DECELERATION_CURVE}`),
            ],
            { optional: true },
          ),
          query(
            ':enter rpl-bottom-nav > .content, :enter rpl-bottom-nav > .background',
            [
              style({ transform: 'translateY(100%)' }),
              animate(`225ms ${AnimationCurves.DECELERATION_CURVE}`),
            ],
            { optional: true },
          ),
          query(
            ':enter rpl-bottom-nav @*', //
            [animateChild()],
            { optional: true },
          ),
          query(':enter rpl-mail-list-layout', [animateChild()]),
          query(':enter rpl-mail-list-layout rpl-mail-card-list', [
            query(':self', [
              style({ transform: 'scale(92%)' }),
              animate(
                `225ms ${AnimationCurves.DECELERATION_CURVE}`,
                style({ transform: 'scale(1)' }),
              ),
            ]),
          ]),
        ]),
      ]),
    ]),
    trigger('launchScreen', [
      transition(':leave', [
        animate(`100ms ${AnimationCurves.STANDARD_CURVE}`),
        style({ opacity: 0 }),
      ]),
    ]),
  ],
  host: {
    ['[@routes]']: 'animationId()',
  },
})
export class AppComponent {
  animationId = injectAnimationIdFactory();
  private breakpoints = inject(BREAKPOINTS);
  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private googleApis$ = inject(GOOGLE_APIS);
  private initializers = inject(INITIALIZER);

  @HostBinding('class') get breakpointsClassBindings(): BreakpointMap {
    return this.breakpoints();
  }

  initialized$ = merge(...this.initializers.map((i) => i()), timer(500)).pipe(
    bufferCount(this.initializers.length + 1),
    map(() => true),
    startWith(false),
  );

  constructor() {
    this.authService.authorized$
      .pipe(
        combineLatestWith(this.authService.user$),
        map(([v]) => v),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.router.navigateByUrl('/');
      });

    /* eslint-disable no-console */
    if (!environment.production) {
      this.googleApis$.subscribe(() => {
        if (localStorage['authorization']) {
          const auth = JSON.parse(
            localStorage['authorization'],
          ) as Authorization;
          gapi.client.setToken({ ['access_token']: auth.token });
          this.authService.setAuthorization(auth);
          console.log('authorization restored', auth);
        }
      });
      this.authService.authorization$.pipe(filter(Boolean)).subscribe((r) => {
        localStorage['authorization'] = JSON.stringify(r);
        console.log('authorization saved', r);
      });
    }
    /* eslint-enable no-console */
  }
}
