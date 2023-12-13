import { createTodo } from "./todo";
import { createProject } from "./project";
import { createNote } from "./note";
import { printTodo, printProject, printNote, printTodos, printProjects, printNotes} from "./logger";

function createStateManager() {
    const todos = [];
    const projects = [];
    const notes = [];

    const getTodos = () => {
        todos;        
    }
    const getProjects = () => {
        projects;
    }
    const getNotes = () => {
        notes;
    }

    const getTodo = (index) => {
        return todos[index];        
    }
    const getProject = (index) => {
        return projects[index];        
    }
    const getNote = (index) => {
        return notes[index];         
    }

    const createAndSaveTodo = (id, title, details, dueDate, priority, isFinished) => {
        const newTodo = createTodo(id, title, details, dueDate, priority, isFinished);
        todos.push(newTodo);
        localStorage.setItem(`todo-${id}`, JSON.stringify(newTodo.getTodo())); 
        return newTodo;
    }

    const createAndSaveProject = (id, title, todos) => {
        const newProject = createProject(id, title, todos);
        projects.push(newProject);
        localStorage.setItem(`project-${id}`, JSON.stringify(newProject.getProject()));
        return newProject;
    }

    const createAndSaveNote = (id, title, details) => {
        const newNote = createNote(id, title, details);
        notes.push(newNote);
        localStorage.setItem(`note-${id}`, JSON.stringify(newNote.getNote()));
        return newNote;
    }

    const deleteTodo = (todoToDelete) => {
        todos.splice(todos.indexOf(todoToDelete), 1);
        // NEED TO DELETE FROM LOCAL STORAGE
    }

    const deleteProject = (projectToDelete) => {
        projects.splice(projects.indexOf(projectToDelete), 1);
        // NEED TO DELETE FROM LOCAL STORAGE
    }

    const deleteNote = (noteToDelete) => {
        notes.splice(notes.indexOf(noteToDelete), 1);
        // NEED TO DELETE FROM LOCAL STORAGE
    }

    // ALSO NEED TO ALLOW TODO, PROJECT AND NOTE EDITS TO BE 
    // REFLECTED IN LOCAL STORAGE --> EITHER HERE OR IN THE
    // TODO, PROJECT AND NODE MODULES THEMSELVES
    // PROBABLY HERE --> FITS WITH SINGLE RESPONSIBILITY 
    // BETTER??

    return {getTodos, getProjects, getNotes, getTodo, getProject, getNote,
            createAndSaveTodo, createAndSaveProject, createAndSaveNote, 
            deleteTodo, deleteProject, deleteNote}
}

export { createStateManager }