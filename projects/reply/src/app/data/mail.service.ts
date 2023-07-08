import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Mail } from './mail.model';

@Injectable()
export abstract class MailService {
  abstract loadMails(): Observable<Mail[]>;
  abstract loadMail(id: string): Observable<Mail>;
}