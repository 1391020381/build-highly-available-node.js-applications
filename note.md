# autocannon
* autocannon [opts] URL
* opts 代表可选参数

1. -c/--connections NUM 要使用的并发连接数。 默认值:10
2. -p/--pipelinging NUM 使用流水线请求的数量 默认1
3. -d/--duraton  SEC   运行autocannon的秒数 默认值 10
4. -a/-amount NUM 退出基准之前的请求次数。如果设置 则忽略-d/duration
5. -w/--workers 用于连续请求的工作线程数
6. 