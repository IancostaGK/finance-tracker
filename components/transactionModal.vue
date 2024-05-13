<script setup lang="ts">
const emit = defineEmits(['update:modelValue']);
const isOpen = defineModel<boolean>({ required: true });
</script>

<template>
    <UModal v-model="isOpen">
        <UCard>
            <template #header> Add Transaction </template>

            <div>Hello!</div>
        </UCard>
    </UModal>
</template>
