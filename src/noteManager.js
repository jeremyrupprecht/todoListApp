import { createNote } from "./note";

function createNoteManager() {

    const createAndSaveNote = (id, title, details) => {
        // Don't allow duplicate id's
        if (localStorage.getItem(`note-${id}`)) {
            console.log("A Note with that id already exists!");
            return
        }
        // NEED TO REFACTOR TO THIS \/ \/ \/ \/ \/ \/

        // // Give the todo an id (this id does not decrease if a todo is 
        // // deleted, to prevent duplicate ids)
        // let id = localStorage.getItem('todoIdCount');
        // if (!id) {
        //     localStorage.setItem('todoIdCount', 0);
        //     id = 0;
        // } else {
        //     id++;
        //     // Double check to not allow duplicate id's
        //     if (localStorage.getItem(`todo-${id}`)) {
        //         console.log("A todo with that id already exists!");
        //         return
        //     }
        //     localStorage.setItem('todoIdCount', id);
        // }


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

    const editNoteDetails = (idOfNoteToEdit, details) => {
        const noteValues = JSON.parse(localStorage.getItem(`note-${idOfNoteToEdit}`));
        if (noteValues) {
            const editedNote = createNote(noteValues.id, noteValues.title, details);
            localStorage.setItem(`note-${idOfNoteToEdit}`, JSON.stringify(editedNote.getNote())); 
            return 
        }
        console.log("This note does not exist!");
    }

    const deleteNote = (idOfNoteToDelete) => {
        localStorage.removeItem(`note-${idOfNoteToDelete}`);
    }

    return { createAndSaveNote, editNoteTitle, editNoteDetails, deleteNote}
}

export { createNoteManager }