function createTodo(inputedId, title, details, dueDate, priority, isFinished) {
    const id = inputedId;

    const getTodo = () => {
        return {id, title, details, dueDate, priority, isFinished};
    }
    const setTitle = (newTitle) => {
        title = newTitle;
    }
    const setDetails = (newDetails) => {
        details = newDetails
    }
    const setDueDate = (newDueDate) => {
        dueDate = newDueDate;
    }
    const setPriority = (newPriority) => {
        priority = newPriority;
    }
    const setIsFinished = (newBoolean) => {
        isFinished = newBoolean;
    }
    const print = () => {
        console.log(id, title, details, dueDate, priority, isFinished);
    }

    return {getTodo, setTitle, setDetails, setDueDate, setPriority, setIsFinished, print}
}

export { createTodo }