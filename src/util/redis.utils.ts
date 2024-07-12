import {
  INVITE_CHANNEL,
  INVITE_KEY,
  INVITE_REPLY_CHANNEL,
  PLAYERS_KEY,
} from "../constant/redis";
import { redis } from "../index";

// METHODS RELATED TO PLAYER CACHE

export async function getPlayersFromCache(server?: string): Promise<any[]> {
  const players = Object.entries(await redis.hgetall(PLAYERS_KEY));
  if (server) {
    return players
      .map((player) => JSON.parse(player[1]))
      .filter((player) => player.server == server);
  }

  return players;
}

export async function removePlayerFromCache(playerId: string) {
  await redis.hdel(PLAYERS_KEY, playerId);
}

export async function clearPlayersCache(server?: string) {
  if (!server) {
    // we'll use del instead of hdel to clear out the map
    await redis.del(PLAYERS_KEY);
    return;
  }

  // todo: find a better way to implement this
  // not that important tho, because this will be only used on server disable
  const players = await getPlayersFromCache(server);
  for (let index = 0; index < players.length; index++) {
    const player = players[index];
    await redis.hdel(PLAYERS_KEY, player.uniqueId);
  }
}

export async function addPlayerToCache(player: any) {
  await redis.hset(PLAYERS_KEY, player.uniqueId, JSON.stringify(player));
}

// METHODS RELATED TO INVITE SYSTEM

export async function getInvite(playerId: string): Promise<string | null> {
  return await redis.get(INVITE_KEY.replace("<player-uuid>", playerId));
}

export async function removeInvite(playerId: string) {
  await redis.del(INVITE_KEY.replace("<player-uuid>", playerId));
}

export async function replyToInvite(inviteReply: any) {
  await redis.publish(INVITE_REPLY_CHANNEL, JSON.stringify(inviteReply));
}

export async function invitePlayer(invite: any) {
  await redis.set(
    INVITE_KEY.replace("<player-uuid>", invite.player),
    JSON.stringify(invite),
    "EX",
    invite.time
  );
  await redis.publish(INVITE_CHANNEL, JSON.stringify(invite)); // let the player know they were invited
}
