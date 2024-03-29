import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { LayoutProjectionModule } from '@layout-projection/angular';
import { EffectsModule } from '@ngrx/effects';
import { ScrollingModule } from '@reply/scrolling';

import { ContactSortPipe } from '../entity/contact/contact-sort.pipe';
import { ContactStringifyPipe } from '../entity/contact/contact-stringify.pipe';
import { MailSnippetPipe } from '../entity/mail/mail-snippet.pipe';
import { ContactFromMailParticipantPipe } from '../entity/shared/contact-from-mail-participant.pipe';
import { AvatarComponent } from '../shared/avatar/avatar.component';
import { HtmlRendererComponent } from '../shared/html-renderer/html-renderer.component';
import { LayoutContentDirective } from '../shared/layout-content.directive';
import { ReadableDatePipe } from '../shared/readable-date.pipe';
import { ReattachOnChangeDirective } from '../shared/reattach-on-change.directive';
import { ResolveRefPipe } from '../shared/resolve-ref.pipe';
import { ScrollableAreaComponent } from '../shared/scrollable-area/scrollable-area.component';
import { SearchButtonComponent } from '../shared/search-button/search-button.component';
import { MailComponent } from './core/mail/mail.component';
import { MailActionMenuButtonComponent } from './core/mail-action-menu-button/mail-action-menu-button.component';
import { MailActionMenuDefComponent } from './core/mail-action-menu-def/mail-action-menu-def.component';
import { MailCardComponent } from './core/mail-card/mail-card.component';
import { MailCardAnimationPresenceComponent } from './core/mail-card-animation-presence/mail-card-animation-presence.component';
import { MailCardListComponent } from './core/mail-card-list/mail-card-list.component';
import { MailDeleteButtonComponent } from './core/mail-delete-button/mail-delete-button.component';
import { MailStarButtonComponent } from './core/mail-star-button/mail-star-button.component';
import { MailboxSelectionPopupComponent } from './core/mailbox-selection-popup/mailbox-selection-popup.component';
import { MailsEffects } from './core/mails.effects';
import { MailDetailLayoutComponent } from './mail-detail-layout/mail-detail-layout.component';
import { MailListLayoutComponent } from './mail-list-layout/mail-list-layout.component';
import { MailsComponent } from './mails.component';
import { MailsRoutingModule } from './mails-routing.module';

// TODO: move actions to actions menu when screen is becoming smaller

@NgModule({
  declarations: [
    MailsComponent,
    MailListLayoutComponent,
    MailDetailLayoutComponent,
    MailCardComponent,
    MailCardListComponent,
    MailComponent,
    MailStarButtonComponent,
    MailDeleteButtonComponent,
    MailCardAnimationPresenceComponent,
    MailActionMenuButtonComponent,
    MailActionMenuDefComponent,
    MailboxSelectionPopupComponent,
  ],
  imports: [
    CommonModule,
    MailsRoutingModule,
    EffectsModule.forFeature(MailsEffects),
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatListModule,
    MatRippleModule,
    MatIconModule,
    LayoutProjectionModule,
    ScrollingModule,
    SearchButtonComponent,
    ScrollableAreaComponent,
    LayoutContentDirective,
    ReadableDatePipe,
    ResolveRefPipe,
    ContactSortPipe,
    ContactStringifyPipe,
    MailSnippetPipe,
    ReattachOnChangeDirective,
    AvatarComponent,
    HtmlRendererComponent,
    ContactFromMailParticipantPipe,
  ],
})
export class MailsModule {}
