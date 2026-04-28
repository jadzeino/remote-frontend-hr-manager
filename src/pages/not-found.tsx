import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@/ui-kit/button';

const Container = styled.main`
  max-width: var(--layout-width);
  margin: 0 auto;
  padding: 80px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
`;

const Code = styled.p`
  font-size: 8rem;
  font-weight: 800;
  color: var(--colors-gray-200);
  line-height: 1;
  letter-spacing: -4px;
`;

const Title = styled.h1`
  ${({ theme }) => theme.typography.h2}
  color: var(--colors-darkBlue);
`;

const Description = styled.p`
  font-size: 1.4rem;
  color: var(--colors-gray-500);
  max-width: 380px;
`;

const Path = styled.code`
  display: inline-block;
  margin-top: 4px;
  padding: 2px 8px;
  background: var(--colors-gray-100);
  border-radius: 6px;
  font-size: 1.3rem;
  color: var(--colors-gray-600);
  word-break: break-all;
`;

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Container>
      <Code aria-hidden="true">404</Code>
      <Title>Page not found</Title>
      <Description>
        The page you're looking for doesn't exist or has been moved.
        <br />
        <Path>{pathname}</Path>
      </Description>
      <Button onClick={() => navigate('/')} style={{ marginTop: 8 }}>
        Back to People
      </Button>
    </Container>
  );
};
