<script setup lang="ts">
definePageMeta({
    layout: false
})

const roles = [
    {
        title: 'Doctor',
        description: 'View patient history, clinical notes, and coding status.',
        icon: 'i-heroicons-user-plus',
        color: 'text-teal-700',
        bg: 'bg-teal-50',
        iconBg: 'bg-teal-600',
        to: '/doctor'
    },
    {
        title: 'Medical Coder',
        description: 'Code records, manage system, and configure AI.',
        icon: 'i-heroicons-command-line',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        iconBg: 'bg-emerald-500',
        to: '/coder'
    },
    {
        title: 'Patient',
        description: 'Access your personal health records and billing info.',
        icon: 'i-heroicons-user',
        color: 'text-slate-700',
        bg: 'bg-slate-50',
        iconBg: 'bg-slate-700',
        to: '/patient'
    }
]
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div class="w-full max-w-5xl space-y-12 text-center">

            <!-- Header Section -->
            <div class="space-y-4">
                <h1 class="text-5xl font-extrabold text-slate-900 tracking-tight">NextMed</h1>
                <p class="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    The Intelligent Trace. Clinical documentation to coding,<br class="hidden sm:block" />
                    verified by humans.
                </p>
            </div>

            <!-- Role Selection Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-0">
                <NuxtLink v-for="role in roles" :key="role.title" :to="role.to"
                    class="group relative flex flex-col items-start p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 text-left cursor-pointer">
                    <div
                        :class="[role.iconBg, 'p-3 rounded-lg mb-6 transition-transform group-hover:scale-110 duration-300']">
                        <UIcon :name="role.icon" class="w-8 h-8 text-white" />
                    </div>

                    <h3 class="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
                        {{ role.title }}
                    </h3>

                    <p class="text-slate-500 leading-relaxed text-sm">
                        {{ role.description }}
                    </p>
                </NuxtLink>
            </div>

            <!-- Footer Section -->
            <div class="pt-16 space-y-4 border-t border-gray-50 mt-12">
                <p class="text-xs font-bold text-teal-700 tracking-widest uppercase">
                    Enterprise Grade Security
                </p>
                <div class="text-sm text-gray-400 flex items-center justify-center gap-2">
                    <span>HIPAA Compliant</span>
                    <span>•</span>
                    <span>Audit-First Architecture</span>
                </div>
                <p class="text-xs text-gray-300 mt-8">
                    © 2024 NextMed Systems. Concept: Intelligent Trace.
                </p>
            </div>

        </div>
    </div>
</template>