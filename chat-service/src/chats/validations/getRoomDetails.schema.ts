import { z } from 'zod';

export const detailsSchema = z.object({
  params: z.object({
    room_id: z.string()
  })
});

export const getRoomDetails = detailsSchema; 