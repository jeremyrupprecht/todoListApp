import { createProject } from "./project";

function createProjectManager(todoManager) {

    // TODO'S DON'T NEED TO KNOW ABOUT THIS
    const getProjectFromStorage = (id) => {
        const projectValues = JSON.parse(localStorage.getItem(`project-${id}`));
        if (projectValues) {
            const projectToReturn = createProject(projectValues.id, 
                                    projectValues.title, projectValues.todoIds);
            return projectToReturn;
        }
    }

    // TODO'S DON'T NEED TO KNOW ABOUT THIS
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

    // TODO'S DON'T NEED TO KNOW ABOUT THIS
    const getTodosDueAtThisDate = (date) => {

    }

    // SUBSCRIBE TO MEDIATOR 
    const addTodoToProject = (todoToAdd, projectToBeAddedto) => {
        projectToBeAddedto.addTodo(todoToAdd.getTodo().id);
        localStorage.setItem(`project-${projectToBeAddedto.getProject().id}`, JSON.stringify(projectToBeAddedto.getProject()));
    }

    // SUBSCRIBE TO MEDIATOR
    const removeTodoFromProject = (todoToRemove, projectToRemoveFrom) => {
        projectToRemoveFrom.removeTodo(todoToRemove.getTodo().id);
        localStorage.setItem(`project-${projectToRemoveFrom.getProject().id}`, JSON.stringify(projectToRemoveFrom.getProject()));
    }

    // TODO'S DON'T NEED TO KNOW ABOUT THIS
    // AS PROJECTS ARE ALWAYS CREATED EMPTY
    const createAndSaveProject = (id, title) => {
        // Don't allow duplicate id's
        if (localStorage.getItem(`project-${id}`)) {
            console.log("A Project with that id already exists!");
            return
        }
        const newProject = createProject(id, title);
        localStorage.setItem(`project-${id}`, JSON.stringify(newProject.getProject()));
        return newProject;
    }

    // TODO'S DON'T NEED TO KNOW ABOUT THIS
    const editProjectTitle = (projectToEdit, title) => {
        projectToEdit.setTitle(title);
        localStorage.setItem(`project-${projectToEdit.getProject().id}`, JSON.stringify(projectToEdit.getProject())); 
    }

    // PUBLISH TO MEDIATOR
    const deleteProject = (projectToDelete) => {
        localStorage.removeItem(`project-${projectToDelete.getProject().id}`);
        
    }

    return {getProjectFromStorage, getTodosOfThisProject, getTodosDueAtThisDate, addTodoToProject, removeTodoFromProject, createAndSaveProject, editProjectTitle,
            deleteProject}
}

export { createProjectManager }