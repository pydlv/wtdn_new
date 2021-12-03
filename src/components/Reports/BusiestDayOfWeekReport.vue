<template>
    <div>
        <div v-if="!loading">
            <h6>Your busiest days of the week in the past 30 days:</h6>

            <div class="d-flex flex-column font-weight-bold">
                <div class="d-inline-flex justify-content-between mb-2 border-bottom border-dark">
                    <div>Day of Week</div>
                    <div>Total Tasks</div>
                </div>
                <div class="d-inline-flex justify-content-between mb-1" v-for="[label, day] of days" :key="day">
                    <div>{{ label }}</div>
                    <div>{{ result.get(day) || 0 }}</div>
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
    import {DayOfWeek} from "@/util";

    @Component
    export default class BusiestDayOfWeekReport extends Vue {
        result = new Map<DayOfWeek, number | null>();

        loading = false;

        days = [
            ["Monday", DayOfWeek.Monday],
            ["Tuesday", DayOfWeek.Tuesday],
            ["Wednesday", DayOfWeek.Wednesday],
            ["Thursday", DayOfWeek.Thursday],
            ["Friday", DayOfWeek.Friday],
            ["Saturday", DayOfWeek.Saturday],
            ["Sunday", DayOfWeek.Sunday],
        ]

        async updateReport() {
            try {
                this.loading = true;
                this.result = new Map<DayOfWeek, number | null>();

                const planner = await getOrCreatePlanner();

                const start = moment().subtract(30, "days");

                const momentByTask = new Map<HasID<Task>, Moment>();
                const dowByTask = new Map<HasID<Task>, DayOfWeek>();

                const allTasks = (await db.tasks
                    .where("plannerId", "==", planner.id)
                    .get()).docs.map(doc => doc.data());

                for (const task of allTasks) {
                    const taskStart = getStartTime(task);

                    const dayOfWeek: DayOfWeek = 1 << (7 - taskStart.isoWeekday());

                    momentByTask.set(task, taskStart);
                    dowByTask.set(task, dayOfWeek);
                }

                const tasks = allTasks.filter(task => momentByTask.get(task)!.isSameOrAfter(start));

                // Average each weekday
                for (const task of tasks) {
                    const dow = dowByTask.get(task)!;
                    const prevSum = this.result.get(dow) || 0;

                    this.result.set(dow, prevSum + 1);
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
