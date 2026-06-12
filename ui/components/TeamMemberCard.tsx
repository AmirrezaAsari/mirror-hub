import { Link2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { TeamMember } from '@/types';

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card className="transition-transform hover:-translate-y-1">
      <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-cyan/20 text-xl font-bold text-primary">
          {member.initials}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{member.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
        </div>
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
        >
          <Link2 className="h-4 w-4" />
          LinkedIn
        </a>
      </CardContent>
    </Card>
  );
}
