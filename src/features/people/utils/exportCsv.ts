import { Person } from '../types';
import { formatSalary } from './formatSalary';

const HEADERS = ['Name', 'Job Title', 'Employment', 'Status', 'Country', 'Salary'];

function escape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function personToRow(p: Person): string {
  return [
    p.name,
    p.jobTitle,
    p.employment,
    p.status,
    p.country,
    formatSalary(p.salary, p.currency),
  ]
    .map(escape)
    .join(',');
}

export function downloadCsv(people: Person[], filename = 'people-export.csv'): void {
  const rows = [HEADERS.join(','), ...people.map(personToRow)];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
