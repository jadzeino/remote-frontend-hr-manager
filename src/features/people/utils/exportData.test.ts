import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock URL.createObjectURL and document.createElement('a').click
beforeEach(() => {
  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => 'blob:mock'),
    revokeObjectURL: vi.fn(),
  });
  const mockAnchor = { href: '', download: '', click: vi.fn() };
  vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLElement);
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Expose the internal escapeCsv via the exported exportPeople by capturing the Blob content
async function getCsvContent(names: string[]): Promise<string> {
  const { exportPeople } = await import('./exportData');
  let capturedContent = '';
  const OrigBlob = globalThis.Blob;
  vi.stubGlobal('Blob', class MockBlob {
    constructor(parts: string[]) { capturedContent = parts[0]; }
  });

  const people = names.map((name, i) => ({
    id: i,
    name,
    jobTitle: 'Engineer',
    employment: 'employee' as const,
    status: 'active' as const,
    country: 'US',
    salary: 10000,
    currency: 'USD',
    photo: '',
  }));

  await exportPeople(people, 'csv');
  vi.stubGlobal('Blob', OrigBlob);
  return capturedContent;
}

describe('exportData — CSV injection prevention', () => {
  it('prefixes "=" with a single quote to prevent formula execution', async () => {
    const csv = await getCsvContent(['=HYPERLINK("evil")']);
    expect(csv).toContain("'=HYPERLINK");
    expect(csv).not.toMatch(/^=HYPERLINK/m);
  });

  it('prefixes "+" with a single quote', async () => {
    const csv = await getCsvContent(['+1234']);
    expect(csv).toContain("'+1234");
  });

  it('prefixes "@" with a single quote', async () => {
    const csv = await getCsvContent(['@evil.com']);
    expect(csv).toContain("'@evil.com");
  });

  it('prefixes "-" with a single quote', async () => {
    const csv = await getCsvContent(['-1+2']);
    expect(csv).toContain("'-1+2");
  });

  it('does not modify safe names', async () => {
    const csv = await getCsvContent(['Jane Smith']);
    expect(csv).toContain('Jane Smith');
    expect(csv).not.toContain("'Jane");
  });

  it('wraps values containing commas in double quotes', async () => {
    const csv = await getCsvContent(['Smith, Jane']);
    expect(csv).toContain('"Smith, Jane"');
  });

  it('escapes embedded double quotes', async () => {
    const csv = await getCsvContent(['Say "hello"']);
    expect(csv).toContain('"Say ""hello"""');
  });
});
