import { expect, it } from 'vitest';
import { mapPublishedSolution } from '../../src/services/solutions';

it('orders solution components by their display position', () => {
  const solution = mapPublishedSolution({
    id: 'solution-1',
    market_id: 'market-1',
    solution_name: 'Smart Lock Actuator',
    slug: 'smart-lock-actuator',
    application: 'Smart Lock',
    motion_type: 'Rotary Actuation',
    solution_description: 'Compact actuator architecture.',
    target_customer: 'Smart lock manufacturers',
    priority: 'high',
    status: 'published',
    seo_title: null,
    seo_description: null,
    published_time: null,
    solution_components: [
      { sort_order: 2, component_role: 'Limit detection', quantity: 1, notes: null, components: { id: '2', component_type: 'Micro Switch', model: 'Switch-01', specification: {}, applications: [], is_public: true } },
      { sort_order: 1, component_role: 'Actuation', quantity: 1, notes: null, components: { id: '1', component_type: 'Gear Motor', model: 'Gear-01', specification: {}, applications: [], is_public: true } },
    ],
  });

  expect(solution.components.map((component) => component.model)).toEqual(['Gear-01', 'Switch-01']);
});
