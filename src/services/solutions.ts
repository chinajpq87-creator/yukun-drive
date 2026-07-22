import type { PublishedSolution, SolutionComponent, MotionSolution } from '../types/database';

type SolutionRow = MotionSolution & { solution_components: SolutionComponent[] };

export function mapPublishedSolution(row: SolutionRow): PublishedSolution {
  const { solution_components, ...solution } = row;

  return {
    ...solution,
    components: [...solution_components]
      .sort((left, right) => left.sort_order - right.sort_order)
      .map(({ components, ...componentMeta }) => ({ ...components, ...componentMeta })),
  };
}

export async function getPublishedSolutionBySlug(client: any, slug: string): Promise<PublishedSolution | null> {
  const { data, error } = await client
    .from('motion_solutions')
    .select('*, solution_components(sort_order, component_role, quantity, notes, components(*))')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return mapPublishedSolution(data as SolutionRow);
}

export async function listPublishedSolutions(client: any): Promise<MotionSolution[]> {
  const { data, error } = await client
    .from('motion_solutions')
    .select('*')
    .eq('status', 'published')
    .order('published_time', { ascending: false });

  return error || !data ? [] : (data as MotionSolution[]);
}
