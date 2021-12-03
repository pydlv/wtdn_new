export function choose<T>(choices: T[]): T {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
}


export enum DayOfWeek {
    Monday = 1 << 6,
    Tuesday = 1 << 5,
    Wednesday = 1 << 4,
    Thursday = 1 << 3,
    Friday = 1 << 2,
    Saturday = 1 << 1,
    Sunday = 1
}
