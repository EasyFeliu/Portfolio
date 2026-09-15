import { GithubIcon, LinkedinIcon } from "@/components/icons";
import type { SocialNetwork } from "@/lib/content";

/** Mapa exhaustivo red → icono: añadir una red obliga a añadir su icono. */
const icons: Record<SocialNetwork, (props: React.SVGProps<SVGSVGElement>) => React.ReactElement> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
};

export function SocialIcon({
  network,
  className,
}: {
  network: SocialNetwork;
  className?: string;
}) {
  const Icon = icons[network];
  return <Icon className={className} />;
}
