
export type MessageType = 'email' | 'whatsapp';
export type MessageStatus = 'pending' | 'sent' | 'failed';

export interface ScheduledMessage {
  id: string;
  userId: string;
  type: MessageType;
  recipient: string;
  subject?: string;
  body: string;
  scheduledFor: Date;
  status: MessageStatus;
  createdAt: Date;
  sentAt?: Date;
}
