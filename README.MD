# 项目启动

```
# 环境
node 8.1.2
tsc 2.3.4
mnpm i

# dev
npm run dev

# production
npm run build
npm run start
```

# 约定

* 前端代码模块，一律用 import 关键字引用，禁用 require
* 文件和文件夹命名大小写保持一致,且用中划线连接。例：readme/README/dev-server
* pages 里允许建立子目录，但只允许建立一层，表示 某个page 由哪些部分组成
