import { Injectable } from '@angular/core';

import { ReactiveRepository } from '../common/reactive-repository';
import { Contact } from './contact.model';
import { CONTACTS } from './contact.records';

@Injectable({
  providedIn: 'root',
})
export class ContactRepository extends ReactiveRepository<Contact> {
  constructor() {
    super();
    CONTACTS.forEach((contact) => this.insert(contact));
  }

  protected identify(entity: Contact): string {
    return entity.id;
  }
}
