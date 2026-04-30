import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Button } from '@/ui-kit/button';
import { createPerson } from '../../services/peopleApi';
import { Person } from '../../types';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  jobTitle: z.string().min(1, 'Job title is required'),
  country: z.string().min(1, 'Country is required'),
  employment: z.enum(['employee', 'contractor'] as const),
  status: z.enum(['active', 'onboarding', 'offboarded'] as const),
  salary: z
    .number({ error: 'Salary must be a number' })
    .positive('Salary must be positive'),
  currency: z.enum(['USD', 'EUR', 'GBP'] as const),
});

type FormData = z.infer<typeof schema>;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const FieldLabel = styled.label`
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--colors-gray-700);
`;

const Input = styled.input`
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--colors-gray-300);
  border-radius: 8px;
  font-size: 1.4rem;
  color: var(--colors-gray-800);
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: var(--colors-brand);
  }

  &[aria-invalid='true'] {
    border-color: var(--colors-redPink);
  }
`;

const Select = styled.select`
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--colors-gray-300);
  border-radius: 8px;
  font-size: 1.4rem;
  color: var(--colors-gray-800);
  background: var(--colors-blank);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--colors-brand);
  }

  &[aria-invalid='true'] {
    border-color: var(--colors-redPink);
  }
`;

const ErrorMsg = styled.span`
  font-size: 1.2rem;
  color: var(--colors-redPink);
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const CancelButton = styled.button`
  height: 44px;
  padding: 0 20px;
  border: 1px solid var(--colors-gray-300);
  border-radius: 24px;
  background: none;
  color: var(--colors-gray-700);
  font-size: 1.4rem;
  cursor: pointer;

  &:hover {
    border-color: var(--colors-gray-500);
  }
`;

const SuccessToast = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--colors-success);
  color: var(--colors-blank);
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1.4rem;
  z-index: 2000;
  animation: slideUp 0.2s ease;

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  countries: string[];
};

export const AddMemberModal = ({ isOpen, onClose, countries }: Props) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'active',
      employment: 'employee',
      currency: 'USD',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      const person: Omit<Person, 'id'> = {
        name: data.name,
        jobTitle: data.jobTitle,
        country: data.country,
        employment: data.employment,
        status: data.status,
        // API stores salary in cents
        salary: Math.round(data.salary * 100),
        currency: data.currency,
        photo: '',
      };
      return createPerson(person);
    },
    onMutate: async (data) => {
      // Optimistic update: cancel outgoing queries and insert new person at top
      await queryClient.cancelQueries({ queryKey: ['people'] });
      const tempPerson: Person = {
        id: Date.now(),
        name: data.name,
        jobTitle: data.jobTitle,
        country: data.country,
        employment: data.employment,
        status: data.status,
        salary: Math.round(data.salary * 100),
        currency: data.currency,
        photo: '',
      };
      return { tempPerson };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['people-infinite'] });
      reset();
      onClose();
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} title="Add member">
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldRow>
            <Field>
              <FieldLabel htmlFor="name">Full name *</FieldLabel>
              <Input
                id="name"
                {...register('name')}
                aria-invalid={!!errors.name}
                placeholder="Jane Smith"
              />
              {errors.name && <ErrorMsg role="alert">{errors.name.message}</ErrorMsg>}
            </Field>

            <Field>
              <FieldLabel htmlFor="jobTitle">Job title *</FieldLabel>
              <Input
                id="jobTitle"
                {...register('jobTitle')}
                aria-invalid={!!errors.jobTitle}
                placeholder="Software Engineer"
              />
              {errors.jobTitle && (
                <ErrorMsg role="alert">{errors.jobTitle.message}</ErrorMsg>
              )}
            </Field>
          </FieldRow>

          <FieldRow>
            <Field>
              <FieldLabel htmlFor="country">Country *</FieldLabel>
              <Select
                id="country"
                {...register('country')}
                aria-invalid={!!errors.country}
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
              {errors.country && (
                <ErrorMsg role="alert">{errors.country.message}</ErrorMsg>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="employment">Employment type *</FieldLabel>
              <Select id="employment" {...register('employment')}>
                <option value="employee">Employee</option>
                <option value="contractor">Contractor</option>
              </Select>
            </Field>
          </FieldRow>

          <FieldRow>
            <Field>
              <FieldLabel htmlFor="status">Status *</FieldLabel>
              <Select id="status" {...register('status')}>
                <option value="active">Active</option>
                <option value="onboarding">Onboarding</option>
                <option value="offboarded">Offboarded</option>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="currency">Currency</FieldLabel>
              <Select id="currency" {...register('currency')}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </Select>
            </Field>
          </FieldRow>

          <Field>
            <FieldLabel htmlFor="salary">Annual salary *</FieldLabel>
            <Input
              id="salary"
              type="number"
              {...register('salary', { valueAsNumber: true })}
              aria-invalid={!!errors.salary}
              placeholder="60000"
              min={0}
            />
            {errors.salary && (
              <ErrorMsg role="alert">{errors.salary.message}</ErrorMsg>
            )}
          </Field>

          {mutation.isError && (
            <ErrorMsg role="alert">
              Failed to add member. Please try again.
            </ErrorMsg>
          )}

          <Footer>
            <CancelButton type="button" onClick={handleClose}>
              Cancel
            </CancelButton>
            <Button type="submit" $isLoading={isSubmitting || mutation.isPending}>
              Add member
            </Button>
          </Footer>
        </Form>
      </Modal>

      {mutation.isSuccess && (
        <SuccessToast role="status" aria-live="polite">
          Member added successfully!
        </SuccessToast>
      )}
    </>
  );
};
