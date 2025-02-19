import Redis from 'ioredis';

const STICKY_KEY_PREFIX = 'user_chat_instance:';

export async function getOrPickChatInstance(
  redis: Redis,           // Tipe ioredis
  userId: string,
  chatInstances: string[]
): Promise<string | null> {
  // 1) Cek instance lama (sticky) di Redis
  const existing = await redis.get(STICKY_KEY_PREFIX + userId);
  if (existing) {
    // Pastikan instance lama masih valid (masih ada di daftar)
    if (chatInstances.includes(existing)) {
      return existing;
    } else {
      // Jika instance lama sudah tidak ada, hapus dari Redis
      await redis.del(STICKY_KEY_PREFIX + userId);
    }
  }

  // 2) Pilih instance baru (misalnya random)
  if (chatInstances.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * chatInstances.length);
  const chosen = chatInstances[randomIndex];

  // 3) Simpan mapping user -> instance di Redis
  await redis.set(STICKY_KEY_PREFIX + userId, chosen);

  return chosen;
}

export async function removeChatInstanceMapping(
  redis: Redis,
  userId: string
): Promise<void> {
  await redis.del(STICKY_KEY_PREFIX + userId);
}
