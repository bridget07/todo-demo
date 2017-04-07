// 引入 express 并且创建一个 express 实例赋值给 app
var express = require('express')
var bodyParse =require('body-parser')

var app = express()

var todoList = [
    {
        id: 1,
        task: "运动",
    },
    {
        id: 2,
        task: "喝水",
    },
    {
        id: 3,
        task: "散步",
    },
]

// 配置静态文件目录
app.use(express.static('static'))
app.use(bodyParse. json())

var sendHtml = function(path, response) {
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    fs.readFile(path, options, function(err, data){
        // console.log(`读取的html文件 ${path} 内容是`, data)
        response.send(data)
    })
}
// 用 get 定义一个给用户访问的网址
// request 是浏览器发送的请求
// response 是要发给浏览器的响应
app.get('/', function(request, response) {
    var path = 'index.html'
    sendHtml(path, response)
})

app.get('/todo/all', function(request, response) {
    var r = JSON.stringify(todoList, null, 2)
    response.send(r)
})

var todoAdd = function(todo){
    // 参数todo 是 {  task: task, } 的形式，需要加上 id 信息
    if(todoList.length === 0) {
        todo.id = 1
    } else {
        todo.id = todoList[todoList.length-1].id + 1
    }
    // 此时的todo 信息完整了
    todoList.push(todo)
    return todo
}
var sendJSON = function(response, object){
    var data = JSON.stringify(object)
    response.send(data)
}
app.post('/todo/add', function(request, response) {
    // console.log(request.body)
    var todo = request.body
    // console.log('todo', todo)
    var t = todoAdd(todo)
    sendJSON(response, t)
})

var todoUpdate = function(todo){
    var id = todo.id
    for(var i = 0; i < todoList.length; i++) {
        // 找到对应 id
        var t = todoList[i]
        if(t.id == id) {
            // update
            t.task = todo.task
            return t
        }
    }
    return todo
}
app.post('/todo/update/:id', function(request, response) {
    // 动态路由里面的变量通过 request.params.变量名 的方式来获取
    var id = request.params.id
    // console.log('update', id, typeof id)
    var todo = request.body
    var t = todoUpdate(todo)
    sendJSON(response, t)
})

var todoDelete = function(id){
    id = Number(id)
    var index = -1
    for(var i = 0; i < todoList.length; i++) {
        // 找到对应 id 的数据
        var t = todoList[i]
        if(t.id == id) {
            // 找到了, 设置 index 并 break
            // splice 删除并返回被我们删除的元素
            var todo = todoList.splice(i, 1)
            // splice 函数返回的是一个数组, 所以我们要用 [0] 取出第一个元素
            return todo[0]
        }
    }
    return null
}
app.get('/todo/delete/:id', function(request, response) {
    var id = request.params.id
    console.log('delete', id)
    var t = todoDelete(id)
    sendJSON(response, t)
})


// 所以如果监听 80 端口的话，浏览器就不需要输入端口了
// 但是 1024 以下的端口是系统保留端口，需要管理员权限才能使用
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
