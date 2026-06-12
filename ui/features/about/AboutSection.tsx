import { TeamMemberCard } from '@/components/TeamMemberCard';
import { teamMembers } from '@/features/about/team-data';

export function AboutSection() {
  return (
    <section id="about" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">درباره ما</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            تیم ما با تمرکز بر تجربه توسعه‌دهندگان ایرانی، زیرساختی شفاف و قابل اعتماد برای
            انتخاب میرور ارائه می‌دهد.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
