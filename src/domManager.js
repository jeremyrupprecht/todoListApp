import background from './images/background.png';
import editIcon from './images/editIcon.svg';
import trashIcon from './images/trashIcon.svg';
import editIconGray from './images/editIconGray.svg';
import trashIconGray from './images/trashIconGray.svg';
import plusIcon from './images/plusIcon.svg';
import closeIcon from './images/closeIcon.svg';
import {parse, format} from 'date-fns';
import { PubSub } from 'pubsub-js';
import { el } from 'date-fns/locale';

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
    const closeTodoCreationContainer = document.querySelector('.modalTitle');
    const closeDetailsContainer = document.querySelector('.detailsCloseButton');

    const closeIconElement = new Image();
    closeIconElement.src = closeIcon;
    closeIconElement.classList.add("closeIconImg");

    closeTodoCreationContainer.appendChild(closeIconElement);
    closeDetailsContainer.appendChild(closeIconElement);


}

function renderTodoModal(createOrEdit, idOfTodoToEdit) {

    const modal = document.querySelector('.createTodoModal');
    const modalOverlay = document.querySelector('.modalFullScreenOverlay');
    modal.classList.add('show');
    modalOverlay.classList.add('show');

    const closeIconElement = document.querySelector(".closeIconImg");
    const form = document.getElementById('newNoteForm');

    // Add listeners to close the modal or submit the form

    closeIconElement.addEventListener('click', closeModal);
    form.addEventListener('submit', closeForm);

    function closeModal() {
        modal.classList.remove('show');
        modalOverlay.classList.remove('show');
        closeIconElement.removeEventListener('click', closeModal);
        form.reset();
    }

    function closeForm(e) {
        e.preventDefault();
        if (createOrEdit == 'create') {
            handleTodoFormData('create', "");
        } else {
            handleTodoFormData('edit', idOfTodoToEdit);
        }
        closeModal();
        form.removeEventListener('submit', closeForm);
    }

    const modalTitle = document.querySelector('.modalTitleText');
    modalTitle.innerText = "New Note";

    const submitButton = document.querySelector('.submitButton');
    submitButton.innerText = "ADD TO DO";

    // If editing, change the modal title and submission button text,
    // also preload the todos existing values for editing

    if (createOrEdit === 'create') return;
    modalTitle.innerText = "Edit Note";
    submitButton.innerText = "CONFIRM EDIT";
    populateFormWithExistingData(idOfTodoToEdit);
}

function populateFormWithExistingData(idOfTodoToEdit) {

    const subscription = PubSub.subscribe('sendTodo', function(topicName, todoValues) {

        const title = document.getElementById('titleInput');
        const details = document.getElementById('detailsInput');
        const dueDate = document.getElementById('dueDateInput');
        const priority = document.getElementById(`${todoValues.priority}`);

        title.value = todoValues.title;
        details.value = todoValues.details;
        dueDate.value = todoValues.dueDate;
        priority.checked = true;
    });
    PubSub.publishSync('requestTodo', idOfTodoToEdit);
    PubSub.unsubscribe(subscription);
}

// PUT THIS IN IT'S OWN MODULE LATER?
function handleTodoFormData(createOrEdit, idOfTodoToEdit) {
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
    const todoValues = {id: idOfTodoToEdit,
                        title: title.value, 
                        details: details.value, 
                        dueDate: dueDate.value, 
                        priority: priority,
                        parentProjectId: 0};
    if (title.value) {
        if (createOrEdit == 'create') {
            PubSub.publishSync('createTodoToTodoManager', todoValues);
        } else {
            PubSub.publishSync('editTodoToTodoManager', todoValues);
        }
    }
    form.reset();
}

PubSub.subscribe('assignTodo', function(msg, valuesToRender) {
    renderTodo(valuesToRender.id, valuesToRender.title, valuesToRender.details, 
        valuesToRender.dueDate, valuesToRender.priority);
});

PubSub.subscribe('renderEditedTodo', function(msg, valuesToRender) {
    const todoElement = document.querySelector(`.todoItem[data-id="${valuesToRender.id}"]`);
    const priorityElement = todoElement.querySelector('.todoPriority');
    const titleElement = todoElement.querySelector('.todoTitle');
    const dueDateElement = todoElement.querySelector('.todoDueDate');

    priorityElement.style.backgroundColor = valuesToRender.priority == 'low' 
    ? 'green' : valuesToRender.priority == 'medium' ? 'orange' : 'red'; 

    titleElement.innerText = valuesToRender.title;

    const date = parse(valuesToRender.dueDate, 'yyyy-MM-dd', new Date());
    const date2 = format(date, 'MMM do');
    dueDateElement.innerText = date2;

});

// Maybe refactor element creation --> bring back helper methods from last project

function renderTodo(id, title, details, dueDate, priority) {

    // Create Elements
    const todoContainer = document.querySelector('.todoContainer');
    const todoItem = document.createElement('div');
    todoItem.classList.add('todoItem');
    todoItem.setAttribute('data-id', id);

    const todoLeft = document.createElement('div');
    const priorityElement = document.createElement('div');
    const isFinishedCheckbox = document.createElement('input');
    const titleElement = document.createElement('div');

    todoLeft.classList.add('todoLeft');
    priorityElement.classList.add('todoPriority');
    isFinishedCheckbox.setAttribute('type', 'checkbox');
    isFinishedCheckbox.setAttribute('id', 'todoFinished');
    isFinishedCheckbox.setAttribute('name', 'todoFinished');
    titleElement.classList.add('todoTitle');

    const todoRight = document.createElement('div');
    const detailsButton = document.createElement('div');
    const dueDateElement = document.createElement('div');
    const editTodoButton = document.createElement('button');
    const deleteTodoButton = document.createElement('button');

    todoRight.classList.add('todoRight');
    detailsButton.classList.add('todoDetails');
    dueDateElement.classList.add('todoDueDate');
    editTodoButton.classList.add('todoButton', 'editTodoButton');
    deleteTodoButton.classList.add('todoButton', 'deleteTodoButton');

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
    todoRight.appendChild(detailsButton);
    todoRight.appendChild(dueDateElement);
    todoRight.appendChild(editTodoButton);
    todoRight.appendChild(deleteTodoButton);

    // Add form output
    priorityElement.style.backgroundColor = priority == 'low' 
    ? 'green' : priority == 'medium' ? 'orange' : 'red'; 
    titleElement.innerText = title;
    detailsButton.innerText = "DETAILS";

    const date = parse(dueDate, 'yyyy-MM-dd', new Date());
    const date2 = format(date, 'MMM do');
    dueDateElement.innerText = date2;

    // Add listeners

    // Finish the todo 
    isFinishedCheckbox.addEventListener('change', function() {
        if (this.checked) {
            PubSub.publishSync('finishTodo', {finished: 1, id});
            renderFinishedTodo(id, 1);
        } else {
            PubSub.publishSync('finishTodo', {finished: 0, id});
            renderFinishedTodo(id, 0);
        }
    });
    
    // Present details to user
    detailsButton.addEventListener('click', function () {

        let todoValues;
        const subscription = PubSub.subscribe('sendTodo', function(topicName, values) {
            todoValues = values;
        });
        PubSub.publishSync('requestTodo', id);
        PubSub.unsubscribe(subscription);

        
        const detailsModal = document.querySelector('.detailsModal');
        const modalOverlay = document.querySelector('.modalFullScreenOverlay');
        detailsModal.classList.add('show');
        modalOverlay.classList.add('show');

        const titleElement = document.querySelector('.detailsTitle');
        const projectElement = document.querySelector('.detailsProject');
        const priorityElement = document.querySelector('.detailsPriority');
        const dueDateElement = document.querySelector('.detailsDueDate');
        const detailsElement = document.querySelector('.detailsDetails');
        const closeButtonElement = document.querySelector('.detailsCloseButton');

        titleElement.textContent = todoValues.title;
        projectElement.textContent = 'NEED TO IMPLEMENT';
        priorityElement.textContent = todoValues.priority;
        dueDateElement.textContent = todoValues.dueDate;
        detailsElement.textContent = todoValues.details;

        closeButtonElement.addEventListener('click', closeModal);
        function closeModal() {
            detailsModal.classList.remove('show');
            modalOverlay.classList.remove('show');
            closeButtonElement.removeEventListener('click', closeModal);
        }
    });

    // Edit todo values
    editTodoButton.addEventListener('click', function() {
        renderTodoModal('edit', id);
    });

    deleteTodoButton.addEventListener('click', function() {
        PubSub.publishSync('deleteTodoToTodoManager', id);
        todoItem.remove();
    });
    
    todoContainer.appendChild(todoItem);
}

function renderFinishedTodo(todoId, finished) {
    const todoElement = document.querySelector(`.todoItem[data-id="${todoId}"]`);
    const title = todoElement.querySelector('.todoTitle');
    const details = todoElement.querySelector('.todoDetails');
    const dueDate = todoElement.querySelector('.todoDueDate');
    const editButton = todoElement.querySelector('.editTodoButton');
    const deleteButton = todoElement.querySelector('.deleteTodoButton');

    if (finished) {
        title.classList.add('titleFinished');
        details.classList.add('detailsFinished');
        dueDate.classList.add('dueDateFinished');
        editButton.childNodes[0].src = editIconGray;
        deleteButton.childNodes[0].src = trashIconGray;
    } else {
        title.classList.remove('titleFinished');
        details.classList.remove('detailsFinished');
        dueDate.classList.remove('dueDateFinished');
        editButton.childNodes[0].src = editIcon;
        deleteButton.childNodes[0].src = trashIcon;
    }
}

function renderTodosForProject() {

}

function renderNotes() {

}

function renderNote() {

}

function renderScreen() {
    renderAllImages();
}

function setupListeners() {
    const addTodoButton = document.querySelector('.addTodoButton');
    addTodoButton.addEventListener('click', () => renderTodoModal('create', ""));
}

export {renderScreen, setupListeners}