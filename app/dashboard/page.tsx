"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Bus, Plane, Ship, Train, Car } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

// Mock data for agencies
const agencies = [
  { id: 1, name: "Vatican Express", location: "Douala", image: "/placeholder.svg?height=200&width=300" },
  { id: 2, name: "General Express", location: "Yaoundé", image: "/placeholder.svg?height=200&width=300" },
  { id: 3, name: "Nso Boys", location: "Bamenda", image: "/placeholder.svg?height=200&width=300" },
  { id: 4, name: "Golden Express", location: "Buea", image: "/placeholder.svg?height=200&width=300" },
  { id: 5, name: "Musango Express", location: "Limbe", image: "/placeholder.svg?height=200&width=300" },
  { id: 6, name: "The People Express", location: "Bafoussam", image: "/placeholder.svg?height=200&width=300" },
]

// Mock data for popular destinations
const popularDestinations = [
  { id: 1, name: "Douala", image: "/placeholder.svg?height=200&width=300" },
  { id: 2, name: "Yaoundé", image: "/placeholder.svg?height=200&width=300" },
  { id: 3, name: "Bamenda", image: "/placeholder.svg?height=200&width=300" },
  { id: 4, name: "Buea", image: "/placeholder.svg?height=200&width=300" },
]

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("bus")

  const handleTransportSelect = (type: string) => {
    if (type === "bus") {
      router.push("/dashboard/bus")
    } else {
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} transport option is not yet supported.`)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to TravelEase</h1>
          <p className="text-muted-foreground mt-2">
            Book your next journey with ease. Select your preferred mode of transportation below.
          </p>
        </div>

        <Tabs defaultValue="bus" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="bus" className="flex items-center gap-2">
              <Bus className="h-4 w-4" /> Bus
            </TabsTrigger>
            <TabsTrigger value="air" className="flex items-center gap-2">
              <Plane className="h-4 w-4" /> Air
            </TabsTrigger>
            <TabsTrigger value="ship" className="flex items-center gap-2">
              <Ship className="h-4 w-4" /> Ship
            </TabsTrigger>
            <TabsTrigger value="train" className="flex items-center gap-2">
              <Train className="h-4 w-4" /> Train
            </TabsTrigger>
            <TabsTrigger value="car" className="flex items-center gap-2">
              <Car className="h-4 w-4" /> Car
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bus" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Bus Transportation</h2>
                    <Button onClick={() => handleTransportSelect("bus")}>View All Agencies</Button>
                  </div>
                  <p>Travel comfortably by bus across Cameroon. Choose from multiple agencies and routes.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {["air", "ship", "train", "car"].map((type) => (
            <TabsContent key={type} value={type} className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid gap-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">
                        {type.charAt(0).toUpperCase() + type.slice(1)} Transportation
                      </h2>
                      <Button onClick={() => handleTransportSelect(type)}>Explore Options</Button>
                    </div>
                    <p>This transportation option is not yet supported. Please check back later.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Popular Agencies</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {agencies.map((agency) => (
                <CarouselItem key={agency.id} className="md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    <Card className="overflow-hidden">
                      <div className="aspect-video relative">
                        <Image
                          src={agency.image || "/placeholder.svg"}
                          alt={agency.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{agency.name}</h3>
                        <p className="text-sm text-muted-foreground">{agency.location}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Popular Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <h3 className="text-white font-semibold p-4">{destination.name}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Travel Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Plan Ahead</h3>
              <p className="text-sm">Book your tickets at least 2-3 days in advance, especially during holidays.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Travel Documents</h3>
              <p className="text-sm">Always carry your ID card or passport when traveling between cities.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Arrival Time</h3>
              <p className="text-sm">Arrive at least 30 minutes before departure to secure your seat.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
