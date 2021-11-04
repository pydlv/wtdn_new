<template>
    <div>
        <p class="h3">Welcome to our daily planner app!</p>
        <div class="m-4">
            <router-link to="/login"><b-button variant="primary col-4">Login</b-button></router-link>
            <p class="m-2">- OR -</p>
            <router-link to="/signup"><b-button variant="primary col-4">Sign Up</b-button></router-link>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import {authModule} from "@/store";

    @Component
    export default class Home extends Vue {
        @Watch('authModule.isLoggedIn')
        userChanged(newValue: boolean) {
            console.log("changed");
            if (newValue) {
                this.$router.replace('/user-home');
            }
        }

        authModule = authModule;
    }
</script>
