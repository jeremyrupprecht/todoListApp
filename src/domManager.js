import background from './images/background.png';
import editIcon from './images/editIcon.svg';
import trashIcon from './images/trashIcon.svg';
import editIconGray from './images/editIconGray.svg';
import trashIconGray from './images/trashIconGray.svg';
import plusIcon from './images/plusIcon.svg';

function renderScreen() {
    const content = document.getElementById('content');
    const backgroundElement = new Image();
    backgroundElement.src = background;
    backgroundElement.classList.add('backgroundImg');
    content.appendChild(backgroundElement);

    renderTodo();
    renderProjectFooterButtonImgs();
}

function renderTodo() {
    const editTodoButton = document.querySelector('.editTodoButton');
    const editIconElement = new Image();
    editIconElement.src = editIconGray;
    editTodoButton.appendChild(editIconElement);

    const deleteTodoButton = document.querySelector('.deleteTodoButton');
    const trashIconElement = new Image();
    trashIconElement.src = trashIconGray;
    deleteTodoButton.appendChild(trashIconElement);

}

function renderProjectFooterButtonImgs() {
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

}

export {renderScreen}