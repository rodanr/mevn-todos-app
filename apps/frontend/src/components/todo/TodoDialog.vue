<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :modal="true"
    :closable="true"
    :draggable="false"
    class="todo-dialog"
    :style="{ width: '540px' }"
    :showHeader="false"
  >
    <!-- Custom Header -->
    <div class="dialog-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="pi" :class="isEditing ? 'pi-pencil' : 'pi-plus'"></i>
        </div>
        <div class="header-text">
          <h2 class="dialog-title">{{ isEditing ? 'Edit Todo' : 'Create New Todo' }}</h2>
          <p class="dialog-subtitle">
            {{ isEditing ? 'Update your todo details' : 'Add a new task to your list' }}
          </p>
        </div>
      </div>
      <Button icon="pi pi-times" text rounded class="close-btn" @click="handleClose" />
    </div>

    <!-- Form Content -->
    <form @submit.prevent="handleFormSubmit" class="dialog-form">
      <div class="form-grid">
        <div class="form-group">
          <label for="name" class="form-label"> Todo Name <span class="required">*</span> </label>
          <InputText
            id="name"
            v-model="name"
            placeholder="Enter a descriptive name for your todo"
            class="form-input"
            :class="{ 'p-invalid': nameError }"
            maxlength="100"
          />
          <small v-if="nameError" class="form-error">{{ nameError }}</small>
          <small v-else class="form-hint">{{ name?.length || 0 }}/100 characters</small>
        </div>

        <div class="form-group">
          <label for="description" class="form-label">
            Description <span class="required">*</span>
          </label>
          <Textarea
            id="description"
            v-model="description"
            placeholder="Provide more details about this todo"
            class="form-input"
            :class="{ 'p-invalid': descriptionError }"
            rows="4"
            maxlength="500"
            autoResize
          />
          <small v-if="descriptionError" class="form-error">{{ descriptionError }}</small>
          <small v-else class="form-hint">{{ description?.length || 0 }}/500 characters</small>
        </div>

        <div class="form-group">
          <label for="dueDate" class="form-label">
            Due Date & Time <span class="required">*</span>
          </label>
          <Calendar
            id="dueDate"
            v-model="dueDate"
            :showTime="true"
            :showSeconds="false"
            dateFormat="mm/dd/yy"
            placeholder="Select when this todo is due"
            class="form-input"
            :class="{ 'p-invalid': dueDateError }"
            :minDate="new Date()"
            :showIcon="true"
            iconDisplay="input"
          />
          <small v-if="dueDateError" class="form-error">{{ dueDateError }}</small>
          <small v-else class="form-hint">Choose a future date and time</small>
        </div>

        <div v-if="isEditing" class="form-group completion-group">
          <div class="completion-card">
            <div class="completion-content">
              <div class="completion-text">
                <h4 class="completion-title">Mark as Completed</h4>
                <p class="completion-description">
                  Toggle to mark this todo as completed or pending
                </p>
              </div>
              <div class="completion-toggle-wrapper">
                <div class="custom-toggle" :class="{ active: isDone }" @click="isDone = !isDone">
                  <div class="toggle-slider">
                    <div class="toggle-icon">
                      <i class="pi pi-check" v-if="isDone"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <!-- Footer Actions -->
    <template #footer>
      <div class="dialog-footer">
        <div class="footer-actions">
          <Button
            label="Cancel"
            icon="pi pi-times"
            severity="secondary"
            outlined
            class="cancel-btn"
            @click="handleClose"
            :disabled="isSubmitting"
          />
          <Button
            :label="isEditing ? 'Update Todo' : 'Create Todo'"
            :icon="isEditing ? 'pi pi-check' : 'pi pi-plus'"
            class="submit-btn"
            :loading="isSubmitting"
            @click="handleFormSubmit"
            :disabled="!isFormValid"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useField, useForm } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import type { Todo, CreateTodoInput, UpdateTodoInput } from '@/types'

import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'

interface Props {
  visible: boolean
  todo?: Todo | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'save', data: CreateTodoInput | UpdateTodoInput): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  todo: null,
})

const emit = defineEmits<Emits>()

const isSubmitting = ref(false)

const isEditing = computed(() => !!props.todo)

// Validation schema
const todoSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    description: z.string().min(1, 'Description is required').max(500, 'Description is too long'),
    dueDate: z
      .date({
        required_error: 'Due date is required',
        invalid_type_error: 'Invalid date format',
      })
      .refine((date) => date > new Date(), {
        message: 'Due date must be in the future',
      }),
    isDone: z.boolean().optional(),
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: todoSchema,
})

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: description, errorMessage: descriptionError } = useField<string>('description')
const { value: dueDate, errorMessage: dueDateError } = useField<Date>('dueDate')
const { value: isDone } = useField<boolean>('isDone')

const isFormValid = computed(() => {
  return (
    name.value &&
    description.value &&
    dueDate.value &&
    !nameError.value &&
    !descriptionError.value &&
    !dueDateError.value
  )
})

// Watch for todo prop changes to populate form
watch(
  () => props.todo,
  (newTodo) => {
    if (newTodo) {
      // Populate form with existing todo data
      name.value = newTodo.name
      description.value = newTodo.description
      dueDate.value = new Date(newTodo.dueDate)
      isDone.value = newTodo.isDone
    } else {
      // Reset form for new todo
      resetForm()
      isDone.value = false
    }
  },
  { immediate: true },
)

// Watch visibility to reset form when dialog opens
watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible && !props.todo) {
      nextTick(() => {
        resetForm()
        isDone.value = false
      })
    }
  },
)

const handleFormSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true

  try {
    const todoData = {
      name: values.name,
      description: values.description,
      dueDate: values.dueDate.toISOString(),
      ...(isEditing.value && { isDone: values.isDone }),
    }

    emit('save', todoData)
  } finally {
    isSubmitting.value = false
  }
})

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.todo-dialog :deep(.p-dialog) {
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.todo-dialog :deep(.p-dialog-content) {
  padding: 0;
  border-radius: 0 0 20px 20px;
}

.todo-dialog :deep(.p-dialog-footer) {
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

/* Custom Header */
.dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
  gap: 1rem;
  position: relative;
}

.dialog-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #5a6d82 0%, #667c9a 50%, #5a6d82 100%);
  background-size: 200% 100%;
  animation: headerGradientShift 3s ease-in-out infinite;
}

@keyframes headerGradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #5a6d82 0%, #667c9a 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow:
    0 8px 25px rgba(90, 109, 130, 0.3),
    0 4px 12px rgba(102, 124, 154, 0.2);
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      0 8px 25px rgba(90, 109, 130, 0.3),
      0 4px 12px rgba(102, 124, 154, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow:
      0 10px 30px rgba(90, 109, 130, 0.4),
      0 6px 16px rgba(102, 124, 154, 0.3);
  }
}

.header-text {
  flex: 1;
  min-width: 0;
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.025em;
}

.dialog-subtitle {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

.close-btn {
  width: 40px;
  height: 40px;
  color: #64748b;
  flex-shrink: 0;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(248, 250, 252, 0.8);
  color: #374151;
  transform: scale(1.1);
}

/* Form Content */
.dialog-form {
  padding: 2rem;
  background: linear-gradient(145deg, #ffffff 0%, #fafbfc 100%);
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required {
  color: #ef4444;
  font-weight: 700;
}

.form-input :deep(.p-inputtext),
.form-input :deep(.p-inputtextarea),
.form-input :deep(.p-calendar-input) {
  height: 48px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #ffffff;
  padding: 0 1rem;
  font-family: inherit;
}

.form-input :deep(.p-inputtextarea) {
  height: auto;
  min-height: 96px;
  padding: 0.75rem 1rem;
  resize: vertical;
  line-height: 1.5;
}

.form-input :deep(.p-inputtext):focus,
.form-input :deep(.p-inputtextarea):focus,
.form-input :deep(.p-calendar-input):focus {
  border-color: #5a6d82;
  box-shadow: 0 0 0 3px rgba(90, 109, 130, 0.1);
  transform: translateY(-1px);
}

.form-input :deep(.p-invalid) {
  border-color: #ef4444;
  background: #fef2f2;
}

.form-input :deep(.p-invalid):focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input :deep(.p-calendar) {
  width: 100%;
}

.form-input :deep(.p-calendar .p-inputtext) {
  width: 100%;
}

.form-error {
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.form-error::before {
  content: '⚠';
  font-size: 0.75rem;
}

.form-hint {
  color: #94a3b8;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Completion Group */
.completion-group {
  margin-top: 0.5rem;
}

.completion-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%);
  border: 2px solid #e0f2fe;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.completion-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
}

.completion-card:hover {
  border-color: #bae6fd;
  background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);
}

.completion-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
}

.completion-text {
  flex: 1;
  text-align: left;
}

.completion-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.completion-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.completion-toggle-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-toggle {
  width: 48px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
}

.custom-toggle.active {
  background: #22c55e;
}

.toggle-slider {
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s ease;
}

.custom-toggle.active .toggle-slider {
  transform: translateX(24px);
}

.toggle-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #ffffff;
}

/* Footer */
.dialog-footer {
  padding: 1.5rem 2rem 2rem 2rem;
  background: #ffffff;
  border-top: 1px solid #f1f5f9;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  width: 100% !important;
}

.footer-actions {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 1rem;
  width: auto !important;
  margin: 0 auto !important;
  flex-direction: row !important;
}

.cancel-btn,
.submit-btn {
  height: 48px;
  padding: 0 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Override any PrimeVue default footer styles with maximum specificity */
.todo-dialog :deep(.p-dialog-footer) {
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  text-align: center !important;
  flex-direction: column !important;
}

/* Force center alignment on all footer children */
.todo-dialog :deep(.p-dialog-footer > *) {
  margin: 0 auto !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

/* Additional override for any potential button containers */
.todo-dialog :deep(.p-dialog-footer .p-button-group),
.todo-dialog :deep(.p-dialog-footer .footer-actions),
.todo-dialog :deep(.p-dialog-footer > div) {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  margin: 0 auto !important;
  width: auto !important;
}

/* Responsive */
@media (max-width: 600px) {
  .todo-dialog :deep(.p-dialog) {
    width: 95vw !important;
    max-width: none !important;
    margin: 1rem;
  }

  .dialog-header {
    padding: 1.5rem;
  }

  .header-content {
    gap: 0.75rem;
  }

  .header-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .dialog-title {
    font-size: 1.25rem;
  }

  .dialog-form {
    padding: 1.5rem;
  }

  .dialog-footer {
    padding: 1rem 1.5rem 1.5rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .footer-actions {
    flex-direction: row;
    gap: 0.75rem;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .cancel-btn,
  .submit-btn {
    flex: 1;
    justify-content: center;
    align-items: center;
    max-width: none;
    height: 48px;
  }

  .completion-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
  }

  .completion-text {
    flex: 1;
    text-align: left;
  }

  .completion-title {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }

  .completion-description {
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .completion-toggle-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custom-toggle {
    width: 40px;
    height: 20px;
  }

  .toggle-slider {
    width: 16px;
    height: 16px;
  }

  .custom-toggle.active .toggle-slider {
    transform: translateX(20px);
  }
}

/* Extra small mobile devices */
@media (max-width: 480px) {
  .dialog-header {
    padding: 0.875rem 1rem;
  }

  .header-icon {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }

  .dialog-title {
    font-size: 1rem;
  }

  .dialog-subtitle {
    font-size: 0.75rem;
  }

  .close-btn {
    width: 32px;
    height: 32px;
  }

  .dialog-form {
    padding: 1rem;
  }

  .form-grid {
    gap: 1rem;
  }

  .form-input :deep(.p-inputtext),
  .form-input :deep(.p-calendar-input) {
    height: 48px !important;
    font-size: 0.9rem;
  }

  .form-input :deep(.p-inputtextarea) {
    min-height: 88px !important;
    font-size: 0.9rem;
  }

  .completion-card {
    padding: 1rem;
  }

  .completion-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
  }

  .completion-text {
    flex: 1;
    text-align: left;
  }

  .completion-title {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }

  .completion-description {
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .completion-toggle-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custom-toggle {
    width: 40px;
    height: 20px;
  }

  .toggle-slider {
    width: 16px;
    height: 16px;
  }

  .custom-toggle.active .toggle-slider {
    transform: translateX(20px);
  }

  .dialog-footer {
    padding: 0.875rem 1rem 1rem 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cancel-btn,
  .submit-btn {
    height: 48px;
    font-size: 0.9rem;
    flex: 1;
    justify-content: center;
    align-items: center;
  }

  .footer-actions {
    flex-direction: row;
    gap: 0.75rem;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
}

/* Landscape mode adjustments for small screens */
@media (max-width: 768px) and (orientation: landscape) {
  .todo-dialog :deep(.p-dialog) {
    height: 100vh !important;
  }

  .todo-dialog :deep(.p-dialog-content) {
    height: calc(100vh - 140px);
  }

  .dialog-header {
    padding: 0.75rem 1.25rem;
  }

  .header-icon {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }

  .dialog-title {
    font-size: 1rem;
  }

  .dialog-subtitle {
    display: none;
  }

  .dialog-form {
    padding: 1rem 1.25rem;
  }

  .form-grid {
    gap: 1rem;
  }

  .completion-card {
    padding: 1rem;
  }

  .completion-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
  }

  .completion-text {
    flex: 1;
    text-align: left;
  }

  .completion-title {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
    line-height: 1.3;
  }

  .completion-description {
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .completion-toggle-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custom-toggle {
    width: 40px;
    height: 20px;
  }

  .toggle-slider {
    width: 16px;
    height: 16px;
  }

  .custom-toggle.active .toggle-slider {
    transform: translateX(20px);
  }

  .dialog-footer {
    padding: 0.75rem 1.25rem 1rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .footer-actions {
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .cancel-btn,
  .submit-btn {
    flex: 1;
    height: 44px;
    justify-content: center;
    align-items: center;
  }
}
</style>
