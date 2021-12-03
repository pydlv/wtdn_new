import {getEndTime, getStartTime, getUpcomingTasks, TaskType} from "@/dao/task";
import moment, {Moment} from "moment";

const DAYS_OF_WEEK = 0b1111100;  // M-F
const MIN_HOUR = 9;
const MAX_HOUR = 17;

export function getDuration() {
    const numHours: number = parseFloat(prompt("Enter event duration (in minutes):") || "30");

    return numHours;
}

function timeIsInValidRange(time: Moment): boolean {
    // Make sure the start time is on an allowed day of week and time
    const weekday = 1 << (7 - time.isoWeekday());

    if (!(weekday & DAYS_OF_WEEK)) {
        return false;
    }

    const hour = time.hour();

    return !(hour < MIN_HOUR || hour > MAX_HOUR);
}

export async function recommendDateTime(duration: number) {
    const upcomingTasks = await getUpcomingTasks();

    const upcomingEvents = upcomingTasks.filter(task => task.type === TaskType.Event);

    const start = moment();  // Current time
    start.set({ second: 0, millisecond: 0 });

    const hour = start.hour();
    const minute = start.minute();

    if (minute < 30 && minute !== 0) {
        // Round up to the next :30
        start.set({ minute: 30 });
    } else if (minute !== 30) {
        // Round up to the next hour
        start.set({ hour: hour + 1, minute: 0 });
    }

    // Continuously add 30 minutes until we find a slot that fits the duration
    while (true) {
        while (!timeIsInValidRange(start)) {
            start.add(30, "minute");
        }

        const end = start.clone().add(duration, "minutes")

        let isValid = true;

        // Check if any existing task has an overlap
        for (const event of upcomingEvents) {
            const eventStart = getStartTime(event);
            const eventEnd = getEndTime(event);

            if (start.isBetween(eventStart, eventEnd, null, "[)")) {
                isValid = false;
                break;
            }

            if (end.isBetween(eventStart, eventEnd, null, "[)")) {
                isValid = false;
                break;
            }
        }

        if (isValid) {
            // Use this time
            break;
        }

        start.add(30, "minute");
    }

    return start;
}
