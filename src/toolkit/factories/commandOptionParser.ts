/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CommandOption {
  long: string;
  short?: string;
  description?: string;
  defaultValue?: any;
  type: "string" | "number" | "boolean";
}

export interface Command {
  name: string;
  description?: string;
  options: CommandOption[];
  action: (args: any) => void;
  commands?: Command[];
}

interface ParsedResult {
  command: Command;
  args: Record<string, any>;
  subCommands: ParsedResult[]; // 子命令的解析结果，允许递归结构
}

export class CommandOptionParser {
  private commands: Command[] = [];

  constructor() {}

  addCommand(command: Command) {
    this.commands.push(command);
  }

  // 解析命令行参数，返回解析结果
  parse(argv: string[]): ParsedResult | undefined {
    const [, , ...args] = argv;
    return this.parseCommand(args, this.commands);
  }

  // 根据解析结果执行命令
  execute(parsedResult: ParsedResult): void {
    parsedResult.command.action(parsedResult.args);
    // 递归执行所有子命令
    for (const subCommandResult of parsedResult.subCommands) {
      this.execute(subCommandResult);
    }
  }

  private parseCommand(
    args: string[],
    commands: Command[]
  ): ParsedResult | undefined {
    const currentCommandName = args.shift();
    if (!currentCommandName) {
      console.error("No command provided.");
      return;
    }

    const command = this.findCommand(currentCommandName, commands);
    if (!command) {
      console.error(`Command not found: ${currentCommandName}`);
      return;
    }

    const commandArgs: any = this.parseOptions(args, command.options);
    const subCommands: ParsedResult[] = [];

    while (command.commands && args.length > 0) {
      // 尝试解析子命令
      const subCommandResult = this.parseCommand(args, command.commands);
      if (subCommandResult) {
        subCommands.push(subCommandResult);
      } else {
        break; // 如果没有找到有效的子命令，则停止解析
      }
    }

    return {
      command,
      args: commandArgs,
      subCommands,
    };
  }

  private parseOptions(args: string[], options: CommandOption[]): any {
    const commandArgs: any = {};
    for (const option of options) {
      const index = args.findIndex(
        (arg) => arg === `--${option.long}` || arg === `-${option.short}`
      );
      if (index !== -1) {
        let value: any = true; // Default for boolean
        if (option.type !== "boolean") {
          value = args[index + 1];
          if (option.type === "number") {
            value = parseFloat(value);
          }
          args.splice(index, 2); // Remove processed option and its value
        } else {
          args.splice(index, 1); // Remove processed option
        }
        commandArgs[option.long] = value;
      } else if (option.defaultValue !== undefined) {
        commandArgs[option.long] = option.defaultValue;
      }
    }
    return commandArgs;
  }

  private findCommand(name: string, commands: Command[]): Command | undefined {
    return commands.find((cmd) => cmd.name === name);
  }
}

// 使用示例
// const parser = new CommandOptionParser();

// parser.addCommand({
//   name: "serve",
//   description: "Start the server",
//   options: [
//     { long: "port", short: "p", type: "number", defaultValue: 3000 },
//     { long: "verbose", short: "v", type: "boolean" },
//   ],
//   action: (args) => {
//     console.log(
//       `Starting server on port ${args.port}. Verbose: ${args.verbose}`
//     );
//   },
// });

// // const results = parser.parse(process.argv);

// // if (results) parser.execute(results);
