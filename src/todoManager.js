// import { compareAsc, startOfWeek } from "date-fns";
import { createTodo } from "./todo";
import { PubSub } from 'pubsub-js';
import { parseISO, format, startOfToday, startOfWeek, endOfWeek} from 'date-fns';

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

    const getAllTodosDueToday = () => {
        const allTodos = getAllTodos();
        const today = format(startOfToday(), 'yyyy-MM-dd');
        const allTodosDueToday = [];
        for (let i = 0; i < allTodos.length; i++) {
            if (today == allTodos[i].dueDate) {
                allTodosDueToday.push(allTodos[i]);
            }
        }
        return allTodosDueToday;
    }

    const getAllTodosDueThisWeek = () => {
        const allTodos = getAllTodos();
        const allTodosDueThisWeek = [];
        const weekStart = format(startOfWeek(startOfToday()), 'yyyy-MM-dd');
        const weekEnd = format(endOfWeek(startOfToday()), 'yyyy-MM-dd');

        for (let i = 0; i < allTodos.length; i++) {
            if (weekStart < allTodos[i].dueDate && 
                allTodos[i].dueDate < weekEnd) {
                allTodosDueThisWeek.push(allTodos[i]);
            }
        }
        return allTodosDueThisWeek;
    }
    
    const getTodosOfThisProject = (topicName, requestType) => {
        const projectId = requestType.projectId;
        const retrievedIds = JSON.parse(localStorage.getItem(`project-${projectId}`)).todoIds;
        const todosToReturn = [];
        for (let i = 0; i < retrievedIds.length; i++) {
            todosToReturn.push(JSON.parse(localStorage.getItem(`todo-${retrievedIds[i]}`)));
        }

        if (requestType.type == "renderTodosForProject") {
            PubSub.publishSync('sendTodosOfProject', todosToReturn);
            return
        }

        return todosToReturn;
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
        const todos = getTodosOfThisProject('', {type: '', projectId}); 
        for (let i = 0; i < todos.length; i++) {
            localStorage.removeItem(`todo-${todos[i].id}`);
        }
    }

    // Subscribe to / listen for project deletion events --> need to delete all
    // todos associated with the deleted project
    const listenForDeletedProjects = PubSub.subscribe('deleteProject', deleteAllTodosForThisProject);
    const listenForCreatedTodos = PubSub.subscribe('createTodoToTodoManager', createAndSaveTodo);
    const listenForFinishedTodos = PubSub.subscribe('finishTodo', finishTodo);
    const listenForDeletedTodos = PubSub.subscribe('deleteTodoToTodoManager', deleteTodo);
    const listenForEditedTodos = PubSub.subscribe('editTodoToTodoManager', editTodo);
    const listenForRequestedTodo = PubSub.subscribe('requestTodo', getTodo);
    const listenForRequestedTodosOfAProject = PubSub.subscribe('requestTodosOfProject', getTodosOfThisProject);
    const listenForRequestedTodosForToday = PubSub.subscribe('requestTodosOfToday', function(topicName) {
        const todos = getAllTodosDueToday();
        PubSub.publishSync('sendTodosOfToday', todos);
    });

    const listenForRequestedTodosForThisWeek = PubSub.subscribe('requestTodosOfThisWeek', function(topicName) {
        const todos = getAllTodosDueThisWeek();
        PubSub.publishSync('sendTodosOfThisWeek', todos);
    })
    

    return {getAllTodos, getAllTodosDueBeforeThisDate, getTodosOfThisProject, createAndSaveTodo, editTodo, deleteTodo}
}

export { createTodoManager }