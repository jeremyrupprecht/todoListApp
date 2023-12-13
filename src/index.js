import './style.css';
import Icon from './testIcon.png';
import {endOfMonth, format, startOfDay, startOfToday} from 'date-fns';
import { createStateManager } from './stateManager';

function component() {
    const element = document.createElement('div');

    element.innerHTML = "testing..........";
    element.classList.add('hello');

    // Add the image to our existing div.
    const myIcon = new Image();
    myIcon.src = Icon;
    element.appendChild(myIcon);

    // const testDate = format(new Date(2023, 0, 11), 'yyyy/MM/dd');
    // console.log(testDate);

    return element;
}

document.body.appendChild(component());


localStorage.clear();
let state = createStateManager();

let testDate = format(startOfToday(), 'yyyy/MM/dd');
let testTodo = state.createAndSaveTodo(0, 'TODO 1', 'test note details', 
                                        testDate, 'low', false);
// let testTodo2 = state.createAndSaveTodo(0, 'TODO TWOO', 'test todo details', 
//                                         testDate, 'low', false);

// let newDate = format(endOfMonth(new Date(2014, 8, 2, 11, 55, 0)), 'yyyy/MM/dd');
// state.editTodo(testTodo, 'new Title!', 'new Details!', newDate, 'medium');


// let testProject = state.createAndSaveProject(0, 'The first project', [testTodo.getTodo().id]);
// let testProject2 = state.createAndSaveProject(0, 'The first project', [testTodo.getTodo().id]);
// console.log(localStorage);


// let testNote = state.createAndSaveNote(0, 'NOTEYYYY', 'Im a note!!');
// let testNote2 = state.createAndSaveNote(0, 'NOTEYYYY', 'Im a note!!');

