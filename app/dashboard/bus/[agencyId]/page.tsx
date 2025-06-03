"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, MapPin, Users } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

// Mock data for agencies
const agencies = {
  "1": {
    id: 1,
    name: "Vatican Express",
    location: "Douala",
    image: "/placeholder.svg?height=200&width=300",
  },
  "2": {
    id: 2,
    name: "General Express",
    location: "Yaoundé",
    image: "/placeholder.svg?height=200&width=300",
  },
  "3": {
    id: 3,
    name: "Nso Boys",
    location: "Bamenda",
    image: "/placeholder.svg?height=200&width=300",
  },
  "4": {
    id: 4,
    name: "Golden Express",
    location: "Buea",
    image: "/placeholder.svg?height=200&width=300",
  },
  "5": {
    id: 5,
    name: "Musango Express",
    location: "Limbe",
    image: "/placeholder.svg?height=200&width=300",
  },
  "6": {
    id: 6,
    name: "The People Express",
    location: "Bafoussam",
    image: "/placeholder.svg?height=200&width=300",
  },
}

// Mock data for buses
const buses = {
  "1": [
    {
      id: 101,
      busNumber: "VE-001",
      destination: "Yaoundé",
      departureTime: "08:00",
      arrivalTime: "06:30",
      totalSeats: 45,
      availableSeats: 12,
      price: 5000,
      image: "/placeholder.svg?height=150&width=300",
    },
    {
      id: 102,
      busNumber: "VE-002",
      destination: "Bamenda",
      departureTime: "09:30",
      arrivalTime: "08:00",
      totalSeats: 45,
      availableSeats: 8,
      price: 6500,
      image: "/placeholder.svg?height=150&width=300",
    },
    {
      id: 103,
      busNumber: "VE-003",
      destination: "Buea",
      departureTime: "10:45",
      arrivalTime: "09:15",
      totalSeats: 45,
      availableSeats: 20,
      price: 4000,
      image: "/placeholder.svg?height=150&width=300",
    },
    {
      id: 104,
      busNumber: "VE-004",
      destination: "Limbe",
      departureTime: "12:00",
      arrivalTime: "10:30",
      totalSeats: 45,
      availableSeats: 15,
      price: 4500,
      image: "/placeholder.svg?height=150&width=300",
    },
    {
      id: 105,
      busNumber: "VE-005",
      destination: "Bafoussam",
      departureTime: "14:30",
      arrivalTime: "13:00",
      totalSeats: 45,
      availableSeats: 5,
      price: 5500,
      image: "/placeholder.svg?height=150&width=300",
    },
  ],
  "2": [
    {
      id: 201,
      busNumber: "GE-001",
      destination: "Douala",
      departureTime: "07:30",
      arrivalTime: "06:00",
      totalSeats: 50,
      availableSeats: 10,
      price: 5000,
      image: "/placeholder.svg?height=150&width=300",
    },
    {
      id: 202,
      busNumber: "GE-002",
      destination: "Bamenda",
      departureTime: "08:45",
      arrivalTime: "07:15",
      totalSeats: 50,
      availableSeats: 15,
      price: 7000,
      image: "/placeholder.svg?height=150&width=300",
    },
  ],
  "3": [
    {
      id: 301,
      busNumber: "NB-001",
      destination: "Douala",
      departureTime: "06:00",
      arrivalTime: "04:30",
      totalSeats: 40,
      availableSeats: 5,
      price: 6500,
      image: "/placeholder.svg?height=150&width=300",
    },
  ],
  "4": [
    {
      id: 401,
      busNumber: "GX-001",
      destination: "Douala",
      departureTime: "07:00",
      arrivalTime: "05:30",
      totalSeats: 45,
      availableSeats: 20,
      price: 4000,
      image: "/placeholder.svg?height=150&width=300",
    },
  ],
  "5": [
    {
      id: 501,
      busNumber: "ME-001",
      destination: "Douala",
      departureTime: "08:15",
      arrivalTime: "06:45",
      totalSeats: 42,
      availableSeats: 18,
      price: 4500,
      image: "/placeholder.svg?height=150&width=300",
    },
  ],
  "6": [
    {
      id: 601,
      busNumber: "PE-001",
      destination: "Douala",
      departureTime: "07:45",
      arrivalTime: "06:15",
      totalSeats: 48,
      availableSeats: 22,
      price: 5500,
      image: "/placeholder.svg?height=150&width=300",
    },
  ],
}

export default function AgencyBusesPage() {
  const { agencyId } = useParams()
  const [searchTerm, setSearchTerm] = useState("")

  const agency = agencies[agencyId as keyof typeof agencies]
  const agencyBuses = buses[agencyId as keyof typeof buses] || []

  const filteredBuses = agencyBuses.filter(
    (bus) =>
      bus.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!agency) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Agency not found</h1>
          <p className="mt-2 text-muted-foreground">The agency you are looking for does not exist.</p>
          <Link href="/dashboard/bus">
            <Button className="mt-6">Back to Agencies</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{agency.name}</h1>
            <p className="text-muted-foreground mt-2 flex items-center">
              <MapPin className="h-4 w-4 mr-1" /> {agency.location}
            </p>
          </div>
          <Link href="/dashboard/bus">
            <Button variant="outline">Back to Agencies</Button>
          </Link>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search buses by destination or bus number..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredBuses.length > 0 ? (
            filteredBuses.map((bus) => (
              <Link key={bus.id} href={`/dashboard/bus/${agencyId}/${bus.id}`}>
                <Card className="overflow-hidden transition-all hover:shadow-md">
                  <div className="md:flex">
                    <div className="md:w-1/4 relative">
                      <div className="aspect-video md:h-full relative">
                        <Image
                          src={bus.image || "/placeholder.svg"}
                          alt={`Bus ${bus.busNumber}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <CardContent className="p-4 md:p-6 md:w-3/4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-semibold text-lg">{bus.destination}</h3>
                            <Badge variant="outline" className="ml-2">
                              {bus.busNumber}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-2">
                            <Clock className="h-4 w-4 mr-1" />
                            Departure: {bus.departureTime} | Arrival: {bus.arrivalTime}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                          <div className="text-lg font-semibold">{bus.price.toLocaleString()} CFA</div>
                          <div className="flex items-center justify-end text-sm text-muted-foreground mt-1">
                            <Users className="h-4 w-4 mr-1" />
                            {bus.availableSeats} / {bus.totalSeats} seats available
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold">No buses found</h2>
              <p className="mt-2 text-muted-foreground">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
