# 日志是什么
* 日志用来记录用户操作 系统运行状态等。是一个系统的重要组成部分。
* 由于日志通常不属于系统核心功能,所以常常不被团队成员所重视。
* Node.js后端程序必须考虑如何依靠良好的日志来保证系统可靠的运行。
# 日志的意义
* Debug:可以用日志来记录变量或逻辑。通过记录程序运行的流程,即程序运行了哪些代码,可以方便排查逻辑问题。
* 问题定位:程序出异常或者故障时,通过日志能够快速定位问题,方便后期解决问题。因为线上生产无法debug,在测试环境出模拟一套生产环境,费时费力。所以依靠日志记录的信息定位问题时非常重要的。同时可以通过日志分析出网络的流量,系统的指标等。
* 用户行为:记录用户的操作行为用于分析,如监控 风控 推荐等。这类日志一般用于其他团队分析,因此会准守一定的格式要求,开发这需要按照这个格式来记录。当然要记录哪些行为 操作 也要提前约定好,开发者主要执行（应用里打点）
* 现场记录与根因分析:在关键地方记录日志，可以在终端定位问题时，当别人质疑是你的代码问题时,可以理直气壮的拿出日志，证明自己的功能。提高排查问题效率，避免无谓的甩锅。

# 没有日志的意义
* 对系统运行状态一知半解,甚至一无所知。
* 系统出现问题无法定位,或者需要花费巨大的时间和精力
* 无法发现系统瓶颈，不知优化从何做起。
* 无法基于日志对系统运行过程中的错误和潜在风险进行监控和报警。
* 无法挖掘用户行为,提升产品价值。

# 当我们打 console 时候，发生了什么

```
Console.prototype.log = funtion(){
    this._stdout.write(util.format.apply(this,arguments)+'\n')
}
```
* Console的底层其实是调用的 process.stdout.write,stdin ,stdout,stderr称之为 标准输入 标准输出 标准错误输出
* 在Unix和Unix系统中,如同某些编程语言接口一样,标准流是当一个计算机程序执行时,在它和它的环境间（终端命令行）进行连接的输入和输出的通道。这个三个I/O连接称做标准输入 标准输出 标准错误输出。

# Process.stdout.write的几个点
1. 文件:在 Windows 和 POSIX上是同步的
2. TTY(终端):Windows上是异步的,在POSIX上是同步的
3. 管道（和套接字）:在Windows上是同步的,在POSIX上是异步的
4. POSIX:mac unix linux


* 同步写入会 阻塞事件循环,直到写入完成。在输出到文件的情况下,这几乎是瞬时的,但在高系统负载下,接收端没有读取管道,或者终端或着文件系统缓慢,事件循环可能经常被阻塞,并且时间长到足以对性能产生严重的负面影响。在命令行方式下不是问题,但在生产环境进行日志记录时要特别小心。

# 标准输出流日志输出到文件
* index.js  console.log('1');console.log(2)
* node index.js > hello.log 2> error.log
* 使用重定向（>）和管道（|）运算符,可以把stdout stderr分别输出到文件里

# 日志怎么打到文件里
* fs.writeFile('log.txt',message,'utf8',callback)
* 问题是每次使用 writeFile时都会替换文件数据,因此我们不能只写入。可以首先通过读取文件数据,fs.readFile 然后将必要的数据和新行附加到现有日志。
```
const newLogs = `${Date.now()}:new logs`
fs.readFile('log.txt',{encoding:'utf8'},(err,data)=>{
    const newData = data + newLogs + '\n'
    fs.writeFile('log.txt',newData,'utf8',callback)
})
```
* 但这种方法有个缺点。每次要写入新日志都会打开一个文件,将所有文件数据加载到内存中,然后再次打开同一个文件并写入新数据。在大文件的情况下会占用很多内存。


* fs.appendFile('log.txt','new logs','utf8',callback)
* 打开一个文件,获取文件句柄（fd）
* 将数据写入文件

* appendFile在每次需要写日志时都会打开一个文件。在高并发的情况下会导致EMFILE错误,这是因为异步I/O会对文件系统进行大量并发调用,操作系统的文件描述符数量会被瞬间用光。
* 文件句柄 目录与文件
```
const log = fs.createWriteStream('log.txt',{flags:'a'})

log.write('new entry\n')

log.end()
```

* 通过 creatWriteStream创建了一个可写流，并在日志来的时候以流的方式写入。
* 不会将整个文件加载到内存中
* 每次程序写入文件时,不会创建新的文件描述符,避免EMFILE错误。

# 日志主要场:服务器应用日志

* 对于服务器的一次http请求,会打出一系列相关联的日志。一般对于前端使用的node BFF层,一次请求会经历调用后端服务，获取数据,对数据加工处理,渲染页面或返回数据等过程,大体分为以下几种日志:
1. 客户端请求:客户端请求到达服务层,需要记录请求日志,统一由框架打日志。一般这样的日志称为 accesslog
2. 服务端请求:node对某个后端服务发起请求,并获取到请求的响应数据。一般由框架的请求库负责打日志
3. 异常捕获:在try catch中,出现err后打印的日志,是需要开发者关心的,因为一旦出现这样的日志,说明业务出现了异常。
4. 业务记录:node中的controller层打的业务日志,一般用于记录业务信息比如订单被创建,照片被删除之类。

# 日志的级别介绍
1. INFO:一些日常的信息,描述一个任务完成时的事件。例如 New User created with id xxx
2. DEBUG:此级别使用开发人员,这类似与记录你在使用调试器或断点时看到的信息。例如调用那个函数以及传递哪些参数等。它应该记录当前状态,调试和查找确切问题时会很有用。
3. WARN
4. ERROR
# 什么是一份好的日志
1. 时间戳:知道事件发生的时间，方便来统计和计算
2. 计算机/服务器名称/IP:分布式系统很需要,可以识别具体是哪个机器
3. 进程ID:显示Node进程的ID便于进程管理,叶方便找是具体哪个进程
4. 消息 报错:把一些实际的请求描述一下,特别是错误码 方便排查
5. 堆栈跟踪: error stack 暴露出来,方便查看代码问题
6. 上下文:当前的访问用户/访问路径等,能够更好地进行现场环境的重现。
# 打日志要避免的问题
1. 日志不应该会产生异常
2. 日志不应该产生副作用
3. 日志不要带敏感信息

# 日志分割技术的介绍
1. create / copytruncate
2. pm2-logrotate(copytruncate)
3. egg-logrotate(create)


# 日志主要场景:命令行日志
1. 怎样打彩色日志
2. 怎么样不让打彩色日志  chalk  process.stdout.isTTY  
3. 打印进度条  process
4. inquirer 交互式命令行
5. blessed-contrib 命令行图表
6. commander.js 命令行基础库
7. cfonts 命令行大logo