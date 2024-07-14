import { IslandInfo } from "../api/v1/island/island.info.model";
import {
  INVITE_CHANNEL,
  INVITE_KEY,
  INVITE_REPLY_CHANNEL,
  ISLAND_CREATE_CHANNEL,
  ISLAND_DELETE_CHANNEL,
  ISLAND_LOAD_CHANNEL,
  ISLAND_UNLOAD_CHANNEL,
  ISLANDS_KEY,
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

// METHODS RELATED TO ISLAND SYSTEM

export async function getLoadedServer(id: string): Promise<string | null> {
  const loadedServer = await redis.hget(ISLANDS_KEY, id);
  if (!loadedServer) {
    return null;
  }

  return loadedServer;
}

export async function unloadIsland(id: string) {
  const loadedServer = await redis.hget(ISLANDS_KEY, id);
  if (!loadedServer) {
    throw Error("Island is not loaded!");
  }

  redis.hdel(ISLANDS_KEY, id);
  redis.publish(ISLAND_UNLOAD_CHANNEL, id);
}

export async function deleteIsland(id: string) {
  const loadedServer = await redis.hget(ISLANDS_KEY, id);
  if (!loadedServer) {
    throw Error("Island is not loaded!");
  }

  redis.hdel(ISLANDS_KEY, id);
  redis.publish(ISLAND_DELETE_CHANNEL, id);
}

export async function loadIsland(island: any) {
  await redis.hset(ISLANDS_KEY, island.uniqueId, island.server);
  await redis.publish(ISLAND_LOAD_CHANNEL, JSON.stringify(island));
}

export async function createIsland(islandId: string, server: string) {
  await redis.publish(
    ISLAND_CREATE_CHANNEL,
    JSON.stringify(
      IslandInfo.check({
        uniqueId: islandId,
        server: server,
      })
    )
  );
}

export async function getAllLoadedIslands(server?: string): Promise<[]> {
  const islandsData = Object.entries(await redis.hgetall(ISLANDS_KEY));
  let islands: any = [];

  if (!server) {
    for (let index = 0; index < islandsData.length; index++) {
      const data = islandsData[index];
      islands.push({ islandId: data[0], server: data[1] });
    }
  } else {
    for (let index = 0; index < islandsData.length; index++) {
      const data = islandsData[index];
      if (data[1] != server) continue;

      islands.push({ islandId: data[0], server: data[1] });
    }
  }

  return islands;
}
