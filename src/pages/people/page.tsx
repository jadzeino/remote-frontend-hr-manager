import { Checkbox } from '@/ui-kit/checkbox';
import { SearchInput } from '@/ui-kit/search-input';
import { ReactElement, useState } from 'react';
import { Container, Filters, Title, Toolbar } from './page.styled';
import { PeopleTable } from './PeopleTable';

export const PeoplePage = (): ReactElement => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    setStatusFilter(checked ? status : '');
  };

  return (
    <Container>
      <Title>People</Title>

      <Toolbar>
        <SearchInput
          placeholder="Search people..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Filters>
          <Checkbox
            label="Active"
            checked={statusFilter === 'active'}
            onChange={(e) =>
              handleStatusFilterChange('active', e.target.checked)
            }
          />
          <Checkbox
            label="Onboarding"
            checked={statusFilter === 'onboarding'}
            onChange={(e) =>
              handleStatusFilterChange('onboarding', e.target.checked)
            }
          />
          <Checkbox
            label="Offboarded"
            checked={statusFilter === 'offboarded'}
            onChange={(e) =>
              handleStatusFilterChange('offboarded', e.target.checked)
            }
          />
        </Filters>
      </Toolbar>

      <PeopleTable search={search} />
    </Container>
  );
};
