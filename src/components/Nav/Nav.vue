<template>
    <header class="p-3 mb-3 border-bottom shadow-sm bg-white">
        <div class="container">
            <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                <div v-if="!isLoggedIn" :class="navClass">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/signup">Sign Up</NavLink>
                </div>
                <div v-else :class="navClass">
                    <NavLink to="/user-home">Home</NavLink>
                    <NavLink to="/manage-account">Manage Account</NavLink>
                    <a class="nav-link px-4" href="javascript:void(0)" @click="signOut">Sign Out</a>
                </div>
            </div>
        </div>
    </header>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'
    import NavLink from '@/components/Nav/NavLink.vue'
    import {authModule} from "@/store";
    import {auth} from "@/firebase";

    @Component({
        components: {
            NavLink
        }
    })
    export default class Nav extends Vue {
        navClass = 'nav nav-pills col-12 col-lg-auto me-lg-auto mb-2 mb-md-0';

        get isLoggedIn() {
            return authModule.isLoggedIn;
        }

        signOut() {
            auth.signOut();
        }
    }
</script>

<style scoped>

</style>
