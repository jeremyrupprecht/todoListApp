import { createTodo } from "./todo";

function createTodoManager() {

    const createAndSaveTodo = (id, title, details, dueDate, priority, isFinished) => {
        // Don't allow duplicate id's
        if (localStorage.getItem(`todo-${id}`)) {
            console.log("A Todo with that id already exists!");
            return
        }
        const newTodo = createTodo(id, title, details, dueDate, priority, isFinished);
        localStorage.setItem(`todo-${id}`, JSON.stringify(newTodo.getTodo())); 
        return newTodo;
    }

    const editTodo = (todoToEdit, title, details, dueDate, priority) => {
        todoToEdit.setTodoValues(title, details, dueDate, priority);
        localStorage.setItem(`todo-${todoToEdit.getTodo().id}`, JSON.stringify(todoToEdit.getTodo())); 
    }

    const deleteTodo = (todoToDelete) => {
        localStorage.removeItem(`todo-${todoToDelete.getTodo().id}`);
    }

    return {createAndSaveTodo, editTodo, deleteTodo}
}

export { createTodoManager }