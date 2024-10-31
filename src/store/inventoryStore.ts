import { create } from 'zustand';
import { InventoryStore, InventoryItem, InventoryMovement, MaintenanceRecord } from '../types/inventory';

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  items: [],
  movements: [],
  maintenanceRecords: [],
  isLoading: false,
  error: null,

  // Операции с инвентарем
  addItem: (itemData) => {
    set((state) => ({
      items: [
        ...state.items,
        {
          ...itemData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateItem: (id, data) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : item
      ),
    }));
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  // Операции с движениями
  createMovement: (movementData) => {
    set((state) => ({
      movements: [
        ...state.movements,
        {
          ...movementData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  },

  approveMovement: (id, approvedBy) => {
    set((state) => ({
      movements: state.movements.map((movement) =>
        movement.id === id
          ? {
              ...movement,
              status: 'approved',
              approvedBy,
              updatedAt: new Date().toISOString(),
            }
          : movement
      ),
    }));
  },

  rejectMovement: (id, reason) => {
    set((state) => ({
      movements: state.movements.map((movement) =>
        movement.id === id
          ? {
              ...movement,
              status: 'rejected',
              notes: reason,
              updatedAt: new Date().toISOString(),
            }
          : movement
      ),
    }));
  },

  completeMovement: (id) => {
    set((state) => ({
      movements: state.movements.map((movement) =>
        movement.id === id
          ? {
              ...movement,
              status: 'completed',
              updatedAt: new Date().toISOString(),
            }
          : movement
      ),
    }));
  },

  // Операции с обслуживанием
  addMaintenanceRecord: (recordData) => {
    set((state) => ({
      maintenanceRecords: [
        ...state.maintenanceRecords,
        {
          ...recordData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateMaintenanceRecord: (id, data) => {
    set((state) => ({
      maintenanceRecords: state.maintenanceRecords.map((record) =>
        record.id === id
          ? {
              ...record,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : record
      ),
    }));
  },

  removeMaintenanceRecord: (id) => {
    set((state) => ({
      maintenanceRecords: state.maintenanceRecords.filter(
        (record) => record.id !== id
      ),
    }));
  },

  // Отчеты и аналитика
  generateInventoryReport: async () => {
    // В реальном приложении здесь должна быть генерация отчета
    return new Blob([''], { type: 'application/pdf' });
  },

  generateMovementReport: async (startDate, endDate) => {
    // В реальном приложении здесь должна быть генерация отчета
    return new Blob([''], { type: 'application/pdf' });
  },

  generateMaintenanceReport: async (itemId) => {
    // В реальном приложении здесь должна быть генерация отчета
    return new Blob([''], { type: 'application/pdf' });
  },

  // Уведомления
  getLowStockItems: () => {
    return get().items.filter(
      (item) =>
        item.minQuantity !== undefined &&
        item.quantity <= item.minQuantity
    );
  },

  getUpcomingMaintenance: (days) => {
    const now = new Date();
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);

    const upcoming: ReturnType<InventoryStore['getUpcomingMaintenance']> = [];

    get().items.forEach((item) => {
      if (item.nextMaintenanceDate) {
        const maintenanceDate = new Date(item.nextMaintenanceDate);
        if (maintenanceDate >= now && maintenanceDate <= deadline) {
          upcoming.push({
            item,
            maintenanceDate: item.nextMaintenanceDate!,
            daysLeft: Math.ceil(
              (maintenanceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            ),
          });
        }
      }
    });

    return upcoming.sort((a, b) => a.daysLeft - b.daysLeft);
  },

  // Поиск и фильтрация
  searchItems: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return get().items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowercaseQuery) ||
        item.manufacturer.toLowerCase().includes(lowercaseQuery) ||
        item.serialNumber?.toLowerCase().includes(lowercaseQuery)
    );
  },

  getItemsByType: (type) => {
    return get().items.filter((item) => item.type === type);
  },

  getItemsByStatus: (status) => {
    return get().items.filter((item) => item.status === status);
  },

  getItemsByLocation: (location) => {
    return get().items.filter((item) => item.location === location);
  },

  getMovementsByItem: (itemId) => {
    return get().movements.filter((movement) => movement.itemId === itemId);
  },

  getMaintenanceByItem: (itemId) => {
    return get().maintenanceRecords.filter(
      (record) => record.itemId === itemId
    );
  },
}));