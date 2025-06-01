<template>
  <div class="todos-view">
    <div class="todos-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">My Todos</h1>
            <p class="page-subtitle">Organize and track your tasks efficiently</p>
          </div>
          <Button
            icon="pi pi-plus"
            label="Add Todo"
            class="add-todo-btn"
            @click="showAddDialog = true"
          />
        </div>
      </div>

      <!-- Filter Section -->
      <div class="filter-section">
        <div class="filter-card">
          <div class="filter-header">
            <i class="pi pi-filter filter-icon"></i>
            <span class="filter-label">Filter todos</span>
          </div>
          <div class="filter-buttons">
            <Button
              :severity="
                !todosStore.currentFilter.isDone && !todosStore.currentFilter.upcoming
                  ? 'primary'
                  : 'secondary'
              "
              :outlined="
                todosStore.currentFilter.isDone !== undefined || todosStore.currentFilter.upcoming
              "
              label="All"
              size="small"
              class="filter-btn"
              @click="todosStore.clearFilter()"
            />
            <Button
              :severity="todosStore.currentFilter.isDone === true ? 'primary' : 'secondary'"
              :outlined="todosStore.currentFilter.isDone !== true"
              label="Completed"
              size="small"
              class="filter-btn"
              @click="todosStore.setFilter({ isDone: true })"
            />
            <Button
              :severity="todosStore.currentFilter.upcoming ? 'primary' : 'secondary'"
              :outlined="!todosStore.currentFilter.upcoming"
              label="Upcoming"
              size="small"
              class="filter-btn"
              @click="todosStore.setFilter({ upcoming: true })"
            />
          </div>
          <div class="filter-info">
            <span class="filter-text">{{ todosStore.filterDisplay }}</span>
            <Badge v-if="totalCount > 0" :value="totalCount" class="filter-count" />
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <!-- Loading State -->
        <div v-if="isLoading && !todos.length" class="loading-state">
          <ProgressSpinner />
          <p class="loading-text">Loading your todos...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <div class="error-content">
            <i class="pi pi-exclamation-triangle error-icon"></i>
            <h3 class="error-title">Unable to load todos</h3>
            <p class="error-message">Please check your connection and try again</p>
            <Button label="Retry" icon="pi pi-refresh" outlined @click="() => refetch()" />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!todos || todos.length === 0" class="empty-state">
          <div class="empty-content">
            <div class="empty-icon">
              <i class="pi pi-inbox"></i>
            </div>
            <h3 class="empty-title">
              {{
                todosStore.currentFilter.isDone !== undefined || todosStore.currentFilter.upcoming
                  ? 'No todos match your filter'
                  : 'No todos yet'
              }}
            </h3>
            <p class="empty-message">
              {{
                todosStore.currentFilter.isDone !== undefined || todosStore.currentFilter.upcoming
                  ? 'Try adjusting your filter to see more todos'
                  : 'Get started by creating your first todo!'
              }}
            </p>
            <Button
              v-if="!todosStore.currentFilter.isDone && !todosStore.currentFilter.upcoming"
              label="Create Your First Todo"
              icon="pi pi-plus"
              class="empty-action-btn"
              @click="showAddDialog = true"
            />
          </div>
        </div>

        <div v-else class="todos-grid">
          <div v-for="todo in todos" :key="todo.id" class="todo-item">
            <TodoCard
              :todo="todo"
              @edit="editTodo"
              @delete="deleteTodoItem"
              @toggle="toggleTodoStatus"
            />
          </div>
        </div>

        <div v-if="totalPages > 1" class="pagination-section">
          <Paginator
            :rows="todosStore.currentFilter.limit || 6"
            :totalRecords="totalCount"
            :first="(currentPage - 1) * (todosStore.currentFilter.limit || 6)"
            @page="handlePageChange"
            :template="{
              '640px': 'PrevPageLink CurrentPageReport NextPageLink',
              '960px': 'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink',
              '1300px':
                'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
              default:
                'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
            }"
            :pageLinkSize="5"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} todos"
            class="todos-paginator"
          />
        </div>
      </div>
    </div>

    <!-- Add/Edit Todo Dialog -->
    <TodoDialog
      v-model:visible="showAddDialog"
      :todo="selectedTodo"
      @save="handleSaveTodo"
      @close="handleCloseDialog"
    />

    <!-- Custom Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="showDeleteDialog"
      :modal="true"
      :closable="false"
      :draggable="false"
      class="delete-confirmation-dialog"
      :style="{ width: '440px' }"
      :showHeader="false"
    >
      <!-- Custom Dialog Content -->
      <div class="delete-dialog-content">
        <!-- Icon and Header -->
        <div class="delete-header">
          <div class="delete-icon">
            <i class="pi pi-trash"></i>
          </div>
          <h3 class="delete-title">Delete Todo</h3>
          <p class="delete-message">
            This action cannot be undone. Are you sure you want to permanently delete this todo?
          </p>
        </div>

        <!-- Todo Preview Card -->
        <div v-if="todoToDelete" class="delete-todo-preview">
          <div class="preview-header">
            <div class="preview-icon">
              <i class="pi pi-file-check"></i>
            </div>
            <div class="preview-info">
              <div class="preview-name">{{ todoToDelete.name }}</div>
              <div class="preview-description">{{ todoToDelete.description }}</div>
            </div>
          </div>
          <div class="preview-meta">
            <div class="preview-date">
              <i class="pi pi-calendar"></i>
              <span>Due {{ formatDate(todoToDelete.dueDate) }}</span>
            </div>
            <div class="preview-status">
              <i class="pi" :class="todoToDelete.isDone ? 'pi-check-circle' : 'pi-clock'"></i>
              <span>{{ todoToDelete.isDone ? 'Completed' : 'Pending' }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="delete-actions">
          <Button
            label="Cancel"
            icon="pi pi-times"
            severity="secondary"
            outlined
            class="delete-cancel-btn"
            @click="cancelDelete"
            :disabled="isDeletingTodo"
          />
          <Button
            label="Delete Forever"
            icon="pi pi-trash"
            severity="danger"
            class="delete-confirm-btn"
            @click="confirmDelete"
            :loading="isDeletingTodo"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useTodos } from '@/composables/useTodos'
import { useTodosStore } from '@/stores/todos'
import { formatDate } from '@/utils/date'
import type { Todo, CreateTodoInput, UpdateTodoInput } from '@/types'

import Button from 'primevue/button'
import Badge from 'primevue/badge'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'
import Paginator from 'primevue/paginator'
import TodoCard from '@/components/todo/TodoCard.vue'
import TodoDialog from '@/components/todo/TodoDialog.vue'

const toast = useToast()
const todosStore = useTodosStore()

const {
  todos,
  totalCount,
  totalPages,
  currentPage,
  isLoading,
  error,
  refetch,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  isCreating,
  isUpdating,
  isDeleting,
} = useTodos()

const showAddDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedTodo = ref<Todo | null>(null)
const todoToDelete = ref<Todo | null>(null)
const isDeletingTodo = ref(false)

// Handle pagination
const handlePageChange = (event: any) => {
  const newPage = event.page + 1 // PrimeVue Paginator is 0-indexed
  const newLimit = event.rows

  // Update limit if it changed
  if (newLimit !== todosStore.currentFilter.limit) {
    todosStore.currentFilter.limit = newLimit
    todosStore.setPage(1) // Reset to first page when changing rows per page
  } else {
    todosStore.setPage(newPage)
  }
}

const editTodo = (todo: Todo) => {
  selectedTodo.value = todo
  showAddDialog.value = true
}

const handleSaveTodo = async (todoData: CreateTodoInput | UpdateTodoInput) => {
  try {
    if (selectedTodo.value) {
      await updateTodo({ id: selectedTodo.value.id, todo: todoData })
    } else {
      await createTodo(todoData as CreateTodoInput)
    }
    handleCloseDialog()
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to save todo. Please try again.',
      life: 5000,
    })
  }
}

const handleCloseDialog = async () => {
  showAddDialog.value = false
  await nextTick()
  selectedTodo.value = null
}

const toggleTodoStatus = async (todo: Todo) => {
  try {
    await toggleTodo({
      id: todo.id,
      isDone: !todo.isDone,
    })
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update todo status',
      life: 3000,
    })
  }
}

const deleteTodoItem = (todo: Todo) => {
  showDeleteDialog.value = true
  todoToDelete.value = todo
}

const confirmDelete = async () => {
  if (!todoToDelete.value) return

  isDeletingTodo.value = true

  try {
    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 400))

    await deleteTodo(todoToDelete.value.id)
    showDeleteDialog.value = false

    toast.add({
      severity: 'success',
      summary: 'Todo Deleted',
      detail: `"${todoToDelete.value.name}" has been deleted successfully`,
      life: 3000,
    })
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Delete Failed',
      detail: 'Failed to delete todo. Please try again.',
      life: 5000,
    })
  } finally {
    isDeletingTodo.value = false
    todoToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteDialog.value = false
  todoToDelete.value = null
}
</script>

<style scoped>
.todos-view {
  min-height: calc(100vh - 70px);
  background: #f8fafc;
  padding: 1.5rem 0;
}

.todos-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Page Header */
.page-header {
  margin-bottom: 1.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.025em;
}

.page-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
}

.add-todo-btn {
  height: 44px;
  padding: 0 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  background: #5a6d82;
  border: none;
  transition: all 0.15s ease;
}

.add-todo-btn:hover {
  background: #4a5d72;
  transform: translateY(-1px);
}

/* Filter Section */
.filter-section {
  margin-bottom: 1.5rem;
}

.filter-card {
  background: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.filter-icon {
  color: #5a6d82;
  font-size: 1rem;
}

.filter-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.filter-btn {
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.15s ease;
  font-size: 0.875rem;
}

.filter-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
}

.filter-text {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.filter-count {
  background: #5a6d82;
  font-size: 0.75rem;
}

/* Todos Grid */
.todos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
  align-items: stretch;
}

/* States */
.loading-state,
.error-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
}

.loading-state {
  flex-direction: column;
  gap: 1rem;
}

.loading-text {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.error-content,
.empty-content {
  max-width: 400px;
}

.error-icon,
.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  font-size: 1.5rem;
}

.error-icon {
  background: #fef2f2;
  color: #ef4444;
}

.empty-icon {
  background: #f8fafc;
  color: #94a3b8;
}

.error-title,
.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.error-message,
.empty-message {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.empty-action-btn {
  background: #5a6d82;
  border: none;
  border-radius: 6px;
  font-weight: 600;
}
</style>
