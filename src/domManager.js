import background from './images/background.png';

function renderScreen() {
    const content = document.getElementById('content');
    const backgroundElement = new Image();
    backgroundElement.src = background;
    backgroundElement.classList.add('backgroundImg');
    content.appendChild(backgroundElement);
}

export {renderScreen}