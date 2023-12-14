import { createTodo } from "./todo";
import { PubSub } from 'pubsub-js';

function createTodoManager() {

    // PROEJCTS DON'T NEED TO KNOW ABOUT THIS
    const getAllTodos = () => {

    }

    // PUBLISH TO MEDIATOR
    const createAndSaveTodo = (id, title, details, dueDate, priority, isFinished, parentProjectId) => {
        // Don't allow duplicate id's
        if (localStorage.getItem(`todo-${id}`)) {
            console.log("A Todo with that id already exists!");
            return
        }
        const newTodo = createTodo(id, title, details, dueDate, priority, isFinished, parentProjectId);
        localStorage.setItem(`todo-${id}`, JSON.stringify(newTodo.getTodo())); 

        // Publish todo creation to project manager
        // console.log('CREATING TODO AND PUBLISHING:', newTodo);
        PubSub.publish('createTodo', newTodo);


        return newTodo;
    }

    const editTodo = (todoToEdit, title, details, dueDate, priority) => {
        todoToEdit.setTodoValues(title, details, dueDate, priority);
        localStorage.setItem(`todo-${todoToEdit.getTodo().id}`, JSON.stringify(todoToEdit.getTodo())); 
    }

    // PUBLISH TO MEDIATOR
    const deleteTodo = (todoToDelete) => {
        // if (localStorage.getItem(`todo-${todoToDelete.getTodo().id}`)) {
        //     localStorage.removeItem(`todo-${todoToDelete.getTodo().id}`);

        //     // Publish todo creation to project manager
        //     const parentProjectId = todoToDelete.getTodo().parentProjectId;

        //     if (parentProjectId) {
        //         const projectToRemoveFrom = projectManager.getProjectFromStorage(parentProjectId);
        //         projectManager.removeTodoFromProject(todoToDelete, projectToRemoveFrom);
        //     } 
        // }
    } 

    const deleteAllTodosForThisProject = (topicName, project) => {
        
        console.log('PROJECT DELETED!', project.testId);
    }

    // Subscribe to / listen for project deletion events --> need to delete all
    // todos associated with the deleted project
    const listenForDeletedProjects = PubSub.subscribe('deleteProject', deleteAllTodosForThisProject);

    return {getAllTodos, createAndSaveTodo, editTodo, deleteTodo}
}

export { createTodoManager }