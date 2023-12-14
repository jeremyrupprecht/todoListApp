import { createProject } from "./project";
import { PubSub } from 'pubsub-js';

// const subscription1 = PubSub.subscribe('topic1', (data, msg) => console.log('Subscriber 1:', data, msg));
// const subscription2 = PubSub.subscribe('topic1', (data, msg)  => console.log('Subscriber 2:', data, msg));
// PubSub.publishSync('topic1', 'Hello, subscribers!');
// PubSub.unsubscribe(subscription1);
// PubSub.publishSync('topic1', 'Hello again!');


function createProjectManager(todoManager) {

    const getProjectFromStorage = (id) => {
        const projectValues = JSON.parse(localStorage.getItem(`project-${id}`));
        if (projectValues) {
            const projectToReturn = createProject(projectValues.id, 
                                    projectValues.title, projectValues.todoIds);
            return projectToReturn;
        }
    }

    const getTodosOfThisProject = (project) => {
        const todoIds = project.getProject().todoIds;
        const todosToReturn = [];
        for (let i = 0; i < todoIds.length; i++) {
            const todo = localStorage.getItem(`todo-${todoIds[i]}`);
            if (todo) {
                todosToReturn.push(todo);
            }
        }
        return todosToReturn;
    }

    const getTodosDueAtThisDate = (date) => {

    }

    const addTodoToProject = (topicName, todoToAdd) => {
        const projectToBeAddedto = getProjectFromStorage(todoToAdd.getTodo().parentProjectId);
        projectToBeAddedto.addTodo(todoToAdd.getTodo().id);
        localStorage.setItem(`project-${projectToBeAddedto.getProject().id}`, JSON.stringify(projectToBeAddedto.getProject()));
    }
    
    const removeTodoFromProject = (topicName, todoToRemove, idOfProjectToRemoveFrom) => {

        // CALL GET PROJECT FROM STORAGE

        // projectToRemoveFrom.removeTodo(todoToRemove.getTodo().id);
        // localStorage.setItem(`project-${projectToRemoveFrom.getProject().id}`, JSON.stringify(projectToRemoveFrom.getProject()));
    }


    const createAndSaveProject = (id, title, todoIds) => {
        // Don't allow duplicate id's
        if (localStorage.getItem(`project-${id}`)) {
            console.log("A Project with that id already exists!");
            return
        }
        const newProject = createProject(id, title, todoIds);
        localStorage.setItem(`project-${id}`, JSON.stringify(newProject.getProject()));
        return newProject;
    }

    const editProjectTitle = (projectToEdit, title) => {
        projectToEdit.setTitle(title);
        localStorage.setItem(`project-${projectToEdit.getProject().id}`, JSON.stringify(projectToEdit.getProject())); 
    }

    // PUBLISH TO MEDIATOR
    const deleteProject = (projectToDelete) => {
        localStorage.removeItem(`project-${projectToDelete.getProject().id}`);
        
    }

    // Subscribe to / listen for todo creation events and todo deletion events
    // --> as the project associated with the created or deleted todo needs to
    // update its list of todo references (for display later)
    const listenForCreatedTodos = PubSub.subscribe('createTodo', addTodoToProject);
    const listenForDeletedTodos = PubSub.subscribe('deleteTodo', removeTodoFromProject);


    return {getProjectFromStorage, getTodosOfThisProject, getTodosDueAtThisDate, addTodoToProject, removeTodoFromProject, createAndSaveProject, editProjectTitle,
            deleteProject}
}

export { createProjectManager }