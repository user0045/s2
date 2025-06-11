
import { useState } from "react";
import { Calendar, Save, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface UpcomingUploadFormProps {
  onSuccess?: () => void;
}

const UpcomingUploadForm = ({ onSuccess }: UpcomingUploadFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    genres: [] as string[],
    episodes: "",
    release_date: "",
    description: "",
    thumbnail_url: "",
    trailer_url: "",
    section_order: ""
  });
  const [newGenre, setNewGenre] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addGenre = () => {
    if (newGenre.trim() && !formData.genres.includes(newGenre.trim())) {
      setFormData(prev => ({
        ...prev,
        genres: [...prev.genres, newGenre.trim()]
      }));
      setNewGenre("");
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(genre => genre !== genreToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.genres.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one genre",
        variant: "destructive"
      });
      return;
    }

    // Check if there are already 20 upcoming content items
    const { count, error: countError } = await supabase
      .from('upcoming_content')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      toast({
        title: "Error",
        description: "Failed to check existing content count",
        variant: "destructive"
      });
      return;
    }

    if (count && count >= 20) {
      toast({
        title: "Error",
        description: "Maximum of 20 upcoming content items allowed. Please delete some items first.",
        variant: "destructive"
      });
      return;
    }

    const newOrder = parseInt(formData.section_order);
    
    // Check if the chosen order is taken and adjust if needed
    const { data: existingContent, error: fetchError } = await supabase
      .from('upcoming_content')
      .select('section_order')
      .gte('section_order', newOrder)
      .order('section_order', { ascending: true });

    if (fetchError) {
      toast({
        title: "Error",
        description: "Failed to check existing orders",
        variant: "destructive"
      });
      return;
    }

    // If there's content with the same or higher order, we need to shift them
    if (existingContent && existingContent.length > 0) {
      // Shift existing orders up by 1
      for (const content of existingContent) {
        await supabase
          .from('upcoming_content')
          .update({ section_order: content.section_order + 1 })
          .eq('section_order', content.section_order);
      }
    }
    
    // Insert the new content
    const { error } = await supabase
      .from('upcoming_content')
      .insert({
        title: formData.title,
        type: formData.type as "movie" | "tv",
        genres: formData.genres,
        episodes: formData.type === "tv" && formData.episodes ? parseInt(formData.episodes) : null,
        release_date: formData.release_date,
        description: formData.description,
        thumbnail_url: formData.thumbnail_url || null,
        trailer_url: formData.trailer_url || null,
        section_order: newOrder
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add upcoming content",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Success",
      description: existingContent && existingContent.length > 0 
        ? "Upcoming content added successfully! Orders adjusted automatically."
        : "Upcoming content added successfully!"
    });

    // Reset form
    setFormData({
      title: "",
      type: "",
      genres: [],
      episodes: "",
      release_date: "",
      description: "",
      thumbnail_url: "",
      trailer_url: "",
      section_order: ""
    });

    // Close form if callback provided
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Calendar className="h-5 w-5 text-primary" />
          Add Upcoming Content
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Upload information about upcoming movies and TV shows
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter content title"
                className="bg-input border-border text-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-foreground">Content Type</Label>
              <Select onValueChange={(value) => handleInputChange("type", value)} required>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="tv">TV Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Genres</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                placeholder="Add a genre (e.g., Action, Sci-Fi)"
                className="bg-input border-border text-foreground"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
              />
              <Button type="button" onClick={addGenre} variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.genres.map((genre) => (
                <Badge key={genre} variant="secondary" className="flex items-center gap-1">
                  {genre}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeGenre(genre)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.type === "tv" && (
              <div className="space-y-2">
                <Label htmlFor="episodes" className="text-foreground">Number of Episodes</Label>
                <Input
                  id="episodes"
                  type="number"
                  min="1"
                  value={formData.episodes}
                  onChange={(e) => handleInputChange("episodes", e.target.value)}
                  placeholder="Enter number of episodes"
                  className="bg-input border-border text-foreground"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="section_order" className="text-foreground">Section Order (1-20)</Label>
              <Select onValueChange={(value) => handleInputChange("section_order", value)} required>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Select order position" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="release_date" className="text-foreground">Release Date</Label>
            <Input
              id="release_date"
              type="date"
              value={formData.release_date}
              onChange={(e) => handleInputChange("release_date", e.target.value)}
              className="bg-input border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter content description..."
              rows={4}
              className="bg-input border-border text-foreground resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnail_url" className="text-foreground">Thumbnail URL</Label>
              <Input
                id="thumbnail_url"
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) => handleInputChange("thumbnail_url", e.target.value)}
                placeholder="https://example.com/thumbnail.jpg"
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trailer_url" className="text-foreground">Trailer URL</Label>
              <Input
                id="trailer_url"
                type="url"
                value={formData.trailer_url}
                onChange={(e) => handleInputChange("trailer_url", e.target.value)}
                placeholder="https://example.com/trailer.mp4"
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Upcoming Content
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpcomingUploadForm;
