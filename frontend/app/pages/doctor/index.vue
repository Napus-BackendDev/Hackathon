<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { storeToRefs } from 'pinia'
import { usePatientsStore, type Patient } from '~/stores/patients'

const UBadge = resolveComponent('UBadge')

const router = useRouter()

const store = usePatientsStore()
const { patients, loading, error } = storeToRefs(store)

// Fetch data on mount
// Fetch data on mount
onMounted(() => {
    store.fetchPatients()
})

watchEffect(() => {
    if (patients.value) {
        console.log('Patients update:', patients.value)
    }
})

const onSelect = (row: any) => {
    const id = row.original ? row.original.id : row.id
    router.push(`/doctor/patients/${id}`)
}

const stats = [
    {
        label: 'My Patients Today',
        value: computed(() => store.todayCount),
        icon: 'i-heroicons-users',
        color: 'text-teal-600',
        bg: 'bg-teal-50',
        iconColor: 'text-teal-600'
    },
    {
        label: 'Pending Notes',
        value: computed(() => store.pendingCount),
        icon: 'i-heroicons-clipboard-document-list',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        iconColor: 'text-amber-600'
    },
    {
        label: 'Codes Reviewed',
        value: computed(() => store.completedCount),
        icon: 'i-heroicons-chart-bar',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        iconColor: 'text-emerald-600'
    },
    {
        label: 'Avg. Visit Time',
        value: '18m',
        icon: 'i-heroicons-clock',
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
        iconColor: 'text-indigo-600'
    }
]

const columns: TableColumn<Patient>[] = [
    {
        id: 'index',
        header: '#',
        cell: ({ row }) => row.index + 1
    },
    {
        accessorKey: 'name',
        header: 'Patient',
        cell: ({ row }) => h('div', { class: 'flex items-center gap-2' }, [
            h('div', { class: `w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${row.original.avatarColor}` }, row.original.initial),
            h('div', {}, [
                h('div', { class: 'text-teal-600 dark:text-teal-400 font-bold' }, row.original.name),
                h('div', { class: 'text-xs text-gray-500' }, `${row.original.age} yrs • ${row.original.sex}`)
            ])
        ])
    },
    {
        accessorKey: 'mrn',
        header: 'MRN / AN',
        cell: ({ row }) => h('div', {}, [
            h('div', { class: 'font-medium' }, row.original.mrn),
            h('div', { class: 'text-xs text-gray-400' }, `AN: ${row.original.AN}`)
        ])
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => h('div', {}, [
            h('div', { class: 'font-medium' }, row.original.date),
            h('div', { class: 'text-xs text-gray-400' }, row.original.timeadm)
        ])
    },
    {
        accessorKey: 'pre_diagnosis',
        header: 'Diagnosis',
        cell: ({ row }) => h('div', { class: 'max-w-xs truncate', title: row.original.pre_diagnosis }, row.original.pre_diagnosis || row.original.cc)
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
                size: 'xs'
            }, () => status)
        }
    }
]

const getStatusColor = (status: string) => {
    switch (status) {
        case 'In Progress': return 'blue'
        case 'Draft': return 'gray'
        case 'Completed': return 'emerald'
        case 'PENDING': return 'warning'
        case 'FLAGGED': return 'error'
        default: return 'gray'
    }
}

definePageMeta({
    layout: 'doctor',
    title: 'Dashboard'
})
</script>

<template>
    <div class="space-y-8">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <UCard v-for="stat in stats" :key="stat.label">
                <div class="flex justify-between items-center">
                    <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ stat.label }}</span>
                        <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</span>
                    </div>
                    <div :class="[stat.bg, 'p-3 rounded-lg']">
                        <UIcon :name="stat.icon" :class="['w-6 h-6', stat.iconColor]" />
                    </div>
                </div>
            </UCard>
        </div>

        <!-- Recent Patient Encounters -->
        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">Recent Patient Encounters</h2>
            </div>

            <UTable :data="patients" :columns="columns" :loading="loading" class="flex-1 cursor-pointer"
                @select="onSelect" />

        </div>
    </div>
</template>