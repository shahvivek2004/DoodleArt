import { Mail, Phone, MapPin } from "lucide-react";
import NavBar from "@/components/LandingPage/NavBarComponent/NavBar";
import SideBar from "@/components/LandingPage/SideBarComponent/SideBar";
import NavButton from "@/components/LandingPage/NavBarComponent/ButtonComponent/NavButton";
import ContactFormComponent from "@/components/LandingPage/ContactFormComponent/main";

export default async function ContactPage() {
  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <NavBar />
      <SideBar />

      {/* Main Content */}
      <div className="h-screen container mx-auto px-4 py-16 overflow-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Get In <span className="text-purple-600">Touch</span> With Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about DoodleArt? We&apos;d love to hear from you.
            Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              <p className="text-gray-600 mb-8">
                Ready to start creating amazing art? Choose your preferred way
                to reach out to us.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold">Email Us</h3>
                    <p className="text-gray-600">vivekshahdev@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold">Call Us</h3>
                    <p className="text-gray-600"></p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold">Visit Us</h3>
                    <p className="text-gray-600"></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">RT</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Real-time</h3>
                <p className="text-sm text-gray-600">Collaboration</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">MU</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Multiple Users
                </h3>
                <p className="text-sm text-gray-600">Editing</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">SD</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Smart</h3>
                <p className="text-sm text-gray-600">Drawings</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h2>
            <ContactFormComponent />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your{" "}
              <span className="text-purple-600">Creative</span> Journey?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of artists who are already creating amazing artwork
              with DoodleArt.
            </p>
            <NavButton
              route="/dashboard"
              style="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Get Started Now
            </NavButton>
          </div>
        </div>
      </div>
    </div>
  );
}
