import { create } from 'zustand';
import { ProjectStore, Project, DocumentStatus } from '../types/project';
import { useAuthStore } from './authStore';
import { canViewProject, canEditProject } from '../utils/accessControl';

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  isLoading: false,

  getVisibleProjects: () => {
    const user = useAuthStore.getState().user;
    if (!user) return [];
    
    return get().projects.filter(project => canViewProject(user, project));
  },

  addProject: (projectData) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set((state) => ({
      projects: [
        ...state.projects,
        {
          ...projectData,
          id: Math.random().toString(36).substr(2, 9),
        },
      ],
    }));
  },

  updateProject: (id, data) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const project = get().projects.find(p => p.id === id);
    if (!project || !canEditProject(user, project)) return;

    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...data } : project
      ),
    }));
  },

  deleteProject: (id) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const project = get().projects.find(p => p.id === id);
    if (!project || !canEditProject(user, project)) return;

    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    }));
  },
}));