<template>
    <div>
        <div class="d-flex justify-content-start mb-2">
            <b-button @click="$router.back()">Back</b-button>
        </div>
        <h3>View/Modify Task</h3>
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
                <b-button variant="primary" class="btn btn-lg" @click="save">
                    Save
                </b-button>
            </div>
            <div class="d-flex justify-content-center">
                <b-button variant="primary" class="btn btn-lg" @click="toggleArchive">
                    {{ this.archived ? 'Unarchive' : 'Archive' }}
                </b-button>
            </div>
            <div class="d-flex justify-content-center">
                <b-button variant="danger" class="btn btn-lg" @click="deleteTask">
                    Delete
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
    import {getOrCreatePlanner} from "@/dao/planner";
    import {db} from "@/firestore";

    @Component
    export default class ViewModifyTask extends Vue {
        taskType: TaskType = TaskType.Task;
        title: string = "";
        description: string = "";
        dueDate: string | null = null;
        dueTime: string | null = null;
        startDate: string | null = null;
        startTime: string | null = null;
        endTime: string | null = null;

        task: Task | null = null;

        archived: boolean = false;

        loading = false;

        taskId: string = this.$route.params.id;

        async mounted() {
            this.loading = true;

            this.taskId = this.$route.params.id;

            try {
                // Load the task from the database
                const taskFetchResult = await db.tasks.doc(this.taskId)
                    .get();

                if (!taskFetchResult.exists) {
                    this.$failToast('Task not found.');
                    this.$router.back();
                    return;
                }

                const task = {
                    ...taskFetchResult.data()!,
                    id: taskFetchResult.id
                };

                this.taskType = task.type;
                this.title = task.title;
                this.description = task.description;
                this.dueDate = task.dueDate;
                this.dueTime = task.dueTime;
                this.startDate = task.startDate;
                this.startTime = task.startTime;
                this.endTime = task.endTime;
                this.archived = task.archived;

                this.task = task;

                this.loading = false;
            } catch (e) {
                this.$failToast('Failed to load task. Please check console for more details.');
                this.$router.back();
                console.error(e);
            }
        }

        async toggleArchive() {
            this.loading = true;
            try {
                await db.tasks.doc(this.task!.id).update({
                    ...this.task!,
                    archived: !this.task!.archived
                } as Task);

                this.$successToast("Successfully updated task.");
                this.$router.back();
            } catch (e) {
                this.$failToast('Failed to update task.');
                this.loading = false;
            }
        }

        async deleteTask() {
            this.loading = true;
            try {
                await db.tasks.doc(this.task!.id).delete();

                this.$successToast("Successfully deleted task.");
                this.$router.back();
            } catch (e) {
                this.$failToast('Failed to delete task.');
                this.loading = false;
            }
        }

        async save() {
            this.loading = true;

            try {
                const planner = await getOrCreatePlanner();

                this.task = {
                    ...this.task!,
                    description: this.description,
                    dueDate: this.dueDate,
                    dueTime: this.dueTime,
                    endTime: this.endTime,
                    plannerId: planner.id!,
                    startTime: this.startTime,
                    title: this.title,
                    type: this.taskType
                };

                await db.tasks.doc(this.task!.id).update(this.task);

                this.$successToast("Successfully saved task!");
            } catch (e) {
                this.$failToast("Failed to save task, please try again.");
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
