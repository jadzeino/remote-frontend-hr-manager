import styled from 'styled-components';
import { TableCell, TableRow } from '@/ui-kit/table';
import { Badge } from '@/shared/ui/Badge/Badge';
import { Person } from '../../types';
import { formatSalary } from '../../utils/formatSalary';

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  overflow: hidden;
`;

const NameText = styled.span`
  font-family: Inter, sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  letter-spacing: 0;
  color: var(--Grey-900, #0f1419);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`;

const RoleText = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background-color: var(--colors-gray-100);
`;

const ClickableRow = styled(TableRow)`
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--colors-brand);
    outline-offset: -2px;
  }
`;

// Always produce an avatar URL — fall back to DiceBear when photo is null/empty
function getAvatarUrl(person: Person): string {
  if (person.photo) return person.photo;
  const seed = encodeURIComponent(`${person.name}-${person.id}`);
  return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`;
}

type Props = {
  person: Person;
  onClick: (person: Person) => void;
};

export const PeopleTableRow = ({ person, onClick }: Props) => {
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
          <Avatar src={getAvatarUrl(person)} alt={person.name} />
          <NameText>{person.name}</NameText>
        </NameCell>
      </TableCell>
      <TableCell><RoleText>{person.jobTitle}</RoleText></TableCell>
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
