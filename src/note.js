function createNote(inputedId, title, details) {
    const id = inputedId;
    const getNote = () => {
        return {id, title, details}
    }
    const setTitle = (newTitle) => {
        title = newTitle;
    }
    const setDetails = (newDetails) => {
        details = newDetails
    }
    const print = () => {
        console.log(id, title, details);
    }
    return {getNote, setTitle, setDetails, print}
}

export { createNote }