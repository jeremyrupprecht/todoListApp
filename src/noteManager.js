import { createNote } from "./note";

function createNoteManager() {

    const createAndSaveNote = (title, details) => {

        let id = localStorage.getItem('noteIdCount');
        if (!id) {
            localStorage.setItem('noteIdCount', 0);
            id = 0;
        } else {
            id++;
            // Double check to not allow duplicate id's
            if (localStorage.getItem(`note-${id}`)) {
                console.log("A note with that id already exists!");
                return
            }
            localStorage.setItem('noteIdCount', id);
        }
        const newNote = createNote(id, title, details);
        localStorage.setItem(`note-${id}`, JSON.stringify(newNote.getNote()));
        return newNote;
    }

    // const editNoteTitle = (idOfNoteToEdit, title) => {
    //     const noteValues = JSON.parse(localStorage.getItem(`note-${idOfNoteToEdit}`));
    //     if (noteValues) {
    //         const editedNote = createNote(noteValues.id, title, noteValues.details);
    //         localStorage.setItem(`note-${idOfNoteToEdit}`, JSON.stringify(editedNote.getNote())); 
    //         return 
    //     }
    //     console.log("This note does not exist!");
    // }

    // const editNoteDetails = (idOfNoteToEdit, details) => {
    //     const noteValues = JSON.parse(localStorage.getItem(`note-${idOfNoteToEdit}`));
    //     if (noteValues) {
    //         const editedNote = createNote(noteValues.id, noteValues.title, details);
    //         localStorage.setItem(`note-${idOfNoteToEdit}`, JSON.stringify(editedNote.getNote())); 
    //         return 
    //     }
    //     console.log("This note does not exist!");
    // }

    const editNote = (id, title, details) => {
        const noteValues = JSON.parse(localStorage.getItem(`note-${id}`));
        if (noteValues) {
            const editedNote = createNote(id, title, details);
            localStorage.setItem(`note-${id}`, JSON.stringify(editedNote.getNote())); 
            return 
        }
        console.log("This note does not exist!");
    }

    const deleteNote = (idOfNoteToDelete) => {
        localStorage.removeItem(`note-${idOfNoteToDelete}`);
    }

    const listenForCreatedNotes = PubSub.subscribe('createNote', function(topicName) {
        const newNote = createAndSaveNote('', '');
        PubSub.publishSync('assignNote', newNote.getNote());
    });
    const listenForEditedNotes = PubSub.subscribe('editNote', function(topicName, requestType) {
        editNote(requestType.id, requestType.title, requestType.details);
    });

    // listen for deleted notes

}

export { createNoteManager }