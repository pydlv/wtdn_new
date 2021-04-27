<template>
    <div>
        <p>Welcome to the user home, {{ user.displayName }}.</p>
    </div>
</template>

<script>
    import {Component, Vue} from "vue-property-decorator";
    import {authModule} from "@/store";

    @Component
    export default class UserHome extends Vue {
        user = authModule.user;
    }
</script>

<style scoped>

</style>
