import { Text } from '@/ui-kit/text';
import { ReactElement } from 'react';
import styled from 'styled-components';

const Link = styled.a`
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 16px;
  transition: box-shadow 250ms ease;

  &:hover,
  &:focus {
    outline: none;
    text-decoration: none;
    box-shadow: 0 0 3px var(--colors-brand);
  }
`;

const Avatar = styled.img`
  display: block;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background-color: var(--colors-gray-400);
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
  line-height: 1.3;
`;

export const Profile = (props: {
  name: string;
  role: string;
  picUrl: string;
}): ReactElement => {
  const { name, picUrl, role } = props;

  return (
    <Link href="#profile-page">
      <Avatar src={picUrl} alt="Profile picture" />
      <Info>
        <Text $variant="bodyM">{name}</Text>
        <Text $variant="bodyXS" $color="gray-500">
          {role}
        </Text>
      </Info>
    </Link>
  );
};
