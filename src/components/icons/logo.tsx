import type { SVGProps } from 'react';
import { Ambulance } from 'lucide-react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <Ambulance {...props} />
  );
}
