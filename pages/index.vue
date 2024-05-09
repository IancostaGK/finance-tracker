<script setup lang="ts">
const options = ['Yearly', 'Monthly', 'Daily'];
const viewSelected = ref(options[0]);
</script>

<template>
    <section class="flex items-center justify-between mb-10">
        <h1 class="text-4xl font-extrabold">Summary</h1>

        <div>
            <USelectMenu :options v-model="viewSelected" />
        </div>
    </section>

    <section
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
    >
        <Trend
            color="green"
            title="Income"
            :amount="3000"
            :last-amount="3000"
            :loading="false"
        />
        <Trend
            color="red"
            title="Expense"
            :amount="4000"
            :last-amount="5000"
            :loading="false"
        />
        <Trend
            color="green"
            title="Investments"
            :amount="4000"
            :last-amount="3000"
            :loading="false"
        />
        <Trend
            color="red"
            title="Saving"
            :amount="4000"
            :last-amount="4100"
            :loading="false"
        />
    </section>
</template>

<style scoped></style>
