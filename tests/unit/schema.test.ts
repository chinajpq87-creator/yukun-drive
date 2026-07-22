import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const schemaPath = resolve('supabase/migrations/001_core_schema.sql');

describe('core database schema', () => {
  it('defines the four V1 business tables and no supplier table', async () => {
    const schema = await readFile(schemaPath, 'utf8');

    expect(schema).toContain('create table market_demands');
    expect(schema).toContain('create table components');
    expect(schema).toContain('create table motion_solutions');
    expect(schema).toContain('create table customer_inquiries');
    expect(schema).not.toContain('supply_chain');
  });
});
