function createTodo(inputedId, title, details, dueDate, priority, isFinished) {
    const id = inputedId;
    const getId = () => {
        id;
    }
    const getTitle = () => {
        title;
    }
    const getDetails = () => {
        details;
    }
    const getDueDate = () => {
        dueDate;
    }
    const getPriority = () => {
        priority;
    }
    const getIsFinished = () => {
        isFinished;
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
    return {getId, getTitle, getDetails, getDueDate, getPriority, getIsFinished
           ,setTitle, setDetails, setDueDate, setPriority, setIsFinished}
}

export { createTodo }