<script setup lang="ts">
const props = defineProps<{
    title: string;
    amount: number;
    lastAmount: number;
    color: string;
    loading: boolean;
}>();

const trendingUp = computed(() => props.amount >= props.lastAmount);
const icon = computed(() =>
    trendingUp.value
        ? 'i-heroicons-arrow-trending-up'
        : 'i-heroicons-arrow-trending-down'
);
const percentageTrend = computed(() => {
    if (!props.lastAmount || !props.amount) return '0%';

    const ratio = Math.abs(
        Math.ceil(((props.amount - props.lastAmount) / props.lastAmount) * 100)
    );

    return `${ratio}%`;
});

const { currency } = useCurrency(props.amount);
</script>

<template>
    <div>
        <div class="font-bold" :class="[color]">
            {{ title }}
        </div>

        <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
            <USkeleton class="h-8 w-full" v-if="loading" />
            <div v-else>{{ currency }}</div>
        </div>

        <div>
            <USkeleton class="h-6 w-full" v-if="loading" />
            <div v-else class="flex space-x-1 items-center text-sm">
                <UIcon
                    :name="icon"
                    class="w-6 h-6"
                    :class="{ green: trendingUp, red: !trendingUp }"
                />
                <div class="text-gray-500 dark:text-gray-400">
                    {{ percentageTrend }} vs last Period
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.green {
    @apply text-green-600 dark:text-green-400;
}

.red {
    @apply text-red-600 dark:text-red-400;
}
</style>
