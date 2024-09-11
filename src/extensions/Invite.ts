import {Extension} from "@tiptap/core";
import { message } from "../common/utils";
import {getCollabUrl} from "../common/collab-utils";

export const Invite = Extension.create({
    name: "invite",
    addOptions() {
        return {
            getCollabUrl,
        }
    },
    addCommands() {
        return {
            copyCollabUrl: () =>()=>{
                navigator.clipboard.writeText(this.options.getCollabUrl());
                message.success("Collabration URL copied.");
            }
        } as any;
    },
})
