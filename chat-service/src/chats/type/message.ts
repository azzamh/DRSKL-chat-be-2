export interface Message {
  id: string,
  conversationId: number,
  userId: string,
  username: string,
  fullName: string,
  content: string,
  deliveredAt: string
}