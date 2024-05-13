<script setup lang="ts">
const emit = defineEmits(['update:modelValue']);
const isOpen = defineModel<boolean>({ required: true });

const categories = ['Food', 'Housing', 'Car', 'Entertainment'];
const types = ['Income', 'Expense', 'Saving', 'Investment'];

const state = ref({
    type: undefined,
    amount: 0,
    created_at: undefined,
    description: undefined,
    category: undefined,
});
</script>

<template>
    <UModal v-model="isOpen">
        <UCard>
            <template #header> Add Transaction </template>

            <UForm :state="state">
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
                    required
                    label="Category"
                    name="category"
                    class="mb-4"
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
