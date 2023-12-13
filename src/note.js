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
    return {getNote, setTitle, setDetails}
}

export { createNote }