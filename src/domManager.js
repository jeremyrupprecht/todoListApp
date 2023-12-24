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
        if (createOrEdit === 'create') {

            const getTodoValuesSubscription = PubSub.subscribe('assignTodo', function(msg, valuesToRender) {
                renderTodo(valuesToRender.id, valuesToRender.title, valuesToRender.details, 
                    valuesToRender.dueDate, valuesToRender.priority);
            });
            PubSub.publishSync('createTodo', todoValues);
            PubSub.unsubscribe(getTodoValuesSubscription);

        } else {

            const editTodoValuesSubscription = PubSub.subscribe('renderEditedTodo', function(msg, valuesToRender) {
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
            PubSub.publishSync('editTodo', todoValues);
            PubSub.unsubscribe(editTodoValuesSubscription);
        }
    }
    renderTodoCounts();
    form.reset();
}

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
            renderTodoCounts();

        } else {
            PubSub.publishSync('finishTodo', {finished: 0, id});
            renderFinishedTodo(id, 0);
            renderTodoCounts();
        }
    });
    
    // Present details to user
    detailsButton.addEventListener('click', function () {

        // Get todo details from todo manager
        let todoValues;
        const getTodoValues = PubSub.subscribe('sendTodo', function(topicName, values) {
            todoValues = values;
        });
        PubSub.publishSync('requestTodo', id);
        PubSub.unsubscribe(getTodoValues);

        // Get todo's parent project title from project manager
        let parentProjectTitle;
        const getParentProjectTitle = PubSub.subscribe('sendProject', function(topicName, project) {
            parentProjectTitle = project.title;
        });
        PubSub.publishSync('requestProject', {id: todoValues.parentProjectId});
        PubSub.unsubscribe(getParentProjectTitle);
        
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
        projectElement.textContent = parentProjectTitle;
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

    editTodoButton.addEventListener('click', function() {
        renderTodoModal('edit', id);
    });

    deleteTodoButton.addEventListener('click', function() {
        PubSub.publishSync('deleteTodo', id);
        todoItem.remove();
        renderTodoCounts();

    });

    todoContainer.appendChild(todoItem);
}

function renderFinishedTodo(todoId, finished) {
    const todoElement = document.querySelector(`.todoItem[data-id="${todoId}"]`);
    const checkBox = todoElement.querySelector('#todoFinished');
    const title = todoElement.querySelector('.todoTitle');
    const details = todoElement.querySelector('.todoDetails');
    const dueDate = todoElement.querySelector('.todoDueDate');
    const editButton = todoElement.querySelector('.editTodoButton');
    const deleteButton = todoElement.querySelector('.deleteTodoButton');

    if (finished) {
        checkBox.checked = true;
        title.classList.add('titleFinished');
        details.classList.add('detailsFinished');
        dueDate.classList.add('dueDateFinished');
        editButton.childNodes[0].src = editIconGray;
        deleteButton.childNodes[0].src = trashIconGray;
    } else {
        checkBox.checked = false;
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
    let todos = [];
    
    // The today and week projects are special in that they only display todos
    // from other projects based on their dueDate
    if (projectId == 1) {
        const subscription = PubSub.subscribe('sendTodosOfToday', function(msg, receivedTodos) {
            todos = receivedTodos;
        });
        PubSub.publishSync('requestTodosOfToday', {});
        PubSub.unsubscribe(subscription);
    } else if (projectId == 2) {

        const subscription = PubSub.subscribe('sendTodosOfThisWeek', function(msg, receivedTodos) {
            todos = receivedTodos;
        });
        PubSub.publishSync('requestTodosOfThisWeek', {});
        PubSub.unsubscribe(subscription);

    } else {
        const subscription = PubSub.subscribe('sendTodosOfProject', function(msg, receivedTodos) {
            todos = receivedTodos;
        });
        PubSub.publishSync('requestTodosOfProject', projectId);
        PubSub.unsubscribe(subscription);
    }

    for (let i = 0; i < todos.length; i++) {
        renderTodo(todos[i].id, todos[i].title, todos[i].dueDate, 
                   todos[i].dueDate, todos[i].priority);

        if (todos[i].isFinished) {
            renderFinishedTodo(todos[i].id, 1);
        }
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

    // The today and week projects (not the home project) CANNOT have todos directly
    // added to them (the today and week projects only display todos from OTHER projects
    // due at those dates)

    const addTodoButton = document.querySelector('.addTodoButton');
    if (projectId == 1 || projectId == 2) {
        addTodoButton.classList.remove('show');
    } else {
        addTodoButton.classList.add('show');
    }
}

function renderTodoCounts() {
    // Get all projects from project manager, as in the greatest case, every
    // project's count needs to be displayed upon start up (or page refresh)
    // and in the least case, a single project's count needs to be updated
    let allProjects = [];
    const getAllProjectsSubscription = PubSub.subscribe('sendAllProjects', function(msg, receivedProjects) {
        allProjects = receivedProjects;
    });
    PubSub.publishSync('requestAllProjects');
    PubSub.unsubscribe(getAllProjectsSubscription);

    for (let i = 0; i < allProjects.length; i++) {

        // Grab number of unfinished todos for this project
        let unfinishedTodosCount = 0;

        if (allProjects[i].id == 1) {

            const getUnfinishedTodosOfThisProject = PubSub.subscribe('sendUnfinishedTodosOfToday', function(msg, receivedTodos) {
                unfinishedTodosCount = receivedTodos.length;
            });
            PubSub.publishSync('requestTodosOfToday', {type: 'unfinished'});
            PubSub.unsubscribe(getUnfinishedTodosOfThisProject);

        } else if (allProjects[i].id == 2) {

            const getUnfinishedTodosOfThisProject = PubSub.subscribe('sendUnfinishedTodosOfThisWeek', function(msg, receivedTodos) {
                unfinishedTodosCount = receivedTodos.length;
            });
            PubSub.publishSync('requestTodosOfThisWeek', {type: 'unfinished'});
            PubSub.unsubscribe(getUnfinishedTodosOfThisProject);

        } else {
            const getUnfinishedTodosOfThisProject = PubSub.subscribe('sendUnfinishedTodos', function(msg, receivedTodos) {
                unfinishedTodosCount = receivedTodos.length;
            });
            PubSub.publishSync('requestUnfinishedTodosOfThisProject', allProjects[i].id);
            PubSub.unsubscribe(getUnfinishedTodosOfThisProject);
        }

        // Then display the number of unfinished todos for this project

        const projectContainer = document.querySelector(`p[data-project-id="${allProjects[i].id}"]`).parentNode;
        const todoCountContainer = projectContainer.querySelector('.todoCountContainer');

        if (unfinishedTodosCount > 0) {
            // Display unfinished todo count
            todoCountContainer.classList.add('show');
            const todoCount = projectContainer.querySelector('.todoCount');
            todoCount.textContent = unfinishedTodosCount;

        } else {
            todoCountContainer.classList.remove('show');
        }
    }
}

function handleProjectFormData(createOrEdit) {
    const getAndRenderNewProject = PubSub.subscribe('sendNewProject', function(topicName, projectToRender) {
        renderProject(projectToRender.id, projectToRender.title);
    });

    const getAndRenderEditedProject = PubSub.subscribe('sendEditedProject', function(topicName, projectToRender) {
        const projectElement = document.querySelector(`p[data-project-id="${projectToRender.id}"]`);
        projectElement.textContent = projectToRender.title;
    });

    const idOfProjectToEdit = currentProject;
    const form = document.getElementById('newProjectForm');
    const title = document.getElementById('projectTitleInput');

    if (title.value) {
        if (createOrEdit == 'create') {
            PubSub.publishSync('createProject', {title: title.value});
        } else {
            PubSub.publishSync('editProject',{id: idOfProjectToEdit, title: title.value});
        }
    }
    PubSub.unsubscribe(getAndRenderNewProject);
    PubSub.unsubscribe(getAndRenderEditedProject);
    form.reset();
}

function renderProject(projectId, title) {
    const projectsContainer = document.querySelector('.newProjects');
    
    const newProjectContainer = document.createElement('div');
    newProjectContainer.classList.add('newProjectContainer');

    const newProjectHeader = document.createElement('p');
    newProjectHeader.textContent = title;
    newProjectHeader.setAttribute('data-project-id', projectId);

    const todoCountContainer = document.createElement('div');
    todoCountContainer.classList.add('todoCountContainer');

    const todoCount = document.createElement('p');
    todoCount.classList.add('todoCount');

    newProjectContainer.appendChild(newProjectHeader);
    newProjectContainer.appendChild(todoCountContainer);
    todoCountContainer.appendChild(todoCount);

    projectsContainer.appendChild(newProjectContainer);
    
    // add event listener
    newProjectHeader.addEventListener('click', function() {
        currentProject = projectId;
        highlightActiveProjectHeader.call(this);
        renderTodosForProject(projectId);
    });

    newProjectHeader.addEventListener('mouseenter', hoverProjectIn);
    newProjectHeader.addEventListener('mouseleave', hoverProjectOut);
}

function renderExistingProjects() {

    // There are 3 default projects (home, today, and week), with ids 0,1 and 2
    // respectively, if there are other existing projects, their id's start 
    // counting up from 3
    if (localStorage.getItem('projectIdCount') > 2) {

        let projects = [];
        const subscription = PubSub.subscribe('sendAllProjects', function(msg, receivedProjects) {
            projects = receivedProjects;
        });
        PubSub.publishSync('requestAllProjects');
        PubSub.unsubscribe(subscription);

        // Sort the list so the projects appear in order
        projects.sort((p1, p2) => p1.id - p2.id);

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
    PubSub.publishSync('requestProject', {id: currentProjectid});
    PubSub.unsubscribe(subscription);
}

function renderScreen() {
    renderAllImages();
    renderTodosForProject(0);
    renderExistingProjects();
    renderTodoCounts();
}

function renderDeleteProjectModal() {
    
    // Show modal
    const deleteProjectModal = document.querySelector('.areYouSureModal');
    const modalOverlay = document.querySelector('.modalFullScreenOverlay');
    deleteProjectModal.classList.add('show');
    modalOverlay.classList.add('show');

    // Grab and render project name
    const idOfProjectToDelete = currentProject;
    let projectTitle = "";

    const subscription = PubSub.subscribe('sendProject', function(topicName, project) {
        projectTitle = project.title;
    });
    PubSub.publishSync('requestProject', {id: idOfProjectToDelete});
    PubSub.unsubscribe(subscription);

    const projectTitleElement = document.querySelector('.titleOfProjectToDelete');
    projectTitleElement.textContent = projectTitle;

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

        // Delete project from database
        PubSub.publishSync('deleteProjectFromDOM', idOfProjectToDelete);
        
        // Remove project element from sidebar
        const projectElementToDelete = document.querySelector(`p[data-project-id="${idOfProjectToDelete}"]`);
        const projectElementContainer = projectElementToDelete.parentElement;
        projectElementContainer.remove();

        // Change currently viewed project (AND CURRENT PROJECT VARIABLE) to home 
        currentProject = 0;
        renderTodosForProject(0);

        // Update todo counts (for this project and today and week of the 
        // project had any todos that were presented there)
        renderTodoCounts();

        closeModal();
    }
}

function hoverProjectIn() {
    const projectId = this.getAttribute('data-project-id');
    if (projectId != currentProject && !this.textContent.startsWith('// ')) {
        this.textContent = `// ${this.textContent}`;
    }
}

function hoverProjectOut() {
    const projectId = this.getAttribute('data-project-id');
    if (projectId != currentProject && this.textContent.startsWith('// ')) {
        this.textContent = (this.textContent).substring(3);
    }
}

function highlightActiveProjectHeader() {
    
    // Clear all other highlighted headers
    const allProjectTitleHeaders = document.querySelectorAll(`p[data-project-id]`);
    for (let i = 0; i < allProjectTitleHeaders.length; i++) {
        if (allProjectTitleHeaders[i].textContent.startsWith('// ')) {
            allProjectTitleHeaders[i].textContent = (allProjectTitleHeaders[i].textContent).substring(3);
        }
    }

    // Highlight the currently active header
    const projectId = this.getAttribute('data-project-id');
    if (projectId == currentProject && !this.textContent.startsWith('// ')) {
        this.textContent = `// ${this.textContent}`;
    }
}


let currentProject = 0;

function setupListeners() {
    const addTodoButton = document.querySelector('.addTodoButton');
    addTodoButton.addEventListener('click', () => renderTodoModal('create', ""));

    // Set home default project listeners (home, today, and week project tabs)

    const homeProjectHeader = document.querySelector(`p[data-project-id="0"]`);
    const todayProjectHeader = document.querySelector(`p[data-project-id="1"]`);
    const weekProjectHeader = document.querySelector(`p[data-project-id="2"]`);

    homeProjectHeader.addEventListener('click', function() {
        currentProject = 0;
        highlightActiveProjectHeader.call(this);
        renderTodosForProject(0);
    });
    todayProjectHeader.addEventListener('click', function() {
        currentProject = 1;
        highlightActiveProjectHeader.call(this);
        renderTodosForProject(1);
    });
    weekProjectHeader.addEventListener('click', function() {
        currentProject = 2;
        highlightActiveProjectHeader.call(this);
        renderTodosForProject(2);
    });

    // Project hover effects
    homeProjectHeader.addEventListener('mouseenter', hoverProjectIn);
    homeProjectHeader.addEventListener('mouseleave', hoverProjectOut);

    todayProjectHeader.addEventListener('mouseenter', hoverProjectIn);
    todayProjectHeader.addEventListener('mouseleave', hoverProjectOut);

    weekProjectHeader.addEventListener('mouseenter', hoverProjectIn);
    weekProjectHeader.addEventListener('mouseleave', hoverProjectOut);

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
