export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type DemandStatus = 'draft' | 'validated' | 'archived';
export type SolutionStatus = 'draft' | 'review' | 'published' | 'archived';
export type InquiryStatus = 'new' | 'reviewing' | 'quoted' | 'closed';

export interface Component {
  id: string;
  component_type: string;
  model: string;
  specification: Record<string, unknown>;
  applications: string[];
  is_public: boolean;
}

export interface SolutionComponent {
  component_role: string | null;
  quantity: number;
  sort_order: number;
  notes: string | null;
  components: Component;
}

export interface MotionSolution {
  id: string;
  market_id: string;
  solution_name: string;
  slug: string;
  application: string;
  motion_type: string;
  solution_description: string;
  target_customer: string | null;
  priority: Priority;
  status: SolutionStatus;
  seo_title: string | null;
  seo_description: string | null;
  published_time: string | null;
}

export interface PublishedSolution extends MotionSolution {
  components: Array<Component & Omit<SolutionComponent, 'components'>>;
}
