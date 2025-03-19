import { z } from 'zod';

export const participantsSchema = z.object({
  params: z.object({
    room_id: z.string()
  })
});

export const getRoomParticipants = participantsSchema; 