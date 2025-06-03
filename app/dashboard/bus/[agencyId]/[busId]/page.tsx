"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, MapPin, User, Calendar } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

// Mock data for agencies
const agencies = {
  "1": {
    id: 1,
    name: "Vatican Express",
    location: "Douala",
  },
  "2": {
    id: 2,
    name: "General Express",
    location: "Yaoundé",
  },
  "3": {
    id: 3,
    name: "Nso Boys",
    location: "Bamenda",
  },
  "4": {
    id: 4,
    name: "Golden Express",
    location: "Buea",
  },
  "5": {
    id: 5,
    name: "Musango Express",
    location: "Limbe",
  },
  "6": {
    id: 6,
    name: "The People Express",
    location: "Bafoussam",
  },
}

// Mock data for buses
const busesData = {
  "101": {
    id: 101,
    agencyId: 1,
    busNumber: "VE-001",
    destination: "Yaoundé",
    departureTime: "08:00",
    arrivalTime: "06:30",
    totalSeats: 45,
    availableSeats: 12,
    price: 5000,
    image: "/placeholder.svg?height=300&width=600",
    driverName: "Emmanuel Mbarga",
    driverAge: 42,
    features: ["Air Conditioning", "WiFi", "Reclining Seats", "USB Charging"],
  },
  "102": {
    id: 102,
    agencyId: 1,
    busNumber: "VE-002",
    destination: "Bamenda",
    departureTime: "09:30",
    arrivalTime: "08:00",
    totalSeats: 45,
    availableSeats: 8,
    price: 6500,
    image: "/placeholder.svg?height=300&width=600",
    driverName: "Paul Nkeng",
    driverAge: 38,
    features: ["Air Conditioning", "Reclining Seats"],
  },
  "201": {
    id: 201,
    agencyId: 2,
    busNumber: "GE-001",
    destination: "Douala",
    departureTime: "07:30",
    arrivalTime: "06:00",
    totalSeats: 50,
    availableSeats: 10,
    price: 5000,
    image: "/placeholder.svg?height=300&width=600",
    driverName: "Jean Tabi",
    driverAge: 45,
    features: ["Air Conditioning", "WiFi", "Reclining Seats", "USB Charging", "Snacks"],
  },
}

export default function BusDetailsPage() {
  const router = useRouter()
  const { agencyId, busId } = useParams()

  // Find the bus data
  const bus = busesData[busId as keyof typeof busesData]
  const agency = agencies[agencyId as keyof typeof agencies]

  const [showReservationForm, setShowReservationForm] = useState(false)
  const [reservationData, setReservationData] = useState({
    fullName: "",
    idNumber: "",
    seatNumber: "",
    phoneNumber: "",
    numberOfSeats: "1",
  })

  if (!bus || !agency) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold">Bus not found</h1>
          <p className="mt-2 text-muted-foreground">The bus you are looking for does not exist.</p>
          <Link href={`/dashboard/bus/${agencyId}`}>
            <Button className="mt-6">Back to Buses</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const handleReserveClick = () => {
    setShowReservationForm(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setReservationData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Store reservation data in localStorage for the payment page
    localStorage.setItem(
      "reservationData",
      JSON.stringify({
        ...reservationData,
        bus,
        agency,
        totalPrice: bus.price * Number.parseInt(reservationData.numberOfSeats),
      }),
    )
    router.push(`/dashboard/bus/${agencyId}/${busId}/payment`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bus Details</h1>
            <p className="text-muted-foreground mt-2">
              {agency.name} - Bus {bus.busNumber}
            </p>
          </div>
          <Link href={`/dashboard/bus/${agencyId}`}>
            <Button variant="outline">Back to Buses</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <div className="aspect-video relative">
              <Image src={bus.image || "/placeholder.svg"} alt={`Bus ${bus.busNumber}`} fill className="object-cover" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center">
                    <h2 className="text-2xl font-bold">{bus.destination}</h2>
                    <Badge variant="outline" className="ml-2">
                      {bus.busNumber}
                    </Badge>
                  </div>
                  <div className="flex items-center text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    From: {agency.location}
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-2xl font-bold">{bus.price.toLocaleString()} CFA</div>
                  <div className="text-sm text-muted-foreground">per seat</div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Schedule</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Departure: {bus.departureTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Arrival: {bus.arrivalTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Today</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Driver Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Name: {bus.driverName}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Age: {bus.driverAge} years</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-semibold mb-2">Bus Features</h3>
                <div className="flex flex-wrap gap-2">
                  {bus.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="font-semibold mb-2">Seat Availability</h3>
                <div className="flex items-center">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-md font-medium">
                    {bus.availableSeats} / {bus.totalSeats}
                  </div>
                  <span className="ml-2 text-muted-foreground">seats available</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {!showReservationForm ? (
              <Card>
                <CardHeader>
                  <CardTitle>Reserve Your Seat</CardTitle>
                  <CardDescription>Book now to secure your seat on this bus</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Price per seat:</span>
                      <span className="font-semibold">{bus.price.toLocaleString()} CFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available seats:</span>
                      <span className="font-semibold">
                        {bus.availableSeats} / {bus.totalSeats}
                      </span>
                    </div>
                    {bus.availableSeats > 0 ? (
                      <Button onClick={handleReserveClick} className="w-full">
                        Reserve a Seat
                      </Button>
                    ) : (
                      <Button disabled className="w-full">
                        Fully Booked
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Reservation Form</CardTitle>
                  <CardDescription>Fill in your details to reserve your seat</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleReservationSubmit} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name (as on ID)</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={reservationData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="idNumber">ID Card Number</Label>
                      <Input
                        id="idNumber"
                        name="idNumber"
                        value={reservationData.idNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="seatNumber">Preferred Seat Number</Label>
                      <Input
                        id="seatNumber"
                        name="seatNumber"
                        type="number"
                        min="1"
                        max={bus.totalSeats}
                        value={reservationData.seatNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={reservationData.phoneNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="numberOfSeats">Number of Seats</Label>
                      <Input
                        id="numberOfSeats"
                        name="numberOfSeats"
                        type="number"
                        min="1"
                        max={Math.min(bus.availableSeats, 5)}
                        value={reservationData.numberOfSeats}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between mb-4">
                        <span>Total Cost:</span>
                        <span className="font-semibold">
                          {(bus.price * Number.parseInt(reservationData.numberOfSeats || "1")).toLocaleString()} CFA
                        </span>
                      </div>
                      <Button type="submit" className="w-full">
                        Proceed to Payment
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
