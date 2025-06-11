import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Save, Image, Link, Film, Tv, Tag, Plus, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

interface Episode {
  episodeNumber: number;
  videoUrl: string;
  duration: string;
}

interface Season {
  seasonNumber: number;
  name: string;
  description: string;
  year: string;
  imdbRating: string;
  genres: string[];
  tags: string[];
  cast: string[];
  directors: string[];
  writers: string[];
  thumbnailUrl: string;
  trailerUrl: string;
  episodes: Episode[];
  featuredSections: string[];
}

const ContentUploadForm = () => {
  const [contentType, setContentType] = useState("movie");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genres: [""],
    year: "",
    imdbRating: "",
    duration: "",
    directors: [""],
    writers: [""],
    cast: [""],
    thumbnailUrl: "",
    videoUrl: "",
    trailerUrl: "",
    tags: [""],
    // Movie specific
    boxOffice: "",
    // TV Show specific
    status: "ongoing",
    // Feature control
    featuredSections: [] as string[]
  });

  const [seasons, setSeasons] = useState<Season[]>([]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Generic function to handle array inputs (directors, writers, cast, genres, tags)
  const handleArrayChange = (field: string, index: number, value: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    const newArray = [...currentArray];
    newArray[index] = value;
    handleInputChange(field, newArray);
  };

  const addArrayItem = (field: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    handleInputChange(field, [...currentArray, ""]);
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    if (currentArray.length > 1) {
      const newArray = currentArray.filter((_, i) => i !== index);
      handleInputChange(field, newArray);
    }
  };

  const handleSectionToggle = (section: string) => {
    const currentSections = formData.featuredSections;
    const updatedSections = currentSections.includes(section)
      ? currentSections.filter(s => s !== section)
      : [...currentSections, section];
    handleInputChange("featuredSections", updatedSections);
  };

  const addSeason = () => {
    const newSeasonNumber = seasons.length + 1;
    const newSeason: Season = {
      seasonNumber: newSeasonNumber,
      name: `Season ${newSeasonNumber}`,
      description: "",
      year: "",
      imdbRating: "",
      genres: [""],
      tags: [""],
      cast: [""],
      directors: [""],
      writers: [""],
      thumbnailUrl: "",
      trailerUrl: "",
      episodes: [],
      featuredSections: []
    };
    setSeasons([...seasons, newSeason]);
  };

  const updateSeason = (seasonIndex: number, field: keyof Season, value: any) => {
    const newSeasons = [...seasons];
    (newSeasons[seasonIndex] as any)[field] = value;
    setSeasons(newSeasons);
  };

  const removeSeason = (seasonIndex: number) => {
    const updatedSeasons = seasons.filter((_, i) => i !== seasonIndex);
    // Reorder season numbers to maintain sequential order
    const reorderedSeasons = updatedSeasons.map((season, index) => ({
      ...season,
      seasonNumber: index + 1,
      name: `Season ${index + 1}`
    }));
    setSeasons(reorderedSeasons);
  };

  // Season array handlers
  const handleSeasonArrayChange = (seasonIndex: number, field: string, index: number, value: string) => {
    const newSeasons = [...seasons];
    const currentArray = newSeasons[seasonIndex][field as keyof Season] as string[];
    const newArray = [...currentArray];
    newArray[index] = value;
    (newSeasons[seasonIndex] as any)[field] = newArray;
    setSeasons(newSeasons);
  };

  const addSeasonArrayItem = (seasonIndex: number, field: string) => {
    const newSeasons = [...seasons];
    const currentArray = newSeasons[seasonIndex][field as keyof Season] as string[];
    (newSeasons[seasonIndex] as any)[field] = [...currentArray, ""];
    setSeasons(newSeasons);
  };

  const removeSeasonArrayItem = (seasonIndex: number, field: string, index: number) => {
    const newSeasons = [...seasons];
    const currentArray = newSeasons[seasonIndex][field as keyof Season] as string[];
    if (currentArray.length > 1) {
      (newSeasons[seasonIndex] as any)[field] = currentArray.filter((_, i) => i !== index);
      setSeasons(newSeasons);
    }
  };

  const handleSeasonSectionToggle = (seasonIndex: number, section: string) => {
    const newSeasons = [...seasons];
    const currentSections = newSeasons[seasonIndex].featuredSections;
    const updatedSections = currentSections.includes(section)
      ? currentSections.filter(s => s !== section)
      : [...currentSections, section];
    newSeasons[seasonIndex].featuredSections = updatedSections;
    setSeasons(newSeasons);
  };

  const addEpisode = (seasonIndex: number) => {
    const newSeasons = [...seasons];
    const newEpisodeNumber = newSeasons[seasonIndex].episodes.length + 1;
    const newEpisode: Episode = {
      episodeNumber: newEpisodeNumber,
      videoUrl: "",
      duration: ""
    };
    newSeasons[seasonIndex].episodes.push(newEpisode);
    setSeasons(newSeasons);
  };

  const updateEpisode = (seasonIndex: number, episodeIndex: number, field: keyof Episode, value: string | number) => {
    const newSeasons = [...seasons];
    (newSeasons[seasonIndex].episodes[episodeIndex] as any)[field] = value;
    setSeasons(newSeasons);
  };

  const removeEpisode = (seasonIndex: number, episodeIndex: number) => {
    const newSeasons = [...seasons];
    const updatedEpisodes = newSeasons[seasonIndex].episodes.filter((_, i) => i !== episodeIndex);
    // Reorder episode numbers to maintain sequential order
    const reorderedEpisodes = updatedEpisodes.map((episode, index) => ({
      ...episode,
      episodeNumber: index + 1
    }));
    newSeasons[seasonIndex].episodes = reorderedEpisodes;
    setSeasons(newSeasons);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      genres: [""],
      year: "",
      imdbRating: "",
      duration: "",
      directors: [""],
      writers: [""],
      cast: [""],
      thumbnailUrl: "",
      videoUrl: "",
      trailerUrl: "",
      tags: [""],
      boxOffice: "",
      status: "ongoing",
      featuredSections: []
    });
    setSeasons([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.thumbnailUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (contentType === "movie" && !formData.videoUrl) {
      toast.error("Please provide a video URL for the movie");
      return;
    }

    if (contentType === "tv-show" && seasons.length === 0) {
      toast.error("Please add at least one season for the TV show");
      return;
    }

    const contentData = {
      ...formData,
      type: contentType,
      genres: formData.genres.filter(g => g.trim() !== ""),
      directors: formData.directors.filter(d => d.trim() !== ""),
      writers: formData.writers.filter(w => w.trim() !== ""),
      cast: formData.cast.filter(c => c.trim() !== ""),
      tags: formData.tags.filter(t => t.trim() !== ""),
      ...(contentType === "tv-show" && { seasons })
    };

    console.log("Content data:", contentData);
    toast.success(`${contentType === "movie" ? "Movie" : "TV Show"} uploaded successfully!`);
    resetForm();
  };

  const getAvailableSections = () => {
    if (contentType === "movie") {
      return ["home-page-hero", "movie-page-hero", "new-release", "popular"];
    } else {
      return ["home-page-hero", "tv-shows-page-hero", "new-release", "popular"];
    }
  };

  const availableGenres = [
    "Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller", 
    "Documentary", "Fantasy", "Crime", "Biography", "Animation", "Adventure",
    "Mystery", "War", "Musical", "Family"
  ];

  const getAvailableGenres = (currentGenres: string[], currentValue: string = "") => {
    const usedGenres = currentGenres.filter(g => g && g !== currentValue);
    return availableGenres.filter(genre => !usedGenres.includes(genre));
  };

  const getSeasonAvailableGenres = (seasonIndex: number, currentGenres: string[], currentValue: string = "") => {
    const usedGenres = currentGenres.filter(g => g && g !== currentValue);
    return availableGenres.filter(genre => !usedGenres.includes(genre));
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload New Content
        </CardTitle>
        <CardDescription>Add movies and TV shows to your platform with detailed information</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Content Type Selection */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-foreground mb-3 block">Content Type *</Label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setContentType("movie")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                contentType === "movie" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card border border-primary/20 text-foreground hover:bg-accent"
              }`}
            >
              <Film className="h-4 w-4" />
              Movie
            </button>
            <button
              type="button"
              onClick={() => setContentType("tv-show")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                contentType === "tv-show" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card border border-primary/20 text-foreground hover:bg-accent"
              }`}
            >
              <Tv className="h-4 w-4" />
              TV Show
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder={`${contentType === "movie" ? "Movie" : "TV Show"} title`}
                  required
                />
              </div>
              {contentType === "movie" && (
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">Year *</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    placeholder="2024"
                    required
                  />
                </div>
              )}
            </div>

            {contentType === "movie" && (
              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder={`Brief description of the ${contentType}`}
                  rows={3}
                  required
                />
              </div>
            )}
          </div>

          {/* Classification - Only for Movies */}
          {contentType === "movie" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Classification</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">Genres *</Label>
                  {formData.genres.map((genre, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <select 
                        value={genre}
                        onChange={(e) => handleArrayChange("genres", index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-background border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        required={index === 0}
                      >
                        <option value="">Select Genre</option>
                        {getAvailableGenres(formData.genres, genre).map(genreOption => (
                          <option key={genreOption} value={genreOption}>{genreOption}</option>
                        ))}
                      </select>
                      {formData.genres.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeArrayItem("genres", index)}
                          className="px-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("genres")}
                    className="mt-2"
                    disabled={formData.genres.length >= availableGenres.length}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Genre
                  </Button>
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    IMDb Rating
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.imdbRating}
                    onChange={(e) => handleInputChange("imdbRating", e.target.value)}
                    placeholder="9.3"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </Label>
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={tag}
                      onChange={(e) => handleArrayChange("tags", index, e.target.value)}
                      placeholder="Enter tag"
                      className="flex-1"
                    />
                    {formData.tags.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeArrayItem("tags", index)}
                        className="px-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem("tags")}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>
            </div>
          )}

          {contentType === "movie" ? (
            <>
              {/* Cast and Crew for Movies */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Cast & Crew</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Directors */}
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">Directors *</Label>
                    {formData.directors.map((director, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          value={director}
                          onChange={(e) => handleArrayChange("directors", index, e.target.value)}
                          placeholder="Director name"
                          required={index === 0}
                        />
                        {formData.directors.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem("directors", index)}
                            className="px-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem("directors")}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Director
                    </Button>
                  </div>

                  {/* Writers */}
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">Writers</Label>
                    {formData.writers.map((writer, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          value={writer}
                          onChange={(e) => handleArrayChange("writers", index, e.target.value)}
                          placeholder="Writer name"
                        />
                        {formData.writers.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem("writers", index)}
                            className="px-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem("writers")}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Writer
                    </Button>
                  </div>

                  {/* Cast */}
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">Cast *</Label>
                    {formData.cast.map((actor, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          value={actor}
                          onChange={(e) => handleArrayChange("cast", index, e.target.value)}
                          placeholder="Actor name"
                          required={index === 0}
                        />
                        {formData.cast.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem("cast", index)}
                            className="px-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem("cast")}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Actor
                    </Button>
                  </div>
                </div>
              </div>

              {/* Movie Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Movie Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">Duration *</Label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      placeholder="120 min"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">Box Office</Label>
                    <Input
                      value={formData.boxOffice}
                      onChange={(e) => handleInputChange("boxOffice", e.target.value)}
                      placeholder="$100M worldwide"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Movie Video URL *
                  </Label>
                  <Input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                    placeholder="https://example.com/movie.mp4"
                    required
                  />
                </div>
              </div>

              {/* Media URLs for Movies */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Media Links</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Movie Thumbnail URL *
                    </Label>
                    <Input
                      type="url"
                      value={formData.thumbnailUrl}
                      onChange={(e) => handleInputChange("thumbnailUrl", e.target.value)}
                      placeholder="https://example.com/thumbnail.jpg"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                      <Film className="h-4 w-4" />
                      Movie Trailer URL
                    </Label>
                    <Input
                      type="url"
                      value={formData.trailerUrl}
                      onChange={(e) => handleInputChange("trailerUrl", e.target.value)}
                      placeholder="https://example.com/trailer.mp4"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Sections for Movies */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Featured Sections</h3>
                <p className="text-sm text-muted-foreground">Select where this content should appear on the platform</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getAvailableSections().map((section) => {
                    const sectionLabels: Record<string, string> = {
                      "home-page-hero": "Home Page Hero",
                      "movie-page-hero": "Movie Page Hero",
                      "new-release": "New Release",
                      "popular": "Popular"
                    };

                    return (
                      <label key={section} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featuredSections.includes(section)}
                          onChange={() => handleSectionToggle(section)}
                          className="w-4 h-4 text-primary bg-background border-primary/20 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-foreground">{sectionLabels[section]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Seasons Management for TV Shows */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-foreground">Seasons</h3>
                  <Button
                    type="button"
                    onClick={addSeason}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Season
                  </Button>
                </div>

                {seasons.map((season, seasonIndex) => (
                  <Card key={seasonIndex} className="border border-primary/20">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">{season.name}</CardTitle>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSeason(seasonIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-foreground mb-2 block">Season Name</Label>
                          <Input
                            value={season.name}
                            onChange={(e) => updateSeason(seasonIndex, "name", e.target.value)}
                            placeholder={`Season ${season.seasonNumber}`}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-foreground mb-2 block">Year</Label>
                          <Input
                            type="number"
                            value={season.year}
                            onChange={(e) => updateSeason(seasonIndex, "year", e.target.value)}
                            placeholder="2024"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            IMDb Rating
                          </Label>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={season.imdbRating}
                            onChange={(e) => updateSeason(seasonIndex, "imdbRating", e.target.value)}
                            placeholder="9.3"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-foreground mb-2 block">Description</Label>
                        <Textarea
                          value={season.description}
                          onChange={(e) => updateSeason(seasonIndex, "description", e.target.value)}
                          placeholder="Season description"
                          rows={2}
                        />
                      </div>

                      {/* Season Genres */}
                      <div>
                        <Label className="text-sm font-medium text-foreground mb-2 block">Genres *</Label>
                        {season.genres.map((genre, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <select 
                              value={genre}
                              onChange={(e) => handleSeasonArrayChange(seasonIndex, "genres", index, e.target.value)}
                              className="flex-1 px-3 py-2 bg-background border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                              required={index === 0}
                            >
                              <option value="">Select Genre</option>
                              {getSeasonAvailableGenres(seasonIndex, season.genres, genre).map(genreOption => (
                                <option key={genreOption} value={genreOption}>{genreOption}</option>
                              ))}
                            </select>
                            {season.genres.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeSeasonArrayItem(seasonIndex, "genres", index)}
                                className="px-2 h-8"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addSeasonArrayItem(seasonIndex, "genres")}
                          className="mt-2 h-8 text-xs"
                          disabled={season.genres.length >= availableGenres.length}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Genre
                        </Button>
                      </div>

                      {/* Season Tags */}
                      <div>
                        <Label className="text-sm font-medium text-foreground mb-2 block">Tags</Label>
                        {season.tags.map((tag, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <Input
                              value={tag}
                              onChange={(e) => handleSeasonArrayChange(seasonIndex, "tags", index, e.target.value)}
                              placeholder="Enter tag"
                              className="flex-1"
                            />
                            {season.tags.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeSeasonArrayItem(seasonIndex, "tags", index)}
                                className="px-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addSeasonArrayItem(seasonIndex, "tags")}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Tag
                        </Button>
                      </div>

                      {/* Season Cast & Crew */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Season Cast */}
                        <div>
                          <Label className="text-sm font-medium text-foreground mb-2 block">Cast</Label>
                          {season.cast.map((actor, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <Input
                                value={actor}
                                onChange={(e) => handleSeasonArrayChange(seasonIndex, "cast", index, e.target.value)}
                                placeholder="Actor name"
                                className="text-sm"
                              />
                              {season.cast.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeSeasonArrayItem(seasonIndex, "cast", index)}
                                  className="px-2 h-8"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSeasonArrayItem(seasonIndex, "cast")}
                            className="mt-2 h-8 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Actor
                          </Button>
                        </div>

                        {/* Season Directors */}
                        <div>
                          <Label className="text-sm font-medium text-foreground mb-2 block">Directors</Label>
                          {season.directors.map((director, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <Input
                                value={director}
                                onChange={(e) => handleSeasonArrayChange(seasonIndex, "directors", index, e.target.value)}
                                placeholder="Director name"
                                className="text-sm"
                              />
                              {season.directors.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeSeasonArrayItem(seasonIndex, "directors", index)}
                                  className="px-2 h-8"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSeasonArrayItem(seasonIndex, "directors")}
                            className="mt-2 h-8 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Director
                          </Button>
                        </div>

                        {/* Season Writers */}
                        <div>
                          <Label className="text-sm font-medium text-foreground mb-2 block">Writers</Label>
                          {season.writers.map((writer, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <Input
                                value={writer}
                                onChange={(e) => handleSeasonArrayChange(seasonIndex, "writers", index, e.target.value)}
                                placeholder="Writer name"
                                className="text-sm"
                              />
                              {season.writers.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeSeasonArrayItem(seasonIndex, "writers", index)}
                                  className="px-2 h-8"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSeasonArrayItem(seasonIndex, "writers")}
                            className="mt-2 h-8 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Writer
                          </Button>
                        </div>
                      </div>

                      {/* Season Media URLs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-foreground mb-2 block">Season Thumbnail URL</Label>
                          <Input
                            type="url"
                            value={season.thumbnailUrl}
                            onChange={(e) => updateSeason(seasonIndex, "thumbnailUrl", e.target.value)}
                            placeholder="https://example.com/season-thumbnail.jpg"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-foreground mb-2 block">Season Trailer URL</Label>
                          <Input
                            type="url"
                            value={season.trailerUrl}
                            onChange={(e) => updateSeason(seasonIndex, "trailerUrl", e.target.value)}
                            placeholder="https://example.com/season-trailer.mp4"
                          />
                        </div>
                      </div>

                      {/* Season Featured Sections */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Featured Sections</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {getAvailableSections().map((section) => {
                            const sectionLabels: Record<string, string> = {
                              "home-page-hero": "Home Page Hero",
                              "tv-shows-page-hero": "TV Shows Page Hero",
                              "new-release": "New Release",
                              "popular": "Popular"
                            };

                            return (
                              <label key={section} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={season.featuredSections.includes(section)}
                                  onChange={() => handleSeasonSectionToggle(seasonIndex, section)}
                                  className="w-3 h-3 text-primary bg-background border-primary/20 rounded focus:ring-primary"
                                />
                                <span className="text-xs text-foreground">{sectionLabels[section]}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Episodes */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-foreground">Episodes</h4>
                          <Button
                            type="button"
                            onClick={() => addEpisode(seasonIndex)}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Episode
                          </Button>
                        </div>

                        {season.episodes.map((episode, episodeIndex) => (
                          <Card key={episodeIndex} className="border border-muted">
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start mb-3">
                                <h5 className="font-medium text-sm">Episode {episode.episodeNumber}</h5>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeEpisode(seasonIndex, episodeIndex)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs font-medium text-foreground mb-1 block">Video URL *</Label>
                                  <Input
                                    type="url"
                                    value={episode.videoUrl}
                                    onChange={(e) => updateEpisode(seasonIndex, episodeIndex, "videoUrl", e.target.value)}
                                    placeholder="https://example.com/episode.mp4"
                                    className="h-8 text-sm"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs font-medium text-foreground mb-1 block">Duration *</Label>
                                  <Input
                                    value={episode.duration}
                                    onChange={(e) => updateEpisode(seasonIndex, episodeIndex, "duration", e.target.value)}
                                    placeholder="45 min"
                                    className="h-8 text-sm"
                                    required
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          <Button type="submit" className="w-full gap-2">
            <Save className="h-4 w-4" />
            Save {contentType === "movie" ? "Movie" : "TV Show"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContentUploadForm;
