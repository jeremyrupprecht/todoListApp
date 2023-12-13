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
    }

    const deleteProject = (projectToDelete) => {
        projects.splice(projects.indexOf(projectToDelete), 1);
    }

    const deleteNote = (noteToDelete) => {
        notes.splice(notes.indexOf(noteToDelete), 1);
    }

    return {getTodos, getProjects, getNotes, getTodo, getProject, getNote,
            createAndSaveTodo, createAndSaveProject, createAndSaveNote, 
            deleteTodo, deleteProject, deleteNote}
}

export { createStateManager }