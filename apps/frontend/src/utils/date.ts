import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns'

export const formatDate = (date: string | Date): string => {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date
    return format(parsedDate, 'MMM dd, yyyy HH:mm')
  } catch {
    return 'Invalid date'
  }
}

export const isUpcoming = (dueDate: string): boolean => {
  try {
    const due = parseISO(dueDate)
    const now = new Date()
    const tomorrow = addDays(now, 1)
    return isAfter(due, now) && isBefore(due, addDays(tomorrow, 7))
  } catch {
    return false
  }
}

export const isOverdue = (dueDate: string, isDone: boolean): boolean => {
  if (isDone) return false
  try {
    const due = parseISO(dueDate)
    return isBefore(due, new Date())
  } catch {
    return false
  }
}
