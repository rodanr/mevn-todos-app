import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Todo, TodoFilter } from '@/types'

export const useTodosStore = defineStore('todos', () => {
  const currentFilter = ref<TodoFilter & { page?: number; limit?: number }>({
    page: 1,
    limit: 6,
  })
  const selectedTodo = ref<Todo | null>(null)

  // Computed
  const filterDisplay = computed((): string => {
    if (currentFilter.value.isDone === true) return 'Completed'
    if (currentFilter.value.upcoming) return 'Upcoming'
    return 'All Todos'
  })

  // Actions
  const setFilter = (filter: TodoFilter): void => {
    // Clear all filter properties first, then apply the new filter
    currentFilter.value = {
      page: 1,
      limit: 6,
      ...filter,
    }
  }

  const clearFilter = (): void => {
    currentFilter.value = { page: 1, limit: 6 }
  }

  const setPage = (page: number): void => {
    currentFilter.value.page = page
  }

  const resetPagination = (): void => {
    currentFilter.value.page = 1
  }

  const nextPage = (): void => {
    currentFilter.value.page = (currentFilter.value.page || 1) + 1
  }

  const setSelectedTodo = (todo: Todo | null): void => {
    selectedTodo.value = todo
  }

  return {
    currentFilter,
    selectedTodo,
    filterDisplay,
    setFilter,
    clearFilter,
    setPage,
    resetPagination,
    setSelectedTodo,
    nextPage,
  }
})
