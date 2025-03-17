import { publishMessage, subscribeToChannel } from '../redisAdapter/pubsub';
import { IPubSubMQ, PubsubMessageData, userOnlineStatusData, userTypingStatusData } from './IPubsubMQ';

export class PubsubRedisMQ implements IPubSubMQ {
  private readonly ONLINE_STATUS_CHANNEL = 'user:online-status:';
  private readonly TYPING_STATUS_CHANNEL = 'user:typing-status:';
  private readonly INBOX_MESSAGES_CHANNEL = 'user:inbox-messages:';
  private readonly OUTBOX_MESSAGES_CHANNEL = 'user:outbox-messages:';

  async publishOnlineStatus(username: string, data: userOnlineStatusData): Promise<void> {
    const message = JSON.stringify(data);
    await publishMessage(this.ONLINE_STATUS_CHANNEL + username, message);
  }

  async publishTypingStatus(username: string, data: userTypingStatusData): Promise<void> {
    const message = JSON.stringify(data);
    await publishMessage(this.TYPING_STATUS_CHANNEL + username, message);
  }

  async subscribeToOnlineStatus(
    username: string,
    callback: (data: userOnlineStatusData) => Promise<void>
  ): Promise<void> {
    subscribeToChannel(this.ONLINE_STATUS_CHANNEL + username, async (message) => {
      const data = JSON.parse(message) as userOnlineStatusData;
      await callback(data);
    });
  }

  async subscribeToTypingStatus(
    username: string,
    callback: (data: userTypingStatusData) => Promise<void>
  ): Promise<void> {
    subscribeToChannel(this.TYPING_STATUS_CHANNEL + username, async (message) => {
      const data = JSON.parse(message) as userTypingStatusData;
      await callback(data);
    });
  }

  async publishMessagesInbox(username: string, data: PubsubMessageData): Promise<void> {
    await publishMessage(this.INBOX_MESSAGES_CHANNEL + username, JSON.stringify(data));
  }

  async subscribeMessagesInbox(
    username: string,
    callback: (data: PubsubMessageData) => Promise<void>
  ): Promise<void> {
    subscribeToChannel(this.INBOX_MESSAGES_CHANNEL + username, async (message) => {
      const data = JSON.parse(message) as PubsubMessageData;
      await callback(data);
    });
  }

  async publishMessagesOutbox(username: string, data: PubsubMessageData): Promise<void> {
    await publishMessage(this.OUTBOX_MESSAGES_CHANNEL + username, JSON.stringify(data));
  }

  async subscribeMessagesOutbox(
    username: string,
    callback: (data: PubsubMessageData) => Promise<void>
  ): Promise<void> {
    subscribeToChannel(this.OUTBOX_MESSAGES_CHANNEL + username, async (message) => {
      const data = JSON.parse(message) as PubsubMessageData;
      await callback(data);
    });
  }
}

const pubsubMQ = new PubsubRedisMQ();

export default pubsubMQ;