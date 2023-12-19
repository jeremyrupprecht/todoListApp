import './style.css';
import {endOfMonth, format, startOfDay, startOfToday} from 'date-fns';
import { createTodoManager } from './todoManager';
import { createProjectManager } from './projectManager';
import { createNoteManager } from './noteManager';
import { renderScreen, setupListeners} from './domManager';

function preloadData(todoManager, projectManager, noteManager) {

    // Preloaded data already there
    if (localStorage.length) {

        // add project and note methods ...


        return
    }

    // Need to load template data if storage is empty (like when the user
    // first opens the site)

        // id's start from 0
}

// const testD = format(new Date(1995, 0, 14), 'MMM Do');
// console.log(testD);

// const subscription1 = PubSub.subscribe('topic1', (data, msg) => console.log('Subscriber 1:', data, msg));
// const subscription2 = PubSub.subscribe('topic1', (data, msg)  => console.log('Subscriber 2:', data, msg));
// PubSub.publishSync('topic1', 'Hello, subscribers!');
// PubSub.unsubscribe(subscription1);
// PubSub.publishSync('topic1', 'Hello again!');


localStorage.clear();
const todoState = createTodoManager();
const projectState = createProjectManager();
const noteState = createNoteManager();

// preloadData(todoState, projectState, noteState);
renderScreen();
setupListeners();

let testProject = projectState.createAndSaveProject(0, 'The first project', []);
// let testProject2 = projectState.createAndSaveProject(1, '2nd project', []);

// let testDate = format(new Date(1995, 0, 14), 'yyyy-MM-dd');
// let todo0 = todoState.createAndSaveTodo('TODO 0', 'test note details', 
//                                         testDate, 'low', false, 0);

// let newDate = format(new Date(1995, 0, 16), 'yyyy-MM-dd');
// // todoState.editTodo(todo1, 'newTitle', 'newDetails', newDate, 'high');

// let todo1 = todoState.createAndSaveTodo('TODO 1', 'test todo details2', 
//                                         testDate, 'high', false, 0);

// let todo2 = todoState.createAndSaveTodo('TODO 2', 'test todo details3', 
//                                         newDate, 'low', false, 0);
                                                                 
// let todo3 = todoState.createAndSaveTodo('TODO 3', 'test todo details4', 
//                                         testDate, 'medium', false, 0);

// let todo4 = todoState.createAndSaveTodo('TODO 4', 'test todo details5', 
//                                         testDate, 'low', false, 1);


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