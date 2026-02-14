<script setup lang="ts">
import { h, resolveComponent, ref } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')


definePageMeta({
    layout: 'doctor',
    title: 'My Patients'
})

type PatientData = {
    id: number
    name: string
    mrn: string
    initial: string
    avatarColor: string
    age: number
    gender: string
    department: string
    date: string
    status: string
    statusColor: string
    aiScore: number
    aiLabel: string
    aiLabelColor: string
}

const patients = ref<PatientData[]>([
    {
        id: 1,
        name: 'Sarah Jenkins',
        mrn: 'MRN-88231',
        initial: 'S',
        avatarColor: 'bg-emerald-100 text-emerald-600',
        age: 42,
        gender: 'F',
        department: 'Neurology',
        date: 'Oct 12, 2024',
        status: 'In Progress',
        statusColor: 'primary',
        aiScore: 92,
        aiLabel: 'High Confidence',
        aiLabelColor: 'emerald'
    },
    {
        id: 2,
        name: 'Michael Chen',
        mrn: 'MRN-99102',
        initial: 'M',
        avatarColor: 'bg-blue-100 text-blue-600',
        age: 35,
        gender: 'M',
        department: 'Orthopedics',
        date: 'Oct 12, 2024',
        status: 'Draft',
        statusColor: 'gray',
        aiScore: 65,
        aiLabel: 'Needs Details',
        aiLabelColor: 'orange'
    },
    {
        id: 3,
        name: 'Emma Wilson',
        mrn: 'MRN-77291',
        initial: 'E',
        avatarColor: 'bg-purple-100 text-purple-600',
        age: 28,
        gender: 'F',
        department: 'General Medicine',
        date: 'Oct 11, 2024',
        status: 'Completed',
        statusColor: 'emerald',
        aiScore: 98,
        aiLabel: 'High Confidence',
        aiLabelColor: 'emerald'
    },
    {
        id: 4,
        name: 'James Rodriguez',
        mrn: 'MRN-66321',
        initial: 'J',
        avatarColor: 'bg-amber-100 text-amber-600',
        age: 55,
        gender: 'M',
        department: 'Cardiology',
        date: 'Oct 11, 2024',
        status: 'Draft',
        statusColor: 'gray',
        aiScore: 78,
        aiLabel: 'AI Ready',
        aiLabelColor: 'amber'
    },
    {
        id: 5,
        name: 'Linda Kim',
        mrn: 'MRN-44512',
        initial: 'L',
        avatarColor: 'bg-rose-100 text-rose-600',
        age: 62,
        gender: 'F',
        department: 'Internal Medicine',
        date: 'Oct 10, 2024',
        status: 'Completed',
        statusColor: 'emerald',
        aiScore: 88,
        aiLabel: 'AI Ready',
        aiLabelColor: 'amber'
    }
])

const getStatusBadgeColor = (status: string) => {
    switch (status) {
        case 'In Progress': return 'blue'
        case 'Draft': return 'gray'
        case 'Completed': return 'emerald'
        default: return 'gray'
    }
}

const getProgressBarColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500'
    if (score >= 70) return 'bg-amber-500'
    return 'bg-orange-500'
}

const columns: TableColumn<PatientData>[] = [
    {
        accessorKey: 'patient',
        header: 'PATIENT / MRN',
        cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
            h('div', {
                class: `flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shrink-0 ${row.original.avatarColor}`
            }, row.original.initial),
            h('div', {}, [
                h('div', { class: 'font-bold text-gray-900 dark:text-white' }, row.original.name),
                h('div', { class: 'text-xs text-gray-500' }, row.original.mrn)
            ])
        ])
    },
    {
        accessorKey: 'demographics',
        header: 'DEMOGRAPHICS',
        cell: ({ row }) => h('span', { class: 'text-gray-700 dark:text-gray-300' }, `${row.original.age} yrs • ${row.original.gender}`)
    },
    {
        accessorKey: 'visit',
        header: 'VISIT',
        cell: ({ row }) => h('div', {}, [
            h('div', { class: 'font-bold text-gray-900 dark:text-white' }, row.original.department),
            h('div', { class: 'text-xs text-gray-500' }, row.original.date)
        ])
    },
    {
        accessorKey: 'status',
        header: 'NOTES STATUS',
        cell: ({ row }) => h(UBadge, {
            label: row.original.status,
            variant: 'subtle',
            class: 'rounded-full px-3',
            color: getStatusBadgeColor(row.original.status)
        })
    },
    {
        accessorKey: 'aiQuality',
        header: 'AI QUALITY',
        cell: ({ row }) => h('div', { class: 'w-48' }, [
            h('div', { class: 'flex items-center justify-between mb-1' }, [
                h(UBadge, {
                    label: row.original.aiLabel,
                    variant: 'soft',
                    size: 'xs',
                    color: row.original.aiLabelColor,
                    class: 'rounded-md font-medium'
                }),
                h('span', { class: 'text-xs font-bold text-gray-700 dark:text-gray-300' }, `${row.original.aiScore}%`)
            ]),
            h('div', { class: 'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden' }, [
                h('div', {
                    class: `h-1.5 rounded-full ${getProgressBarColor(row.original.aiScore)}`,
                    style: { width: `${row.original.aiScore}%` }
                })
            ])
        ])
    },
    {
        id: 'actions',
        header: 'ACTIONS',
        cell: ({ row }) => h('div', { class: 'flex justify-end gap-2' }, [
            h(UButton, {
                icon: 'i-heroicons-document-text',
                label: 'Notes',
                color: 'gray',
                variant: 'ghost',
                size: 'xs',
                class: 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
            }),
            h(UButton, {
                icon: 'i-heroicons-clock',
                color: 'gray',
                variant: 'ghost',
                size: 'xs',
                class: 'text-gray-400 hover:text-gray-700',
                padded: false
            })
        ])
    }
]

const search = ref('')
const dateFilter = ref('Today')
</script>

<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Patients</h1>
                <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Patients assigned to you for documentation
                    review.</p>
            </div>

            <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button v-for="label in ['Today', 'This Week', 'Custom']" :key="label" @click="dateFilter = label"
                    class="px-4 py-1.5 text-sm font-medium rounded-md transition-colors"
                    :class="dateFilter === label ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'">
                    {{ label }}
                </button>
            </div>
        </div>

        <!-- Filters -->
        <div
            class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-1 rounded-xl">
            <div class="w-full sm:w-1/3">
                <UInput v-model="search" icon="i-heroicons-magnifying-glass"
                    placeholder="Search by Patient Name or MRN..." size="lg"
                    :ui="{ icon: { trailing: { pointer: '' } } }" class="bg-transparent" variant="none" />
            </div>

            <div class="flex items-center gap-3 w-full sm:w-auto">
                <UButton icon="i-heroicons-funnel" variant="ghost" color="gray" label="Department"
                    trailing-icon="i-heroicons-chevron-down" />
                <UButton icon="i-heroicons-check-circle" variant="ghost" color="gray" label="Status"
                    trailing-icon="i-heroicons-chevron-down" />
            </div>
        </div>

        <!-- Table -->
        <UCard :ui="{ body: { padding: 'p-0 sm:p-0' }, header: { padding: 'p-4 sm:p-6' } }">
            <UTable :data="patients" :columns="columns"
                :ui="{ th: { base: 'uppercase text-xs font-bold text-gray-500 tracking-wider' } }" />
        </UCard>
    </div>
</template>