<template>
    <div>
        <div v-if="!loading">
            <h6>Number of tasks per week for the past 8 weeks:</h6>

            <div class="d-flex flex-column font-weight-bold">
                <div class="d-inline-flex justify-content-between mb-2 border-bottom border-dark">
                    <div>Week</div>
                    <div>Total Tasks</div>
                </div>
                <div class="d-inline-flex justify-content-between mb-1" v-for="week of weeks" :key="week.start.format()">
                    <div>{{ week.format() }}</div>
                    <div>{{ result.get(week) }}</div>
                </div>
            </div>
        </div>
        <div v-else>
            <b-spinner variant="success" />
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {db, HasID} from "@/firestore";
    import {getOrCreatePlanner} from "@/dao/planner";
    import moment, {Moment} from "moment";
    import {getStartTime, Task} from "@/dao/task";

    class Week {
        start: Moment;
        end: Moment;

        constructor(start: Moment, end: Moment) {
            this.start = start;
            this.end = end;
        }

        format() {
            return this.start.format("M/D") + " - " + this.end.format("M/D");
        }
    }

    @Component
    export default class TasksPerWeekReport extends Vue {
        weeks: Week[] = [];
        result = new Map<Week, number>();

        constructor() {
            super();

            // Populate the weeks
            const end = moment().startOf("day");
            const start = end.clone().subtract(7, "days").startOf("day");

            // Go back 8 weeks
            for (let i = 0; i < 8; i++) {
                this.weeks.push(new Week(start.clone(), end.clone()));

                end.subtract(7, "days");
                start.subtract(7, "days");
            }

            this.weeks.reverse();  // Oldest weeks first
        }

        getWeekFromDay(day: Moment) {
            for (const week of this.weeks) {
                if (day.isBetween(week.start, week.end, null, "[)")) {
                    return week;
                }
            }
        }

        loading = false;

        async updateReport() {
            try {
                this.loading = true;

                // Initialize each week in the result
                for (const week of this.weeks) {
                    this.result.set(week, 0);
                }

                const planner = await getOrCreatePlanner();

                const start = moment().subtract(60, "days");

                const momentByTask = new Map<HasID<Task>, Moment>();

                const allTasks = (await db.tasks
                    .where("plannerId", "==", planner.id)
                    .get()).docs.map(doc => doc.data());

                for (const task of allTasks) {
                    const taskStart = getStartTime(task);

                    momentByTask.set(task, taskStart);
                }

                const tasks = allTasks.filter(task => momentByTask.get(task)!.isSameOrAfter(start));

                for (const task of tasks) {
                    // Add the task to its respective week total

                    const week = this.getWeekFromDay(momentByTask.get(task)!);

                    if (!week) {
                        // Task is in the future, ignore.
                        continue;
                    }

                    const previous = this.result.get(week)!;

                    this.result.set(week, previous + 1);
                }
            }
            catch (e) {
                console.error(e);
                this.$failToast("Failed to generate report.");
            }
            finally {
                this.loading = false;
            }
        }

        mounted() {
            this.updateReport();
        }
    }
</script>

<style scoped>

</style>
