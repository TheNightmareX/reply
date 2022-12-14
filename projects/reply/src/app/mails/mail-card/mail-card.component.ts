import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';

import { BreakpointManager } from '@/app/core/breakpoint.manager';
import { Contact } from '@/app/data/contact.model';
import { ContactService } from '@/app/data/contact.service';

import { Mail } from '../../data/mail.model';

@Component({
  selector: 'rpl-mail-card',
  templateUrl: './mail-card.component.html',
  styleUrls: ['./mail-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailCardComponent implements OnInit {
  @Input() mail!: Mail;

  breakpoints$ = this.breakpointManager.breakpoints$;
  mailSender$!: Observable<Contact>;

  @HostBinding('class.read') get mailIsRead(): boolean {
    return this.mail.isRead;
  }
  @HostBinding('class.starred') get mailIsStared(): boolean {
    return this.mail.isStarred;
  }

  @ViewChild('anchor') private anchorElementRef!: ElementRef<HTMLAnchorElement>;

  constructor(
    private breakpointManager: BreakpointManager,
    private contactService: ContactService,
  ) {}

  ngOnInit(): void {
    this.mailSender$ = this.contactService.getContact$ById(this.mail.sender);
  }

  @HostListener('click') onClick(): void {
    this.anchorElementRef.nativeElement.click();
  }
}
