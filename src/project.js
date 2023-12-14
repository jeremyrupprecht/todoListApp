function createProject(inputedId, title, todoIds) {
    const project = Object.create(projectPrototype);
    project.id = inputedId;
    project.title = title;
    project.todoIds = todoIds;
    return project;
}

const projectPrototype = {
    getProject: function() {
        return {id: this.id, title: this.title, todoIds: this.todoIds}
    },
    setTitle: function(title) {
        this.title = title;
    },
    addTodo: function(todoId) {
        this.todoIds.push(todoId);
    },
    removeTodo: function(todoIdToRemove) {
        let index = this.todoIds.indexOf(todoIdToRemove);
        if (index > -1) { 
            this.todoIds.splice(index, 1);
        }
    }
}

// function createProject(inputedId, title, todoIds) {
//     const id = inputedId;

//     const getProject = () => {
//         return {id, title, todoIds}
//     }
//     const setTitle = (newTitle) => {
//         title = newTitle;
//     }
//     const addTodo = (todoId) => {
//         todoIds.push(todoId);
//     }
//     const removeTodo = (todoIdToRemove) => {
//         let index = todoIds.indexOf(todoIdToRemove);
//         console.log('INDEX', index);
//         console.log('HEYYYYYYY');
//         if (index > -1) { 
//             todoIds.splice(index, 1);
//         }
//     }
//     return {getProject, setTitle, addTodo, removeTodo}
// }

export { createProject }