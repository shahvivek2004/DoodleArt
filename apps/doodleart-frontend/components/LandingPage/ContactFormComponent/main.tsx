"use client";
import { Send } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";

export default function ContactFormComponent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);

    alert("Message sent successfully!");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-gray-700 mb-2 font-medium"
          >
            Name
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Your full name"
            required
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="block text-gray-700 mb-2 font-medium"
          >
            Email
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="block text-gray-700 mb-2 font-medium"
        >
          Subject
        </label>
        <input
          type="text"
          id="contact-subject"
          name="subject"
          autoComplete="off"
          value={formData.subject}
          onChange={handleChange}
          className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="What's this about?"
          required
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-gray-700 mb-2 font-medium"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          autoComplete="off"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          placeholder="Tell us about your project..."
          required
        ></textarea>
      </div>

      <button
        onClick={handleSubmit}
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
    </div>
  );
}
