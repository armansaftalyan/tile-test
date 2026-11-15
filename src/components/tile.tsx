import { type TileId } from '@/lib/catalog';
export function Tile({
  id,
  icon = false,
  className = '',
}: {
  id: TileId;
  icon?: boolean;
  className?: string;
}) {
  const src = `/tiles/${id}${icon && ['ocean', 'fern', 'dot', 'star'].includes(id) ? '-icon' : ''}.webp`;
  // Small local reference crops are intentionally rendered without image transformation.
  return (
    <img src={src} alt="" draggable={false} className={`h-full w-full object-cover ${className}`} />
  );
}
