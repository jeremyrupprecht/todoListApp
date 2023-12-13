import { createTodo } from "./todo";
import { createProject } from "./project";

function createProjectManager() {

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

    const addTodoToProject = (todoToAdd, projectToBeAddedto) => {
        projectToBeAddedto.addTodo(todoToAdd.getTodo().id);
        localStorage.setItem(`project-${projectToBeAddedto.getProject().id}`, JSON.stringify(projectToBeAddedto.getProject()));
    }

    const createAndSaveProject = (id, title, todos) => {
        // Don't allow duplicate id's
        if (localStorage.getItem(`project-${id}`)) {
            console.log("A Project with that id already exists!");
            return
        }
        const newProject = createProject(id, title, todos);
        localStorage.setItem(`project-${id}`, JSON.stringify(newProject.getProject()));
        return newProject;
    }

    const editProjectTitle = (projectToEdit, title) => {
        projectToEdit.setTitle(title);
        localStorage.setItem(`project-${projectToEdit.getProject().id}`, JSON.stringify(projectToEdit.getProject())); 
    }

    const deleteProject = (projectToDelete) => {
        localStorage.removeItem(`project-${projectToDelete.getProject().id}`);
    }

    return {getTodosOfThisProject, getTodosDueAtThisDate, addTodoToProject, createAndSaveProject, editProjectTitle,
            deleteProject}
}

export { createProjectManager }