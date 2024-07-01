import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const storyIds = await response.json();
  const top100Ids = storyIds.slice(0, 100);
  const storyPromises = top100Ids.map(async (id) => {
    const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    return storyResponse.json();
  });
  return Promise.all(storyPromises);
};

function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-3xl text-center font-bold mb-4">Hacker News Top Stories</h1>
      <Input
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500">Failed to load stories.</p>
      ) : (
        <div className="space-y-4">
          {filteredStories.map((story) => (
            <Card key={story.id}>
              <CardHeader>
                <CardTitle>{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Upvotes: {story.score}</p>
                <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  Read more
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Index;