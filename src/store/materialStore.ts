import { create } from 'zustand';
import { Material, MaterialStore } from '../types/material';

export const useMaterialStore = create<MaterialStore>((set) => ({
  materials: [],
  isLoading: false,

  addMaterial: (materialData) => {
    set((state) => ({
      materials: [
        ...state.materials,
        {
          ...materialData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  },

  updateMaterial: (id, data) => {
    set((state) => ({
      materials: state.materials.map((material) =>
        material.id === id ? { ...material, ...data } : material
      ),
    }));
  },

  removeMaterial: (id) => {
    set((state) => ({
      materials: state.materials.filter((material) => material.id !== id),
    }));
  },
}));