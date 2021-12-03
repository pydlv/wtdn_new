<template>
    <div>
        <div v-if="!loading">
            <h3>Planner</h3>
            <div class="d-flex justify-content-between mt-2">
                <b-button @click="toggleViewArchived">{{ viewArchived ? 'Hide Archived' : 'Show Archived' }}</b-button>
                <router-link to="/planner/create-task"><b-button variant="primary">Create Task</b-button></router-link>
            </div>

            <div class="mt-4" style="font-size: 24px">
                <div v-if="tasks.length">
                    <div v-for="task of tasks" :key="task.id" class="border-top border-bottom d-flex justify-content-between p-2">
                        <div class="d-flex flex-column">
                            <div class="h4 text-left">{{ task.title }}</div>
                            <div class="h6 font-weight-light text-left">{{ getStartTime(task).format("ddd, MMMM Do, h:mm a") }}</div>
                        </div>
                        <div class="d-inline-flex ml-2">
                            <a href="javascript:void(0)" @click="$router.push(`/planner/view/${task.id}`)">View / Edit</a>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <h2 class="mt-4">Nothing to show!</h2>
                </div>
            </div>
        </div>
        <b-spinner variant="primary" v-else />
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {HasID} from "@/firestore";
    import {getStartTime, getUpcomingTasks, Task} from "@/dao/task";

    @Component
    export default class Planner extends Vue {
        loading = false;

        tasks: HasID<Task>[] = [];

        viewArchived = false;

        getStartTime(task: HasID<Task>) {
            return getStartTime(task);
        }

        async updateTasks() {
            this.loading = true;

            this.tasks = await getUpcomingTasks(this.viewArchived);

            this.loading = false;
        }

        mounted() {
            this.updateTasks();
        }

        toggleViewArchived() {
            this.viewArchived = !this.viewArchived;

            this.updateTasks();
        }
    }
</script>

<style scoped>

</style>
