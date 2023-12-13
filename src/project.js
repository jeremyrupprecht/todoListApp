function createProject(inputedId, title, todoIds) {
    const id = inputedId;

    const getProject = () => {
        return {id, title, todoIds}
    }
    const setTitle = (newTitle) => {
        title = newTitle;
    }
    const addTodo = (todoId) => {
        todoIds.push(todoId);
    }
    const removeTodo = (todoIdToRemove) => {
        let index = todoIds.indexOf(todoIdToRemove);
        console.log('INDEX', index);
        console.log('HEYYYYYYY');
        if (index > -1) { 
            todoIds.splice(index, 1);
        }
    }
    return {getProject, setTitle, addTodo, removeTodo}
}

export { createProject }