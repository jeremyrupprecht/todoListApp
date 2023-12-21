import { createProject } from "./project";
import { PubSub } from 'pubsub-js';

function createProjectManager() {

    const getProjectFromStorage = (topicName, requestType) => {
        const id = requestType.id;
        const projectValues = JSON.parse(localStorage.getItem(`project-${id}`));
        if (projectValues) {
            const projectToReturn = createProject(projectValues.id, 
                                    projectValues.title, projectValues.todoIds);

            if (requestType.type == 'requestProject') {
                PubSub.publishSync('sendProject', projectToReturn);
                return
            }
            return projectToReturn;
        }
        console.log("Project does not Exist!");
    }

    const getAllProjects = (topicId, requestType) => {
        const allProjects = [];
        const keys = Object.keys(localStorage);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].includes("project")) {
                allProjects.push(JSON.parse(localStorage.getItem(keys[i])));
            }
        }

        if (requestType) {
            if (requestType.type = 'renderProjects') {
                PubSub.publishSync('sendAllProjects', allProjects);
                return
            }
        }

        return allProjects;
    }

    // Called WHENEVER a todo is created (every todo must have a parent project)
    const addTodoToProject = (topicName, idOfTodoToAdd) => {
        const todoToAdd = JSON.parse(localStorage.getItem(`todo-${idOfTodoToAdd}`));
        const projectToBeAddedto = getProjectFromStorage('', {id: todoToAdd.parentProjectId});
        projectToBeAddedto.addTodo(todoToAdd.id);
        localStorage.setItem(`project-${projectToBeAddedto.getProject().id}`, JSON.stringify(projectToBeAddedto.getProject()));
    }
    
    // Called WHENEVER a todo is deleted (the parent's todo is reference must be deleted)
    const removeTodoFromProject = (topicName, idOfTodoToRemove) => {
        const todoToRemove = JSON.parse(localStorage.getItem(`todo-${idOfTodoToRemove}`));
        const projectToBeRemovedFrom = getProjectFromStorage('', {id: todoToRemove.parentProjectId});
        projectToBeRemovedFrom.removeTodo(todoToRemove.id);
        localStorage.setItem(`project-${projectToBeRemovedFrom.getProject().id}`, JSON.stringify(projectToBeRemovedFrom.getProject()));
    }

    const createAndSaveProject = (topicName, requestType) => {
        const title = requestType.title;
        const id = getAllProjects('', '').length;
        // Don't allow duplicate id's
        if (localStorage.getItem(`project-${id}`)) {
            console.log("A Project with that id already exists!");
            return
        }
        const newProject = createProject(id, title, []);
        localStorage.setItem(`project-${id}`, JSON.stringify(newProject.getProject()));

        if (requestType.type == 'createNewProject') {
            PubSub.publishSync('sendNewProject', newProject);
            return
        }
        return newProject;
    }

    const editProjectTitle = (topicName, requestType) => {
        const idOfProjectToEdit = requestType.id;
        const title = requestType.title;

        const projectToEdit = getProjectFromStorage('', {id: idOfProjectToEdit});
        projectToEdit.setTitle(title);
        localStorage.setItem(`project-${projectToEdit.getProject().id}`, JSON.stringify(projectToEdit.getProject())); 

        if (requestType.type == 'editProjectTitle') {
            PubSub.publishSync('sendEditedProject', projectToEdit);
        }


    }

    // This publishes to the PubSub mediator
    const deleteProject = (topicName, idOfProjectToDelete) => {
        PubSub.publishSync('deleteProject', idOfProjectToDelete);
        localStorage.removeItem(`project-${idOfProjectToDelete}`);
    }

    // Subscribe to / listen for todo creation events and todo deletion events
    // --> as the project associated with the created or deleted todo needs to
    // update its list of todo references (for display later)
    const listenForCreatedTodos = PubSub.subscribe('createTodo', addTodoToProject);
    const listenForDeletedTodos = PubSub.subscribe('deleteTodo', removeTodoFromProject);
    const listenForCreatedProjects = PubSub.subscribe('createProjectToProjectManager', createAndSaveProject);
    const listenForRequestedAllProjects = PubSub.subscribe('requestAllProjects', getAllProjects)
    const listenForRequestedProjects = PubSub.subscribe('requestProject', getProjectFromStorage);
    const listenForEditedProjects = PubSub.subscribe('editProjectToProjectManager', editProjectTitle);
    const listenForDeletedProjects = PubSub.subscribe('deleteProjectFromDOM', deleteProject);


    return {getProjectFromStorage, addTodoToProject, removeTodoFromProject, createAndSaveProject, editProjectTitle,
            deleteProject}
}

export { createProjectManager }