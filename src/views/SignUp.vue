<template>
    <div>
        <p class="h2">Sign Up:</p>

        <b-form class="mt-4">
            <p v-if="errorMessage" class="text-danger">Failed to sign up: {{ errorMessage }}</p>

            <b-form-group label="Email">
                <b-form-input type="email" v-model="email" />
            </b-form-group>
            <b-form-group label="Password">
                <b-form-input type="password" v-model="password" />
            </b-form-group>
            <b-form-group label="Confirm Password">
                <b-form-input type="password" v-model="confirmPassword" />
            </b-form-group>
            <b-button class="mt-2" type="submit" @click="trySignUp">Submit</b-button>
        </b-form>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {authModule} from "@/store";

    @Component
    export default class SignUp extends Vue {
        errorMessage = '';
        email = '';
        password = '';
        confirmPassword = '';

        checkValidation(): boolean {
            if (this.password !== this.confirmPassword) {
                this.errorMessage = 'The passwords you entered do not match.';
                return false;
            }

            return true;
        }

        trySignUp() {
            // Make sure our passwords match
            if (!this.checkValidation()) {
                return;
            }

            authModule.trySignUp({email: this.email, password: this.password})
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
