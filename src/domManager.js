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
    const closeProjectCreationContainer = document.querySelector('.addProjectModalTitle');

    const closeIconElement = new Image();
    closeIconElement.src = closeIcon;
    closeIconElement.classList.add("todoCreationCloseIcon");

    const closeIconElement2 = new Image();
    closeIconElement2.src = closeIcon;
    closeIconElement2.classList.add("showDetailsCloseIcon");

    const closeIconElement3 = new Image();
    closeIconElement3.src = closeIcon;
    closeIconElement3.classList.add("projectCreationCloseIcon");

    closeTodoCreationContainer.appendChild(closeIconElement);
    closeDetailsContainer.appendChild(closeIconElement2);
    closeProjectCreationContainer.appendChild(closeIconElement3);

    // Add Projects button
    const addProjectButton = document.querySelector('.addProjectButton');
    const plusIconElement2 = new Image();
    plusIconElement2.src = plusIcon;
    addProjectButton.appendChild(plusIconElement2);
}

function renderTodoModal(createOrEdit, idOfTodoToEdit) {

    const modal = document.querySelector('.createTodoModal');
    const modalOverlay = document.querySelector('.modalFullScreenOverlay');
    modal.classList.add('show');
    modalOverlay.classList.add('show');

    const closeIconElement = document.querySelector(".todoCreationCloseIcon");
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
    populateTodoFormWithExistingData(idOfTodoToEdit);
}

function populateTodoFormWithExistingData(idOfTodoToEdit) {

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
                        parentProjectId: currentProject};
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

function renderTodosForProject(projectId) {

    // Clear any existing todos
    const todoContainer = document.querySelector('.todoContainer');
    todoContainer.innerHTML = '';
    
    // Get and render the todos of this project
    let todos;
    const subscription = PubSub.subscribe('sendTodosOfProject', function(msg, receivedTodos) {
        todos = receivedTodos;
    });
    PubSub.publishSync('requestTodosOfProject', {type: 'renderTodosForProject', projectId});
    PubSub.unsubscribe(subscription);

    for (let i = 0; i < todos.length; i++) {
        // NEED TO RENDER THEM AS FINISHED IF THEY ARE FUKKKKKKKKKKKKKK
        renderTodo(todos[i].id, todos[i].title, todos[i].dueDate, 
                   todos[i].dueDate, todos[i].priority);
    }

    // Only user created projects (every project excluding home, today and week)
    // can have their title edited, (or can be deleted entirely), if the project
    // is user created, render the edit title and delete project buttons
    const editProjectButton = document.querySelector('.editProjectButton');
    const deleteProjectButton = document.querySelector('.deleteProjectButton');
    if (projectId > 2) {
        editProjectButton.classList.add('show');
        deleteProjectButton.classList.add('show');
    } else {
        editProjectButton.classList.remove('show');
        deleteProjectButton.classList.remove('show');
    }
}

function handleProjectFormData(createOrEdit) {

    const getAndRenderNewProject = PubSub.subscribe('sendNewProject', function(topicName, projectToRender) {
        renderProject(projectToRender.id, projectToRender.title);
    });

    const getAndRenderEditedProject = PubSub.subscribe('sendEditedProject', function(topicName, projectToRender) {
        const projectElement = document.querySelector(`p[data-id="${projectToRender.id}"]`);
        projectElement.textContent = projectToRender.title;
    });

    const idOfProjectToEdit = currentProject;
    const form = document.getElementById('newProjectForm');
    const title = document.getElementById('projectTitleInput');

    if (title.value) {
        if (createOrEdit == 'create') {
            PubSub.publishSync('createProjectToProjectManager', {type: 'createNewProject', title: title.value});
        } else {
            PubSub.publishSync('editProjectToProjectManager',{type: 'editProjectTitle',id: idOfProjectToEdit, title: title.value});
        }
    }

    PubSub.unsubscribe(getAndRenderNewProject);
    form.reset();
}

function renderProject(projectId, title) {
    const projectsContainer = document.querySelector('.newProjects');
    const newProjectHeader = document.createElement('p');
    newProjectHeader.textContent = title;
    newProjectHeader.setAttribute('data-id', projectId);
    projectsContainer.appendChild(newProjectHeader);

    // add event listener
    newProjectHeader.addEventListener('click', () => {
        currentProject = projectId;
        renderTodosForProject(projectId);
    });
}

function renderExistingProjects() {

    // There are 3 default projects (home, today, and week), with ids 0,1 and 2
    // respectively, if there are other existing projects, their id's start 
    // counting up from 3
    if (localStorage.getItem('project-3')) {

        let projects;
        const subscription = PubSub.subscribe('sendAllProjects', function(msg, receivedProjects) {
            projects = receivedProjects;
        });
        PubSub.publishSync('requestAllProjects', {type: 'renderProjects'});
        PubSub.unsubscribe(subscription);

        for (let i = 0; i < projects.length; i++) {
            if (projects[i].id > 2) {
                renderProject(projects[i].id, projects[i].title);
            }
        }
    }
}

function renderProjectModal(createOrEdit) {

    // Show modal
    const addProjectModal = document.querySelector('.addProjectModal');
    const modalOverlay = document.querySelector('.modalFullScreenOverlay');
    addProjectModal.classList.add('show');
    modalOverlay.classList.add('show');

    // Handle closing or submitting the form
    const closeIconElement = document.querySelector(".projectCreationCloseIcon");
    const form = document.getElementById('newProjectForm');

    // Add listeners to close the modal or submit the form
    closeIconElement.addEventListener('click', closeModal);
    form.addEventListener('submit', submitForm);

    function closeModal() {
        addProjectModal.classList.remove('show');
        modalOverlay.classList.remove('show');
        closeIconElement.removeEventListener('click', closeModal);
        form.removeEventListener('submit', submitForm);
        form.reset();
    }

    function submitForm(e) {
        e.preventDefault();

        if (createOrEdit == 'create') {
            handleProjectFormData('create');
        } else {
            handleProjectFormData('edit');
        }
        closeModal();
    }

    const modalTitle = document.querySelector('.AddProjectModalTitleText');
    modalTitle.innerText = "New Project";

    const submitButton = document.querySelector('.submitNewProject');
    submitButton.innerText = "ADD PROJECT";

    // If editing, change the modal title and submission button text,
    // also preload the todos existing values for editing

    if (createOrEdit === 'create') return;
    modalTitle.innerText = "Edit Project";
    submitButton.innerText = "CONFIRM EDIT";
    populateProjectFormWithExistingTitle();

}

function populateProjectFormWithExistingTitle() {

    const currentProjectid = currentProject;

    const subscription = PubSub.subscribe('sendProject', function(topicName, project) {
        const title = document.getElementById('projectTitleInput');
        title.value = project.title;
    });
    PubSub.publishSync('requestProject', {type: 'requestProject', id: currentProjectid});
    PubSub.unsubscribe(subscription);
}

function renderScreen() {
    renderAllImages();
    renderTodosForProject(0);
    renderExistingProjects();
}


function disableAllOtherButtonsWhileModalActive() {

}

function renderDeleteProjectModal() {
    
    // Show modal
    const deleteProjectModal = document.querySelector('.areYouSureModal');
    const modalOverlay = document.querySelector('.modalFullScreenOverlay');
    deleteProjectModal.classList.add('show');
    modalOverlay.classList.add('show');

    // Render name of the project to be deleted

    // Handle "yes" option
    const yesButton = deleteProjectModal.querySelector(".yesButton");
    yesButton.addEventListener('click', handleDeleteProject);

    // Handle "no" option
    const noButton = deleteProjectModal.querySelector('.noButton');
    noButton.addEventListener('click', closeModal);

    function closeModal() {
        deleteProjectModal.classList.remove('show');
        modalOverlay.classList.remove('show');
        yesButton.removeEventListener('click', handleDeleteProject);
        noButton.removeEventListener('click', closeModal);   
    }

    function handleDeleteProject() {

        // PubSub to delete project from database
        const idOfProjectToDelete = currentProject;
        PubSub.publishSync('deleteProjectFromDOM', idOfProjectToDelete);
        
        // Remove project title from sidebar
        const projectElementToDelete = document.querySelector(`p[data-id="${idOfProjectToDelete}"]`);
        projectElementToDelete.remove();

        // Change currently viewed project (AND CURRENT PROJECT VARIABLE) to home 
        currentProject = 0;
        renderTodosForProject(0);

        closeModal();
    }
}

let currentProject = 0;

function setupListeners() {
    const addTodoButton = document.querySelector('.addTodoButton');
    addTodoButton.addEventListener('click', () => renderTodoModal('create', ""));

    // Set home default project listeners (home, today, and week project tabs)

    const homeProjectButton = document.querySelector('.projectHome');
    const todayProjectButton = document.querySelector('.projectToday');
    const weekProjectButton = document.querySelector('.projectWeek');

    homeProjectButton.addEventListener('click', () => {
        currentProject = 0;
        renderTodosForProject(0);
    });
    todayProjectButton.addEventListener('click', () => {
        currentProject = 1;
        renderTodosForProject(1);
    });
    weekProjectButton.addEventListener('click', () => {
        currentProject = 2;
        renderTodosForProject(2);
    });

    // Add projects button
    const addProjectButton = document.querySelector('.addProjectButton');
    addProjectButton.addEventListener('click', () => {
        renderProjectModal('create');
    });

    // Edit and delete project buttons

    const editProjectButton = document.querySelector('.editProjectButton');
    const deleteProjectButton = document.querySelector('.deleteProjectButton');
    editProjectButton.addEventListener('click', () => {
        renderProjectModal('edit');
    });

    deleteProjectButton.addEventListener('click', () => {
        renderDeleteProjectModal();
    });


    // Notes Button
}

// ------------------------

function renderNotes() {

}

function renderNote() {

}


export {renderScreen, setupListeners}
