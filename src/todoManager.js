import { createTodo } from "./todo";

function createTodoManager(projectManager) {

    const getAllTodos = () => {

    }

    const createAndSaveTodo = (id, title, details, dueDate, priority, isFinished, parentProjectId) => {
        // Don't allow duplicate id's
        if (localStorage.getItem(`todo-${id}`)) {
            console.log("A Todo with that id already exists!");
            return
        }
        const newTodo = createTodo(id, title, details, dueDate, priority, isFinished, parentProjectId);
        console.log(newTodo.getTodo().parentProjectId);
        localStorage.setItem(`todo-${id}`, JSON.stringify(newTodo.getTodo())); 
        return newTodo;
    }

    const editTodo = (todoToEdit, title, details, dueDate, priority) => {
        todoToEdit.setTodoValues(title, details, dueDate, priority);
        localStorage.setItem(`todo-${todoToEdit.getTodo().id}`, JSON.stringify(todoToEdit.getTodo())); 
    }

    const deleteTodo = (todoToDelete) => {
        if (localStorage.getItem(`todo-${todoToDelete.getTodo().id}`)) {
            localStorage.removeItem(`todo-${todoToDelete.getTodo().id}`);
            // Remove todo id reference from this todo's parent project (if it has one)
            const parentProjectId = todoToDelete.getTodo().parentProjectId;

            if (parentProjectId) {
                const projectToRemoveFrom = projectManager.getProjectFromStorage(parentProjectId);
                projectManager.removeTodoFromProject(todoToDelete, projectToRemoveFrom);
            } 
        }
    } 

    return {getAllTodos, createAndSaveTodo, editTodo, deleteTodo}
}

export { createTodoManager }