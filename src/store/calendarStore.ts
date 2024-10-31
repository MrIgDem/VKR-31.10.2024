import { create } from 'zustand';
import { CalendarStore, Schedule, ScheduleTask, Resource, TaskDependency } from '../types/calendar';
import { calculateCriticalPathForTasks, calculateTaskProgress } from '../utils/scheduleCalculations';

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  schedules: [],
  isLoading: false,
  error: null,

  addSchedule: (scheduleData) => {
    set((state) => ({
      schedules: [
        ...state.schedules,
        {
          ...scheduleData,
          id: Math.random().toString(36).substr(2, 9),
        },
      ],
    }));
  },

  updateSchedule: (id, data) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, ...data } : schedule
      ),
    }));
  },

  removeSchedule: (id) => {
    set((state) => ({
      schedules: state.schedules.filter((schedule) => schedule.id !== id),
    }));
  },

  addTask: (scheduleId, taskData) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              tasks: [
                ...schedule.tasks,
                {
                  ...taskData,
                  id: Math.random().toString(36).substr(2, 9),
                },
              ],
            }
          : schedule
      ),
    }));
    get().calculateCriticalPath(scheduleId);
  },

  updateTask: (scheduleId, taskId, data) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              tasks: schedule.tasks.map((task) =>
                task.id === taskId ? { ...task, ...data } : task
              ),
            }
          : schedule
      ),
    }));
    get().calculateCriticalPath(scheduleId);
    get().calculateProgress(scheduleId);
  },

  removeTask: (scheduleId, taskId) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              tasks: schedule.tasks.filter((task) => task.id !== taskId),
            }
          : schedule
      ),
    }));
    get().calculateCriticalPath(scheduleId);
  },

  addResource: (scheduleId, resourceData) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              resources: [
                ...schedule.resources,
                {
                  ...resourceData,
                  id: Math.random().toString(36).substr(2, 9),
                },
              ],
            }
          : schedule
      ),
    }));
  },

  updateResource: (scheduleId, resourceId, data) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              resources: schedule.resources.map((resource) =>
                resource.id === resourceId ? { ...resource, ...data } : resource
              ),
            }
          : schedule
      ),
    }));
  },

  removeResource: (scheduleId, resourceId) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              resources: schedule.resources.filter(
                (resource) => resource.id !== resourceId
              ),
            }
          : schedule
      ),
    }));
  },

  addDependency: (scheduleId, dependencyData) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              tasks: schedule.tasks.map((task) =>
                task.id === dependencyData.successorId
                  ? {
                      ...task,
                      dependencies: [
                        ...task.dependencies,
                        {
                          ...dependencyData,
                          id: Math.random().toString(36).substr(2, 9),
                        },
                      ],
                    }
                  : task
              ),
            }
          : schedule
      ),
    }));
    get().calculateCriticalPath(scheduleId);
  },

  removeDependency: (scheduleId, dependencyId) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              tasks: schedule.tasks.map((task) => ({
                ...task,
                dependencies: task.dependencies.filter(
                  (dep) => dep.id !== dependencyId
                ),
              })),
            }
          : schedule
      ),
    }));
    get().calculateCriticalPath(scheduleId);
  },

  calculateCriticalPath: (scheduleId) => {
    set((state) => {
      const schedule = state.schedules.find((s) => s.id === scheduleId);
      if (!schedule) return state;

      const { criticalPath, tasks } = calculateCriticalPathForTasks(schedule.tasks);

      return {
        schedules: state.schedules.map((s) =>
          s.id === scheduleId
            ? {
                ...s,
                criticalPath,
                tasks,
              }
            : s
        ),
      };
    });
  },

  calculateProgress: (scheduleId) => {
    set((state) => {
      const schedule = state.schedules.find((s) => s.id === scheduleId);
      if (!schedule) return state;

      const progress = calculateTaskProgress(schedule.tasks);

      return {
        schedules: state.schedules.map((s) =>
          s.id === scheduleId
            ? {
                ...s,
                progress,
              }
            : s
        ),
      };
    });
  },

  detectResourceConflicts: (scheduleId) => {
    const schedule = get().schedules.find((s) => s.id === scheduleId);
    if (!schedule) return [];

    const conflicts: {
      taskId: string;
      resourceId: string;
      startDate: string;
      endDate: string;
      type: 'overallocation' | 'unavailable';
    }[] = [];

    // Проверяем каждый ресурс
    schedule.resources.forEach((resource) => {
      const resourceTasks = schedule.tasks.filter((task) =>
        task.resources.some((r) => r.resourceId === resource.id)
      );

      // Проверяем перегрузку ресурса
      resourceTasks.forEach((task) => {
        const taskResource = task.resources.find(
          (r) => r.resourceId === resource.id
        );
        if (!taskResource) return;

        // Проверяем доступность ресурса
        const availability = resource.availability.find(
          (a) =>
            new Date(a.startDate) <= new Date(task.startDate) &&
            new Date(a.endDate) >= new Date(task.endDate)
        );

        if (!availability) {
          conflicts.push({
            taskId: task.id,
            resourceId: resource.id,
            startDate: task.startDate,
            endDate: task.endDate,
            type: 'unavailable',
          });
          return;
        }

        // Проверяем перегрузку
        if (taskResource.quantity > availability.quantity) {
          conflicts.push({
            taskId: task.id,
            resourceId: resource.id,
            startDate: task.startDate,
            endDate: task.endDate,
            type: 'overallocation',
          });
        }
      });
    });

    return conflicts;
  },

  saveBaseline: (scheduleId) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId
          ? {
              ...schedule,
              baseline: {
                startDate: schedule.startDate,
                endDate: schedule.endDate,
                tasks: schedule.tasks.map((task) => ({
                  id: task.id,
                  startDate: task.startDate,
                  endDate: task.endDate,
                })),
              },
            }
          : schedule
      ),
    }));
  },

  revertToBaseline: (scheduleId) => {
    set((state) => ({
      schedules: state.schedules.map((schedule) =>
        schedule.id === scheduleId && schedule.baseline
          ? {
              ...schedule,
              startDate: schedule.baseline.startDate,
              endDate: schedule.baseline.endDate,
              tasks: schedule.tasks.map((task) => {
                const baselineTask = schedule.baseline?.tasks.find(
                  (bt) => bt.id === task.id
                );
                return baselineTask
                  ? {
                      ...task,
                      startDate: baselineTask.startDate,
                      endDate: baselineTask.endDate,
                    }
                  : task;
              }),
            }
          : schedule
      ),
    }));
  },

  exportToMSProject: async (scheduleId) => {
    const schedule = get().schedules.find((s) => s.id === scheduleId);
    if (!schedule) throw new Error('Schedule not found');

    // Здесь должна быть реализация экспорта в формат MS Project
    // Возвращаем заглушку
    return new Blob([''], { type: 'application/xml' });
  },

  exportToExcel: async (scheduleId) => {
    const schedule = get().schedules.find((s) => s.id === scheduleId);
    if (!schedule) throw new Error('Schedule not found');

    // Здесь должна быть реализация экспорта в Excel
    // Возвращаем заглушку
    return new Blob([''], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  },

  getSchedulesByProject: (projectId) => {
    return get().schedules.filter((schedule) => schedule.projectId === projectId);
  },

  getSchedulesByStatus: (status) => {
    return get().schedules.filter((schedule) => schedule.status === status);
  },

  searchSchedules: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return get().schedules.filter(
      (schedule) =>
        schedule.name.toLowerCase().includes(lowercaseQuery) ||
        schedule.description?.toLowerCase().includes(lowercaseQuery)
    );
  },

  getUpcomingDeadlines: (days) => {
    const now = new Date();
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);

    const upcomingDeadlines: {
      taskId: string;
      scheduleName: string;
      taskName: string;
      deadline: string;
      daysLeft: number;
    }[] = [];

    get().schedules.forEach((schedule) => {
      schedule.tasks.forEach((task) => {
        const taskDeadline = new Date(task.endDate);
        if (taskDeadline >= now && taskDeadline <= deadline) {
          const daysLeft = Math.ceil(
            (taskDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
          upcomingDeadlines.push({
            taskId: task.id,
            scheduleName: schedule.name,
            taskName: task.name,
            deadline: task.endDate,
            daysLeft,
          });
        }
      });
    });

    return upcomingDeadlines.sort((a, b) => a.daysLeft - b.daysLeft);
  },
}));