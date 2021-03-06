/**
 * Created by gsh on 2017/4/7.
 */
var log = function() {
    console.log.apply(console, arguments)
}
var e = function(selector) {
    return document.querySelector(selector)
}
var appendHtml = function(element, html) {
    element.insertAdjacentHTML('beforeend', html)
}
var baseUrl = localhost:8081

var ajax = function(method, path, data, reseponseCallback) {
    var r = new XMLHttpRequest()
// 设置请求方法和请求地址
    r.open(method, path, true)
// 设置发送的数据的格式
    r.setRequestHeader('Content-Type', 'application/json')
// 注册响应函数
    r.onreadystatechange = function() {
        if(r.readyState === 4) {
            reseponseCallback(r.response)
        }
    }
// 发送请求
    r.send(data)
}
var apiTodoAll = function(callback) {
    var method = 'GET'
    var path = '/todo/all'
    var url = baseUrl + path
    ajax(method, url, '', function(r){
        var todos = JSON.parse(r.response)
        log('todo all', todos)
        callback(todos)
    })
}
var apiTodoAdd = function(task, callback) {
    var method = 'POST'
    var path = '/todo/add'
    var url = baseUrl + path
    var data = {
        'task': task,
    }
    var data = JSON.stringify(data)
    ajax(method, url, data, function(r){
        var t = JSON.parse(r.response)
        log('add todo', t)
        callback(t)
    })
}
var apiTodoUpdate = function (id, task, callback) {
    var method = 'POST'
    var path = '/todo/update/' + id
    var url = baseUrl + path
    var data = {
        'id': id,
        'task': task,
    }
    data = JSON.stringify(data)
    ajax(method, url, data, function(r){
        var t = JSON.parse(r.response)
        log('todo update', t)
        callback(t)
    })
}
var apiTodoDelete = function(id, callback){
    var method = 'GET'
    var path = '/delete/' + id
    var url = baseUrl + path
    ajax(method, url, '', function(r){
        var t = JSON.parse(r.response)
        log('todo delete', t)
        callback(t)
    })
}

// apiTodoUpdate(1, '更新后的task', function(response){
//     console.log('apitodo updateadd成功', response)
// })
// apiTodoAdd('看书', function(response){
//     console.log('todoadd成功', response)
// })
// apiTodoAll(function(response){
//     console.log('apitodo all', response)
// })
// itodo 的 html
var templateTodo = function(todo){
    var task = todo.task
    var id = todo.id
    var t = `
        <div class=todo-cell data-id=${id}>
            <button class=todo-delete>删除</button>
            <button class=todo-edit>编辑</button>
            <span class=todo-task>${task}</span>
        </div>
    `
    return t
}
// 载入所有 todos
var loadTodos = function() {
    apiTodoAll(function(todos){
        insertTodos(todos)
    })
}
var insertTodo = function(todo){
    var container = e('#id-div-todo-container')
    var todoCell = templateTodo(todo)
    appendHtml(container, todoCell)
}
// 显示所有 todos
var insertTodos = function(todos) {
    var container = e('#id-div-todo-container')
    for (var i = 0; i < todos.length; i++) {
        var todo = todos[i]
        var t = templateTodo(todo)
        appendHtml(container, t)
    }
}

var bindEventAdd = function(){
    var container = e('#id-div-todo-container')
    container.addEventListener('click', function(event){
        var self = event.target
        if (self.id == 'id-button-add') {
            log('点击add 按钮')
            var task = e('#id-input-task').value
            log('task', task)
            apiTodoAdd(task, function(todo){
                insertTodo(todo)
            })
        }
    })
}
var bindEventDelete = function(){
    var container = e('#id-div-todo-container')
    container.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('todo-delete')) {
            log('点击delete 按钮')
            var todoCell = self.parentElement
            var todo_id = todoCell.dataset.id
            log('todo_id', todo_id)
            apiTodoDelete(todo_id, function(todo){
                todoCell.remove()
                log('被删除的 todo', todo)
            })
        }
    })
}
var bindEventEdit = function(){
    var container = e('#id-div-todo-container')
    container.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('todo-edit')) {
            log('edit 按钮')
            var todoCell = self.parentElement
            var span = todoCell.querySelector('span')
            var todo_id = todoCell.dataset.id
            log('todo edit', span)
            span.contentEditable = true
        }
    })
}
var bindEventEditInput = function(){
    var container = e('#id-div-todo-container')
    container.addEventListener('keydown', function(event){
        var self = event.target
        if (self.classList.contains('todo-task')) {
            log('editinput 按钮', event)
            if (event.key == 'Enter') {
                log('Enter')
                self.contentEditable = false
                var task = self.innerHTML
                var todoCell = self.parentElement
                var todo_id = todoCell.dataset.id
                apiTodoUpdate(todo_id, task, function(){
                    log('ajax updated')
                })
            }
        }
    })
}

var bindEvents = function(){
    bindEventAdd()
    bindEventEdit()
    bindEventEditInput()
    bindEventDelete()
}

var __main = function() {
    log('main, todo.js')
    loadTodos()
    bindEvents()
}

__main()
