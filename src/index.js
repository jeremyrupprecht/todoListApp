import './style.css';
import Icon from './testIcon.png';
import {endOfMonth, format, startOfDay, startOfToday} from 'date-fns';
import { createTodoManager } from './todoManager';
import { createProjectManager } from './projectManager';
import { createNoteManager } from './noteManager';

function component() {
    const element = document.createElement('div');

    element.innerHTML = "testing..........";
    element.classList.add('hello');

    // Add the image to our existing div.
    const myIcon = new Image();
    myIcon.src = Icon;
    element.appendChild(myIcon);

    return element;
}

document.body.appendChild(component());

// const subscription1 = PubSub.subscribe('topic1', (data, msg) => console.log('Subscriber 1:', data, msg));
// const subscription2 = PubSub.subscribe('topic1', (data, msg)  => console.log('Subscriber 2:', data, msg));
// PubSub.publishSync('topic1', 'Hello, subscribers!');
// PubSub.unsubscribe(subscription1);
// PubSub.publishSync('topic1', 'Hello again!');

localStorage.clear();
const todoState = createTodoManager();
const projectState = createProjectManager();
const noteState = createNoteManager();



let testProject = projectState.createAndSaveProject(0, 'The first project', []);
let testProject2 = projectState.createAndSaveProject(1, '2nd project', []);

let testDate = format(startOfToday(), 'yyyy/MM/dd');
let todo1 = todoState.createAndSaveTodo(0, 'TODO 0', 'test note details', 
                                        testDate, 'low', false, 0);

let newDate = format(endOfMonth(new Date(2014, 8, 2, 11, 55, 0)), 'yyyy/MM/dd');
// todoState.editTodo(todo1, 'newTitle', 'newDetails', newDate, 'high');

let todo2 = todoState.createAndSaveTodo(1, 'TODO 2', 'test todo details2', 
                                        testDate, 'high', false, 0);

let todo3 = todoState.createAndSaveTodo(3, 'TODO 3', 'test todo details3', 
                                        testDate, 'low', false, 0);
                                                                 
let todo4 = todoState.createAndSaveTodo(4, 'TODO 4', 'test todo details4', 
                                        testDate, 'medium', false, 0);

let todo5 = todoState.createAndSaveTodo(5, 'TODO 5', 'test todo details5', 
                                        testDate, 'low', false, 1);

// console.log(JSON.stringify(testProject.getProject()));
// console.log(JSON.stringify(testProject));

// todoState.deleteTodo(todo4);
// projectState.deleteProject(testProject.getProject().id);

// let testProject2 = state.createAndSaveProject(0, 'The first project', [testTodo.getTodo().id]);
// console.log(localStorage);

// let newDate = format(endOfMonth(new Date(2014, 8, 2, 11, 55, 0)), 'yyyy/MM/dd');
// state.editTodo(testTodo, 'new Title!', 'new Details!', newDate, 'medium');

// let testNote = noteState.createAndSaveNote(0, 'NOTEYYYY', 'Im a note!!');
// let testNote2 = noteState.createAndSaveNote(1, 'NOTEYYYY', 'Im a note!!');