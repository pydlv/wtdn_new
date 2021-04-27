<template>
    <div>
        <p class="h2 mb-4">Manage Account</p>

        <b-input-group prepend="Display Name">
            <b-form-input v-model="displayName" />
        </b-input-group>

        <div class="mt-4">
            <router-link :to="{name: 'ChangePassword'}">
                <b-button>Change Password</b-button>
            </router-link>
        </div>

        <div>
            <b-button class="mt-4" variant="primary" @click="saveProfile">Save</b-button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {authModule} from "@/store";
    import {auth} from "@/firebase";

    @Component
    export default class ManageAccount extends Vue {
        displayName = authModule.user?.displayName;

        async saveProfile() {
            await auth.currentUser?.updateProfile({
                displayName: this.displayName
            });

            this.$successToast('Successfully saved profile.');
        }
    }
</script>

<style scoped>

</style>
