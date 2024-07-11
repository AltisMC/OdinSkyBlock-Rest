import { Schema, model } from "mongoose";

const PermissionSchema = new Schema({
  islandId: { type: String, required: true },
  permissionId: { type: String, required: true },
  role: {
    type: String,
    enum: ["BANNED", "VISITOR", "COOP", "MEMBER", "ADMIN", "OWNER"],
    required: true,
    default: "MEMBER",
  },
});

export const Permission = model("Permission", PermissionSchema);
