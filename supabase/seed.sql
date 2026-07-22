insert into market_demands (
  id, industry, application, product_name, customer_type, market_region,
  customer_problem, motion_requirement, technical_requirement, market_priority,
  business_value, status
) values (
  'c0a80121-0000-4000-8000-000000000001', 'Smart Home', 'Smart Lock',
  'Smart Lock Actuator', 'Smart lock manufacturer', 'Global',
  'Compact, reliable locking actuation is needed for a battery-powered product.',
  'Bidirectional low-speed rotary motion with end-position detection.',
  '{"voltage":"6V","target_torque":"1.2Nm","noise":"low"}', 'high', 5, 'validated'
);

insert into components (id, component_type, model, specification, applications, is_public) values
  ('c0a80121-0000-4000-8000-000000000011', 'Gear Motor', 'GM-0612', '{"voltage":"6V","gear_ratio":"150:1"}', '{Smart Lock}', true),
  ('c0a80121-0000-4000-8000-000000000012', 'Encoder', 'ENC-06', '{"resolution":"12 PPR"}', '{Smart Lock}', true),
  ('c0a80121-0000-4000-8000-000000000013', 'Micro Switch', 'MS-01', '{"rating":"3A"}', '{Smart Lock}', true);

insert into motion_solutions (
  id, market_id, solution_name, slug, application, motion_type, solution_description,
  target_customer, priority, status, seo_title, seo_description, published_time
) values (
  'c0a80121-0000-4000-8000-000000000021', 'c0a80121-0000-4000-8000-000000000001',
  'Smart Lock Actuator', 'smart-lock-actuator', 'Smart Lock', 'Rotary Actuation',
  'A compact actuator architecture for secure, low-noise smart lock operation.',
  'Smart lock manufacturers', 'high', 'published',
  'Smart Lock Actuator Motion Solution', 'Compact motion architecture for smart locks.', now()
);

insert into solution_components (solution_id, component_id, component_role, quantity, sort_order) values
  ('c0a80121-0000-4000-8000-000000000021', 'c0a80121-0000-4000-8000-000000000011', 'Lock actuation', 1, 1),
  ('c0a80121-0000-4000-8000-000000000021', 'c0a80121-0000-4000-8000-000000000012', 'Position feedback', 1, 2),
  ('c0a80121-0000-4000-8000-000000000021', 'c0a80121-0000-4000-8000-000000000013', 'End-position detection', 2, 3);
