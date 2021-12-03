import moment from "moment";
import {getOrCreatePlanner} from "@/dao/planner";
import {db} from "@/firestore";

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


export function sortTasks(tasks: Task[], reverse=false) {
    tasks.sort((a, b) => {
        const aStart = getStartTime(a);
        const bStart = getStartTime(b);

        if (!reverse) {
            return aStart.unix() - bStart.unix();
        } else {
            return bStart.unix() - aStart.unix();
        }
    })
}


export function getStartTime(task: Task) {
    let date, time;

    if (task.type === TaskType.Task) {
        date = task.dueDate || '';
        time = task.dueTime || '';
    } else {
        date = task.startDate || '';
        time = task.startTime || '';
    }

    return moment((date + ' ' + time).trim());
}

export function getEndTime(task: Task) {
    let date, time;

    if (task.type === TaskType.Task) {
        date = task.dueDate || '';
        time = task.dueTime || '';
    } else {
        date = task.startDate || '';
        time = task.endTime || '';
    }

    return moment((date + ' ' + time).trim());
}


export async function getUpcomingTasks(archived=false) {
    // Fetch the tasks
    const planner = await getOrCreatePlanner();

    const result = await db.tasks
        .where('plannerId', '==', planner.id)
        .where('archived', '==', archived)
        .get();

    const tasks = result.docs.map(doc => doc.data());

    sortTasks(tasks, archived);  // When we are viewing archived tasks, we want to show most recent first.

    return tasks;
}
