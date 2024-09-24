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

export {Status, StatusLabel};