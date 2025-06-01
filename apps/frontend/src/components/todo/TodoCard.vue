<template>
  <div class="todo-card" :class="{ completed: todo.isDone, overdue: isOverdue }">
    <!-- Card Header -->
    <div class="card-header">
      <div class="status-section">
        <Checkbox
          :model-value="todo.isDone"
          binary
          @change="$emit('toggle', todo)"
          :disabled="isToggling"
          class="todo-checkbox"
        />
        <div class="status-badges">
          <Tag v-if="todo.isDone" value="Completed" severity="success" class="status-tag" />
          <Tag v-else-if="isOverdue" value="Overdue" severity="danger" class="status-tag" />
          <Tag v-else-if="isUpcomingTodo" value="Upcoming" severity="info" class="status-tag" />
        </div>
      </div>

      <div class="action-buttons">
        <Button
          icon="pi pi-pencil"
          size="small"
          text
          rounded
          class="action-btn edit-btn"
          @click="$emit('edit', todo)"
          v-tooltip="'Edit todo'"
        />
        <Button
          icon="pi pi-trash"
          size="small"
          text
          rounded
          class="action-btn delete-btn"
          @click="$emit('delete', todo)"
          v-tooltip="'Delete todo'"
        />
      </div>
    </div>

    <!-- Card Content -->
    <div class="card-content">
      <div class="content-main">
        <h3 class="todo-title" :class="{ 'completed-text': todo.isDone }">
          {{ todo.name }}
        </h3>

        <p class="todo-description" :class="{ 'completed-text': todo.isDone }">
          {{ todo.description }}
        </p>
      </div>

      <div class="todo-meta">
        <div class="due-date">
          <i class="pi pi-calendar meta-icon"></i>
          <span class="meta-text">{{ formatDate(todo.dueDate) }}</span>
        </div>
      </div>
    </div>

    <!-- Card Footer -->
    <div class="card-footer">
      <div class="timestamps">
        <div class="timestamp">
          <i class="pi pi-plus-circle timestamp-icon"></i>
          <span class="timestamp-text">Created {{ formatDate(todo.createdAt) }}</span>
        </div>
        <div class="timestamp">
          <i class="pi pi-pencil timestamp-icon"></i>
          <span class="timestamp-text">Updated {{ formatDate(todo.updatedAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Todo } from '@/types'
import { formatDate, isUpcoming, isOverdue as checkOverdue } from '@/utils/date'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

interface Props {
  todo: Todo
  isToggling?: boolean
}

interface Emits {
  (e: 'edit', todo: Todo): void
  (e: 'delete', todo: Todo): void
  (e: 'toggle', todo: Todo): void
}

const props = withDefaults(defineProps<Props>(), {
  isToggling: false,
})

defineEmits<Emits>()

const isUpcomingTodo = computed(() => isUpcoming(props.todo.dueDate))
const isOverdue = computed(() => checkOverdue(props.todo.dueDate, props.todo.isDone))
</script>

<style scoped>
/* Card Container */
.todo-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 280px;
  width: 100%;
  min-width: 320px;
  max-width: 100%;
}

.todo-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #5a6d82;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease;
}

.todo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.todo-card:hover::before {
  transform: scaleX(1);
}

.todo-card.completed {
  background: #f8fffe;
  border-color: #d1fae5;
}

.todo-card.completed::before {
  background: #22c55e;
  transform: scaleX(1);
}

.todo-card.overdue {
  background: #fef2f2;
  border-color: #fecaca;
}

.todo-card.overdue::before {
  background: #ef4444;
  transform: scaleX(1);
}

/* Card Header */
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 0 1.25rem;
  gap: 1rem;
}

.status-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.todo-checkbox :deep(.p-checkbox-box) {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid #d1d5db;
  transition: all 0.15s ease;
}

.todo-checkbox :deep(.p-checkbox-box):hover {
  border-color: #5a6d82;
}

.todo-checkbox :deep(.p-checkbox-box.p-highlight) {
  background: #22c55e;
  border-color: #22c55e;
}

.status-badges {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.status-tag {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.edit-btn:hover {
  background: #f1f5f9;
  color: #5a6d82;
}

.delete-btn:hover {
  background: #fef2f2;
  color: #ef4444;
}

/* Card Content */
.card-content {
  padding: 1rem 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 140px;
}

.content-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.todo-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
  word-wrap: break-word;
  transition: color 0.15s ease;
  position: relative;
}

.todo-title::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 0;
  height: 1px;
  background: #94a3b8;
  transition: width 0.2s ease;
}

.todo-title.completed-text {
  color: #64748b;
}

.todo-title.completed-text::after {
  width: 100%;
}

.todo-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  word-wrap: break-word;
  transition: color 0.15s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.5rem;
  max-height: 2.5rem;
}

.todo-description.completed-text {
  color: #94a3b8;
}

.todo-meta {
  display: flex;
  align-items: center;
  margin-top: auto;
}

.due-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.meta-icon {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* Card Footer */
.card-footer {
  padding: 0 1.25rem 1.25rem 1.25rem;
  border-top: 1px solid #f1f5f9;
  margin-top: auto;
}

.timestamps {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-top: 0.75rem;
}

.timestamp {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.timestamp-icon {
  font-size: 0.6875rem;
}
</style>
