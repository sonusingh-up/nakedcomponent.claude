<script setup lang="ts">
import type { FreezeBank } from '~/types'

const props = defineProps<{
  bank: FreezeBank | null
}>()

const d = new Date()
const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const baseUsed = computed(() => props.bank?.base_used ?? 0)
const bonusEarned = computed(() => props.bank?.bonus_earned ?? false)
const bonusUsed = computed(() => props.bank?.bonus_used ?? false)
</script>

<template>
  <div class="rounded-[14px] bg-[#0d0d0d] p-3 border border-[#222]">
    <div class="flex justify-between items-center mb-2.5">
      <span class="text-[13px] font-medium text-[#aaa]">Streak protection</span>
      <span class="text-[11px] text-[#444]">Resets {{ nextMonth }}</span>
    </div>
    
    <div class="flex gap-2 mb-2.5">
      <!-- Slot 1 -->
      <div v-if="baseUsed < 1" class="flex-1 bg-[#0c1929] border border-[#1a3a5f] rounded-[10px] p-2.5 text-center">
        <UIcon name="i-lucide-snowflake" class="size-[22px] text-blue-400" />
        <div class="text-blue-400 text-[11px] mt-1 font-medium">Ready</div>
      </div>
      <div v-else class="flex-1 bg-[#151515] border border-[#222] rounded-[10px] p-2.5 text-center opacity-45">
        <UIcon name="i-lucide-snowflake" class="size-[22px] text-[#555]" />
        <div class="text-[#555] text-[11px] mt-1">Used</div>
      </div>

      <!-- Slot 2 -->
      <div v-if="baseUsed < 2" class="flex-1 bg-[#0c1929] border border-[#1a3a5f] rounded-[10px] p-2.5 text-center">
        <UIcon name="i-lucide-snowflake" class="size-[22px] text-blue-400" />
        <div class="text-blue-400 text-[11px] mt-1 font-medium">Ready</div>
      </div>
      <div v-else class="flex-1 bg-[#151515] border border-[#222] rounded-[10px] p-2.5 text-center opacity-45">
        <UIcon name="i-lucide-snowflake" class="size-[22px] text-[#555]" />
        <div class="text-[#555] text-[11px] mt-1">Used</div>
      </div>

      <!-- Bonus Slot -->
      <div v-if="!bonusEarned" class="flex-1 bg-[#121a12] border border-[#1e3a1e] rounded-[10px] p-2.5 text-center">
        <UIcon name="i-lucide-lock" class="size-[22px] text-green-400" />
        <div class="text-green-400 text-[11px] mt-1">+1 earnable</div>
      </div>
      <div v-else-if="!bonusUsed" class="flex-1 bg-[#0c1929] border border-[#1a3a5f] rounded-[10px] p-2.5 text-center">
        <UIcon name="i-lucide-snowflake" class="size-[22px] text-blue-400" />
        <div class="text-blue-400 text-[11px] mt-1 font-medium">Bonus</div>
      </div>
      <div v-else class="flex-1 bg-[#151515] border border-[#222] rounded-[10px] p-2.5 text-center opacity-45">
        <UIcon name="i-lucide-snowflake" class="size-[22px] text-[#555]" />
        <div class="text-[#555] text-[11px] mt-1">Used</div>
      </div>
    </div>
    
    <div v-if="baseUsed === 2 && bonusUsed" class="bg-[#1a1010] border border-[#3a1a1a] rounded-lg px-2.5 py-2 flex items-center gap-1.5">
      <UIcon name="i-lucide-calendar" class="size-[13px] text-[#777]" />
      <span class="text-[#666] text-[11px]">No freezes left. Bank refills on {{ nextMonth }}.</span>
    </div>
    <div v-else-if="bonusEarned" class="bg-[#111] rounded-lg px-2.5 py-2 flex items-center gap-1.5">
      <UIcon name="i-lucide-trophy" class="size-[13px] text-green-400" />
      <span class="text-green-400 text-[11px]">Bonus freeze unlocked!</span>
    </div>
    <div v-else class="bg-[#111] rounded-lg px-2.5 py-2 flex items-center gap-1.5">
      <UIcon name="i-lucide-info" class="size-[13px] text-green-400 shrink-0" />
      <span class="text-[#555] text-[11px] leading-relaxed">7-day streak on any habit unlocks the bonus slot this month</span>
    </div>
  </div>
</template>
