<template>
    <div>
        <div class="d-flex justify-content-start mb-2">
            <b-button @click="$router.back()">Back</b-button>
        </div>
        <h3>Create Task</h3>
        <div class="j mt-2" v-if="!loading">
            <div class="d-flex justify-content-between">
                <div>
                    Type:
                </div>
                <b-dropdown :text="taskType">
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
                <div class="mt-4 mb-4" style="font-size:1.2rem">
                    Click <a href="javascript:void(0);" @click="getFromScheduler">here</a> to request a date/time from the scheduler.
                </div>
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
    import {db} from "@/firestore";
    import {getOrCreatePlanner} from "@/dao/planner";
    import {getDuration, recommendDateTime} from "@/scheduler";

    @Component
    export default class CreateTask extends Vue {
        taskType: TaskType = TaskType.Task;
        title: string = "";
        description: string = "";
        dueDate: string | null = null;
        dueTime: string | null = null;
        startDate: string | null = null;
        startTime: string | null = null;
        endTime: string | null = null;

        loading = false;

        async submit() {
            this.loading = true;

            try {
                const planner = await getOrCreatePlanner();

                const newTask: Task = {
                    archived: false,
                    dateCreated: (new Date()).toString(),
                    description: this.description,
                    startDate: this.startDate,
                    dueDate: this.dueDate,
                    dueTime: this.dueTime,
                    endTime: this.endTime,
                    plannerId: planner.id as string,
                    startTime: this.startTime,
                    title: this.title,
                    type: this.taskType
                }

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

        async getFromScheduler() {
            const duration = getDuration();

            const start = await recommendDateTime(duration);
            const end = start.clone();
            end.add(duration, "minutes");

            this.startDate = start.format("YYYY-MM-DD");
            this.startTime = start.format("HH:mm");
            this.endTime = end.format("HH:mm");
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
