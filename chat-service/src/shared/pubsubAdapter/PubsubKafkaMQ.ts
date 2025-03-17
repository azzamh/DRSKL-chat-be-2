import { Kafka, Producer, Consumer } from 'kafkajs';
import { IPubSubMQ, PubsubMessageData, userOnlineStatusData, userTypingStatusData } from './IPubsubMQ';

export class PubsubKafkaMQ implements IPubSubMQ {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  private readonly ONLINE_STATUS_TOPIC = 'user.online.status.';
  private readonly TYPING_STATUS_TOPIC = 'user.typing.status.';
  private readonly INBOX_MESSAGES_TOPIC = 'user.inbox.messages.';
  private readonly OUTBOX_MESSAGES_TOPIC = 'user.outbox.messages.';

  constructor() {
    this.kafka = new Kafka({
      clientId: 'realtime-service',
      brokers: ['kafka:29092']
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'realtime-service-group' });

    this.initialize();
  }

  private async initialize() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async publishOnlineStatus(username: string, data: userOnlineStatusData): Promise<void> {
    await this.producer.send({
      topic: this.ONLINE_STATUS_TOPIC + username,
      messages: [{ value: JSON.stringify(data) }]
    });
  }

  async publishTypingStatus(username: string, data: userTypingStatusData): Promise<void> {
    await this.producer.send({
      topic: this.TYPING_STATUS_TOPIC + username,
      messages: [{ value: JSON.stringify(data) }]
    });
  }

  async subscribeToOnlineStatus(
    username: string,
    callback: (data: userOnlineStatusData) => Promise<void>
  ): Promise<void> {
    await this.consumer.subscribe({ topic: this.ONLINE_STATUS_TOPIC + username });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          const data = JSON.parse(message.value.toString()) as userOnlineStatusData;
          await callback(data);
        }
      },
    });
  }

  async subscribeToTypingStatus(
    username: string,
    callback: (data: userTypingStatusData) => Promise<void>
  ): Promise<void> {
    await this.consumer.subscribe({ topic: this.TYPING_STATUS_TOPIC + username });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          const data = JSON.parse(message.value.toString()) as userTypingStatusData;
          await callback(data);
        }
      },
    });
  }

  async publishMessagesInbox(username: string, data: PubsubMessageData): Promise<void> {
    await this.producer.send({
      topic: this.INBOX_MESSAGES_TOPIC + username,
      messages: [{ value: JSON.stringify(data) }]
    });
  }

  async subscribeMessagesInbox(
    username: string,
    callback: (data: PubsubMessageData) => Promise<void>
  ): Promise<void> {
    await this.consumer.subscribe({ topic: this.INBOX_MESSAGES_TOPIC + username });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          const data = JSON.parse(message.value.toString()) as PubsubMessageData;
          await callback(data);
        }
      },
    });
  }

  async publishMessagesOutbox(username: string, data: PubsubMessageData): Promise<void> {
    await this.producer.send({
      topic: this.OUTBOX_MESSAGES_TOPIC + username,
      messages: [{ value: JSON.stringify(data) }]
    });
  }

  async subscribeMessagesOutbox(
    username: string,
    callback: (data: PubsubMessageData) => Promise<void>
  ): Promise<void> {
    await this.consumer.subscribe({ topic: this.OUTBOX_MESSAGES_TOPIC + username });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) {
          const data = JSON.parse(message.value.toString()) as PubsubMessageData;
          await callback(data);
        }
      },
    });
  }
}
const pubsubMQ = new PubsubKafkaMQ();

export default pubsubMQ;
