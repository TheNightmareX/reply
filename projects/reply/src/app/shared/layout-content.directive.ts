import { Directive, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScrollDirectionDirective } from '@reply/scrolling';

import { LAYOUT_CONTEXT } from '../core/layout-context.token';

@Directive({
  selector: '[rplLayoutContent]',
  standalone: true,
  hostDirectives: [ScrollDirectionDirective],
})
export class LayoutContentDirective {
  private layoutContext = inject(LAYOUT_CONTEXT);
  private scrollDirections = inject(ScrollDirectionDirective);
  constructor() {
    this.scrollDirections.scrollUp.pipe(takeUntilDestroyed()).subscribe(() => {
      this.layoutContext.mutate((c) => (c.contentFavored = false));
    });
    this.scrollDirections.scrollDown
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.layoutContext.mutate((c) => (c.contentFavored = true));
      });
  }
}
