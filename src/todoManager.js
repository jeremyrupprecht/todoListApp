import { createTodo } from "./todo";
import { PubSub } from 'pubsub-js';

function createTodoManager() {

    const getAllTodos = () => {

    }

    const getAllTodosDueAtThisDate = (date) => {

    }

    const getTodoIdsOfThisProject = (projectId) => {
        const todoIds = JSON.parse(localStorage.getItem(`project-${projectId}`)).todoIds;
        return todoIds;
    }

    // This publishes to the PubSub mediator
    const createAndSaveTodo = (id, title, details, dueDate, priority, isFinished, parentProjectId) => {
        // Don't allow duplicate id's
        if (localStorage.getItem(`todo-${id}`)) {
            console.log("A Todo with that id already exists!");
            return
        }
        const newTodo = createTodo(id, title, details, dueDate, priority, isFinished, parentProjectId);
        localStorage.setItem(`todo-${id}`, JSON.stringify(newTodo.getTodo())); 
        // Publish todo creation to project manager
        PubSub.publishSync('createTodo', newTodo);
        return newTodo;
    }

    const editTodo = (todoToEdit, title, details, dueDate, priority) => {
        todoToEdit.setTodoValues(title, details, dueDate, priority);
        localStorage.setItem(`todo-${todoToEdit.getTodo().id}`, JSON.stringify(todoToEdit.getTodo())); 
    }

    // This publishes to the PubSub mediator
    const deleteTodo = (idOfTodoToDelete) => {
        if (localStorage.getItem(`todo-${idOfTodoToDelete}`)) {
            localStorage.removeItem(`todo-${idOfTodoToDelete}`);
            // Publish todo deletion to project manager
            PubSub.publishSync('deleteTodo', idOfTodoToDelete);
            return
        }
        console.log('This todo does not exist!');
    } 

    // Called WHENEVER a project is deleted --> all of it's todos are deleted as well
    const deleteAllTodosForThisProject = (topicName, projectId) => {
        const todoIds = getTodoIdsOfThisProject(projectId);
        for (let i = 0; i < todoIds.length; i++) {
            localStorage.removeItem(`todo-${todoIds[i]}`);
        }

    }

    // Subscribe to / listen for project deletion events --> need to delete all
    // todos associated with the deleted project
    const listenForDeletedProjects = PubSub.subscribe('deleteProject', deleteAllTodosForThisProject);

    return {getAllTodos, getAllTodosDueAtThisDate, getTodoIdsOfThisProject, createAndSaveTodo, editTodo, deleteTodo}
}

export { createTodoManager }