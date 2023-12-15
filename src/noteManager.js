import { createNote } from "./note";

function createNoteManager() {

    const createAndSaveNote = (id, title, details) => {
        // Don't allow duplicate id's
        if (localStorage.getItem(`note-${id}`)) {
            console.log("A Note with that id already exists!");
            return
        }
        const newNote = createNote(id, title, details);
        localStorage.setItem(`note-${id}`, JSON.stringify(newNote.getNote()));
        return newNote;
    }

    const editNoteTitle = (idOfNoteToEdit, title) => {
        const noteValues = JSON.parse(localStorage.getItem(`note-${idOfNoteToEdit}`));
        if (noteValues) {
            const editedNote = createNote(noteValues.id, title, noteValues.details);
            localStorage.setItem(`note-${idOfNoteToEdit}`, JSON.stringify(editedNote.getNote())); 
            return 
        }
        console.log("This note does not exist!");
    }

    const editNoteDetails = (noteToEdit, details) => {
        noteToEdit.setDetails(details);
        localStorage.setItem(`note-${noteToEdit.getNote().id}`, JSON.stringify(noteToEdit.getNote())); 
    }

    const deleteNote = (noteToDelete) => {
        localStorage.removeItem(`note-${noteToDelete.getNote().id}`);
    }

    return { createAndSaveNote, editNoteTitle, editNoteDetails, deleteNote}
}

export { createNoteManager }