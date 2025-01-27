import { SyncAdapter } from "@/toolkit/factories/asyncAdapter";
import { RemoteFS } from "@/toolkit/factories/remoteFs";

export const createRemoteFSSyncAdapter = <T>(
  fs: RemoteFS,
  path: string
): SyncAdapter<T> => {
  const load = async () => {
    const content = (await fs.readFile({ path })).content;
    if (!content) return undefined;
    return JSON.parse(content) as T;
  };
  const save = async (data: T) => {
    return await fs.writeFile({ path, content: JSON.stringify(data) });
  };
  return {
    load,
    save,
  };
};
