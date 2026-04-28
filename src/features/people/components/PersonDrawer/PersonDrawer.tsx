import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Drawer, DrawerBody } from '@/shared/ui/Drawer/Drawer';
import { Badge } from '@/shared/ui/Badge/Badge';
import { Button } from '@/ui-kit/button';
import { formatSalary } from '../../utils/formatSalary';
import { Person } from '../../types';

const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 0;
  border-bottom: 1px solid var(--colors-gray-200);
  margin-bottom: 24px;
`;

const Avatar = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--colors-gray-200);
`;

const AvatarFallback = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--colors-brand);
  color: var(--colors-blank);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
  font-weight: 600;
`;

const Name = styled.h3`
  ${({ theme }) => theme.typography.h3}
  margin: 0;
  text-align: center;
`;

const JobTitle = styled.p`
  ${({ theme }) => theme.typography.bodySM}
  color: var(--colors-gray-500);
  margin: 0;
  text-align: center;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--colors-gray-100);

  &:last-of-type {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-size: 1.3rem;
  color: var(--colors-gray-500);
`;

const DetailValue = styled.span`
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--colors-gray-800);
`;

const Actions = styled.div`
  margin-top: 24px;
  display: flex;
  gap: 12px;
`;

type Props = {
  person: Person | null;
  onClose: () => void;
};

export const PersonDrawer = ({ person, onClose }: Props) => {
  const navigate = useNavigate();

  const initials = person?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '';

  return (
    <Drawer
      isOpen={person !== null}
      onClose={onClose}
      title="Member details"
    >
      {person && (
        <DrawerBody>
          <AvatarWrapper>
            {person.photo ? (
              <Avatar src={person.photo} alt={person.name} />
            ) : (
              <AvatarFallback aria-hidden="true">{initials}</AvatarFallback>
            )}
            <Name>{person.name}</Name>
            <JobTitle>{person.jobTitle}</JobTitle>
            <Badge status={person.status} />
          </AvatarWrapper>

          <DetailRow>
            <DetailLabel>Country</DetailLabel>
            <DetailValue>{person.country}</DetailValue>
          </DetailRow>

          <DetailRow>
            <DetailLabel>Employment</DetailLabel>
            <DetailValue>
              {person.employment.charAt(0).toUpperCase() + person.employment.slice(1)}
            </DetailValue>
          </DetailRow>

          <DetailRow>
            <DetailLabel>Status</DetailLabel>
            <DetailValue>
              <Badge status={person.status} />
            </DetailValue>
          </DetailRow>

          <DetailRow>
            <DetailLabel>Annual salary</DetailLabel>
            <DetailValue>{formatSalary(person.salary, person.currency)}</DetailValue>
          </DetailRow>

          <Actions>
            <Button
              onClick={() => {
                navigate(`/people/edit/${person.id}`);
                onClose();
              }}
            >
              Edit member
            </Button>
          </Actions>
        </DrawerBody>
      )}
    </Drawer>
  );
};
