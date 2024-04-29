import { IConfigurationContribute } from "@/toolkit/vscode/IExtensionConfiguration";

export interface IExtensionMenifest {
  name: string;
  publisher: string;
  author: {
    name: string;
  };
  displayName: string;
  description: string;
  version: string;
  icon: string;
  main: string;
  engines?: {
    vscode: string;
  };
  categories: string[];
  activationEvents?: string[];
  contributes: {
    icons?: {
      [key: string]: {
        description: string;
        default: {
          url?: string;
          fontPath?: string;
        };
      };
    };
    configuration?: IConfigurationContribute;
    commands?: {
      command: string;
      title: string;
      category: string;
      icon:
        | string
        | {
            light: string;
            dark: string;
          };
    }[];
    menus?: {
      command: string;
      when: string;
      group: string;
      submenu: string;
    }[];
    keybindings?: {
      command: string;
      key: string;
      mac: string;
      when: string;
    }[];
  };

  repository?: {
    type: string;
    url: string;
  };
  bugs?: {
    url: string;
  };
  license: string;
}
