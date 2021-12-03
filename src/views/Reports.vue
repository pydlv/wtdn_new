<template>
    <div>
        <h3>Select Report Type</h3>
        <div class="d-flex flex-column mt-4">
            <b-button @click="toggle(ReportType.BusiestDayOfWeekReport)">Busiest Day of Week</b-button>
            <b-button class="mt-4" @click="toggle(ReportType.NumberOfTasksPerWeek)">Number of Tasks Per Week</b-button>
        </div>

        <div class="mt-4 pt-4" v-if="reportType !== null">
            <h3 class="mb-4">Generated Report</h3>
            <BusiestDayOfWeekReport v-if="reportType === ReportType.BusiestDayOfWeekReport" />
            <TasksPerWeekReport v-if="reportType === ReportType.NumberOfTasksPerWeek" />
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import BusiestDayOfWeekReport from "@/components/Reports/BusiestDayOfWeekReport.vue";
    import TasksPerWeekReport from "@/components/Reports/TasksPerWeekReport.vue";

    enum ReportType {
        BusiestDayOfWeekReport,
        NumberOfTasksPerWeek
    }

    @Component({
        components: {TasksPerWeekReport, BusiestDayOfWeekReport}
    })
    export default class Reports extends Vue {
        reportType: ReportType | null = null;

        toggle(rt: ReportType) {
            if (this.reportType === rt) {
                this.reportType = null;
            } else {
                this.reportType = rt;
            }
        }

        ReportType = ReportType
    }
</script>

<style scoped>

</style>
