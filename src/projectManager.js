import { createProject } from "./project";

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

    // NEED TODO IN STORAGE TO KNOW ABOUT THIS
    const addTodoToProject = (todoToAdd, projectToBeAddedto) => {
        projectToBeAddedto.addTodo(todoToAdd.getTodo().id);
        localStorage.setItem(`project-${projectToBeAddedto.getProject().id}`, JSON.stringify(projectToBeAddedto.getProject()));
    }

    // NEED TODO IN STORAGE TO KNOW ABOUT THIS
    const removeTodoFromProject = (todoToRemove, projectToRemoveFrom) => {
        projectToRemoveFrom.removeTodo(todoToRemove.getTodo().id);
        localStorage.setItem(`project-${projectToRemoveFrom.getProject().id}`, JSON.stringify(projectToRemoveFrom.getProject()));
    }

    // NEED TODOS IN STORAGE TO KNOW ABOUT THIS
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

    const editProjectTitle = (projectToEdit, title) => {
        projectToEdit.setTitle(title);
        localStorage.setItem(`project-${projectToEdit.getProject().id}`, JSON.stringify(projectToEdit.getProject())); 
    }

    // NEED TODOS IN STORAGE TO KNOW ABOUT THIS
    const deleteProject = (projectToDelete) => {
        localStorage.removeItem(`project-${projectToDelete.getProject().id}`);
        
    }

    return {getProjectFromStorage, getTodosOfThisProject, getTodosDueAtThisDate, addTodoToProject, removeTodoFromProject, createAndSaveProject, editProjectTitle,
            deleteProject}
}

export { createProjectManager }