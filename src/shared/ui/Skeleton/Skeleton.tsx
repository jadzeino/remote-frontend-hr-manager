import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

type SkeletonProps = {
  $width?: string;
  $height?: string;
  $borderRadius?: string;
};

export const Skeleton = styled.span<SkeletonProps>`
  display: block;
  width: ${({ $width }) => $width ?? '100%'};
  height: ${({ $height }) => $height ?? '16px'};
  border-radius: ${({ $borderRadius }) => $borderRadius ?? '4px'};
  background: linear-gradient(
    90deg,
    var(--colors-gray-200) 25%,
    var(--colors-gray-100) 50%,
    var(--colors-gray-200) 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;
