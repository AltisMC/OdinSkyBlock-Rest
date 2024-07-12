// !!!!ATTENTION!!!!
// DO NOT BLINDLY CHANGE WHAT'S IN THIS FILE!
// PLUGIN ITSELF ALSO USES THE SAME CHANNELS AND IT WILL NOT WORK IF YOU CHANGE IT ONLY FROM HERE!

// stuff related to invitation system
export const INVITE_KEY = "thoxia:skyblock:invites:<player-uuid>";
export const INVITE_REPLY_CHANNEL = "thoxia:skyblock:invite:reply";

// stuff related to chat system
export const CHAT_CHANNEL = "thoxia:skyblock:chat";

// stuff related to server system
export const SERVERS_KEY = "thoxia:skyblock:servers";

// stuff related to player system
export const PLAYERS_KEY = "thoxia:skyblock:players:<server-name>";

// stuff related to island system
export const ISLANDS_KEY = "thoxia:skyblock:islands";
export const ISLAND_DELETE_CHANNEL = "thoxia:skyblock:island:delete";
export const ISLAND_UNLOAD_CHANNEL = "thoxia:skyblock:island:unload";
export const ISLAND_LOAD_CHANNEL = "thoxia:skyblock:island:load";
export const ISLAND_LOAD_REPLY_CHANNEL = "thoxia:skyblock:island:load:reply"; // not used in the rest
export const ISLAND_CREATE_CHANNEL = "thoxia:skyblock:island:create";
export const ISLAND_CREATE_REPLY_CHANNEL =
  "thoxia:skyblock:island:create:reply"; // not used in the rest, creator server will MUST publish a message

// stuff related to member system
export const ISLAND_MEMBER_UPDATE_CHANNEL = "thoxia:skyblock:island:member";
