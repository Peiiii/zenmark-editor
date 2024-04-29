import { configure, BFSRequire } from "browserfs";

export const aquireBrowserFS = async (
  ...args: Parameters<typeof configure>
) => {
  // you can also add a callback as the last parameter instead of using promises
  await configure(...args);

  const fs = BFSRequire("fs");
  return fs;
};
