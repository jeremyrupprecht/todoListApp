import './style.css';
import Icon from './testIcon.png';
import {format, startOfDay, startOfToday} from 'date-fns';
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
let testTodo2 = state.createAndSaveTodo(1, 'TODO TWOO', 'test note details', 
                                        testDate, 'low', false);
console.log(testTodo.getTodo());

let testProject = state.createAndSaveProject(0, 'The first project', [testTodo.getTodo().id, testTodo2.getTodo().id]);
console.log(testProject.getProject());

let testNote = state.createAndSaveNote(0, 'NOTEYYYY', 'Im a note!!');
console.log(testNote.getNote());