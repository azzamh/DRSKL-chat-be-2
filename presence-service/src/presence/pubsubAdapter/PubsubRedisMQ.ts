import { publishMessage, subscribeToChannel } from '../../shared/redisAdapter/pubsub';
import { IPubSubMQ } from './IPubsubMQ';

export class PubsubRedisMQ implements IPubSubMQ {
  private readonly ONLINE_STATUS_CHANNEL = 'user:online-status:';
  private readonly TYPING_STATUS_CHANNEL = 'user:typing-status:';
  private readonly INBOX_MESSAGES_CHANNEL = 'user:inbox-messages:';
  private readonly OUTBOX_MESSAGES_CHANNEL = 'user:outbox-messages:';

  async publishOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    const message = JSON.stringify({
      userId,
      isOnline,
      timestamp: new Date().toISOString()
    });

    await publishMessage(this.ONLINE_STATUS_CHANNEL+userId, message);
  }

  async publishTypingStatus(userId: string, isTyping: boolean): Promise<void> {
    const message = JSON.stringify({
      userId,
      isTyping,
      timestamp: new Date().toISOString()
    });

    await publishMessage(this.TYPING_STATUS_CHANNEL + userId, message);
  }

  async subscribeToOnlineStatus(userId: string, callback: (message: any) => Promise<void>): Promise<void> {
    subscribeToChannel(this.ONLINE_STATUS_CHANNEL + userId, callback);
  }

  async subscribeToTypingStatus(userId: string, callback: (message: any) => Promise<void>): Promise<void> {
    subscribeToChannel(this.TYPING_STATUS_CHANNEL + userId, callback);
  }


  async publishMessagesInbox(userId: string, message: string): Promise<void> {
    await publishMessage(this.INBOX_MESSAGES_CHANNEL + userId, message);
  }

  async subscribeMessagesInbox(userId: string, callback: (message: any) => Promise<void>): Promise<void> {
    subscribeToChannel(this.INBOX_MESSAGES_CHANNEL + userId, callback);
  }

  async publishMessagesOutbox(userId: string, message: string): Promise<void> {
    await publishMessage(this.OUTBOX_MESSAGES_CHANNEL + userId, message);
  }

  async subscribeMessagesOutbox(userId: string, callback: (message: any) => Promise<void>): Promise<void> {
    subscribeToChannel(this.OUTBOX_MESSAGES_CHANNEL + userId, callback);
  }
}
