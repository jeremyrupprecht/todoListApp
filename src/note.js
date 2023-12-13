function createNote(inputedId, title, details) {
    const id = inputedId;
    const getId = () => {
        id;
    }
    const getTitle = () => {
        title;
    }
    const getDetails = () => {
        details;
    }
    const setTitle = (newTitle) => {
        title = newTitle;
    }
    const setDetails = (newDetails) => {
        details = newDetails
    }
    return {getId, getTitle, getDetails, setTitle, setDetails}
}