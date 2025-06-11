
import PremiumNavbar from "@/components/PremiumNavbar";
import HeroSlider from "@/components/HeroSlider";
import SimplePremiumContentRow from "@/components/SimplePremiumContentRow";
import { useQuery } from "@tanstack/react-query";

interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: string;
  year: string;
  type: "movie" | "tv";
}

const Index = () => {
  const { data: contentLibrary = [] } = useQuery({
    queryKey: ['/api/content'],
    select: (data: any[]) => {
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        genre: Array.isArray(item.genres) ? item.genres.join(" • ") : item.genre || "",
        rating: item.rating,
        year: item.releaseYear ? item.releaseYear.toString() : new Date(item.createdAt).getFullYear().toString(),
        type: item.type === "Movie" ? "movie" as const : "tv" as const
      }));
    }
  });

  // Fallback content if no database content exists
  const fallbackContent: Movie[] = [
    { id: 1, title: "Oppenheimer", genre: "Biography • Drama", rating: "R", year: "2023", type: "movie" },
    { id: 2, title: "Barbie", genre: "Comedy • Adventure", rating: "PG-13", year: "2023", type: "movie" },
    { id: 3, title: "Spider-Man: Across the Spider-Verse", genre: "Animation • Action", rating: "PG", year: "2023", type: "movie" },
    { id: 4, title: "Guardians of the Galaxy Vol. 3", genre: "Action • Adventure", rating: "PG-13", year: "2023", type: "movie" },
    { id: 5, title: "Fast X", genre: "Action • Crime", rating: "PG-13", year: "2023", type: "movie" },
    { id: 6, title: "The Little Mermaid", genre: "Family • Musical", rating: "PG", year: "2023", type: "movie" },
    { id: 7, title: "The Last of Us", genre: "Drama • Horror", rating: "TV-MA", year: "2023", type: "tv" },
    { id: 8, title: "Wednesday", genre: "Comedy • Horror", rating: "TV-14", year: "2022", type: "tv" },
    { id: 9, title: "House of the Dragon", genre: "Fantasy • Drama", rating: "TV-MA", year: "2022", type: "tv" },
    { id: 10, title: "Stranger Things", genre: "Sci-Fi • Horror", rating: "TV-14", year: "2022", type: "tv" },
  ];

  const contentToUse = contentLibrary.length > 0 ? contentLibrary : fallbackContent;

  // Get latest 11 items for each category
  const getLatest11 = (filterFn: (item: Movie) => boolean): Movie[] => {
    return contentToUse
      .filter(filterFn)
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, 11);
  };

  const newReleases = getLatest11(() => true);
  const popular = getLatest11(() => true);
  const actionAdventure = getLatest11(item => 
    item.genre.toLowerCase().includes('action') || 
    item.genre.toLowerCase().includes('adventure')
  );
  const comedy = getLatest11(item => 
    item.genre.toLowerCase().includes('comedy')
  );
  const crime = getLatest11(item => 
    item.genre.toLowerCase().includes('crime')
  );
  const drama = getLatest11(item => 
    item.genre.toLowerCase().includes('drama')
  );
  const horror = getLatest11(item => 
    item.genre.toLowerCase().includes('horror')
  );
  const mysteryThriller = getLatest11(item => 
    item.genre.toLowerCase().includes('mystery') || 
    item.genre.toLowerCase().includes('thriller')
  );
  const sciFi = getLatest11(item => 
    item.genre.toLowerCase().includes('sci-fi')
  );

  const handleContentAction = (contentId: number, action: string) => {
    console.log(`${action} content with ID: ${contentId}`);
  };

  const handleSeeMore = (sectionTitle: string) => {
    console.log(`See more for section: ${sectionTitle}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <PremiumNavbar />
      
      <div className="pt-20">
        <HeroSlider />
        
        <div className="container mx-auto pb-12">
          <SimplePremiumContentRow 
            title="New Releases" 
            movies={newReleases}
            contentType="all"
            onMoviePlay={(id) => handleContentAction(id, "Play")}
            onMovieMoreInfo={(id) => handleContentAction(id, "More info")}
            onSeeMore={() => handleSeeMore("New Releases")}
          />
          
          <SimplePremiumContentRow 
            title="Popular" 
            movies={popular}
            contentType="all"
            onMoviePlay={(id) => handleContentAction(id, "Play")}
            onMovieMoreInfo={(id) => handleContentAction(id, "More info")}
            onSeeMore={() => handleSeeMore("Popular")}
          />
          
          <SimplePremiumContentRow 
            title="Action & Adventure" 
            movies={actionAdventure}
            contentType="all"
            onMoviePlay={(id) => handleContentAction(id, "Play")}
            onMovieMoreInfo={(id) => handleContentAction(id, "More info")}
            onSeeMore={() => handleSeeMore("Action & Adventure")}
          />
          
          <SimplePremiumContentRow 
            title="Comedy" 
            movies={comedy}
            contentType="all"
            onMoviePlay={(id) => handleContentAction(id, "Play")}
            onMovieMoreInfo={(id) => handleContentAction(id, "More info")}
            onSeeMore={() => handleSeeMore("Comedy")}
          />
          
          <SimplePremiumContentRow 
            title="Crime" 
            movies={crime}
            contentType="all"
            onMoviePlay={(id) => handleContentAction(id, "Play")}
            onMovieMoreInfo={(id) => handleContentAction(id, "More info")}
            onSeeMore={() => handleSeeMore("Crime")}
          />
          
          <SimplePremiumContentRow 
            title="Drama" 
            movies={drama}
            contentType="all"
            onMoviePlay={(id) => handleContentAction(id, "Play")}
            onMovieMoreInfo={(id) => handleContentAction(id, "More info")}
            onSeeMore={() => handleSeeMore("Drama")}
          />
          
          <SimplePremiumContentRow 
            title="Horror" 
            movies={horror}
            contentType="all"
            onMoviePlay={(id) => handleContentAction(id, "Play")}
            onMovieMoreInfo={(id) => handleContentAction(id, "More info")}
            onSeeMore={() => handleSeeMore("Horror")}
          />
          
          <SimplePremiumContentRow 
            title="Mystery & Thriller" 
            movies={mysteryThriller}
            contentType="all"
            onMoviePlay={(id) => handleContentAction(id, "Play")}
            onMovieMoreInfo={(id) => handleContentAction(id, "More info")}
            onSeeMore={() => handleSeeMore("Mystery & Thriller")}
          />
          
          <SimplePremiumContentRow 
            title="Sci-Fi" 
            movies={sciFi}
            contentType="all"
            onMoviePlay={(id) => handleContentAction(id, "Play")}
            onMovieMoreInfo={(id) => handleContentAction(id, "More info")}
            onSeeMore={() => handleSeeMore("Sci-Fi")}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
