<script setup lang="ts">
import DashboardNavbar from '../components/DashboardNavbar.vue'
import CoderSidebar from '../components/CoderSidebar.vue'
</script>

<template>
    <UDashboardGroup>
        <CoderSidebar />
        <UDashboardPage class="w-screen">
            <DashboardNavbar />
            <div class="min-h-screen bg-gray-50 p-8">
                <slot />
            </div>
        </UDashboardPage>
    </UDashboardGroup>
</template>
