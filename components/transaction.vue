<script setup lang="ts">
import type { TransactionRow } from '~/types/Transaction';

const props = defineProps<{
    transaction: TransactionRow;
}>();
const emit = defineEmits(['deleted']);

const isLoading = ref(false);

const toast = useToast();
const supabase = useSupabaseClient();
const { currency } = useCurrency(props.transaction.amount);

const deleteTransaction = async () => {
    isLoading.value = true;
    try {
        await supabase
            .from('transactions')
            .delete()
            .eq('id', props.transaction.id);
        toast.add({
            title: 'Transaction deleted',
            icon: 'i-heroicons-check-circle',
        });
        emit('deleted', props.transaction.id);
    } catch (error) {
        toast.add({
            title: 'Transaction deleted',
            icon: 'i-heroicons-exclamation-circle',
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
            click: () => console.log('Edit'),
        },
        {
            label: 'Delete',
            icon: 'i-heroicons-trash-20-solid',
            click: deleteTransaction,
        },
    ],
];

const icon = computed(() =>
    props.transaction.type === 'income'
        ? { name: 'i-heroicons-arrow-up-right', class: 'text-green-600' }
        : { name: 'i-heroicons-arrow-down-left', class: 'text-red-600' }
);
</script>

<template>
    <div
        class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
    >
        <div class="flex items-center justify-between">
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
                <UDropdown
                    :items="items"
                    :popper="{ placement: 'bottom-start' }"
                >
                    <UButton
                        color="white"
                        variant="ghost"
                        trailing-icon="i-heroicons-ellipsis-horizontal"
                        :loading="isLoading"
                    />
                </UDropdown>
            </div>
        </div>
    </div>
</template>
