<script setup lang="ts">
definePageMeta({
    layout: 'coder',
    title: 'Dashboard'
})

import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
const UBadge = resolveComponent('UBadge')


type Data = {
    id: number
    patient: string
    mrn: string
    date: string
    diagnosis: string
    status: 'PENDING' | 'COMPLETED' | 'FLAGGED'
}



const stats = [
    {
        label: 'Pending Records',
        value: '1',
        desc: 'Assigned to you today',
        icon: 'i-heroicons-document',
        color: 'amber', // Yellowish
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-600 dark:text-amber-400'
    },
    {
        label: 'Completed',
        value: '1',
        desc: '+12% from yesterday',
        icon: 'i-heroicons-check-circle',
        color: 'emerald', // Greenish
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        text: 'text-emerald-600 dark:text-emerald-400'
    },
    {
        label: 'Flagged',
        value: '1',
        desc: 'Requires supervisor attention',
        icon: 'i-heroicons-flag',
        color: 'red',
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-600 dark:text-red-400'
    },
    {
        label: 'Accuracy Rate',
        value: '98.5%',
        desc: 'Based on supervisor reviews',
        icon: 'i-heroicons-chart-bar',
        color: 'emerald',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        text: 'text-emerald-600 dark:text-emerald-400'
    }
]

const data = ref<Data[]>([
    {
        id: 1,
        patient: 'John Doe',
        mrn: 'MRN-882190',
        date: '2023-10-15',
        diagnosis: 'Patient presents with chest pain radiating to left...',
        status: 'PENDING'
    },
    {
        id: 2,
        patient: 'Sarah Miller',
        mrn: 'MRN-129334',
        date: '2023-10-14',
        diagnosis: 'Patient fell from ladder. X-ray confirms distal ra...',
        status: 'COMPLETED'
    },
    {
        id: 3,
        patient: 'Robert Fox',
        mrn: 'MRN-992101',
        date: '2023-10-16',
        diagnosis: 'Patient complains of persistent cough and fever fo...',
        status: 'FLAGGED'
    }
])


const columns: TableColumn<Data>[] = [
    {
        id: 'index',
        header: '#',
        cell: ({ row }) => row.index + 1
    },
    {
        accessorKey: 'patient',
        header: 'Patient',
    },
    {
        accessorKey: 'mrn',
        header: 'MRN',
        cell: ({ row }) => row.original.mrn
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => row.original.date
    },
    {
        accessorKey: 'diagnosis',
        header: 'Diagnosis',
        cell: ({ row }) => row.original.diagnosis
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.status
            return h(UBadge, {
                color: getStatusColor(status),
                variant: 'subtle',
                class: 'rounded-full',
                size: 'lg'
            }, () => status)
        }
    }
]

const getStatusColor = (status: string) => {
    switch (status) {
        case 'PENDING': return 'warning'
        case 'COMPLETED': return 'primary'
        case 'FLAGGED': return 'error'
        default: return 'neutral'
    }
}
</script>

<template>
    <div class="space-y-6">
        <!-- Top Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <UCard v-for="stat in stats" :key="stat.label">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
                        <h3 class="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{{ stat.value }}</h3>
                        <p class="text-xs text-gray-500 mt-2">{{ stat.desc }}</p>
                    </div>
                    <div :class="['p-2 rounded-lg', stat.bg]">
                        <UIcon :name="stat.icon" class="w-6 h-6" :class="stat.text" />
                    </div>
                </div>
            </UCard>
        </div>

        <div class="">
            <!-- Recent Activity (2/3) -->
            <UCard>
                <template #header>
                    <h3 class="font-bold text-lg text-gray-900 dark:text-white">Recent Activity</h3>
                </template>

                <UTable :data="data" :columns="columns" />
            </UCard>
        </div>
    </div>
</template>
