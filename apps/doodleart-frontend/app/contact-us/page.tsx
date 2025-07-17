'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import NavBar from '@/components/Home/NavBar';
import SideBar from '@/components/Home/SideBar';
import { useRouter } from 'next/navigation';

export default function ContactPage() {

    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Reset form
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
        setIsSubmitting(false);

        alert('Message sent successfully!');
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

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
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                            <p className="text-gray-600 mb-8">
                                Ready to start creating amazing art? Choose your preferred way to reach out to us.
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
                                <h3 className="font-semibold text-gray-900 mb-1">Multiple Users</h3>
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="What's this about?"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 mb-2 font-medium">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Tell us about your project..."
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="text-center mt-16">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Ready to Start Your <span className="text-purple-600">Creative</span> Journey?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Join thousands of artists who are already creating amazing artwork with DoodleArt.
                        </p>
                        <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors" onClick={() => { router.push('/dashboard') }}>
                            Get Started Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}