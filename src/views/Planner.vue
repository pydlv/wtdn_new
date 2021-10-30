<template>
    <div>
        <h3>Planner</h3>
        <router-link to="/planner/create-task"><b-button variant="primary" class="mt-2">Create Task</b-button></router-link>

        <div class="mt-4" style="font-size: 24px">
            <div v-for="task of tasks" :key="task.id" class="border-top border-bottom d-flex justify-content-between p-2">
                <div>
                    {{ task.title }}
                </div>
                <div class="d-inline-flex">
                    <a href="javascript:void(0)" @click="$router.push(`/planner/view/${task.id}`)">View / Edit</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {db} from "@/firestore";
    import {Task} from "@/dao/task";
    import {getOrCreatePlanner} from "@/dao/planner";

    @Component
    export default class Planner extends Vue {
        tasks: Task[] = [];

        async mounted() {
            // Fetch the tasks
            this.tasks = [];

            const planner = await getOrCreatePlanner();

            const result = await db.tasks
                .where('plannerId', '==', planner.id)
                .where('archived', '==', false)
                .get();
            result.docs.map(doc => this.tasks.push(
                {
                    ...doc.data(),
                    id: doc.id
                }
            ));
        }
    }
</script>

<style scoped>

</style>
