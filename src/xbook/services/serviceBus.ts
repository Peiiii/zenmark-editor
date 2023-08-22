const createServiceBus = () => {
    const SPERATOR=".";
    const allowOverride = true;
    const map=new Map();
    const exist=(name:string)=>{
        return map.has(name);
    }
    // const 
    const exposeAt=(scope:string,serviceMap:{[name:string]:Function})=>{
        for(const name in serviceMap){
            
            if(map.has(`${scope}${SPERATOR}${name}`)){
                return false;
            }
        }
        for(const name in serviceMap){
            expose(`${scope}${SPERATOR}${name}`,serviceMap[name]);
        }
    }
    const expose=(name:string|{[name:string]:Function},handler?:Function)=>{
        if(typeof name !== 'string'){
            for(const key of Object.keys(name)){
                expose(key,name[key]);
            }
        }else{
            if(exist(name) && !allowOverride)return false;
            map.set(name,handler);
            return true;
        }
    }
    const invoke=(name:string,...args:any[])=>{
        if(!exist(name)) throw new Error("Service not found: " + name);
        const result=map.get(name)(...args);
        return result;
    }
    return {
        expose,
        exposeAt,
        invoke
    }
}

export const serviceBus = createServiceBus();