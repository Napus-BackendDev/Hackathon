<script setup lang="ts">
import { doctorItems } from '@/assets/sidebar-items'
const items = doctorItems

</script>

<template>
    <UDashboardSidebar collapsible resizable
        class="border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <template #header="{ collapsed }">
            <div class="flex items-center gap-3 px-2 w-full" :class="{ 'justify-center': collapsed }">
                <div class="relative flex items-center justify-center w-8 h-8 shrink-0">
                    <UIcon name="i-heroicons-chart-bar-square" class="w-8 h-8 text-teal-700" />
                </div>
                <span v-if="!collapsed" class="text-xl font-bold text-gray-900 dark:text-white truncate">NextMed</span>
            </div>
        </template>

        <template #default="{ collapsed }">
            <div v-if="!collapsed" class="px-2 mt-2">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">CLINICAL</p>
            </div>

            <UNavigationMenu :items="items" orientation="vertical" />
        </template>

        <template #footer="{ collapsed }">
            <div class="flex flex-col gap-4 w-full">
                <!-- User Profile -->
                <div class="flex items-center gap-3 px-2" :class="{ 'justify-center': collapsed }">
                    <UAvatar src="https://i.pravatar.cc/150?u=nextmed_demo" alt="Dr. Emily Stones" size="md"
                        class="ring-2 ring-white shrink-0" />
                    <div v-if="!collapsed" class="flex flex-col overflow-hidden">
                        <span class="text-sm font-semibold text-gray-900 dark:text-white leading-none truncate">Dr.
                            Emily Stones</span>
                        <span class="text-xs text-gray-500 mt-1 truncate">Doctor</span>
                    </div>
                </div>

                <!-- Sign Out Button -->
                <UButton variant="ghost" color="error" to="/" :block="!collapsed"
                    class="justify-start gap-3 px-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    :class="{ 'justify-center px-0': collapsed }">
                    <template #leading>
                        <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-5 h-5 shrink-0" />
                    </template>
                    <span v-if="!collapsed">Sign Out</span>
                </UButton>
            </div>
        </template>
    </UDashboardSidebar>
</template>
