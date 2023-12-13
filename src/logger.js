function printTodo(todo) {
    let todoToPrint = todo.getTodo();
    console.log(todoToPrint.id, todoToPrint.title, todoToPrint.details,
                todoToPrint.dueDate, todoToPrint.priority, todoToPrint.isFinished);
}

function printProject(project) {
    console.log(project);
}

function printNote(note) {
    console.log(note);
}

function printTodos(todos) {
    console.log(todos);
}

function printProjects(projects) {
    console.log(projects);
}

function printNotes(notes) {
    console.log(notes);
}

export {printTodo, printProject, printNote, printTodos, printProjects, printNotes}