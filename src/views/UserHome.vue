<template>
    <div>
        <div>
            <p>Welcome to the user home, {{ user.displayName }}.</p>
        </div>

        <div>
            You have {{ numTasksToDo }} tasks awaiting completion.
            <div class="mt-4">
                <router-link to="/planner"><b-button variant="primary">View Planner</b-button></router-link>
            </div>
            <div class="mt-4">
                <router-link to="/inspiration"><b-button variant="primary">Get Motivated</b-button></router-link>
            </div>
        </div>
    </div>


</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {authModule} from "@/store";
    import {getOrCreatePlanner} from "@/dao/planner";
    import {db} from "@/firestore";

    @Component
    export default class UserHome extends Vue {
        user = authModule.user;
        numTasksToDo = 0;

        async mounted() {
            const planner = await getOrCreatePlanner();

            const tasksFetchResult = await db.tasks
                .where('plannerId', '==', planner.id)
                .where('archived', '==', false)
                .get();

            this.numTasksToDo = tasksFetchResult.size;
        }
    }
</script>

<style scoped>

</style>
