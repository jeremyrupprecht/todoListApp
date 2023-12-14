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

// localStorage.clear();
// const todoState = createTodoManager(projectState);
// const projectState = createProjectManager(todoState);
// const noteState = createNoteManager();

// let testDate = format(startOfToday(), 'yyyy/MM/dd');
// let todo1 = todoState.createAndSaveTodo(0, 'TODO 0', 'test note details', 
//                                         testDate, 'low', false, "0");



// let newDate = format(endOfMonth(new Date(2014, 8, 2, 11, 55, 0)), 'yyyy/MM/dd');
// todoState.editTodo(todo1, 'newTitle', 'newDetails', newDate, 'high');

// let todo2 = todoState.createAndSaveTodo(1, 'TODO 1', 'test todo details2', 
//                                         testDate, 'high', false, "0");

// let todo3 = todoState.createAndSaveTodo(3, 'TODO 3', 'test todo details3', 
//                                         testDate, 'low', false, "");
                                                                 
// let todo4 = todoState.createAndSaveTodo(4, 'TODO 4', 'test todo details4', 
//                                         testDate, 'medium', false, "");


// let testProject = projectState.createAndSaveProject(0, 'The first project');


// let testProject2 = state.createAndSaveProject(0, 'The first project', [testTodo.getTodo().id]);
// console.log(localStorage);

// let newDate = format(endOfMonth(new Date(2014, 8, 2, 11, 55, 0)), 'yyyy/MM/dd');
// state.editTodo(testTodo, 'new Title!', 'new Details!', newDate, 'medium');

// let testNote = noteState.createAndSaveNote(0, 'NOTEYYYY', 'Im a note!!');
// let testNote2 = noteState.createAndSaveNote(1, 'NOTEYYYY', 'Im a note!!');