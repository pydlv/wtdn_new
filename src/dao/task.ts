export enum TaskType {
    Event = "Event",
    Task = "Task"
}

export interface Task {
    id?: string,
    plannerId: string,
    type: TaskType,
    title: string,
    description: string,
    dateCreated: string,
    dueDate: string | null,
    startDate: string | null,
    dueTime: string | null,
    startTime: string | null,
    endTime: string | null,
    archived: boolean
}


export function sortClosestTasks(tasks: Task[]) {
    const getStart = (task: Task) => task.type === TaskType.Task ? [task.dueDate, task.dueTime] : [task.startDate, task.startTime];

    tasks.sort((a, b) => {
        const [aStartDate, aStartTime] = getStart(a);
        const [bStartDate, bStartTime] = getStart(b);

        const aStart = new Date();
        const bStart = new Date();

        if (aStartDate) {
            const j = new Date(aStartDate);
            aStart.setMonth(j.getMonth());
            aStart.setDate(j.getDate());
            aStart.setFullYear(j.getFullYear());
        }

        if (aStartTime) {
            const j = new Date(aStartTime);
            aStart.setHours(j.getHours(), j.getMinutes(), j.getSeconds());
        }

        if (bStartDate) {
            const j = new Date(bStartDate);
            bStart.setMonth(j.getMonth());
            bStart.setDate(j.getDate());
            bStart.setFullYear(j.getFullYear());
        }

        if (bStartTime) {
            const j = new Date(bStartTime);
            bStart.setHours(j.getHours(), j.getMinutes(), j.getSeconds());
        }

        return aStart.getTime() - bStart.getTime();
    })
}
