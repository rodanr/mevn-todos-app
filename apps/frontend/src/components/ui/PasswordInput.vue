<template>
  <div class="password-input-wrapper">
    <input
      :id="id"
      :type="showPassword ? 'text' : 'password'"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :class="[
        'password-input',
        {
          'password-input--invalid': invalid,
          'password-input--disabled': disabled,
        },
      ]"
    />
    <button
      type="button"
      class="password-toggle"
      @click="togglePassword"
      :disabled="disabled"
      :tabindex="-1"
    >
      <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue?: string
  id?: string
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  autocomplete?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  invalid: false,
  autocomplete: 'current-password',
})

defineEmits<Emits>()

const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  width: 100%;
  height: 48px;
  padding: 0 3rem 0 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  background: #ffffff;
  transition: all 0.2s ease;
  outline: none;
}

.password-input:focus {
  border-color: #5a6d82;
  box-shadow: 0 0 0 3px rgba(90, 109, 130, 0.1);
}

.password-input--invalid {
  border-color: #ef4444;
}

.password-input--invalid:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.password-input--disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.password-toggle:hover:not(:disabled) {
  color: #374151;
  background-color: #f3f4f6;
}

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.password-toggle i {
  font-size: 1rem;
}
</style>
