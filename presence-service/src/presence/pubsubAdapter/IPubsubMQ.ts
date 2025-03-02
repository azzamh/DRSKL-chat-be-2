

export interface IPubSubMQ {
  publishOnlineStatus(userId: string, isOnline: boolean): Promise<void>;
  publishTypingStatus(userId: string, isTyping: boolean): Promise<void>;
  subscribeToOnlineStatus(userId: string, callback: (message: string) => Promise<void>): Promise<void>;
  subscribeToTypingStatus(userId: string, callback: (message: string) => Promise<void>): Promise<void>;

  publishMessagesInbox(userId: string, message: string): Promise<void>;
  subscribeMessagesInbox(userId: string, callback: (message: string) => Promise<void>): Promise<void>;

  publishMessagesOutbox(userId: string, message: string): Promise<void>;
  subscribeMessagesOutbox(userId: string, callback: (message: string) => Promise<void>): Promise<void>;


}

