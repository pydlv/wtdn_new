<template>
    <div>
        <div v-if="nextTask">
            <p class="font-weight-bold h4">{{ nextTaskName }}</p>
            <span class="font-weight-light fs">{{ startTime.format("dddd, MMMM Do YYYY, h:mm:ss a") }}</span>

            <div>
                <b-button variant="primary" class="mt-2" @click="markComplete">
                    Mark Complete
                </b-button>
            </div>

            <blockquote class="blockquote font-italic font-weight-light pt-4 bg-active">
                {{ quote }}
            </blockquote>
        </div>
        <div v-else>
            <h3>Congrats! You don't have any tasks awaiting completion. Maybe you should read a book.</h3>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {getStartTime, sortTasks, Task} from "@/dao/task";
    import {db} from "@/firestore";
    import {getOrCreatePlanner} from "@/dao/planner";
    import {quotes} from "@/quotes";
    import {choose} from "@/util";

    @Component
    export default class Inspiration extends Vue {
        nextTask: Task | null = null;

        quote: string | null = null;

        async updateNextTask() {
            const planner = await getOrCreatePlanner();

            const result = await db.tasks
                .where('plannerId', '==', planner.id)
                .where('archived', '==', false)
                .get();

            const tasks = result.docs.map(doc => doc.data());

            if (tasks) {
                sortTasks(tasks);

                this.nextTask = tasks[0];

                this.quote = choose(quotes)
            }

        }

        get nextTaskName() {
            return this.nextTask && this.nextTask.title;
        }

        get startTime() {
            if (this.nextTask) {
                return getStartTime(this.nextTask);
            }

            return null;
        }

        async markComplete() {
            if (!this.nextTask) return;

            await db.tasks.doc(this.nextTask.id).update({
                ...this.nextTask,
                archived: true
            } as Task);

            await this.updateNextTask();
        }

        mounted() {
            this.updateNextTask();
        }
    }
</script>

<style scoped>

</style>
