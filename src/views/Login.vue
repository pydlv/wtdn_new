<template>
    <div>
        <p class="h2">Please login:</p>

        <b-form class="mt-4">
            <p v-if="errorMessage" class="text-danger">Failed to sign in: {{ errorMessage }}</p>

            <b-form-group label="Email">
                <b-form-input type="email" v-model="email" />
            </b-form-group>
            <b-form-group label="Password">
                <b-form-input type="password" v-model="password" />
            </b-form-group>
            <b-button variant="primary" @click="tryLogin" type="submit" class="mt-2">Login</b-button>
        </b-form>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {authModule} from "@/store";

    @Component
    export default class Login extends Vue {
        email = '';
        password = '';
        errorMessage = '';

        tryLogin() {
            this.errorMessage = '';

            authModule.tryLogin({email: this.email, password: this.password})
                .catch((error) => {
                    this.errorMessage = "message" in error ? error.message : 'An unknown error occurred.';
                    if (!this.errorMessage) {
                        console.error(error);
                    }
                })
        }
    }
</script>

<style scoped>

</style>
