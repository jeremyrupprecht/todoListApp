import './style.css';
import {endOfMonth, format, startOfDay, startOfToday} from 'date-fns';
import { createTodoManager } from './todoManager';
import { createProjectManager } from './projectManager';
import { createNoteManager } from './noteManager';
import { renderScreen, setupListeners} from './domManager';

function preloadData(todoManager, projectManager, noteManager) {

    // Need to load template todos if there are none (like when the user first
    // opens the site)

    if (!localStorage.getItem('todo-0')) {
        console.log("preloading data...");

        const date1 = format(new Date(1995, 0, 14), 'yyyy-MM-dd');
        const date2 = format(new Date(1995, 0, 16), 'yyyy-MM-dd');

        // Set up a loop for these

        const values0 = {title: 'TODO 0', details: 'DETAILS0', dueDate: date1, 
        priority: 'low', isFinished: false, parentProjectId: 0};
        PubSub.publishSync('createTodoToTodoManager', values0);

        const values1 = {title: 'TODO 1', details: 'DETAILS11', dueDate: date2, 
        priority: 'medium', isFinished: false, parentProjectId: 0};
        PubSub.publishSync('createTodoToTodoManager', values1);

        const values2 = {title: 'TODO 2', details: 'DETAILS22', dueDate: date1, 
        priority: 'high', isFinished: false, parentProjectId: 0};
        PubSub.publishSync('createTodoToTodoManager', values2);

        const values3 = {title: 'TODO 3', details: 'DETAILS33', dueDate: date1, 
        priority: 'low', isFinished: false, parentProjectId: 0};
        PubSub.publishSync('createTodoToTodoManager', values3);

        const values4 = {title: 'TODO 4', details: 'DETAILS44', dueDate: date1, 
        priority: 'low', isFinished: false, parentProjectId: 1};
        PubSub.publishSync('createTodoToTodoManager', values4);

        const values5 = {title: 'TODO 5', details: 'DETAILS55', dueDate: date1, 
        priority: 'low', isFinished: false, parentProjectId: 1};
        PubSub.publishSync('createTodoToTodoManager', values5);

        const values6 = {title: 'TODO 6', details: 'DETAILS66', dueDate: date1, 
        priority: 'low', isFinished: false, parentProjectId: 2};
        PubSub.publishSync('createTodoToTodoManager', values6);
    }
}

function createDefaultProjects(projectManager) {

    if (!localStorage.getItem('project-0')) {

        const homeProject = {type: '', title: 'Home'};
        PubSub.publishSync('createProjectToProjectManager', homeProject);
        
        const todayProject = {type: '', title: 'Today'};
        PubSub.publishSync('createProjectToProjectManager', todayProject);

        const weekProject = {type: '', title: 'Week'};
        PubSub.publishSync('createProjectToProjectManager', weekProject);
    }
}

// const testD = format(new Date(1995, 0, 14), 'MMM Do');
// console.log(testD);

// const subscription1 = PubSub.subscribe('topic1', (data, msg) => console.log('Subscriber 1:', data, msg));
// const subscription2 = PubSub.subscribe('topic1', (data, msg)  => console.log('Subscriber 2:', data, msg));
// PubSub.publishSync('topic1', 'Hello, subscribers!');
// PubSub.unsubscribe(subscription1);
// PubSub.publishSync('topic1', 'Hello again!');

const todoState = createTodoManager();
const projectState = createProjectManager();
const noteState = createNoteManager();

// localStorage.clear();

createDefaultProjects(projectState);
preloadData(todoState, projectState, noteState);


renderScreen();
setupListeners();


// const testTodos = todoState.getTodosOfThisProject(0);
// console.log(testTodos);


/*

let testProject = projectState.createAndSaveProject(0, 'The first project', []);
let testProject2 = projectState.createAndSaveProject(1, '2nd project', []);

let testDate = format(new Date(1995, 0, 14), 'yyyy-MM-dd');
let todo0 = todoState.createAndSaveTodo(0, 'TODO 0', 'test note details', 
                                        testDate, 'low', false, 0);

// todoState.deleteTodo(todo0.getTodo().id);
// todoState.deleteTodo(todo1.getTodo().id);
// todoState.deleteTodo(todo2.getTodo().id);
// todoState.deleteTodo(todo3.getTodo().id);
// todoState.deleteTodo(todo4.getTodo().id);

todoState.editTodo(todo1.getTodo().id, 'new Title!', 'new Details!', newDate, 'medium');

projectState.editProjectTitle(testProject2.getProject().id, "NEW PROJECT TITLE!");
projectState.editProjectTitle(testProject.getProject().id, "GUESS WHAT!");

// console.log(JSON.stringify(testProject.getProject()));
// console.log(JSON.stringify(testProject));

// todoState.deleteTodo(todo4);
// projectState.deleteProject(testProject.getProject().id);

// let testProject2 = state.createAndSaveProject(0, 'The first project', [testTodo.getTodo().id]);
// console.log(localStorage);

// let newDate = format(endOfMonth(new Date(2014, 8, 2, 11, 55, 0)), 'yyyy/MM/dd');
// state.editTodo(testTodo, 'new Title!', 'new Details!', newDate, 'medium');

let testNote = noteState.createAndSaveNote(0, 'NOTEYYYY', 'Im a note!!');
let testNote2 = noteState.createAndSaveNote(1, 'NOTEYYYY', 'Im a note!!');

noteState.editNoteTitle(testNote.getNote().id, "NEW NOTE TITLE");
noteState.editNoteDetails(testNote2.getNote().id, "GUESS WHAT, NEW NOTE DETAILS!!!");
noteState.deleteNote(testNote.getNote().id);

// console.log(todoState.getAllTodos());

let today = format(startOfToday(), 'yyyy-MM-dd');

let testDate2 = format(new Date(1995, 0, 15), 'yyyy-MM-dd');

const todosDate = todoState.getAllTodosDueBeforeThisDate(testDate2);
// console.table('RETURNED DATES', todosDate);

*/