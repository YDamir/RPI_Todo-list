const Status = {
    BACKLOG: 'backlog',
    INPROGRESS: 'inprogress',
    COMPLETED: 'completed',
    RESYCLEBIN: 'resyclebin',
};

const StatusLabel = {
    [Status.BACKLOG]: 'Бэклог',
    [Status.INPROGRESS]: 'В процессе',
    [Status.COMPLETED]: 'Готово',
    [Status.RESYCLEBIN]: 'Корзина',
};

const UserAction = {
    UPDATE_TASK: 'UPDATE_TASK',
    ADD_TASK: 'ADD_TASK',
    DELETE_TASK: 'DELETE_TASK',
};

const UpdateType = {
    PATCH: 'PATCH',
    MINOR: 'MINOR',
    MAJOR: 'MAJOR',
    INIT: 'INIT',
};

export {Status, StatusLabel, UserAction, UpdateType};