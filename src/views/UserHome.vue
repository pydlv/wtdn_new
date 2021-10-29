<template>
    <div>
        <div>
            <p>Welcome to the user home, {{ user.displayName }}.</p>
        </div>

        <div>
            You have {{ numTasksTodo }} tasks awaiting completion.
            <div class="mt-2">
                <b-button variant="primary">View Planner</b-button>
            </div>
        </div>
    </div>


</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {authModule} from "@/store";

    @Component
    export default class UserHome extends Vue {
        user = authModule.user;

        get numTasksTodo() {
            return 0;
        }
    }
</script>

<style scoped>

</style>
