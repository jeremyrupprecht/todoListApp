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

    const editNoteTitle = (noteToEdit, title) => {
        noteToEdit.setTitle(title);
        localStorage.setItem(`note-${noteToEdit.getNote().id}`, JSON.stringify(noteToEdit.getNote())); 
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