<template>
    <div>
        <h3>Planner</h3>
        <router-link to="/planner/create-task"><b-button variant="primary" class="mt-2">Create Task</b-button></router-link>

        <div class="border-top border-bottom mt-4">

        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    @Component
    export default class Planner extends Vue {
        // get fetchTasks() {
        //     return Tasks.where('plannerId', '==', authModule.user?.email).get();
        // }
    }
</script>

<style scoped>

</style>
