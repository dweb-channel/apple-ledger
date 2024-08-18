# Dledger

dweb-browser 快捷记账应用。

## init

第一次运行初始化数据库。

```bash
deno task init
```

## 启动应用

```bash
deno task start
```

## API

1. 快捷指令添加一条消息。
```bash
/add/:auto_hash
```

2. 用户注册

```bash
/user/register
```
3. 用户登陆

```bash
/user/login
```

4. 用户删除

```bash
/user/delete
```