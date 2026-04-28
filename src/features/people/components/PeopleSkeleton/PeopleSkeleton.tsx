import { TableCell, TableRow } from '@/ui-kit/table';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';

const ROW_COUNT = 10;

type Props = {
  colCount?: number;
};

export const PeopleSkeletonRows = ({ colCount = 6 }: Props) => {
  return (
    <>
      {Array.from({ length: ROW_COUNT }).map((_, i) => (
        <TableRow key={i} aria-hidden="true">
          <TableCell>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Skeleton $width="32px" $height="32px" $borderRadius="50%" />
              <Skeleton $width="140px" $height="14px" />
            </div>
          </TableCell>
          {Array.from({ length: colCount - 1 }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton $width={j === colCount - 2 ? '80px' : '100px'} $height="14px" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
