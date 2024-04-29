/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AbilityMapping,
  RemotePortal,
} from "@/toolkit/factories/rpc/portal/remotePortal";
import { ICommunicationChannel } from "@/toolkit/factories/rpc/protocal/communicationChannel";

export type GetConfiguration = (portal: RemotePortal) => {
  remoteAbilityMappings?: (string|AbilityMapping)[];
  abilities?: {
    key: string;
    handler: (...args: any[]) => any;
  }[];
};

export const createRemotePortal = (
  target: ICommunicationChannel,
  getConfiguration?: GetConfiguration
) => {
  const portal = new RemotePortal(target);
  if (!getConfiguration) return portal;
  const { remoteAbilityMappings = [], abilities = [] } =
    getConfiguration(portal);
  portal.mapRemoteAbilities(remoteAbilityMappings);
  portal.addAbilities(abilities || []);
  return portal;
};
