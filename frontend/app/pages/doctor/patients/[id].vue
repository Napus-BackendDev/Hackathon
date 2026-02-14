<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePatientsStore } from '~/stores/patients'

const route = useRoute()
const router = useRouter()
const store = usePatientsStore()
const { currentPatient: patient, loading } = storeToRefs(store)

onMounted(() => {
    const id = Number(route.params.id)
    if (id) {
        store.fetchPatient(id)
    }
})

// Computed wrapper to safely access patient properties or defaults
const patientDisplay = computed(() => {
    if (!patient.value) return {
        name: 'Loading...',
        mrn: '...',
        date: '...',
        department: '...',
        note: '',
        lastEdited: '...'
    }
    return {
        ...patient.value,
        note: patient.value.pi || '', // Map Present Illness to note
        lastEdited: 'Today, 10:42 AM' // Mock for now
    }
})

const noteModel = computed({
    get: () => patient.value?.pi || '',
    set: (val) => {
        if (patient.value) patient.value.pi = val
    }
})


const detectedCodes = ref([
    {
        type: 'ICD-10',
        code: 'I21.9',
        description: 'Acute myocardial infarction, unspecified',
        match: 98,
        status: 'pending'
    },
    {
        type: 'ICD-10',
        code: 'R07.9',
        description: 'Chest pain, unspecified',
        match: 85,
        status: 'pending'
    }
])

const gaps = ref([
    'Missing laterality for fracture diagnosis.',
    'Specify "Initial" vs "Subsequent" encounter.'
])

const items = [{
    slot: 'suggestions',
    label: 'AI Suggestions',
    icon: 'i-heroicons-sparkles'
}, {
    slot: 'audit',
    label: 'Audit Log',
    icon: 'i-heroicons-clock'
}]

const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'success'
    if (percentage >= 80) return 'warning'
    return 'error'
}

definePageMeta({
    layout: 'doctor',
    title: 'Patient Details'
})
</script>

<template>
    <div v-if="loading" class="flex flex-col items-center justify-center h-full space-y-4">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-teal-600 animate-spin" />
        <p class="text-gray-500">Loading patient data...</p>
    </div>
    <div v-else class="flex flex-col h-full space-y-6">
        <!-- Header Section -->
        <header class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <UButton icon="i-heroicons-arrow-left" variant="ghost" @click="router.back()" />
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ patientDisplay.name }}</h1>
                    <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <UBadge color="neutral" variant="soft">{{ patientDisplay.mrn }}</UBadge>
                        <span>&bull;</span>
                        <span>{{ patientDisplay.date }}</span>
                        <span>&bull;</span>
                        <span class="text-teal-600 font-medium">{{ patientDisplay.department }}</span>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div
                    class="flex items-center gap-2 text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-full text-sm font-medium">
                    <UIcon name="i-heroicons-sparkles" />
                    <span>AI Analysis Active</span>
                </div>
                <UButton icon="i-heroicons-document-check" label="Save Changes" variant="solid" />
            </div>
        </header>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">

            <!-- Left Column: Clinical Documentation -->
            <div
                class="lg:col-span-2 flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <!-- Card Header -->
                <div
                    class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <div class="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                        <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-gray-500" />
                        Clinical Documentation
                    </div>
                    <span class="text-xs text-gray-500">Last edited: {{ patientDisplay.lastEdited }}</span>
                </div>

                <!-- Editor Area -->
                <div class="flex-1 p-6 relative">
                    <UTextarea v-model="noteModel" variant="none" placeholder="Start typing clinical notes..."
                        class="w-full h-full p-0" :ui="{
                            base: 'h-full resize-none text-gray-700 dark:text-gray-300 leading-relaxed text-base'
                        }" />
                </div>

                <!-- Card Footer -->
                <div
                    class="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                    <span>{{ noteModel.length }} characters</span>
                    <div class="flex items-center gap-1.5 text-emerald-600">
                        <UIcon name="i-heroicons-check-circle" class="w-4 h-4" />
                        <span>All changes saved</span>
                    </div>
                </div>
            </div>

            <!-- Right Column: AI Suggestions -->
            <div class="flex flex-col h-full min-h-0">
                <div
                    class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-full overflow-hidden">

                    <UTabs :items="items" class="w-full">
                        <template #suggestions>
                            <div class="p-4 space-y-6 overflow-y-auto h-[calc(100vh-280px)]">
                                <!-- Detected Codes Section -->
                                <div class="space-y-3">
                                    <div class="flex items-center justify-between">
                                        <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">DETECTED
                                            CODES</h3>
                                        <UButton size="xs" color="primary" variant="ghost" icon="i-heroicons-plus"
                                            label="Add Code" />
                                    </div>

                                    <!-- Code Cards -->
                                    <div v-for="code in detectedCodes" :key="code.code"
                                        class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3 hover:border-teal-200 dark:hover:border-teal-800 transition-colors bg-white dark:bg-gray-900">
                                        <div class="flex items-start justify-between">
                                            <div class="flex items-center gap-2">
                                                <UBadge color="primary" variant="subtle" size="xs" class="font-mono">{{
                                                    code.type }}</UBadge>
                                                <span class="font-bold text-gray-900 dark:text-white text-lg">{{
                                                    code.code }}</span>
                                            </div>
                                            <UBadge :color="getMatchColor(code.match)" variant="subtle" size="xs">{{
                                                code.match }}% Match</UBadge>
                                        </div>

                                        <p class="text-sm text-gray-600 dark:text-gray-300">{{ code.description }}</p>

                                        <div class="flex items-center gap-2 pt-1">
                                            <UButton flex-1 block color="neutral" variant="soft" size="xs"
                                                class="flex-1 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                                                Accept</UButton>
                                            <UButton flex-1 block color="neutral" variant="ghost" size="xs"
                                                class="flex-1">
                                                Edit</UButton>
                                            <UButton icon="i-heroicons-information-circle" color="neutral"
                                                variant="ghost" size="xs" class="rounded-full" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Documentation Gaps Section -->
                                <div class="space-y-3">
                                    <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Documentation
                                        Gaps</h3>
                                    <div
                                        class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 space-y-3 border border-orange-100 dark:border-orange-800/50">
                                        <div v-for="(gap, index) in gaps" :key="index" class="flex items-start gap-2.5">
                                            <UIcon name="i-heroicons-exclamation-circle"
                                                class="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                            <span class="text-sm text-gray-700 dark:text-gray-300">{{ gap }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <template #audit>
                            <div class="p-4 text-center text-gray-500 py-12">
                                No audit logs available.
                            </div>
                        </template>
                    </UTabs>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Ensure the textarea area feels like a document */
textarea:focus {
    outline: none;
}
</style>