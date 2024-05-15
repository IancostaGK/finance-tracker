<script setup lang="ts">
import { periodOptions } from '~/constants';

const user = useSupabaseUser();

const isOpen = ref(false);
const viewSelected = ref(
  user.value?.user_metadata?.transaction_view ?? periodOptions[1]
);
const { current, previous } = useSelectedTimePeriod(viewSelected);
const {
  pending,
  refresh,
  transactions: {
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    grouped: { byDate },
  },
} = useFetchTransactions(current);

const {
  refresh: refreshPrevious,
  transactions: {
    incomeTotal: prevIncomeTotal,
    expenseTotal: prevExpenseTotal,
  },
} = useFetchTransactions(previous);

await refreshPrevious();
await refresh();
</script>

<template>
  <div>
    <section class="flex items-center justify-between mb-10">
      <h1 class="text-4xl font-extrabold">Summary</h1>

      <div>
        <USelectMenu :options="periodOptions" v-model="viewSelected" />
      </div>
    </section>

    <section
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
    >
      <Trend
        color="green"
        title="Income"
        :amount="incomeTotal"
        :last-amount="prevIncomeTotal"
        :loading="pending"
      />
      <Trend
        color="red"
        title="Expense"
        :amount="expenseTotal"
        :last-amount="prevExpenseTotal"
        :loading="pending"
      />
    </section>

    <section class="flex justify-between mb-10">
      <div>
        <h2 class="text-2xl font-extrabold">Transactions</h2>
        <div class="text-gray-500 dark:text-gray-400">
          You have {{ incomeCount }} incomes and {{ expenseCount }} expenses
          this period
        </div>
      </div>
      <div>
        <UButton
          icon="i-heroicons-plus-circle"
          color="white"
          variant="solid"
          label="Add"
          @click="isOpen = true"
        />
      </div>
    </section>

    <section v-if="!pending">
      <div
        v-for="(transactionsOnDay, date) in byDate"
        :key="date"
        class="mb-10"
      >
        <DailyTransactionsSummary
          :date="date"
          :transactions="transactionsOnDay"
        />
        <Transaction
          v-for="transaction in transactionsOnDay"
          :key="JSON.stringify(transaction)"
          :transaction="transaction"
          @deleted="refresh()"
          @edited="refresh()"
        />
      </div>
    </section>
    <section v-else>
      <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>

    <TransactionModal v-model="isOpen" @saved="refresh()" />
  </div>
</template>
