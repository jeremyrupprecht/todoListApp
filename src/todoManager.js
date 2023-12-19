import { compareAsc } from "date-fns";
import { createTodo } from "./todo";
import { PubSub } from 'pubsub-js';
import { parseISO } from 'date-fns';

function createTodoManager() {

    const getTodo = (topicName, id) => {
        const todo = JSON.parse(localStorage.getItem(`todo-${id}`));
        PubSub.publishSync('sendTodo',todo);
    }

    const getAllTodos = () => {
        const allTodos = []
        const keys = Object.keys(localStorage);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].includes("todo")) {
                allTodos.push(JSON.parse(localStorage.getItem(keys[i])));
            }
        }
        return allTodos;
    }

    const getAllTodosDueBeforeThisDate = (date) => {
        const allTodos = getAllTodos();
        const todosBeforeThisDate = allTodos.filter((todo) => 
        parseISO(todo.dueDate).getTime() <= parseISO(date).getTime());
        return todosBeforeThisDate;
    }
    
    const getTodoIdsOfThisProject = (projectId) => {
        const todoIds = JSON.parse(localStorage.getItem(`project-${projectId}`)).todoIds;
        return todoIds;
    }

    // This publishes to the PubSub mediator
    const createAndSaveTodo = (topicName, todoValues) => {
        
        const title = todoValues.title;
        const details = todoValues.details;
        const dueDate = todoValues.dueDate;
        const priority = todoValues.priority;
        const isFinished = todoValues.isFinished;
        const parentProjectId = todoValues.parentProjectId;

        const id = getAllTodos().length;
        // Don't allow duplicate id's
        if (localStorage.getItem(`todo-${id}`)) {
            console.log("A Todo with that id already exists!");
            return
        }
        const newTodo = createTodo(id, title, details, dueDate, priority, isFinished, parentProjectId);
        localStorage.setItem(`todo-${id}`, JSON.stringify(newTodo.getTodo())); 

        // Publish todo creation to project manager and publish todo id back
        // to the dom manager (to link the DOM element and todo together)
        PubSub.publishSync('createTodo', id);
        PubSub.publishSync('assignTodo', newTodo.getTodo());

        return newTodo;
    }

    const editTodo = (topicName, todoValues) => {

        const idOfTodoToEdit = todoValues.id;
        const title = todoValues.title;
        const details = todoValues.details;
        const dueDate = todoValues.dueDate;
        const priority = todoValues.priority;

        const todoFromStorage = JSON.parse(localStorage.getItem(`todo-${idOfTodoToEdit}`));
        if (todoValues) {
            const editedTodo = createTodo(idOfTodoToEdit, title, details, dueDate, 
                                          priority, todoFromStorage.isFinished,
                                          todoFromStorage.parentProjectId);
            localStorage.setItem(`todo-${idOfTodoToEdit}`, JSON.stringify(editedTodo.getTodo())); 
            PubSub.publishSync('renderEditedTodo', editedTodo.getTodo());
        }
    }

    const finishTodo = (topicName, finishedObject) => {
        const idOfTodoToFinish = finishedObject.id;
        const isFinished = finishedObject.finished;
        const todoValues = JSON.parse(localStorage.getItem(`todo-${idOfTodoToFinish}`));
        if (todoValues) {
            const editedTodo = createTodo(todoValues.id, todoValues.title, 
                                          todoValues.details, todoValues.dueDate,
                                          todoValues.priority, isFinished, 
                                          todoValues.parentProjectId);
            localStorage.setItem(`todo-${idOfTodoToFinish}`, JSON.stringify(editedTodo.getTodo())); 
        }
    }

    // This publishes to the PubSub mediator
    const deleteTodo = (topicName, idOfTodoToDelete) => {
        if (localStorage.getItem(`todo-${idOfTodoToDelete}`)) {
            // Publish todo deletion to project manager
            PubSub.publishSync('deleteTodo', idOfTodoToDelete);
            localStorage.removeItem(`todo-${idOfTodoToDelete}`);
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
    const listenForCreatedTodos = PubSub.subscribe('createTodoToTodoManager', createAndSaveTodo);
    const listenForFinishedTodos = PubSub.subscribe('finishTodo', finishTodo);
    const listenForDeletedTodos = PubSub.subscribe('deleteTodoToTodoManager', deleteTodo);
    const listenForEditedTodos = PubSub.subscribe('editTodoToTodoManager', editTodo);
    const listenForRequestedTodos = PubSub.subscribe('requestTodo', getTodo);

    return {getAllTodos, getAllTodosDueBeforeThisDate, getTodoIdsOfThisProject, createAndSaveTodo, editTodo, deleteTodo}
}

export { createTodoManager }