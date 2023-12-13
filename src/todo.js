function createTodo(inputedId, title, details, dueDate, priority, isFinished) {
    const id = inputedId;

    const getTodo = () => {
        return {id, title, details, dueDate, priority, isFinished};
    }
    // When a todo is edited, the user has the option to edit every value
    // but the isFinished flag, these values are always edited with a single
    // form prompt
    const setTodoValues = (newTitle, newDetails, newDueDate, newPriority) => {
        title = newTitle;
        details = newDetails;
        dueDate = newDueDate;
        priority = newPriority;
    }

    // const setTitle = (newTitle) => {
    //     title = newTitle;
    // }
    // const setDetails = (newDetails) => {
    //     details = newDetails
    // }
    // const setDueDate = (newDueDate) => {
    //     dueDate = newDueDate;
    // }
    // const setPriority = (newPriority) => {
    //     priority = newPriority;
    // }
    const setIsFinished = (newBoolean) => {
        isFinished = newBoolean;
    }
    return {getTodo, setTodoValues, setIsFinished}
}

export { createTodo }