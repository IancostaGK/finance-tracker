<script setup lang="ts">
import type { UForm } from '#build/components';
import type { Form } from '#ui/types';
import { z } from 'zod';
import { categories, types } from '~/constants';
import type { TransactionRow } from '~/types/Transaction';

const emit = defineEmits(['saved']);
const isOpen = defineModel<boolean>({ required: true });
const props = defineProps<{
  transaction?: TransactionRow;
}>();

const initialState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
};

const isLoading = ref(false);
const form = ref<Form<typeof state.value> | null>(null);
const state = ref(
  props.transaction
    ? {
        ...props.transaction,
        created_at: props.transaction.created_at.split('T')[0],
      }
    : { ...initialState }
);

const supabase = useSupabaseClient();
const { toastError, toastSuccess } = useAppToast();

const defaultSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  created_at: z.string(),
  description: z.string().optional(),
});

const incomeSchema = z.object({
  type: z.literal('Income'),
});

const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum(categories as any),
});

const investmentSchema = z.object({
  type: z.literal('Investment'),
});

const savingSchema = z.object({
  type: z.literal('Saving'),
});

const schema = z.intersection(
  z.discriminatedUnion('type', [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ]),
  defaultSchema
);

const resetForm = () => {
  Object.assign(state.value, initialState);
  form.value?.clear();
};

const save = async () => {
  if (form.value?.errors.length) return;

  isLoading.value = true;
  try {
    const { error } = await supabase.from('transactions').upsert({
      ...state.value,
      id: props.transaction?.id,
    } as any);

    if (!error) {
      toastSuccess({
        title: 'Transaction saved',
      });
      isOpen.value = false;
      emit('saved');
      return;
    }
    throw error;
  } catch (e: any) {
    toastError({
      title: 'Transaction not saved',
      description: e?.message as string,
    });
  } finally {
    isLoading.value = false;
  }
};

const isEditing = computed(() => !!props.transaction);
watch(isOpen, (value) => {
  if (!value) resetForm();
});
</script>

<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        {{ isEditing ? 'Edit' : 'Add' }} Transaction
      </template>

      <UForm :state :schema ref="form" @submit="save">
        <UFormGroup required label="Transaction Type" name="type" class="mb-4">
          <USelect
            placeholder="Select the transaction type"
            :options="types"
            v-model="state.type"
          />
        </UFormGroup>

        <UFormGroup label="Amount" required name="amount" class="mb-4">
          <UInput
            type="number"
            placeholder="Amount"
            v-model.number="state.amount"
          />
        </UFormGroup>

        <UFormGroup
          label="Transaction date"
          required
          name="created_at"
          class="mb-4"
        >
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="state.created_at"
          />
        </UFormGroup>

        <UFormGroup
          label="Description"
          hint="Optional"
          name="description"
          class="mb-4"
        >
          <UInput placeholder="Description" v-model="state.description" />
        </UFormGroup>

        <UFormGroup
          required
          label="Category"
          name="category"
          class="mb-4"
          v-if="state.type === 'Expense'"
        >
          <USelect
            placeholder="Category"
            :options="categories"
            v-model="state.category"
          />
        </UFormGroup>

        <UButton
          type="submit"
          color="black"
          variant="solid"
          label="Save"
          :loading="isLoading"
        />
      </UForm>
    </UCard>
  </UModal>
</template>
