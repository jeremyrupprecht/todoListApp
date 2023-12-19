import background from './images/background.png';
import editIcon from './images/editIcon.svg';
import trashIcon from './images/trashIcon.svg';
import editIconGray from './images/editIconGray.svg';
import trashIconGray from './images/trashIconGray.svg';
import plusIcon from './images/plusIcon.svg';
import closeIcon from './images/closeIcon.svg';
import {parse, format} from 'date-fns';
import { PubSub } from 'pubsub-js';

function renderAllImages() {

    // Background image
    const content = document.getElementById('content');
    const backgroundElement = new Image();
    backgroundElement.src = background;
    backgroundElement.classList.add('backgroundImg');
    content.appendChild(backgroundElement);

    // Footer buttons
    const addTodoButton = document.querySelector('.addTodoButton');
    const plusIconElement = new Image();
    plusIconElement.src = plusIcon;
    addTodoButton.appendChild(plusIconElement);

    const editProjectButton = document.querySelector('.editProjectButton');
    const editIconElement = new Image();
    editIconElement.src = editIcon;
    editProjectButton.appendChild(editIconElement);

    const deleteProjectButton = document.querySelector('.deleteProjectButton');
    const trashIconElement = new Image();
    trashIconElement.src = trashIcon;
    deleteProjectButton.appendChild(trashIconElement);

    // Modal X icon
    const closeContainer = document.querySelector('.modalTitle');
    const closeIconElement = new Image();
    closeIconElement.src = closeIcon;
    closeIconElement.classList.add("closeIconImg");
    closeContainer.appendChild(closeIconElement);
}

function renderCreateTodoModal() {

    const modal = document.querySelector('.createTodoModal');
    const modalOverlay = document.querySelector('.modalFullScreenOverlay');
    modal.classList.add('show');
    modalOverlay.classList.add('show');

    const closeIconElement = document.querySelector(".closeIconImg");
    const form = document.getElementById('newNoteForm');

    function closeModal() {
        modal.classList.remove('show');
        modalOverlay.classList.remove('show');
        closeIconElement.removeEventListener('click', closeModal);
    }

    function closeForm(e) {
        e.preventDefault();
        handleTodoFormData();
        closeModal();
        form.removeEventListener('submit', closeForm);
    }

    closeIconElement.addEventListener('click', closeModal);
    form.addEventListener('submit', closeForm);
}

// PUT THIS IN IT'S OWN MODULE LATER?

function handleTodoFormData() {
    const form = document.getElementById('newNoteForm');
    const title = document.getElementById('titleInput');
    const details = document.getElementById('detailsInput');
    const dueDate = document.getElementById('dueDateInput');
    const priority = (function () {
        const radios = form.elements['todoPriority'];
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
              return radios[i].value;
            }
          }
    })();

    const todoValues = {title: title.value, 
                        details: details.value, 
                        dueDate: dueDate.value, 
                        priority: priority.value};

    if (title.value) {
        // SEND DATA TO TODOMANAGER TO CREATE TODO FOR THE BACKEND
        PubSub.publishSync('createTodoToTodoManager', todoValues);
        renderTodo(title.value, details.value, dueDate.value, priority.value);
    }
    form.reset();
}


// Maybe refactor element creation --> bring back helper methods from last project

function renderTodo(title, details, dueDate, priority) {

    // Create Elements
    const todoContainer = document.querySelector('.todoContainer');
    const todoItem = document.createElement('div');
    todoItem.classList.add('todoItem');

    const todoLeft = document.createElement('div');
    const priorityElement = document.createElement('div');
    const isFinishedCheckbox = document.createElement('input');
    const titleElement = document.createElement('div');

    todoLeft.classList.add('todoLeft');
    priorityElement.classList.add('todoPriority');
    isFinishedCheckbox.setAttribute('type', 'checkbox');
    isFinishedCheckbox.setAttribute('id', 'todoFinished');
    isFinishedCheckbox.setAttribute('name', 'todoFinished');

    const todoRight = document.createElement('div');
    const detailsElement = document.createElement('div');
    const dueDateElement = document.createElement('div');
    const editTodoButton = document.createElement('button');
    const deleteTodoButton = document.createElement('button');

    todoRight.classList.add('todoRight');
    detailsElement.classList.add('todoDetails');
    dueDateElement.classList.add('todoDueDate');
    editTodoButton.classList.add('todoButton');
    deleteTodoButton.classList.add('todoButton');

    const editIconElement = new Image();
    editIconElement.src = editIcon;
    editTodoButton.appendChild(editIconElement);

    const trashIconElement = new Image();
    trashIconElement.src = trashIcon;
    deleteTodoButton.appendChild(trashIconElement);

    todoItem.appendChild(todoLeft);
    todoLeft.appendChild(priorityElement);
    todoLeft.appendChild(isFinishedCheckbox);
    todoLeft.appendChild(titleElement);

    todoItem.appendChild(todoRight);
    todoRight.appendChild(detailsElement);
    todoRight.appendChild(dueDateElement);
    todoRight.appendChild(editTodoButton);
    todoRight.appendChild(deleteTodoButton);

    // Add form output
    priorityElement.style.backgroundColor = priority == 'low' 
    ? 'green' : priority == 'medium' ? 'orange' : 'red'; 
    titleElement.innerText = title;
    detailsElement.innerText = "DETAILS";

    const date = parse(dueDate, 'yyyy-MM-dd', new Date());
    const date2 = format(date, 'MMM do');
    dueDateElement.innerText = date2;

    // Add listeners
    isFinishedCheckbox.addEventListener('change', function() {

        if (this.checked) {
            console.log("Checkbox is checked..");
        } else {
            console.log("Checkbox is not checked..");
        }
    });
    
    // Details

    // Edit

    // Delete
    


    todoContainer.appendChild(todoItem);
}

function renderFinishedTodo(todoId) {

}

function renderProject() {

}

function renderNote() {

}

function renderScreen() {
    renderAllImages();
}

function setupListeners() {
    const addTodoButton = document.querySelector('.addTodoButton');
    addTodoButton.addEventListener('click', renderCreateTodoModal);
}

export {renderScreen, setupListeners}