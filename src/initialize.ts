let initialContent = `
---
title: home
---

# 测试
---

- [ ] dd

* [ ] 吃饭
- [x] 睡觉
- [] 打豆豆

\`\`\`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap demo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
  </head>
  <body>
    <h1>Hello, world!</h1>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
  </body>
</html>
\`\`\`
`;
if (import.meta.env.PROD) initialContent = `# `;
export { initialContent };

export const initialContent2 = `# **第一个 Markdown 文档**

---

## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题

**加粗** *斜体* ~~删除线~~

- 一级无序列表
  - 二级无序列表
    - 三级无序列表

1. 一级有序列表
   1. 二级有序列表
      1. 三级有序列表

> 在浏览器支持 ES 模块之前，JavaScript 并没有提供原生机制让开发者以模块化的方式进行开发。这也正是我们对 “打包” 这个概念熟悉的原因：使用工具抓取、处理并将我们的源码模块串联成可以在浏览器中运行的文件。

| **name** | **age** | **blog** |
| :--- | :---: | ---: |
| *LearnShare* | 12 | [LearnShare](http://xianbai.me/) |
| **Mike** | 32 | [Mike](http://mike.me/) |

这是一个行内公式：$\\int_0^\\infty \\mathrm{e}^{-x}]\\,\\mathrm{d}x$ ， 公式块也是支持的：


$$
\\sqrt[n]{1+x+x^2+\\ldots }
$$
- [ ] vite 以当前工作目录作为根目录启动开发服务器。

- [ ] 你也可以通过 vite serve some/sub/dir 来指定一个替代的根目录。

- [ ] 注意 Vite 同时会解析项目根目录下的 [**配置文件（即**](https://cn.vitejs.dev/config/#configuring-vite) vite.config.js）

- [ ] 因此如果根目录被改变了，你需要将配置文件移动到新的根目录下。

\`\`\`json
{
  "scripts": {
    "dev": "vite", // 启动开发服务器，别名：vite dev，vite serve
    "build": "vite build", // 为生产环境构建产物
    "preview": "vite preview" // 本地预览生产构建产物
  }
}
\`\`\`

![玉山银行数字化（上）：构建台湾地区第一个银行自建的“微服务架构”核心系统](https://static001.infoq.cn/resource/image/12/4a/12584834cf3183549f3fe81547bc204a.jpg?x-oss-process=image/crop,y_1,w_1279,h_718/resize,w_613,h_345)

`;

/*
# **Markdown示例**

## 文本图像代码

Vite（法语意为 "快速的"，发音 `/vit/`，发音同 "veet"）是一种新型前端构建工具，能够显著提升前端开发体验。它主要由两部分组成：

- 一个开发服务器，它基于 [**原生 ES 模块**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 提供了 [**丰富的内建功能**](https://cn.vitejs.dev/guide/features.html)，如速度快到惊人的 [**模块热更新（HMR）**](https://cn.vitejs.dev/guide/features.html#hot-module-replacement)。

- 一套构建指令，它使用 [**Rollup**](https://rollupjs.org/) 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

目前支持的模板预设如下：

> 在浏览器支持 ES 模块之前，JavaScript 并没有提供原生机制让开发者以模块化的方式进行开发。这也正是我们对 “打包” 这个概念熟悉的原因：使用工具抓取、处理并将我们的源码模块串联成可以在浏览器中运行的文件。

| **name** | **age** | **blog** |
| :--- | :---: | ---: |
| *LearnShare* | 12 | [LearnShare](http://xianbai.me/) |
| **Mike** | 32 | [Mike](http://mike.me/) |

---

这是一个行内公式：$\int_0^\infty \mathrm{e}^{-x}\,\mathrm{d}x$ ， 公式块也是支持的：


$$
\sqrt[n]{1+x+x^2+\ldots}
$$
### 长文本

你可能已经注意到，在一个 Vite 项目中，`index.html` 在项目最外层而不是在 `public` 文件夹内。这是有意而为之的：在开发期间 Vite 是一个服务器，而 `index.html` 是该 Vite 项目的入口文件。

Vite 将 `index.html` 视为源码和模块图的一部分。Vite 解析 `<script type="module" src="...">` ，这个标签指向你的 JavaScript 源码。甚至内联引入 JavaScript 的 `<script type="module">` 和引用 CSS 的 `<link href>` 也能利用 Vite 特有的功能被解析。另外，`index.html` 中的 URL 将被自动转换，因此不再需要 `%PUBLIC_URL%` 占位符了。

与静态 HTTP 服务器类似，Vite 也有 “根目录” 的概念，即服务文件的位置，在接下来的文档中你将看到它会以 `<root>` 代称。源码中的绝对 URL 路径将以项目的 “根” 作为基础来解析，因此你可以像在普通的静态文件服务器上一样编写代码（并且功能更强大！）。Vite 还能够处理依赖关系，解析处于根目录外的文件位置，这使得它即使在基于 monorepo 的方案中也十分有用。

Vite 也支持多个 `.html` 作入口点的 [**多页面应用模式**](https://cn.vitejs.dev/guide/build.html#multi-page-app)。

- [ ] `vite` 以当前工作目录作为根目录启动开发服务器。

- [ ] 你也可以通过 `vite serve some/sub/dir` 来指定一个替代的根目录。

- [ ] 注意 Vite 同时会解析项目根目录下的 [**配置文件（即**](https://cn.vitejs.dev/config/#configuring-vite) `vite.config.js`）

- [ ] 因此如果根目录被改变了，你需要将配置文件移动到新的根目录下。

## **命令行界面**

在安装了 Vite 的项目中，可以在 npm scripts 中使用 `vite` 可执行文件，或者直接使用 `npx vite` 运行它。下面是通过脚手架创建的 Vite 项目中默认的 npm scripts：

**json**

```json
{
  "scripts": {
    "dev": "vite", // 启动开发服务器，别名：`vite dev`，`vite serve`
    "build": "vite build", // 为生产环境构建产物
    "preview": "vite preview" // 本地预览生产构建产物
  }
}
```

可以指定额外的命令行选项，如 `--port` 或 `--https`。运行 `npx vite --help` 获得完整的命令行选项列表。

查看 [**命令行界面**](https://cn.vitejs.dev/guide/cli.html) 了解更多细节。

---

下面是一张图片：

![玉山银行数字化（上）：构建台湾地区第一个银行自建的“微服务架构”核心系统](https://static001.infoq.cn/resource/image/12/4a/12584834cf3183549f3fe81547bc204a.jpg?x-oss-process=image/crop,y_1,w_1279,h_718/resize,w_613,h_345)

**阶段二：多仓库多模块应用**，于是将项目拆解成多个业务模块，并在多个 Git 仓库管理，模块解耦，降低了巨石应用的复杂度，每个模块都可以独立编码、测试、发版，代码管理变得简化，构建效率也得以提升，这种代码管理方式称之为 MultiRepo。
*/
