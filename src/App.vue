<template>
    <div id="app">
        <Nav></Nav>
        <div class="container rounded bg-white shadow-sm border p-4">
            <router-view/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator';
    import Nav from "@/components/Nav/Nav.vue";
    import {authModule} from "@/store";
    import {needsRedirectedFromNonProtectedPage, needsRedirectedFromProtectedPage} from "@/router";

    @Component({
        components: {Nav}
    })
    export default class App extends Vue {
        get isLoggedIn() {
            return authModule.isLoggedIn;
        }

        // Redirect from non-protected page such as login and signup if the user is already logged in
        @Watch('isLoggedIn')
        isLoggedInChanged() {
            if (needsRedirectedFromNonProtectedPage(this.$route.path)) {
                this.$router.push({ name: 'UserHome' });
            }

            if (needsRedirectedFromProtectedPage(this.$route.path)) {
                this.$router.push({ name: 'Login' });
            }
        }
    }
</script>

<style lang="scss">
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
</style>
