import styled from 'styled-components';
import { TableCell, TableRow } from '@/ui-kit/table';
import { Badge } from '@/shared/ui/Badge/Badge';
import { Person } from '../../types';
import { formatSalary } from '../../utils/formatSalary';

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background-color: var(--colors-gray-200);
`;

const AvatarFallback = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--colors-brand);
  color: var(--colors-blank);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const ClickableRow = styled(TableRow)`
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--colors-brand);
    outline-offset: -2px;
  }
`;

type Props = {
  person: Person;
  onClick: (person: Person) => void;
};

export const PeopleTableRow = ({ person, onClick }: Props) => {
  const initials = person.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const employment =
    person.employment.charAt(0).toUpperCase() + person.employment.slice(1);

  return (
    <ClickableRow
      tabIndex={0}
      role="button"
      aria-label={`View details for ${person.name}`}
      onClick={() => onClick(person)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick(person);
      }}
    >
      <TableCell>
        <NameCell>
          {person.photo ? (
            <Avatar
              src={person.photo}
              alt=""
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <AvatarFallback aria-hidden="true">{initials}</AvatarFallback>
          )}
          {person.name}
        </NameCell>
      </TableCell>
      <TableCell>{person.jobTitle}</TableCell>
      <TableCell>{employment}</TableCell>
      <TableCell>
        <Badge status={person.status} />
      </TableCell>
      <TableCell>{person.country}</TableCell>
      <TableCell $textAlign="right">
        {formatSalary(person.salary, person.currency)}
      </TableCell>
    </ClickableRow>
  );
};
