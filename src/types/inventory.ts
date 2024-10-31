export type InventoryItemType = 'cable' | 'equipment' | 'tool' | 'consumable';
export type InventoryStatus = 'available' | 'reserved' | 'in_use' | 'maintenance' | 'written_off';
export type MovementType = 'receipt' | 'issue' | 'return' | 'write_off' | 'transfer';

export interface InventoryItem {
  id: string;
  type: InventoryItemType;
  name: string;
  manufacturer: string;
  model: string;
  serialNumber?: string;
  inventoryNumber: string;
  status: InventoryStatus;
  location: string;
  quantity: number;
  unit: string;
  minQuantity?: number;
  maxQuantity?: number;
  price: number;
  purchaseDate?: string;
  warrantyExpiration?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  specifications?: Record<string, string>;
  notes?: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  type: MovementType;
  itemId: string;
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  projectId?: string;
  requestedBy: string;
  approvedBy?: string;
  date: string;
  returnDate?: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  notes?: string;
  documents?: {
    id: string;
    type: string;
    number: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  itemId: string;
  type: 'routine' | 'repair' | 'calibration';
  date: string;
  performedBy: string;
  cost: number;
  description: string;
  result: string;
  nextMaintenanceDate?: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryStore {
  items: InventoryItem[];
  movements: InventoryMovement[];
  maintenanceRecords: MaintenanceRecord[];
  isLoading: boolean;
  error: string | null;

  // Операции с инвентарем
  addItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, data: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;

  // Операции с движениями
  createMovement: (movement: Omit<InventoryMovement, 'id' | 'createdAt' | 'updatedAt'>) => void;
  approveMovement: (id: string, approvedBy: string) => void;
  rejectMovement: (id: string, reason: string) => void;
  completeMovement: (id: string) => void;

  // Операции с обслуживанием
  addMaintenanceRecord: (record: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMaintenanceRecord: (id: string, data: Partial<MaintenanceRecord>) => void;
  removeMaintenanceRecord: (id: string) => void;

  // Отчеты и аналитика
  generateInventoryReport: () => Promise<Blob>;
  generateMovementReport: (startDate: string, endDate: string) => Promise<Blob>;
  generateMaintenanceReport: (itemId: string) => Promise<Blob>;
  
  // Уведомления
  getLowStockItems: () => InventoryItem[];
  getUpcomingMaintenance: (days: number) => {
    item: InventoryItem;
    maintenanceDate: string;
    daysLeft: number;
  }[];

  // Поиск и фильтрация
  searchItems: (query: string) => InventoryItem[];
  getItemsByType: (type: InventoryItemType) => InventoryItem[];
  getItemsByStatus: (status: InventoryStatus) => InventoryItem[];
  getItemsByLocation: (location: string) => InventoryItem[];
  getMovementsByItem: (itemId: string) => InventoryMovement[];
  getMaintenanceByItem: (itemId: string) => MaintenanceRecord[];
}