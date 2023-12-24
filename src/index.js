import './style.css';
import {endOfMonth, format, startOfDay, startOfToday} from 'date-fns';
import { createTodoManager } from './todoManager';
import { createProjectManager } from './projectManager';
import { createNoteManager } from './noteManager';
import { renderScreen, setupListeners} from './domManager';

function preloadData() {

    // Need to load template todos if there are none (like when the user first
    // opens the site)
    if (!localStorage.getItem('todoIdCount')) {
        console.log("Empty local storage detected, preloading data...");

        const date0 = format(new Date(2023, 11, 21), 'yyyy-MM-dd');
        const date1 = format(new Date(2023, 11, 20), 'yyyy-MM-dd');
        const date2 = format(new Date(2023, 11, 16), 'yyyy-MM-dd');
        const date3 = format(new Date(2023, 11, 24), 'yyyy-MM-dd');

        // Set up a loop for these

        const values0 = {title: 'TODO 0', details: 'DETAILS0', dueDate: date0, 
        priority: 'low', isFinished: false, parentProjectId: 0};
        PubSub.publishSync('createTodo', values0);

        const values1 = {title: 'TODO 1', details: 'DETAILS11', dueDate: date1, 
        priority: 'medium', isFinished: false, parentProjectId: 0};
        PubSub.publishSync('createTodo', values1);

        const values2 = {title: 'TODO 2', details: 'DETAILS22', dueDate: date2, 
        priority: 'high', isFinished: false, parentProjectId: 0};
        PubSub.publishSync('createTodo', values2);

        const values3 = {title: 'TODO 3', details: 'DETAILS33', dueDate: date3, 
        priority: 'low', isFinished: false, parentProjectId: 0};
        PubSub.publishSync('createTodo', values3);
    }
}

function createDefaultProjects() {
    if (!localStorage.getItem('projectIdCount')) {
        PubSub.publishSync('createProject', {title: 'Home'});        
        PubSub.publishSync('createProject', {title: 'Today'});
        PubSub.publishSync('createProject', {title: 'Week'});
    }
}

createTodoManager();
createProjectManager();
createNoteManager();

createDefaultProjects();
preloadData();
renderScreen();
setupListeners();
