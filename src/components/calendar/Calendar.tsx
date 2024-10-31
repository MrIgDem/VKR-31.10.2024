import React, { useState } from 'react';
import { useCalendarStore } from '../../store/calendarStore';
import { Schedule, ScheduleTask } from '../../types/calendar';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { TaskTimeline } from './TaskTimeline';
import { ResourceView } from './ResourceView';
import { GanttChart } from './GanttChart';

type ViewType = 'timeline' | 'resources' | 'gantt';

export function Calendar() {
  const { schedules } = useCalendarStore();
  const [selectedView, setSelectedView] = useState<ViewType>('timeline');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const handlePrevMonth = () => {
    setSelectedDate(prev => {
      const date = new Date(prev);
      date.setMonth(date.getMonth() - 1);
      return date;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => {
      const date = new Date(prev);
      date.setMonth(date.getMonth() + 1);
      return date;
    });
  };

  const renderView = () => {
    switch (selectedView) {
      case 'timeline':
        return <TaskTimeline schedule={selectedSchedule} date={selectedDate} />;
      case 'resources':
        return <ResourceView schedule={selectedSchedule} date={selectedDate} />;
      case 'gantt':
        return <GanttChart schedule={selectedSchedule} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={selectedSchedule?.id || ''}
              onChange={(e) => {
                const schedule = schedules.find(s => s.id === e.target.value);
                setSelectedSchedule(schedule || null);
              }}
              className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Выберите расписание</option>
              {schedules.map(schedule => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            <button
              className="px-3 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2"
            >
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium">
                {selectedDate.toLocaleString('ru-RU', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedView('timeline')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              selectedView === 'timeline'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Временная шкала
          </button>
          <button
            onClick={() => setSelectedView('resources')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              selectedView === 'resources'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Ресурсы
          </button>
          <button
            onClick={() => setSelectedView('gantt')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              selectedView === 'gantt'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Диаграмма Ганта
          </button>
        </div>
      </div>

      {selectedSchedule ? (
        renderView()
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">
            Выберите расписание для просмотра
          </p>
        </div>
      )}
    </div>
  );
}