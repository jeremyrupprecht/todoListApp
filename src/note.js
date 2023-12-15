function createNote(inputedId, title, details) {
    const note = Object.create(notePrototype);
    note.id = inputedId;
    note.title = title;
    note.details = details;
    return note;
}

const notePrototype = {
    getNote: function() {
        return {id: this.id, title: this.title, details: this.details}
    },
    setTitle: function(title) {
        this.title = title;
    },
    setDetails: function(details) {
        this.details = details;
    },
}

// function createNote(inputedId, title, details) {
//     const id = inputedId;
//     const getNote = () => {
//         return {id, title, details}
//     }
//     const setTitle = (newTitle) => {
//         title = newTitle;
//     }
//     const setDetails = (newDetails) => {
//         details = newDetails
//     }
//     return {getNote, setTitle, setDetails}
// }


export { createNote }