import { create } from 'zustand';
import { AnalyticsStore, Metric, ChartData, Report, MetricPeriod } from '../types/analytics';
import { useProjectStore } from './projectStore';
import { useTaskStore } from './taskStore';
import { useRiskStore } from './riskStore';

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  metrics: [],
  charts: [],
  reports: [],
  isLoading: false,
  error: null,

  getMetrics: (period) => {
    const projectStore = useProjectStore.getState();
    const taskStore = useTaskStore.getState();
    const riskStore = useRiskStore.getState();

    const metrics: Metric[] = [
      {
        id: 'active-projects',
        name: 'Активные проекты',
        value: projectStore.projects.filter(p => p.status !== 'completed').length,
        type: 'count',
        period,
        trend: 0, // Здесь нужно вычислить тренд
      },
      {
        id: 'tasks-completion',
        name: 'Выполнение задач',
        value: (taskStore.tasks.filter(t => t.status === 'completed').length / 
                taskStore.tasks.length) * 100,
        type: 'percentage',
        period,
        trend: 0,
      },
      {
        id: 'high-risks',
        name: 'Критические риски',
        value: riskStore.risks.filter(r => 
          r.currentAssessment?.priority === 'high' || 
          r.currentAssessment?.priority === 'critical'
        ).length,
        type: 'count',
        period,
        trend: 0,
      },
      // Добавьте другие метрики по необходимости
    ];

    return metrics;
  },

  updateMetrics: async () => {
    set({ isLoading: true });
    try {
      const metrics = get().getMetrics('month');
      set({ metrics, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to update metrics', isLoading: false });
    }
  },

  getChartData: (chartId, period) => {
    const projectStore = useProjectStore.getState();
    const taskStore = useTaskStore.getState();
    const riskStore = useRiskStore.getState();

    // Здесь можно добавить логику для различных типов графиков
    const charts: Record<string, () => ChartData> = {
      'project-status': () => ({
        id: 'project-status',
        type: 'pie',
        title: 'Статус проектов',
        data: [
          { name: 'В работе', value: projectStore.projects.filter(p => p.status === 'in_progress').length },
          { name: 'Завершены', value: projectStore.projects.filter(p => p.status === 'completed').length },
          { name: 'На паузе', value: projectStore.projects.filter(p => p.status === 'on_hold').length },
        ],
        series: [{ name: 'Проекты', key: 'value' }],
      }),
      'task-progress': () => ({
        id: 'task-progress',
        type: 'line',
        title: 'Прогресс выполнения задач',
        data: [], // Здесь нужно добавить данные по дням/неделям
        series: [
          { name: 'Завершено', key: 'completed' },
          { name: 'В работе', key: 'in_progress' },
        ],
      }),
      // Добавьте другие графики
    };

    return charts[chartId]?.() || null;
  },

  updateChartData: async (chartId) => {
    set({ isLoading: true });
    try {
      const chartData = get().getChartData(chartId, 'month');
      if (chartData) {
        set(state => ({
          charts: [...state.charts.filter(c => c.id !== chartId), chartData],
          isLoading: false,
        }));
      }
    } catch (error) {
      set({ error: 'Failed to update chart data', isLoading: false });
    }
  },

  generateReport: async (type, parameters) => {
    set({ isLoading: true });
    try {
      // Здесь должна быть логика генерации отчета
      const report: Report = {
        id: Math.random().toString(36).substr(2, 9),
        title: `Отчет по ${type}`,
        type,
        format: 'pdf',
        generatedAt: new Date().toISOString(),
        url: '#', // Здесь должен быть URL сгенерированного отчета
        parameters,
      };

      set(state => ({
        reports: [...state.reports, report],
        isLoading: false,
      }));

      return report.url;
    } catch (error) {
      set({ error: 'Failed to generate report', isLoading: false });
      throw error;
    }
  },

  getReports: () => {
    return get().reports;
  },

  deleteReport: (id) => {
    set(state => ({
      reports: state.reports.filter(r => r.id !== id),
    }));
  },
}));