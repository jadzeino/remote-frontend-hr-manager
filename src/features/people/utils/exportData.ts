import { Person } from '../types';
import { formatSalary } from './formatSalary';

export type ExportFormat = 'csv' | 'json' | 'xlsx';

const HEADERS = ['Name', 'Job Title', 'Employment', 'Status', 'Country', 'Salary'];

function toRow(p: Person) {
  return {
    Name: p.name,
    'Job Title': p.jobTitle,
    Employment: p.employment,
    Status: p.status,
    Country: p.country,
    Salary: formatSalary(p.salary, p.currency),
  };
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportAsCsv(people: Person[], filename: string) {
  const rows = people.map((p) => Object.values(toRow(p)).map(escapeCsv).join(','));
  const content = [HEADERS.join(','), ...rows].join('\n');
  triggerDownload(new Blob([content], { type: 'text/csv;charset=utf-8;' }), filename);
}

function exportAsJson(people: Person[], filename: string) {
  const rows = people.map(toRow);
  const content = JSON.stringify(rows, null, 2);
  triggerDownload(new Blob([content], { type: 'application/json;charset=utf-8;' }), filename);
}

async function exportAsXlsx(people: Person[], filename: string) {
  // Lazy-load xlsx — only downloaded when the user actually picks XLSX
  const { utils, writeFile } = await import('xlsx');
  const ws = utils.json_to_sheet(people.map(toRow), { header: HEADERS });
  ws['!cols'] = [22, 24, 18, 14, 16, 20].map((wch) => ({ wch }));
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'People');
  writeFile(wb, filename);
}

export async function exportPeople(people: Person[], format: ExportFormat, baseName = 'people') {
  const date = new Date().toISOString().slice(0, 10);
  const name = `${baseName}-${date}`;

  if (format === 'csv') return exportAsCsv(people, `${name}.csv`);
  if (format === 'json') return exportAsJson(people, `${name}.json`);
  return exportAsXlsx(people, `${name}.xlsx`);
}
