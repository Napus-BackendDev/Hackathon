<script setup lang="ts">
definePageMeta({
    layout: 'coder',
    title: 'Patient Case'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

// Mock Data
const patient = {
    name: 'James Wilson',
    mrn: 'MRN-882190',
    provider: 'Dr. Emily Stones',
    note: `Patient presents with chest pain radiating to left arm. ECG shows ST
elevation. Troponin elevated. Diagnosis: Acute Myocardial Infarction.`
}

const suggestions = ref([
    {
        id: 1,
        code: 'I21.9',
        type: 'ICD-10',
        description: 'Acute myocardial infarction, unspecified',
        confidence: 98,
        status: 'pending' // pending, approved, rejected
    },
    {
        id: 2,
        code: 'R07.9',
        type: 'ICD-10',
        description: 'Chest pain, unspecified',
        confidence: 85,
        status: 'pending'
    }
])

const getMatchColor = (confidence: number) => {
    if (confidence >= 90) return 'primary'
    if (confidence >= 80) return 'warning'
    return 'error'
}

const approveSuggestion = (id: number) => {
    const suggestion = suggestions.value.find(s => s.id === id)
    if (suggestion) {
        suggestion.status = 'approved'
        toast.add({ title: 'Code Approved', description: `${suggestion.code} has been approved.`, color: 'primary' })
    }
}

const rejectSuggestion = (id: number) => {
    const index = suggestions.value.findIndex(s => s.id === id)
    if (index !== -1) {
        const code = suggestions.value[index].code
        suggestions.value.splice(index, 1)
        toast.add({ title: 'Code Rejected', description: `${code} has been removed.`, color: 'red' })
    }
}

const addManualCode = () => {
    suggestions.value.push({
        id: Date.now(),
        code: 'M54.5',
        type: 'ICD-10',
        description: 'Low back pain',
        confidence: 100,
        status: 'pending'
    })
    toast.add({ title: 'Manual Code Added', description: 'New code has been added to the list.', color: 'gray' })
}
</script>

<template>
    <UCard class="flex flex-col h-full">
        <!-- Header -->
        <template #header>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="router.back()" />
                    <div>
                        <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ patient.name }}</h1>
                        <div class="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                            <span>{{ patient.mrn }}</span>
                            <span>&bull;</span>
                            <span>{{ patient.provider }}</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <UButton icon="i-heroicons-flag" color="gray" variant="ghost" label="Flag Case" />
                    <UButton icon="i-heroicons-document-check" color="primary" label="Submit Codes" />
                </div>
            </div>
        </template>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            <!-- Left: Clinical Note -->
            <UCard class="h-full flex flex-col" :ui="{ body: { base: 'flex-1' } }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <UIcon name="i-heroicons-pencil-square" class="w-5 h-5 text-gray-500" />
                            <h3 class="font-bold text-gray-900 dark:text-white">Clinical Note</h3>
                        </div>
                        <UButton icon="i-heroicons-clipboard" color="gray" variant="ghost" size="xs" />
                    </div>
                </template>

                <div
                    class="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed font-serif">
                    <p>
                        <span class="bg-emerald-100 dark:bg-emerald-900/30 px-1 py-0.5 rounded">Patient presents with
                            chest pain radiating to left arm.</span>
                        ECG shows ST elevation. Troponin elevated.
                        <span class="bg-emerald-100 dark:bg-emerald-900/30 px-1 py-0.5 rounded">Diagnosis: Acute
                            Myocardial Infarction.</span>
                    </p>
                </div>
            </UCard>

            <!-- Right: AI Suggestions -->
            <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between px-1">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-primary-500" />
                        <h3 class="font-bold text-gray-900 dark:text-white">AI Suggestions</h3>
                    </div>
                    <UBadge label="Model v2.4 (High Confidence)" color="primary" variant="subtle" size="xs" />
                </div>

                <div class="space-y-4">
                    <UCard v-for="suggestion in suggestions" :key="suggestion.id"
                        :class="{ 'ring-2 ring-primary-500 dark:ring-primary-400': suggestion.status === 'approved' }">
                        <div class="flex justify-between items-start mb-2">
                            <div class="flex items-center gap-2">
                                <span class="text-xl font-bold text-gray-900 dark:text-white">{{ suggestion.code
                                }}</span>
                                <UBadge :label="suggestion.type" color="gray" variant="soft" size="xs" />
                                <UBadge v-if="suggestion.status === 'approved'" label="Approved" color="primary"
                                    variant="solid" size="xs" />
                            </div>
                            <UBadge :label="`${suggestion.confidence}% Match`"
                                :color="getMatchColor(suggestion.confidence)" variant="subtle" size="xs" />
                        </div>

                        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
                            {{ suggestion.description }}
                        </p>

                        <div v-if="suggestion.status !== 'approved'"
                            class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                            <div class="flex gap-2">
                                <UButton icon="i-heroicons-check" color="gray" variant="ghost" size="xs" label="Approve"
                                    class="hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                                    @click="approveSuggestion(suggestion.id)" />
                                <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" size="xs" label="Reject"
                                    class="hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    @click="rejectSuggestion(suggestion.id)" />
                            </div>
                            <UButton icon="i-heroicons-pencil" color="gray" variant="ghost" size="xs" />
                        </div>
                        <div v-else class="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
                            <UButton icon="i-heroicons-arrow-uturn-left" color="gray" variant="ghost" size="xs"
                                label="Undo" @click="suggestion.status = 'pending'" />
                        </div>
                    </UCard>

                    <!-- Add Manual Code Button -->
                    <button @click="addManualCode"
                        class="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 dark:hover:border-primary-500 dark:hover:text-primary-400 transition-colors flex items-center justify-center gap-2 font-medium text-sm">
                        <UIcon name="i-heroicons-plus" class="w-5 h-5" />
                        Add Manual Code
                    </button>
                </div>
            </div>
        </div>
    </UCard>
</template>
