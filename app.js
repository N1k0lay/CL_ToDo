//API https://jsonplaceholder.typicode.com

//TodoObj:
// {userId: 1, id: 1, title: 'delectus aut autem', completed: false}
// UserObj
// {id: 1, name: 'Leanne Graham', username: 'Bret', email: 'Sincere@april.biz', address: {…}, …}

const todoList = document.getElementById('todo-list');
const usersTodoList = document.getElementById('user-todo');
let todos, users;

let pToDo = fetch('https://jsonplaceholder.typicode.com/todos')
    .then(response => response.json());

let pUsers = fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json());

Promise.all([pUsers, pToDo]).then(value => {
    users = value[0];
    todos = value[1];
    //Вывод ToDo
    todos.map(e => {
        createLiTask(e, 'after')
    })
    //Вывод Users
    users.map(e => {
        let option = document.createElement("option");
        option.append(e.name);
        option.setAttribute('key', e.id);
        option.value = e.id;
        usersTodoList.append(option);
        return e;
    })

});

//Изменение статуса таски
const statusTask = (taskId, status) => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({
            completed: status,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => {
            document.querySelectorAll('.todo-item').forEach(e => {
                if (Number(e.getAttribute('key')) === Number(taskId) && json.completed === true) {
                    e.classList.add('done');
                } else {
                    e.classList.remove('done');
                }
            });
            console.log(json)
        });

};
//Удаление таски
const deleteTask = (taskId) => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
        method: 'DELETE',
    }).then((res) => {
        document.querySelectorAll('.todo-item').forEach(e => {
            if (Number(e.getAttribute('key')) === Number(taskId)) {
                e.remove();
            }
        });
        console.log(res)
    });
};
//Добавление таски на сервер
const addTask = () => {
    let textToDo = document.querySelector('#new-todo');
    let userToDo = document.querySelector('#user-todo');
    //Валидация
    if (textToDo.value && userToDo.value !== 'select user') {
        fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify({
                title: textToDo.value,
                completed: false,
                userId: userToDo.value,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((json) => createLiTask(json, 'before'));
    } else {
        alert('Проверьте заполненные поля.')
    }

}
//Создание таск в списке
const createLiTask = (obj, insert = 'before') => {
    console.log(obj);
    let li = document.createElement("li");
    li.classList.add('todo-item');
    if (obj.completed) {
        li.classList.add('done')
    }
    li.setAttribute('key', obj.id);
    li.innerHTML = `
            <input type="checkbox" ${obj.completed && 'checked'} onchange="statusTask((Number(this.parentNode.getAttribute('key'))), this.checked)">
            <span class="task">${obj.title} <em>by</em> <b>${users[obj.userId - 1].name}</b></span>
            <button class="close" onclick="deleteTask((Number(this.parentNode.getAttribute('key'))));">X</button>`;
    insert === 'before' ? todoList.prepend(li) : todoList.append(li);
}


