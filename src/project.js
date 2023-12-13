function createProject(inputedId, title, todos) {
    const id = inputedId;

    const getProject = () => {
        return {id, title, todos}
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
    return {getProject, setTitle, addTodo, removeTodo}
}

export { createProject }