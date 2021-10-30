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

// export const TaskConverter = {
//     toFirestore(task: Task) {
//         return {
//             ...task
//         }
//     },
//     fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
//         const data = snapshot.data(options);
//         return data as Task;
//     }
// }
//
// export const Tasks = () => collection("tasks").withConverter(TaskConverter);
