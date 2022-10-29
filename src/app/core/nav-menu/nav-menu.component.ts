import { Component, OnInit } from '@angular/core';

import { BreakpointManager } from '../breakpoint.manager';

@Component({
  selector: 'rpl-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit {
  constructor(public breakpointManager: BreakpointManager) {}

  ngOnInit(): void {}
}
