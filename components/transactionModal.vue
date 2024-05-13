<script setup lang="ts">
import type { UForm } from '#build/components';
import { z } from 'zod';
import { categories, types } from '~/constants';

const emit = defineEmits(['update:modelValue']);
const isOpen = defineModel<boolean>({ required: true });

const form = ref<InstanceType<typeof UForm> | null>(null);
const state = ref({
    type: undefined,
    amount: 0,
    created_at: undefined,
    description: undefined,
    category: undefined,
});

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

const save = async () => {
    if (form.value?.validate(state.value)) {
    }
};
</script>

<template>
    <UModal v-model="isOpen">
        <UCard>
            <template #header> Add Transaction </template>

            <UForm :state :schema ref="form" @submit.prevent="save">
                <UFormGroup
                    required
                    label="Transaction Type"
                    name="type"
                    class="mb-4"
                >
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
                    <UInput
                        placeholder="Description"
                        v-model="state.description"
                    />
                </UFormGroup>

                <UFormGroup
                    :required="true"
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
                />
            </UForm>
        </UCard>
    </UModal>
</template>
