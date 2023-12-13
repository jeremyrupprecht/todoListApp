import { createTodo } from "./todo";
import { createProject } from "./project";
import { createNote } from "./note";

function createStateManager() {
    const todos = [];
    const projects = [];
    const notes = [];

    const getTodos = () => {
        todos;        
    }
    const getProjects = () => {
        projects
    }
    const getNotes = () => {
        notes;
    }

    const getTodo = (todoToGet) => {
        let index = todos.indexOf(todoToGet);
        return todos[index];        
    }
    const getProject = (projectToGet) => {
        let index = projects.indexOf(projectToGet);
        return projects[index];        
    }
    const getNote = (noteToGet) => {
        let index = notes.indexOf(noteToGet);
        return notes[index];         
    }

    const createAndSaveTodo = (id, title, details, dueDate, priority, isFinished) => {
        const newTodo = createTodo(id, title, details, dueDate, priority, isFinished);
        todos.push(newTodo);
        localStorage.setItem(`todo-${id}`, JSON.stringify(newTodo.getTodo()));
        const retrievedTodo = localStorage.getItem(`todo-${id}`);
        console.log('RETRIEVED', retrievedTodo);
    }

    const createAndSaveProject = (id, title, todos) => {
        const newProject = createProject(id, title, todos);
        projects.push(newProject);
        printProjects();
    }

    const createAndSaveNote = (id, title, details) => {
        const newNote = createNote(id, title, details);
        notes.push(newNote);
        printNotes();
    }

    const deleteTodo = (todoToDelete) => {
        todos.splice(todos.indexOf(todoToDelete), 1);
    }

    const deleteProject = (projectToDelete) => {
        projects.splice(projects.indexOf(projectToDelete), 1);
    }

    const deleteNote = (noteToDelete) => {
        notes.splice(notes.indexOf(noteToDelete), 1);
    }

    // these might break the single responsibility principle??
    // MOVE THESE OUT TO A LOGGER MODULE LATER...
    const printTodos = () => {
        console.log(todos);
    }
    const printProjects = () => {
        console.log(projects);
    }
    const printNotes = () => {
        console.log(notes);
    }

    return {getTodos, getProjects, getNotes, getTodo, getProject, getNote,
            createAndSaveTodo, createAndSaveProject, createAndSaveNote, 
            deleteTodo, deleteProject, deleteNote}
}

export { createStateManager }