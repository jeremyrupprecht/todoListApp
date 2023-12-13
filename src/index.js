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

    const testDate = format(new Date(2023, 0, 11), 'yyyy/MM/dd');
    console.log(testDate);

    return element;
}

document.body.appendChild(component());



let state = createStateManager();
let testDate = format(startOfToday(), 'yyyy/MM/dd');
state.createAndSaveTodo(0, 'note1', 'test note details', 
                        testDate, 'yyyy/MM/dd', 'low', false);