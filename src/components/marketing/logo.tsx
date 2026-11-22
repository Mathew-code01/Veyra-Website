import Image from 'next/image';

export type VeyraLogoSize = 'sm' | 'md' | 'lg';

interface VeyraLogoProps {
  size?: VeyraLogoSize;
  className?: string;
}

const SIZE_MAP: Record<VeyraLogoSize, number> = {
  sm: 24,
  md: 32,
  lg: 48,
};

export function VeyraLogo({ size = 'md', className }: VeyraLogoProps) {
  const dimension = SIZE_MAP[size];
  return (
    <Image
      src="/veyra-symbol.svg"
      alt=""
      width={dimension}
      height={dimension}
      className={className}
      aria-hidden="true"
    />
  );
}
