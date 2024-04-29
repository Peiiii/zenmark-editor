type ParsedCommand = {
  command: string;
  args: string[];
};

export class BasicCommandLineParser {
  // 环境变量存储结构，开始时为空
  private environmentVariables: Record<string, string> = {};

  // 构造函数不再需要初始环境变量设置
  constructor({
    environmentVariables = {},
  }: { environmentVariables?: Record<string, string> } = {}) {
    this.environmentVariables = environmentVariables;
  }

  // 用正则替换字符串中的环境变量占位符
  private expandEnvironmentVariables(input: string): string {
    return input.replace(
      /\$(\w+)/g,
      (_, key) => this.environmentVariables[key] || ""
    );
  }

  // 引号处理逻辑
  private handleQuotes(input: string): string[] {
    const args: string[] = [];
    let currentArg = "";
    let inQuotes = false;
    let quoteChar = "";

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if (
        (char === '"' || char === "'") &&
        (i === 0 || input[i - 1] !== "\\")
      ) {
        if (inQuotes && char === quoteChar) {
          inQuotes = false;
          args.push(currentArg);
          currentArg = "";
        } else if (!inQuotes) {
          inQuotes = true;
          quoteChar = char;
        }
      } else if (!inQuotes && char === " ") {
        if (currentArg.length > 0) {
          args.push(currentArg);
          currentArg = "";
        }
      } else {
        currentArg += char;
      }
    }

    if (currentArg.length > 0) {
      args.push(currentArg);
    }

    return args;
  }

  public parse(commandString: string): ParsedCommand {
    const expanded = this.expandEnvironmentVariables(commandString);
    const argsWithQuotesHandled = this.handleQuotes(expanded);

    const command = argsWithQuotesHandled[0];
    const args = argsWithQuotesHandled.slice(1);

    return { command, args };
  }

  // 允许动态地设置环境变量
  public setEnvironmentVariable(key: string, value: string): void {
    this.environmentVariables[key] = value;
  }

  // 获取环境变量的值
  public getEnvironmentVariable(key: string): string | undefined {
    return this.environmentVariables[key];
  }
}
