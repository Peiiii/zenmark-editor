const Registry={
    create:()=>{
        const map=new Map();
        const has= map.has;
        const get=map.get;
        const set=map.set;
        return {
            has,
            get,
            set,
        }
    }
}
export const registryService=Registry.create();