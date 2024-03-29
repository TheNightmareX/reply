import { Injectable } from '@angular/core';

import { Mailbox } from '@/app/entity/mailbox/mailbox.model';

import { DemoEntityFactory } from '../core/demo-entity-factory';

@Injectable({
  providedIn: 'root',
})
export class DemoMailboxFactory implements DemoEntityFactory {
  create(payload: { id?: string; name: string }): Mailbox {
    return {
      id: payload.id ?? payload.name,
      name: payload.name,
    };
  }
}
