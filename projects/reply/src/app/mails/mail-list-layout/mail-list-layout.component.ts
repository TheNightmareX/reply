import { query, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AnimationCurves } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { SharedAxisAnimation } from '@/app/core/animations';
import { BREAKPOINTS } from '@/app/core/breakpoint.service';
import { NavigationContext } from '@/app/core/navigation.context';
import { ContentComponent } from '@/app/standalone/content/content.component';

import { MailsComponent } from '../mails.component';

let scrollTop = 0;

@Component({
  selector: 'rpl-mail-list-layout',
  templateUrl: './mail-list-layout.component.html',
  styleUrls: ['./mail-list-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('content', [
      transition(':increment', [
        query(':leave', style({ position: 'absolute' })),
        SharedAxisAnimation.apply('y', 'forward'),
      ]),
      transition(':decrement', [
        query(':leave', style({ position: 'absolute' })),
        SharedAxisAnimation.apply('y', 'backward'),
      ]),
    ]),
  ],
})
export class MailListLayoutComponent implements OnInit, OnDestroy {
  AnimationCurves = AnimationCurves;
  breakpoints = inject(BREAKPOINTS);

  mailboxName$ = this.route.params.pipe(map((params) => params['mailboxName']));

  @ViewChild(ContentComponent) private content!: ContentComponent;

  constructor(
    public navigationContext: NavigationContext,
    private route: ActivatedRoute,
    private mailsComponent: MailsComponent,
  ) {}

  ngOnInit(): void {}

  async ngAfterViewInit(): Promise<void> {
    this.content.fakeScroll(scrollTop);
    await this.mailsComponent.animateLayout(250);
    this.content.setScrollTop(scrollTop);
  }

  ngOnDestroy(): void {
    scrollTop = this.content.getScrollTop();
  }
}
