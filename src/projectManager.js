import { createProject } from "./project";
import { PubSub } from 'pubsub-js';

function createProjectManager() {

    const getProjectFromStorage = (id) => {
        const projectValues = JSON.parse(localStorage.getItem(`project-${id}`));
        if (projectValues) {
            const projectToReturn = createProject(projectValues.id, 
                                    projectValues.title, projectValues.todoIds);
            return projectToReturn;
        }
        console.log("Project does not Exist!");
    }

    // Called WHENEVER a todo is created (every todo must have a parent project)
    const addTodoToProject = (topicName, idOfTodoToAdd) => {
        const todoToAdd = JSON.parse(localStorage.getItem(`todo-${idOfTodoToAdd}`));
        const projectToBeAddedto = getProjectFromStorage(todoToAdd.parentProjectId);
        projectToBeAddedto.addTodo(todoToAdd.id);
        localStorage.setItem(`project-${projectToBeAddedto.getProject().id}`, JSON.stringify(projectToBeAddedto.getProject()));
    }
    
    // Called WHENEVER a todo is deleted (the parent's todo is reference must be deleted)
    const removeTodoFromProject = (topicName, idOfTodoToRemove) => {
        const todoToRemove = JSON.parse(localStorage.getItem(`todo-${idOfTodoToRemove}`));
        const projectToBeRemovedFrom = getProjectFromStorage(todoToRemove.parentProjectId);
        projectToBeRemovedFrom.removeTodo(todoToRemove.id);
        localStorage.setItem(`project-${projectToBeRemovedFrom.getProject().id}`, JSON.stringify(projectToBeRemovedFrom.getProject()));
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

    const editProjectTitle = (idOfProjectToEdit, title) => {
        const projectToEdit = getProjectFromStorage(idOfProjectToEdit);
        projectToEdit.setTitle(title);
        localStorage.setItem(`project-${projectToEdit.getProject().id}`, JSON.stringify(projectToEdit.getProject())); 
    }

    // This publishes to the PubSub mediator
    const deleteProject = (idOfProjectToDelete) => {
        PubSub.publishSync('deleteProject', idOfProjectToDelete);
        localStorage.removeItem(`project-${idOfProjectToDelete}`);
    }

    // Subscribe to / listen for todo creation events and todo deletion events
    // --> as the project associated with the created or deleted todo needs to
    // update its list of todo references (for display later)
    const listenForCreatedTodos = PubSub.subscribe('createTodo', addTodoToProject);
    const listenForDeletedTodos = PubSub.subscribe('deleteTodo', removeTodoFromProject);

    return {getProjectFromStorage, addTodoToProject, removeTodoFromProject, createAndSaveProject, editProjectTitle,
            deleteProject}
}

export { createProjectManager }