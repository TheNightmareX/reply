import { Contact } from './contact.model';

export interface Mail {
  id: string;
  subject: string;
  sender: Contact['id'];
  recipients: Contact['id'][];
  sentAt: Date;
  content: string;
  isStarred: boolean;
  isRead: boolean;
  mailboxName: string;
}
