import { Person } from '@/types/person';

export type { Person };

export type PeopleQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string[];
  country?: string;
  role?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
};

export type PeopleResponse = {
  data: Person[];
  total: number;
  page: number;
  totalPages: number;
};

export type GroupBy = 'none' | 'country' | 'status' | 'role' | 'jobTitle';
export type ViewMode = 'pagination' | 'infinite';

export type SortState = {
  column: string;
  order: 'asc' | 'desc' | 'none';
};

export type SavedFilter = {
  id: string;
  name: string;
  filters: {
    search?: string;
    status?: string[];
    country?: string;
    role?: string;
    groupBy?: GroupBy;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
  };
  savedAt: string;
};

export type PeopleFiltersState = {
  search: string;
  status: string[];
  country: string;
  role: string;
  page: number;
  limit: number;
  sortBy: string;
  order: 'asc' | 'desc' | 'none';
  groupBy: GroupBy;
  viewMode: ViewMode;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
};
