<script setup lang="ts">
import type { TransactionRow } from '~/types/Transaction';

const props = defineProps<{
  transaction: TransactionRow;
}>();
const emit = defineEmits(['deleted', 'edited']);

const isLoading = ref(false);
const isOpen = ref(false);

const { toastError, toastSuccess } = useAppToast();
const supabase = useSupabaseClient();
const { currency } = useCurrency(props.transaction.amount);

const deleteTransaction = async () => {
  isLoading.value = true;
  try {
    await supabase.from('transactions').delete().eq('id', props.transaction.id);
    toastSuccess({
      title: 'Transaction deleted',
    });
    emit('deleted', props.transaction.id);
  } catch (error) {
    toastError({
      title: 'Transaction deleted',
    });
  } finally {
    isLoading.value = false;
  }
};

const items = [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => (isOpen.value = true),
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: deleteTransaction,
    },
  ],
];

const icon = computed(() =>
  props.transaction.type === 'Income'
    ? { name: 'i-heroicons-arrow-up-right', class: 'text-green-600' }
    : { name: 'i-heroicons-arrow-down-left', class: 'text-red-600' }
);
</script>

<template>
  <div
    class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
  >
    <div class="flex items-center justify-between space-x-4 col-span-2">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon.name" :class="icon.class" />
        <div>
          {{ transaction.description }}
        </div>
      </div>
      <div>
        <UBadge color="white" v-if="transaction.category">
          {{ transaction.category }}
        </UBadge>
      </div>
    </div>

    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            color="white"
            variant="ghost"
            trailing-icon="i-heroicons-ellipsis-horizontal"
            :loading="isLoading"
          />
        </UDropdown>

        <TransactionModal
          v-model="isOpen"
          :transaction="transaction"
          @saved="emit('edited')"
        />
      </div>
    </div>
  </div>
</template>
