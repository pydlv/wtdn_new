<template>
    <div>
        <div class="d-flex justify-content-start mb-4">
            <b-button @click="$router.back()">Back</b-button>
        </div>

        <p class="h2 mb-4">Change Password</p>

        <b-form>
            <p v-if="errorMessage" class="text-danger">Cannot change password: {{ errorMessage }}</p>

            <b-input-group prepend="Current Password" class="mt-4 mb-4">
                <b-form-input type="password" v-model="currentPassword" />
            </b-input-group>
            <b-input-group prepend="New Password" class="mt-4 mb-4">
                <b-form-input type="password" v-model="newPassword" />
            </b-input-group>
            <b-input-group prepend="Confirm Password" class="mt-4 mb-4">
                <b-form-input type="password" v-model="confirmPassword" />
            </b-input-group>

            <b-button type="submit" variant="primary" class="mt-2" @click="tryChangePassword">Submit</b-button>
        </b-form>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {auth} from "@/firebase";
    import {authModule} from "@/store";
    import firebase from "firebase/app";

    @Component
    export default class ChangePassword extends Vue {
        currentPassword = "";
        newPassword = "";
        confirmPassword = "";

        errorMessage = "";

        checkValidation(): boolean {
            if (this.newPassword !== this.confirmPassword) {
                this.errorMessage = 'The passwords you entered do not match.';
                return false;
            }

            return true;
        }

        async tryChangePassword() {
            // Make sure the passwords match
            if (!this.checkValidation()) {
                return;
            }

            const credential = firebase.auth.EmailAuthProvider.credential(
                authModule.user!.email!,
                this.currentPassword
            );

            try {
                await auth.currentUser?.reauthenticateWithCredential(credential);
            } catch {
                this.errorMessage = "Current password is incorrect.";
                return;
            }

            auth.currentUser?.updatePassword(this.newPassword)
                .then(() => {
                    this.$successToast("Successfully updated password.");
                    this.$router.push({name: "Manage Account"});
                })
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
