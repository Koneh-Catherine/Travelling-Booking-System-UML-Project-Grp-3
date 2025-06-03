import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-4">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-foreground">TravelEase</h1>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="secondary">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary to-primary/80 py-20 text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-4xl font-bold mb-4">Book Your Journey with Ease</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Find and book the best transportation options across Cameroon. Simple, fast, and reliable booking
              experience.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-16 container">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose TravelEase?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Wide Selection</h3>
              <p>Choose from multiple transportation options and agencies across Cameroon.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Easy Booking</h3>
              <p>Simple and straightforward booking process with secure payment options.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Digital Tickets</h3>
              <p>Get your tickets instantly and access them anytime, anywhere.</p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {["Douala", "Yaoundé", "Bamenda", "Buea", "Limbe", "Bafoussam", "Garoua", "Maroua"].map((city) => (
                <div
                  key={city}
                  className="bg-card p-4 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium">{city}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">TravelEase</h3>
              <p>Your trusted partner for all travel needs in Cameroon.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <p>Email: info@travelease.com</p>
              <p>Phone: +237 123 456 789</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} TravelEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
