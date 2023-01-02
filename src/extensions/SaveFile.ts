import {Extension} from "@tiptap/core";
import {history} from "../common/history";
import { fs } from "../common/fs";
import { message } from "../common/utils";
export const SaveFile = Extension.create({
    name: "saveFile",
    async onCreate() {
        const path=(history.location.query as any).path;
        if(path){
            await fs.ready();
            if(await fs.promises.exists(path)){
                const content=await fs.promises.readFile(path,"utf8");
                this.editor.commands.setContent(content);
            }else{
                message.warning("File not exists : "+path);
            }
        }
    },
    addCommands() {
        return {
            saveFile: ()=> async ({commands,editor}) =>{
                const content = editor.getHTML();
                const path=(history.location.query as any).path;
                if(path){
                    await fs.promises.writeFile(path,content);
                    message.success("File saved");
                }else{
                    console.log("File not saved, no path specified.");
                }
            },
            isPathGiven:()=>()=>{
                const path=(history.location.query as any).path;
                return !!path;
            }
        } as any
    },
    addKeyboardShortcuts() {
        return {
            "Ctrl-s":()=>(this.editor.commands as any).saveFile()
        }
    },

    
}) 