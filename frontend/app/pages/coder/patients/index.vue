<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

definePageMeta({
    layout: 'coder',
    title: 'Patient Records'
})

const search = ref('')

type PatientData = {
    id: number
    name: string
    department: string
    mrn: string
    date: string
    provider: string
    status: 'PENDING' | 'COMPLETED' | 'FLAGGED'
}

const data = ref<PatientData[]>([
    {
        id: 1,
        name: 'James Wilson',
        department: 'Cardiology',
        mrn: 'MRN-882190',
        date: 'Oct 15, 2023',
        provider: 'Dr. Emily Stones',
        status: 'PENDING'
    },
    {
        id: 2,
        name: 'Sarah Miller',
        department: 'Orthopedics',
        mrn: 'MRN-129334',
        date: 'Oct 14, 2023',
        provider: 'Dr. Alan Grant',
        status: 'COMPLETED'
    },
    {
        id: 3,
        name: 'Robert Fox',
        department: 'Internal Medicine',
        mrn: 'MRN-992101',
        date: 'Oct 16, 2023',
        provider: 'Dr. Lisa Cuddy',
        status: 'FLAGGED'
    }
])

const getStatusColor = (status: string) => {
    switch (status) {
        case 'PENDING': return 'warning'
        case 'COMPLETED': return 'primary'
        case 'FLAGGED': return 'error'
        default: return 'neutral'
    }
}

const columns: TableColumn<PatientData>[] = [
    {
        accessorKey: 'name',
        header: 'PATIENT',
        cell: ({ row }) => h('div', { class: 'flex flex-col' }, [
            h('span', { class: 'font-bold text-gray-900 dark:text-white' }, row.original.name),
            h('span', { class: 'text-xs text-gray-500' }, row.original.department)
        ])
    },
    {
        accessorKey: 'mrn',
        header: 'MRN',
        cell: ({ row }) => row.original.mrn
    },
    {
        accessorKey: 'date',
        header: 'DATE OF SERVICE',
        cell: ({ row }) => row.original.date
    },
    {
        accessorKey: 'provider',
        header: 'PROVIDER',
        cell: ({ row }) => row.original.provider
    },
    {
        accessorKey: 'status',
        header: 'STATUS',
        cell: ({ row }) => {
            const status = row.original.status
            return h(UBadge, {
                color: getStatusColor(status),
                variant: 'subtle',
                class: 'rounded-full',
                size: 'lg'
            }, () => status)
        }
    },
    {
        id: 'actions',
        key: 'actions',
        header: 'ACTION',
        cell: ({ row }) => h(UButton, {
            variant: 'link',
            color: 'primary',
            padded: false,
            to: `/coder/patients/${row.original.id}`
        }, () => 'Open >')
    }
]

const fileInput = ref<any>(null)

const triggerFileInput = () => {
    fileInput.value?.input?.click()
}

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        const file = target.files[0]
        console.log('File selected:', file.name)
    }
}
</script>

<template>
    <UCard>
        <template #header>
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div class="w-1/2">
                    <UInput v-model="search" icon="i-heroicons-magnifying-glass"
                        placeholder="Search by Patient Name or MRN..." size="lg" />
                </div>

                <div class="flex items-center gap-3 w-full sm:w-auto">
                    <UInput ref="fileInput" type="file" class="hidden" accept=".csv,.xlsx,.xls"
                        @change="handleFileUpload" />
                    <UButton icon="i-heroicons-arrow-up-tray" color="primary" label="Upload Records"
                        @click="triggerFileInput" />
                </div>
            </div>
        </template>

        <UTable :data="data" :columns="columns" />
    </UCard>
</template>
