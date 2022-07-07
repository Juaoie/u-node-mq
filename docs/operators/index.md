# 🎨 operators

    Queue类提供的钩子函数可以集成operators对消息和消费者进行操作；

- [map](./map.md)
- [task](./task.md)
- [debounceTime](./debounceTime.md)
- [throttleTime](./throttleTime.md)
- [newsTime](./newsTime.md)
- [of](./of.md)
- [interval](./interval.md)
- [filter](./filter.md)
- [removeDuplicates](./removeDuplicates.md)
- [instant](./instant.md)

**operators 异步钩子函数说明**

    异步钩子函数不会影响队列执行

| 名称            | 参数       | 返回    | 说明                     |
| --------------- | ---------- | ------- | ------------------------ |
| mounted         | Queue      | unknown | operate 安装成功以后执行 |
| addedNews       | News       | unknown | 消息加入队列以后执行     |
| addedConsumer   | Consumer   | unknown | 消费者订阅队列以后执行   |
| removedConsumer | Consumer[] | unknown | 消费者成功被移除以后执行 |

**operators 同步钩子函数说明**

    同步的钩子函数返回值会影响队列执行

| 名称          | 参数 | 返回                        | 说明                                             |
| ------------- | ---- | --------------------------- | ------------------------------------------------ |
| beforeAddNews | News | boolean \| Promise<boolean> | 消息加入队列之前执行，通过返回值控制是否加入队列 |
| ejectNews     | News | boolean \| Promise<boolean> | 消息弹出来以后执行，返回值用于控制消息是否被丢弃 |
