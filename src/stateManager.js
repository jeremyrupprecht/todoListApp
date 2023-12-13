import { createTodo } from "./todo";
import { createProject } from "./project";
import { createNote } from "./note";
import { de } from "date-fns/locale";

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

    const editTodo = (todoToEdit, title, details, dueDate, priority) => {
        todoToEdit.setTodoValues(title, details, dueDate, priority);
        localStorage.setItem(`todo-${todoToEdit.getTodo().id}`, JSON.stringify(todoToEdit.getTodo())); 
    }

    const editProjectTitle = (projectToEdit, title) => {
        projectToEdit.setTitle(title);
        localStorage.setItem(`project-${projectToEdit.getProject().id}`, JSON.stringify(projectToEdit.getProject())); 
    }

    const editNoteTitle = (noteToEdit, title) => {
        noteToEdit.setTitle(title);
        localStorage.setItem(`note-${noteToEdit.getNote().id}`, JSON.stringify(noteToEdit.getNote())); 
    }

    const editNoteDetails = (noteToEdit, details) => {
        noteToEdit.setDetails(details);
        localStorage.setItem(`note-${noteToEdit.getNote().id}`, JSON.stringify(noteToEdit.getNote())); 
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

    return {createAndSaveTodo, createAndSaveProject, createAndSaveNote, editTodo, editProjectTitle,
        editNoteTitle, editNoteDetails, deleteTodo, deleteProject, deleteNote}
}

export { createStateManager }