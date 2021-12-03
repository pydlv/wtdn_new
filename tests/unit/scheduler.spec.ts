import {recommendDateTime} from "@/scheduler";
import {Task, TaskType} from "@/dao/task";
import * as taskModule from "@/dao/task";
import {HasID} from "@/firestore";

async function getTestTasks(): Promise<HasID<Task>[]> {
    return [
        {
            id: "test-id",
            plannerId: "test",
            type: TaskType.Event,
            title: "Meeting",
            description: "Meeting with boss",
            dateCreated: "2021-01-01",
            dueDate: null,
            startDate: "2021-12-02",
            dueTime: null,
            startTime: "08:00:00",
            endTime: "20:00:00",
            archived: false
        },
        {
            id: "test-id",
            plannerId: "test",
            type: TaskType.Event,
            title: "Conference",
            description: "Conference call",
            dateCreated: "2021-01-01",
            dueDate: null,
            startDate: "2021-12-03",
            dueTime: null,
            startTime: "08:00:00",
            endTime: "09:30:00",
            archived: false
        }
    ]
}

jest.spyOn(taskModule, 'getUpcomingTasks').mockImplementation(getTestTasks);


describe('Scheduler', () => {
    it('should provide a recommendation',  async () => {
        const time = await recommendDateTime(30);

        expect(time.month()).toBe(11);  // moment month is zero-based, so 11 is december
        expect(time.date()).toBe(3);
        expect(time.hour()).toBe(9);
        expect(time.minute()).toBe(30);
    })
})
