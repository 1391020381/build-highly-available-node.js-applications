# APM的形态
1. 服务器性能指标监控
    - cpu  内存  硬盘容量
    - 告警
    - 监控历史趋势，对异常点进行分析
2. 服务监控
    - 对提供的服务进行监控
    - 监控服务的情况  如 请求次数 响应数 成功率
    - 监控服务的热点 异常波动
    - 监测服务来源 调用方分布
3. 错误/异常监控      
    - 对报错或异常进行监控
    - 一般需要主动上报
    - 需要提供大量上下文信息才有意义。url  错误堆栈 甚至用户信息
    - 价值与上报的消息多少成正比同样成本也是
4. 日志收集
    - 对服务的所有情况进行记录,日志是必不可少的。
    - 不管是业务本身,还是访问记录,都需要尽可能记录日志
    - 日志的查询分析很困难,所以APM 一般都有日志收集和分析的能力。
    - 日志会占用大量磁盘空间,所以需要定时清除,清除掉就很难查到问题啦。
5. 依赖监控
    - 对服务的依赖进行监控,如数据库 缓存 外部服务
    - 几乎所有的响应缓慢问题均由依赖导致  
    - 依赖监控也是比较大范围的监控,只能发现问题,很难跟服务本身关联起来。
6. 分布式事务追踪  
    - 分布式事务追踪可以通过一个ID就可以查询到一次请求的全链路情况
7. 代码级监控分析 
    - 一般利用自动化的代码插桩技术,获取Node.js进程内方法调用链路。
    - 可以查看调用栈上的总执行时间和每个方法占的百分比。 
    - 结合 V8 Profiling 查看可能出现的内存泄漏情况。 


    * https://gitee.com/node-apm
    * https://github.com/nswbmw/node-in-debugging
    * https://github.com/yjhjstz/deep-into-node
    * https://github.com/theanarkh/understand-nodejs
    * https://github.com/aliyun-node/Node.js-Troubleshooting-Guide
    * https://github.com/goldbergyoni/nodebestpractices/blob/master/README.chinese.md
    * https://pm2.keymetrics.io/docs/usage/signals-clean-restart/
    * [[译] 在你沉迷于包的海洋之前，还是了解一下运行时 Node.js 的本身](https://juejin.cn/post/6844903470529511432#heading-0)
    * [node.js BFF开发8个月的心路历程](https://juejin.cn/post/6844904084709834766#heading-2)
