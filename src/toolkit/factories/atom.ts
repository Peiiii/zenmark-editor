/* eslint-disable @typescript-eslint/no-explicit-any */
import { createEventBus } from "@/toolkit/factories/eventBus";
import { createInjector } from "@/toolkit/factories/injector";
import { createPluginService } from "@/toolkit/factories/pluginService";
import { createPluginSystem } from "@/toolkit/factories/pluginSystem";
import { createRegistry } from "@/toolkit/factories/registry";
import { createRenderer } from "@/toolkit/factories/renderer";
import { createServiceBus } from "@/toolkit/factories/serviceBus";
import { createStateContainer } from "@/toolkit/factories/stateContainer";
import { Key } from "@/toolkit/types";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

export type AtomProps = {
  id?: string;
};
const withPluginSystem = <T extends Record<string, any>>(system: T) => {
  const pluginSystem = createPluginSystem<T, "activate", "deactivate">();
  const pluginService = createPluginService<T>(system);
  return Object.assign(system, {
    createPlugin: pluginSystem.createPlugin,
    addPlugins: pluginService.use,
  });
};
export const createAtom = (props?: AtomProps) => {
  let { id } = props || {};
  id = id || nanoid();
  const eventBus = createEventBus();
  const registry = createRegistry();
  const serviceBus = createServiceBus();
  const renderer = createRenderer<Record<string, any>>();
  const states = createStateContainer();
  const useValue = <T>(key: Key<T>): T | undefined => {
    const [value, setValue] = useState(() => states.get(key));
    useEffect(() => {
      return states.subscribe(key, (_: unknown, v: T) => setValue(v));
    }, []);
    return value;
  };

  const injector = createInjector();
  const withModule = <
    S extends System,
    T extends Record<string, Record<string, any>>
  >(
    system: S,
    module: T
  ) => {
    const temp = {
      id: system.id,
      emit: system.emit,
      on: system.on,
      expose: system.expose,
      invoke: system.invoke,
      states: system.states,
      registry: system.registry,
      injector: system.injector,
      renderer: system.renderer,
      ComponentProvider: system.ComponentProvider,
      withModule: system.withModule,
    };
    const res = Object.assign(temp, module);
    const withPluginSystem2 = <T extends Record<string, any>>(system: T) => {
      const pluginSystem = createPluginSystem<T, "activate", "deactivate">();
      const pluginService = createPluginService<T>(system);
      return Object.assign(system, {
        createPlugin: pluginSystem.createPlugin,
        addPlugins: pluginService.use,
      });
    };

    return withPluginSystem2(res);
  };

  type System = {
    id: string;
    emit: typeof eventBus.emit;
    on: typeof eventBus.on;
    expose: typeof serviceBus.expose;
    invoke: typeof serviceBus.invoke;
    states: typeof states & { useValue: typeof useValue };
    registry: typeof registry;
    injector: typeof injector;
    renderer: typeof renderer;
    ComponentProvider: typeof renderer.ComponentProvider;
    createPlugin: ReturnType<
      typeof createPluginSystem<System, "activate", "deactivate">
    >["createPlugin"];
    addPlugins: ReturnType<typeof createPluginService<System>>["use"];
    withModule: typeof withModule;
  };
  const system = {
    id,
    emit: eventBus.emit,
    on: eventBus.on,
    expose: serviceBus.expose,
    invoke: serviceBus.invoke,
    states: Object.assign(states, { useValue }),
    registry,
    injector,
    renderer,
    ComponentProvider: renderer.ComponentProvider,
    withModule,
  } as System;

  return withPluginSystem(system);
};

export type Atom = ReturnType<typeof createAtom>;
