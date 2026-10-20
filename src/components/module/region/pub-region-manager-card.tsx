import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { IManager } from "@/types";
import { badgeText, getFallbackText, statusVarient } from "@/utils";
import { formatServiceDate } from "../services/details-util";

type Props = {
  manager: IManager;
};

const PubRegionManagerCard = ({ manager }: Props) => {
  return (
    <Card className="gap-0 p-4 shadow-none">
      <div className="flex items-start gap-3">
        <Avatar className="size-11 shrink-0 ring-1 ring-primary/15">
          <AvatarImage
            src={manager.user.profileImg ?? ""}
            alt={manager.user.name}
          />
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {getFallbackText(manager.user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold">{manager.user.name}</p>
            <Badge
              variant={statusVarient(manager.verificationStatus)}
              className="rounded-full"
            >
              {badgeText(manager.verificationStatus)}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">Region manager</p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5 border-t border-border/70 pt-3 text-sm">
        <a
          href={`mailto:${manager.user.email}`}
          className="flex min-w-0 items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <Mail className="size-4 shrink-0 text-primary" aria-hidden />
          <span className="truncate">{manager.user.email}</span>
        </a>

        <a
          href={manager.phone ? `tel:${manager.phone}` : undefined}
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <Phone className="size-4 shrink-0 text-primary" aria-hidden />
          <span>{manager.phone || "Phone not shared"}</span>
        </a>

        <p className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
          <span className="truncate">
            {manager.address?.city || "Address not shared"}
          </span>
        </p>

        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden />
          <span>Joined {formatServiceDate(manager.createdAt)}</span>
        </p>
      </div>
    </Card>
  );
};

export default PubRegionManagerCard;
