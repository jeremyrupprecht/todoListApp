import { createTodo } from "./todo";
import { createProject } from "./project";

function createProjectManager() {

    const getTodosOfThisProject = (project) => {
        const todoIds = project.getProject().todos;
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
        // This function will retrive all the todos for this specific 
        // date
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

    const addTodoToProject = (todoToAdd, projectToBeAddedto) => {
        // This function will add a todo to a project
    }

    const editProjectTitle = (projectToEdit, title) => {
        projectToEdit.setTitle(title);
        localStorage.setItem(`project-${projectToEdit.getProject().id}`, JSON.stringify(projectToEdit.getProject())); 
    }

    const deleteProject = (projectToDelete) => {
        localStorage.removeItem(`project-${projectToDelete.getProject().id}`);
    }

    return {getTodosOfThisProject, getTodosDueAtThisDate, createAndSaveProject, editProjectTitle,
            deleteProject}
}

export { createProjectManager }