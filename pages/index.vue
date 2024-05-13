<script setup lang="ts">
import type { TransactionRow } from '~/types/Transaction';

const options = ['Yearly', 'Monthly', 'Daily'];

const supabase = useSupabaseClient();

const transactions = ref<TransactionRow[]>([]);
const viewSelected = ref(options[0]);
const isLoading = ref(false);

const fetchTransactions = async (): Promise<TransactionRow[]> => {
    isLoading.value = true;
    try {
        const { data } = await useAsyncData('transactions', async () => {
            const { data, error } = await supabase
                .from('transactions')
                .select();
            if (error) return [];
            return data;
        });

        return data.value || [];
    } finally {
        isLoading.value = false;
    }
};

const transactionsGroupedByDate = computed(() => {
    if (!transactions.value) return {};

    let grouped: Record<string, TransactionRow[]> = {};

    for (const transaction of transactions.value) {
        const date = new Date(transaction.created_at)
            .toISOString()
            .split('T')[0];

        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(transaction);
    }
    return grouped;
});

const refreshTransactions = async () =>
    (transactions.value = await fetchTransactions());
await refreshTransactions();
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
            :amount="4000"
            :last-amount="3000"
            :loading="isLoading"
        />
        <Trend
            color="red"
            title="Expense"
            :amount="4000"
            :last-amount="5000"
            :loading="isLoading"
        />
        <Trend
            color="green"
            title="Investments"
            :amount="4000"
            :last-amount="3000"
            :loading="isLoading"
        />
        <Trend
            color="red"
            title="Saving"
            :amount="4000"
            :last-amount="4100"
            :loading="isLoading"
        />
    </section>

    <section v-if="!isLoading">
        <div
            v-for="(transactionsOnDay, date) in transactionsGroupedByDate"
            :key="date"
            class="mb-10"
        >
            <DailyTransactionsSummary
                :date="date"
                :transactions="transactionsOnDay"
            />
            <Transaction
                v-for="transaction in transactionsOnDay"
                :key="transaction.id"
                :transaction="transaction"
                @deleted="refreshTransactions()"
            />
        </div>
    </section>
    <section v-else>
        <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
</template>
