
import { useQuery } from "@tanstack/react-query";
import PremiumNavbar from "@/components/PremiumNavbar";
import UpcomingCard from "@/components/UpcomingCard";

interface UpcomingContent {
  id: string;
  title: string;
  genres: string[];
  episodes: number | null;
  releaseDate: string;
  description: string;
  type: "movie" | "tv";
  thumbnailUrl: string | null;
  trailerUrl: string | null;
  sectionOrder: number;
}

const Upcoming = () => {
  const { data: upcomingContent = [] } = useQuery({
    queryKey: ['/api/upcoming-content'],
    select: (data: any[]) => {
      const today = new Date().toISOString().split('T')[0];
      return data
        .filter(item => item.releaseDate >= today)
        .sort((a, b) => a.sectionOrder - b.sectionOrder)
        .slice(0, 20) as UpcomingContent[];
    }
  });

  const displayContent = upcomingContent;

  return (
    <div className="min-h-screen bg-background">
      <PremiumNavbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-thin uppercase tracking-[0.3em] text-foreground mb-12 font-mono">Coming Soon</h1>
          
          <div className="space-y-6">
            {displayContent.map((content) => (
              <UpcomingCard
                key={content.id}
                title={content.title}
                genre={Array.isArray(content.genres) ? content.genres.join(" • ") : content.genres || ""}
                releaseDate={content.releaseDate}
                description={content.description}
                type={content.type}
                thumbnailUrl={content.thumbnailUrl || ""}
                trailerUrl={content.trailerUrl || ""}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upcoming;
