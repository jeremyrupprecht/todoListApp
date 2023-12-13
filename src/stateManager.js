import { createTodo } from "./todo";
import { createProject } from "./project";
import { createNote } from "./note";

function createStateManager() {

    const getTodosOfThisProject = (project) => {

    }

    const getTodosDueAtThisDate = (date) => {

    }

    const createAndSaveTodo = (id, title, details, dueDate, priority, isFinished) => {
        // Don't allow duplicate id's
        if (localStorage.getItem(`todo-${id}`)) {
            console.log("A Todo with that id already exists!");
            return
        }
        const newTodo = createTodo(id, title, details, dueDate, priority, isFinished);
        localStorage.setItem(`todo-${id}`, JSON.stringify(newTodo.getTodo())); 
        return newTodo;
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

    const createAndSaveNote = (id, title, details) => {
        // Don't allow duplicate id's
        if (localStorage.getItem(`note-${id}`)) {
            console.log("A Note with that id already exists!");
            return
        }
        const newNote = createNote(id, title, details);
        localStorage.setItem(`note-${id}`, JSON.stringify(newNote.getNote()));
        return newNote;
    }

    const editTodo = (todoToEdit, title, details, dueDate, priority, isFinished) => {

    }

    const editProject = (projectToEdit, title, details) => {

    }

    const editNote = (noteToEdit, title, details) => {

    }

    const deleteTodo = (todoToDelete) => {
        localStorage.removeItem(`todo-${todoToDelete.getTodo().id}`);
    }

    const deleteProject = (projectToDelete) => {
        localStorage.removeItem(`project-${projectToDelete.getProject().id}`);
    }

    const deleteNote = (noteToDelete) => {
        localStorage.removeItem(`note-${noteToDelete.getNote().id}`);
    }

    return {createAndSaveTodo, createAndSaveProject, createAndSaveNote, 
            deleteTodo, deleteProject, deleteNote}
}

export { createStateManager }