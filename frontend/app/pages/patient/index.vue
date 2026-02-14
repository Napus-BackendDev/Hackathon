<script setup lang="ts">
definePageMeta({
    layout: 'patient',
    title: 'Overview'
})

const quickLinks = [
    {
        icon: 'i-heroicons-document-text',
        title: 'Medical Records',
        desc: 'Access your history, lab results, and diagnoses.',
        link: 'View Records →',
        to: '/patient/records',
        iconClass: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
        textClass: 'text-emerald-600 dark:text-emerald-400'
    },
    {
        icon: 'i-heroicons-credit-card',
        title: 'Billing & Insurance',
        desc: 'View statements and manage payments.',
        link: 'Manage Billing →',
        to: '/patient/billing',
        iconClass: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
        textClass: 'text-emerald-600 dark:text-emerald-400'
    },
    {
        icon: 'i-heroicons-chart-bar',
        title: 'Health Vitals',
        desc: 'Track your blood pressure, weight, and more.',
        link: 'View Trends →',
        to: '/patient/vitals',
        iconClass: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
        textClass: 'text-purple-600 dark:text-purple-400'
    }
]

const timeline = [
    {
        title: 'Cardiology Consultation',
        date: 'Oct 15, 2023',
        provider: 'Dr. Emily Stones',
        desc: 'Follow-up for chest pain. ECG performed.',
        color: 'emerald'
    },
    {
        title: 'Lab Results Available',
        date: 'Oct 14, 2023',
        provider: '',
        desc: 'Complete Blood Count (CBC) results are ready.',
        color: 'gray'
    }
]
</script>

<template>
    <div class="space-y-6">
        <!-- Welcome Banner -->
        <div class="relative overflow-hidden bg-emerald-600 rounded-2xl p-8 text-white shadow-lg">
            <div class="relative z-10">
                <h1 class="text-3xl font-bold mb-2">Welcome back, James!</h1>
                <p class="text-emerald-50 mb-6">Your next appointment is scheduled for Oct 24, 2023 with Dr. Emily
                    Stones.</p>
                <UButton color="neutral" variant="outline" label="View Appointment Details"
                    class="text-emerald-600 font-bold" />
            </div>

            <!-- Decorative Circles -->
            <div class="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/30 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 right-20 -mb-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl"></div>
        </div>

        <!-- Quick Links Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UCard v-for="item in quickLinks" :key="item.title" class="hover:shadow-md transition-shadow">
                <div class="flex flex-col h-full justify-between gap-4">
                    <div>
                        <div :class="['w-10 h-10 rounded-lg flex items-center justify-center mb-4', item.iconClass]">
                            <UIcon :name="item.icon" class="w-6 h-6" />
                        </div>
                        <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-1">{{ item.title }}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.desc }}</p>
                    </div>
                    <div>
                        <UButton :to="item.to" variant="link" :padded="false"
                            :class="['font-bold text-sm', item.textClass]">
                            {{ item.link }}
                        </UButton>
                    </div>
                </div>
            </UCard>
        </div>

        <!-- Recent Timeline -->
        <UCard class="mb-10">
            <template #header>
                <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-calendar" class="w-5 h-5 text-emerald-600" />
                    <h3 class="font-bold text-lg text-gray-900 dark:text-white">Recent Timeline</h3>
                </div>
            </template>

            <div class="relative pl-4 space-y-8 ml-2">
                <!-- Vertical Line -->
                <div class="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

                <div v-for="(event, index) in timeline" :key="index" class="relative pl-6">
                    <!-- Dot -->
                    <div class="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900"
                        :class="event.color === 'emerald' ? 'bg-emerald-500' : 'bg-gray-300'"></div>

                    <div>
                        <h4 class="font-bold text-gray-900 dark:text-white text-base">{{ event.title }}</h4>
                        <div class="text-xs text-gray-500 mt-1 mb-3 flex items-center gap-2">
                            <span>{{ event.date }}</span>
                            <span v-if="event.provider">•</span>
                            <span v-if="event.provider">{{ event.provider }}</span>
                        </div>

                        <div
                            class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800">
                            {{ event.desc }}
                        </div>
                    </div>
                </div>
            </div>
        </UCard>
    </div>
</template>
