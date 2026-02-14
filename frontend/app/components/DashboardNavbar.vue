<script setup lang="ts">
const route = useRoute()

// Format date: "Saturday, February 14, 2026"
const currentDate = computed(() => {
    const date = new Date()
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })
})

const pageTitle = computed(() => {
    return route.meta.title || 'Dashboard'
})

const portalLabel = computed(() => {
    if (route.path.includes('/coder')) {
        return 'ADMIN ACCESS'
    }
    if (route.path.includes('/patient')) {
        return 'PATIENT PORTAL'
    }
    return 'PROVIDER PORTAL'
})
</script>

<template>
    <UDashboardNavbar>
        <template #title>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ pageTitle }}
            </h1>
        </template>

        <template #right>
            <div class="flex items-center gap-4">
                <div class="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    {{ portalLabel }}
                </div>
            </div>
        </template>
    </UDashboardNavbar>
</template>
