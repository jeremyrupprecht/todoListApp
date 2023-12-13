function createProject(inputedId, title, todos) {
    const id = inputedId;
    const getId = () => {
        id;
    }
    const getTitle = () => {
        title;
    }
    const getTodos = () => {
        todos;
    }
    const setTitle = (newTitle) => {
        title = newTitle;
    }
    const addTodo = (newTodo) => {
        todos.push(newTodo);
    }
    const removeTodo = (todoToRemove) => {
        let index = todoToRemove.id;
        if (index > -1) { 
            todos.splice(index, 1);
        }
    }
    return {getId, getTitle, getTodos, setTitle, addTodo, removeTodo}
}

export { createProject }