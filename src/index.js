import './style.css';
import {format} from 'date-fns';
import { createTodoManager } from './todoManager';
import { createProjectManager } from './projectManager';
import { createNoteManager } from './noteManager';
import { renderScreen, setupListeners} from './domManager';

function preloadTodoData() {
    // Need to load template todos if there are none (like when the user first
    // opens the site)
    if (!localStorage.getItem('todoIdCount')) {
        console.log("Empty local storage detected, preloading todo data...");

        const date0 = format(new Date(2023, 11, 21), 'yyyy-MM-dd');
        const date1 = format(new Date(2023, 11, 20), 'yyyy-MM-dd');
        const date2 = format(new Date(2023, 11, 16), 'yyyy-MM-dd');
        const date3 = format(new Date(2023, 11, 24), 'yyyy-MM-dd');

        // Set up a loop for these
        const values0 = {title: 'TODO 0', details: 'DETAILS0', dueDate: date0, 
        priority: 'low', isFinished: false, parentProjectId: 0};
        PubSub.publishSync('createTodo', values0);

        const values1 = {title: 'TODO 1', details: 'DETAILS1', dueDate: date1, 
        priority: 'medium', isFinished: false, parentProjectId: 0};
        PubSub.publishSync('createTodo', values1);

        const values2 = {title: 'TODO 2', details: 'DETAILS2', dueDate: date2, 
        priority: 'high', isFinished: false, parentProjectId: 0};
        PubSub.publishSync('createTodo', values2);

        const values3 = {title: 'TODO 3', details: 'DETAILS3', dueDate: date3, 
        priority: 'low', isFinished: false, parentProjectId: 0};
        PubSub.publishSync('createTodo', values3);

        const values4 = {title: 'TODO 4', details: 'DETAILS4', dueDate: date3, 
        priority: 'low', isFinished: false, parentProjectId: 0};
        PubSub.publishSync('createTodo', values4);

    }
}

function preloadNoteData() {
    if (!localStorage.getItem('noteIdCount')) {
        console.log("Empty local storage detected, preloading note data...");

        const values0 = {title: 'Title0', details: 'Details0'};
        PubSub.publishSync('createNote', values0);
        
        const values1 = {title: 'Title1', details: 'Details1'};
        PubSub.publishSync('createNote', values1);
        
        const values2 = {title: 'Title2', details: 'Details2'};
        PubSub.publishSync('createNote', values2);

        const values3 = {title: 'Title3', details: 'Details3'};
        PubSub.publishSync('createNote', values3);

        const values4 = {title: 'Title4', details: 'Details4'};
        PubSub.publishSync('createNote', values4);

        const values5 = {title: 'Title5', details: 'Details5'};
        PubSub.publishSync('createNote', values5);

        const values6 = {title: 'Title6', details: 'Details6'};
        PubSub.publishSync('createNote', values6);

        const values7 = {title: 'Title7', details: 'Details7'};
        PubSub.publishSync('createNote', values7);
        
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
preloadTodoData();
preloadNoteData();
renderScreen();
setupListeners();
