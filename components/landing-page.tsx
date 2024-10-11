'use client'

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, User, Bell, Search, Users, MessageSquare, Flame, Check } from 'lucide-react'
import Link from 'next/link'

// Mock data for featured communities
const featuredCommunities = [
  { id: 1, name: "Tech Enthusiasts", description: "A community for tech lovers to discuss the latest innovations and gadgets.", image: "/placeholder.svg?height=400&width=800" },
  { id: 2, name: "Bookworms Unite", description: "Connect with fellow book lovers and discover your next great read.", image: "/placeholder.svg?height=400&width=800" },
  { id: 3, name: "Fitness Fanatics", description: "Share workout tips, nutrition advice, and stay motivated together.", image: "/placeholder.svg?height=400&width=800" },
]

// Mock data for community cards
const communityCards = [
  { id: 1, name: "Gamers' Paradise", description: "For all gaming enthusiasts", image: "/placeholder.svg?height=200&width=400", members: 5420, posts: 1200, category: "Entertainment", tags: ["Gaming", "Esports", "Streaming"], isHot: true, joined: true },
  { id: 2, name: "Foodies' Corner", description: "Share recipes and food experiences", image: "/placeholder.svg?height=200&width=400", members: 3890, posts: 950, category: "Lifestyle", tags: ["Cooking", "Recipes", "Restaurants"], joined: false },
  { id: 3, name: "Travel Bugs", description: "Explore the world together", image: "/placeholder.svg?height=200&width=400", members: 7650, posts: 2300, category: "Lifestyle", tags: ["Adventure", "Culture", "Photography"], joined: true },
  { id: 4, name: "Movie Buffs", description: "Discuss and review films", image: "/placeholder.svg?height=200&width=400", members: 4200, posts: 1800, category: "Entertainment", tags: ["Cinema", "Reviews", "Discussions"], joined: false },
  { id: 5, name: "Pet Lovers", description: "For those who adore their furry friends", image: "/placeholder.svg?height=200&width=400", members: 6100, posts: 3100, category: "Lifestyle", tags: ["Dogs", "Cats", "Pet Care"], joined: false },
  { id: 6, name: "DIY Crafters", description: "Share your creative projects", image: "/placeholder.svg?height=200&width=400", members: 2900, posts: 1500, category: "Hobbies", tags: ["Crafts", "DIY", "Upcycling"], joined: true },
  { id: 7, name: "Music Maestros", description: "For music creators and enthusiasts", image: "/placeholder.svg?height=200&width=400", members: 5300, posts: 2700, category: "Arts", tags: ["Instruments", "Composition", "Concerts"], joined: false },
  { id: 8, name: "Green Thumbs", description: "Gardening tips and plant care", image: "/placeholder.svg?height=200&width=400", members: 3400, posts: 890, category: "Hobbies", tags: ["Plants", "Gardening", "Sustainability"], joined: false },
  { id: 9, name: "Tech Innovators", description: "Discussing the latest in technology", image: "/placeholder.svg?height=200&width=400", members: 8200, posts: 3500, category: "Technology", tags: ["Innovation", "Startups", "AI"], joined: true },
  { id: 10, name: "Fitness Enthusiasts", description: "Share workout routines and health tips", image: "/placeholder.svg?height=200&width=400", members: 6800, posts: 2100, category: "Health", tags: ["Workout", "Nutrition", "Wellness"], joined: false },
  { id: 11, name: "Language Exchange", description: "Practice languages with native speakers", image: "/placeholder.svg?height=200&width=400", members: 4500, posts: 1800, category: "Education", tags: ["Languages", "Culture", "Learning"], joined: false },
  { id: 12, name: "Art Collective", description: "Showcase and discuss various art forms", image: "/placeholder.svg?height=200&width=400", members: 3900, posts: 2200, category: "Arts", tags: ["Painting", "Sculpture", "Digital Art"], joined: true },
]

export function LandingPageComponent() {
  const [currentFeatured, setCurrentFeatured] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const nextFeatured = () => {
    setCurrentFeatured((prev) => (prev + 1) % featuredCommunities.length)
  }

  const prevFeatured = () => {
    setCurrentFeatured((prev) => (prev - 1 + featuredCommunities.length) % featuredCommunities.length)
  }

  const filteredCommunities = useMemo(() => {
    return communityCards.filter(community => 
      (categoryFilter === 'All' || community.category === categoryFilter) &&
      (community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
       community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  }, [searchQuery, categoryFilter])

  const paginatedCommunities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredCommunities.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredCommunities, currentPage])

  const totalPages = Math.ceil(filteredCommunities.length / itemsPerPage)

  const groupedCommunities = useMemo(() => {
    return paginatedCommunities.reduce((acc, community) => {
      if (!acc[community.category]) {
        acc[community.category] = [];
      }
      acc[community.category].push(community);
      return acc;
    }, {} as Record<string, typeof communityCards>)
  }, [paginatedCommunities])

  const categories = ['All', ...new Set(communityCards.map(c => c.category))]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">SocialEngage</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="#" className="hover:text-primary">Home</Link></li>
              <li><Link href="#" className="hover:text-primary">Browse</Link></li>
              <li><Link href="#" className="hover:text-primary">My Communities</Link></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon"><Search className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Featured Communities Carousel */}
        <section className="relative mb-12">
          <div className="overflow-hidden rounded-lg">
            <div className="relative h-[400px]">
              <img
                src={featuredCommunities[currentFeatured].image}
                alt={featuredCommunities[currentFeatured].name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-8">
                <div className="text-white">
                  <h2 className="text-4xl font-bold mb-2">{featuredCommunities[currentFeatured].name}</h2>
                  <p className="text-lg mb-4">{featuredCommunities[currentFeatured].description}</p>
                  <Button>Join Community</Button>
                </div>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 transform -translate-y-1/2" onClick={prevFeatured}>
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2" onClick={nextFeatured}>
            <ChevronRight className="h-8 w-8" />
          </Button>
        </section>

        {/* Search and Filter */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Community Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Discover Communities</h2>
          {Object.entries(groupedCommunities).map(([category, communities]) => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {communities.map((community) => (
                  <Card key={community.id} className="overflow-hidden">
                    <CardHeader className="p-0 relative">
                      <img src={community.image} alt={community.name} className="w-full h-32 object-cover" />
                      {community.isHot && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full flex items-center">
                          <Flame className="w-4 h-4 mr-1" />
                          Hot
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="mb-2">{community.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mb-4">{community.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {community.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {community.members.toLocaleString()} members
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {community.posts.toLocaleString()} posts
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted">
                      {community.joined ? (
                        <Button className="w-full" variant="outline">
                          <Check className="w-4 h-4 mr-2" />
                          Joined
                        </Button>
                      ) : (
                        <Button className="w-full">Join Community</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Pagination */}
        <section className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button variant="outline" disabled>
              Page {currentPage} of {totalPages}
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">About Us</h3>
              <p className="text-sm text-muted-foreground">SocialEngage is a platform for connecting people with shared interests and passions.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3  className="font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="hover:text-primary">Facebook</Link>
                <Link href="#" className="hover:text-primary">Twitter</Link>
                <Link href="#" className="hover:text-primary">Instagram</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © 2024 SocialEngage. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}