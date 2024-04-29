/* eslint-disable @typescript-eslint/no-explicit-any */
import { BasicCommandLineParser } from "@/toolkit/factories/basicCommandLineParser";
import { createBean, define } from "@/toolkit/factories/bean";
import {
  Command,
  CommandOptionParser,
} from "@/toolkit/factories/commandOptionParser";
import { createEventBus } from "@/toolkit/factories/eventBus";
import { ComponentBox } from "@/toolkit/factories/magicBox/componentBox";

// type DefaultContentType = "components" | "apps" | "commands";
// type IContentType = DefaultContentType | string;

export const AppBox = define(() => {
  const bean = createBean<{
    [key: string]: any;
  }>({});
  const register = (name: string, value: any) => {
    bean.set({ ...bean.get(), [name]: value });
  };
  const get = (name: string) => bean.get()[name];
  const use = (name: string) => bean.use()[name];
  return Object.assign(bean, {
    registerApp: register,
    getApp: get,
    useApp: use,
  });
});

export const CommandBox = define(() => {
  const bean = createBean<Record<string, Command>>({});
  const register = (name: string, value: Command) => {
    bean.set({ ...bean.get(), [name]: value });
  };
  const get = (name: string) => bean.get()[name];
  const use = (name: string) => bean.use()[name];
  const has = (name: string) => !!bean.get()[name];
  const execute = (name: string, args: any) => {
    const command = get(name);
    command.action(args);
  };
  const executeCommandLine = (commandString: string) => {
    const basicCommandLineParser = new BasicCommandLineParser();
    const commandOptionParser = new CommandOptionParser();
    const { command, args } = basicCommandLineParser.parse(commandString);
    args.unshift(command);
    Object.entries(bean.get()).forEach(([, value]) => {
      commandOptionParser.addCommand(value);
    });
    const executable = commandOptionParser.parse(args);
    if (executable) {
      commandOptionParser.execute(executable);
    }
  };
  return Object.assign(bean, {
    registerCommand: register,
    getCommand: get,
    useCommand: use,
    hasCommand: has,
    executeCommand: execute,
    executeCommandLine,
  });
});

export const MagicBox = define(() => {
  const bean = createBean<Record<string, any>>({});
  const apps = AppBox.create();
  const commands = CommandBox.create();
  const components = ComponentBox.create();
  const eventBus = createEventBus();
  return Object.assign(bean, {
    apps,
    commands,
    components,
    eventBus,
  });
});

// export const magicBox = MagicBox.create();

// magicBox.apps.registerApp("app1", { name: "app1" });

// export const MagicBox = define(() => {
//   const bean = createBean<MyBean>({
//     components: {},
//     apps: {},
//     commands: {},
//   });
//   const {
//     namespaces: { components, apps, commands },
//   } = bean;

//   bean.namespaces;

//   const register = (type: IContentType, name: string, value: any) => {
//     bean.namespaces[type].set({
//       ...bean.namespaces[type].get(),
//       [name]: value,
//     });
//   };
//   const get = (type: IContentType, name: string) => {
//     return bean.namespaces[type].get()?.[name];
//   };
//   const use = (type: IContentType, name: string) => {
//     return bean.namespaces[type].use()?.[name];
//   };
//   const registerApp = (name: string, value: any) =>
//     register("apps", name, value);
//   const getApp = (name: string) => get("apps", name);
//   const useApp = (name: string) => use("apps", name);

//   const registerComponent = (name: string, value: any) =>
//     register("components", name, value);
//   const getComponent = (name: string) => get("components", name);
//   const useComponent = (name: string) => use("components", name);

//   const registerCommand = (name: string, value: any) =>
//     register("commands", name, value);
//   const getCommand = (name: string) => get("commands", name);
//   const useCommand = (name: string) => use("commands", name);

//   //   const commandString = "npm dev --watch --port 3000";
//   const executeCommand = (commandString: string) => {
//     const basicCommandLineParser = new BasicCommandLineParser();
//     const commandOptionParser = new CommandOptionParser();
//     const { command, args } = basicCommandLineParser.parse(commandString);
//     args.unshift(command);
//     commandOptionParser.addCommand({
//       name: "npm",
//       description: "Run npm commands",
//       options: [],
//       action: (args: any) => {
//         console.log("Running npm with args:", args);
//         if (args.help) {
//           console.log("Help for npm commands");
//         }
//       },
//       commands: [
//         {
//           name: "dev",
//           description: "Run the development server",
//           options: [
//             {
//               long: "watch",
//               short: "w",
//               description: "Watch file changes",
//               type: "boolean",
//             },
//             {
//               long: "port",
//               short: "p",
//               description: "Port number",
//               type: "number",
//             },
//           ],
//           action: (args: any) => {
//             console.log("Running npm dev with args:", args);
//           },
//         },
//       ],
//     });
//     commandOptionParser.parse(args);
//   };

//   return {
//     components,
//     apps,
//     commands,
//     register,
//     get,
//     use,
//     registerApp,
//     getApp,
//     useApp,
//     registerComponent,
//     getComponent,
//     useComponent,
//     registerCommand,
//     getCommand,
//     useCommand,
//   };
// });
