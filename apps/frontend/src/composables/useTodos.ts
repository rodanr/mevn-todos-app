import { computed, watch } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { todosApi } from '@/api/todos'
import { useTodosStore } from '@/stores/todos'
import { useAuthStore } from '@/stores/auth'
import type { Todo, UpdateTodoInput, CreateTodoInput } from '@mevn-todos/shared'
import type { ComputedRef } from 'vue'

interface UseTodosReturn {
  todos: ComputedRef<Todo[]>
  totalCount: ComputedRef<number>
  totalPages: ComputedRef<number>
  currentPage: ComputedRef<number>
  isLoading: ComputedRef<boolean>
  error: ComputedRef<unknown>
  refetch: () => void
  createTodo: (todo: CreateTodoInput) => void
  updateTodo: (params: { id: string; todo: UpdateTodoInput }) => void
  deleteTodo: (id: string) => void
  toggleTodo: (params: { id: string; isDone: boolean }) => void
  isCreating: ComputedRef<boolean>
  isUpdating: ComputedRef<boolean>
  isDeleting: ComputedRef<boolean>
  isToggling: ComputedRef<boolean>
}

export const useTodos = (): UseTodosReturn => {
  const toast = useToast()
  const queryClient = useQueryClient()
  const todosStore = useTodosStore()
  const authStore = useAuthStore()

  // Watch for filter changes and reset pagination
  watch(
    () => [todosStore.currentFilter.isDone, todosStore.currentFilter.upcoming],
    () => {
      todosStore.resetPagination()
    },
    { deep: true },
  )

  const todosQuery = useQuery({
    queryKey: ['todos', computed(() => JSON.stringify(todosStore.currentFilter))],
    queryFn: async () => {
      // Add a small delay to ensure token is set
      await new Promise((resolve) => setTimeout(resolve, 100))

      const response = await todosApi.getTodos(todosStore.currentFilter)
      return response
    },
    staleTime: 0, // Always fetch fresh data when filter changes
    enabled: computed(() => authStore.isAuthenticated), // Only run when authenticated
  })

  // Mutations for CRUD operations
  const createTodoMutation = useMutation({
    mutationFn: todosApi.createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.add({
        severity: 'success',
        summary: 'Todo Created',
        detail: 'Your todo has been created successfully',
        life: 3000,
      })
    },
    onError: () => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create todo. Please try again.',
        life: 5000,
      })
    },
  })

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, todo }: { id: string; todo: UpdateTodoInput }) =>
      todosApi.updateTodo(id, todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.add({
        severity: 'success',
        summary: 'Todo Updated',
        detail: 'Your todo has been updated successfully',
        life: 3000,
      })
    },
    onError: () => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update todo. Please try again.',
        life: 5000,
      })
    },
  })

  const deleteTodoMutation = useMutation({
    mutationFn: todosApi.deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: () => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete todo. Please try again.',
        life: 5000,
      })
    },
  })

  const toggleTodoMutation = useMutation({
    mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) =>
      todosApi.toggleTodo(id, isDone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.add({
        severity: 'success',
        summary: 'Todo Updated',
        detail: 'Todo status updated successfully',
        life: 3000,
      })
    },
    onError: () => {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update todo status. Please try again.',
        life: 5000,
      })
    },
  })

  const todos = computed(() => {
    return todosQuery.data.value?.todos || []
  })

  const totalCount = computed(() => {
    return todosQuery.data.value?.pagination?.totalItems || 0
  })

  const totalPages = computed(() => {
    return todosQuery.data.value?.pagination?.totalPages || 0
  })

  const currentPage = computed(() => {
    return todosQuery.data.value?.pagination?.currentPage || 1
  })

  return {
    todos,
    totalCount,
    totalPages,
    currentPage,
    isLoading: computed(() => todosQuery.isLoading.value),
    error: computed(() => todosQuery.error.value),
    refetch: todosQuery.refetch,
    createTodo: createTodoMutation.mutate,
    updateTodo: updateTodoMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate,
    toggleTodo: toggleTodoMutation.mutate,
    isCreating: computed(() => createTodoMutation.isPending.value),
    isUpdating: computed(() => updateTodoMutation.isPending.value),
    isDeleting: computed(() => deleteTodoMutation.isPending.value),
    isToggling: computed(() => toggleTodoMutation.isPending.value),
  }
}

export const useTodo = (
  id: string,
): {
  data: Todo | undefined
  isLoading: boolean
  error: unknown
} => {
  const query = useQuery({
    queryKey: ['todo', id],
    queryFn: () => todosApi.getTodoById(id),
    enabled: !!id,
  })

  return {
    data: query.data.value,
    isLoading: query.isLoading.value,
    error: query.error.value,
  }
}
