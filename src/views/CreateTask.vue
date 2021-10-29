<template>
    <div>
        <h3>Create Task</h3>
        <div class="j" v-if="!loading">
            <div class="d-flex justify-content-between">
                <div>
                    Type:
                </div>
                <b-dropdown v-model="taskType" :text="taskType">
                    <b-dropdown-item v-for="v of TaskType" :key="v" :active="taskType === v" @click="taskType = v">{{ v }}</b-dropdown-item>
                </b-dropdown>
            </div>
            <div class="d-flex justify-content-between">
                <div>
                    Title:
                </div>
                <div>
                    <b-input v-model="title"></b-input>
                </div>
            </div>
            <div class="d-flex justify-content-between">
                <div class="text-nowrap">
                    Description:
                </div>
                <div>
                    <b-input v-model="description"></b-input>
                </div>
            </div>
            <div v-if="taskType === TaskType.Task">
                <div class="d-flex justify-content-between">
                    <div class="text-nowrap mr-4">
                        Due Date:
                    </div>
                    <div>
                        <b-datepicker v-model="dueDate"></b-datepicker>
                        <div class="d-flex justify-content-end">
                            <a href="javascript:void(0)" @click="dueDate = null"><span>clear</span></a>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-between">
                    <div class="text-nowrap">
                        Due Time:
                    </div>
                    <div>
                        <b-form-timepicker v-model="dueTime"></b-form-timepicker>
                        <div class="d-flex justify-content-end">
                            <a href="javascript:void(0)" @click="dueTime = null"><span>clear</span></a>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="d-flex justify-content-between">
                    <div class="text-nowrap mr-4">
                        Date:
                    </div>
                    <div>
                        <b-datepicker v-model="startDate"></b-datepicker>
                        <div class="d-flex justify-content-end">
                            <a href="javascript:void(0)" @click="startDate = null"><span>clear</span></a>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-between">
                    <div class="text-nowrap">
                        Start Time:
                    </div>
                    <div>
                        <b-form-timepicker v-model="startTime"></b-form-timepicker>
                        <div class="d-flex justify-content-end">
                            <a href="javascript:void(0)" @click="startTime = null"><span>clear</span></a>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-between">
                    <div class="text-nowrap">
                        End Time:
                    </div>
                    <div>
                        <b-form-timepicker v-model="endTime"></b-form-timepicker>
                        <div class="d-flex justify-content-end">
                            <a href="javascript:void(0)" @click="endTime = null"><span>clear</span></a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <b-button variant="primary" class="btn btn-lg" @click="submit">
                    Save
                </b-button>
            </div>
        </div>
        <div v-else class="justify-content-center">
<!--            We're loading -->
            <b-spinner variant="success"></b-spinner>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {Task, TaskType} from "@/dao/task";
    import {authModule} from "@/store";
    import { v4 } from "uuid";
    import {db} from "@/firestore";

    @Component
    export default class CreateTask extends Vue {
        taskType: TaskType = TaskType.Task;
        title: string = "";
        description: string = "";
        dueDate: Date | null = null;
        dueTime: string | null = null;
        startDate: Date | null = null;
        startTime: string | null = null;
        endTime: string | null = null;

        loading = false;

        async submit() {
            this.loading = true;

            try {
                const newId = v4();
                const newTask: Task = {
                    id: newId,
                    archived: false,
                    dateCreated: (new Date()).toString(),
                    description: this.description,
                    dueDate: this.dueDate ? this.dueDate.toDateString() : null,
                    dueTime: this.dueTime,
                    endTime: this.endTime,
                    plannerId: authModule.user!.email!,
                    startTime: this.startTime,
                    title: this.title,
                    type: this.taskType
                }

                // await Tasks().doc(newId).set(newTask);
                await db.tasks.add(newTask);

                this.$successToast("Successfully created task!");

                this.$router.push("/planner");
            } catch (e) {
                this.$failToast("Failed to create task, please try again.");
                console.error(e);
            } finally {
                this.loading = false;
            }
        }

        TaskType = TaskType;
    }
</script>

<style scoped>
    .j {
        font-size: 24px;
    }

    .d-flex {
        margin-bottom: 20px;
    }
</style>
