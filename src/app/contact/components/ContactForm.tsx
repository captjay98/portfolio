"use client";

import { useState, FormEvent } from "react";
import { Bird } from "lucide-react";
import { contactService } from "@/services/contactService";

export default function ContactForm() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Real API call to contact service
      await contactService.submitContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      // Success response
      setSubmitStatus({
        success: true,
        message: "Message sent successfully! I'll get back to you soon.",
      });

      // Clear form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error response
      setSubmitStatus({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);

      // Clear status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({});
      }, 5000);
    }
  };

  return (
    <div className="bg-glass rounded-xl shadow-elevated effect-3d overflow-hidden border border-light-subtle/10 dark:border-dark-subtle/20 p-6">
      <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
        Prepare the Pigeon
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="animate-fade-in" style={{ animationDelay: "250ms" }}>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-light-text dark:text-dark-text mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md bg-light-subtle/5 dark:bg-dark-subtle/5 
                border border-light-subtle/20 dark:border-dark-subtle/20 
                focus:outline-none focus:ring-1 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40 
                focus:border-light-accent/60 dark:focus:border-dark-accent/60 
                text-light-text dark:text-dark-text transition-colors duration-200"
              placeholder="The pigeon can't talk"
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "350ms" }}>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-light-text dark:text-dark-text mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-md bg-light-subtle/5 dark:bg-dark-subtle/5 
                border border-light-subtle/20 dark:border-dark-subtle/20 
                focus:outline-none focus:ring-1 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40 
                focus:border-light-accent/60 dark:focus:border-dark-accent/60 
                text-light-text dark:text-dark-text transition-colors duration-200"
              placeholder="So the pigeon can find the way back"
            />
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "450ms" }}>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-light-text dark:text-dark-text mb-1"
          >
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-md bg-light-subtle/5 dark:bg-dark-subtle/5 
              border border-light-subtle/20 dark:border-dark-subtle/20 
              focus:outline-none focus:ring-1 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40 
              focus:border-light-accent/60 dark:focus:border-dark-accent/60 
              text-light-text dark:text-dark-text transition-colors duration-200"
            placeholder="To get my Attention?"
          />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "550ms" }}>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-light-text dark:text-dark-text mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-3 py-2 rounded-md bg-light-subtle/5 dark:bg-dark-subtle/5 
              border border-light-subtle/20 dark:border-dark-subtle/20 
              focus:outline-none focus:ring-1 focus:ring-light-accent/40 dark:focus:ring-dark-accent/40 
              focus:border-light-accent/60 dark:focus:border-dark-accent/60 
              text-light-text dark:text-dark-text transition-colors duration-200 resize-y"
            placeholder="And then Finally...... the gist"
          ></textarea>
        </div>

        {/* Form status message */}
        {submitStatus.message && (
          <div
            className={`p-3 rounded-md ${
              submitStatus.success
                ? "bg-green-100/30 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                : "bg-red-100/30 dark:bg-red-900/20 text-red-800 dark:text-red-300"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <div className="animate-fade-in" style={{ animationDelay: "650ms" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-6 py-3 bg-accent-gradient text-white rounded-md shadow-accent flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>Releasing Pigeon...</>
            ) : (
              <>
                Release The Pigeon{" "}
                <Bird size={16} className="ml-2 animate-bounce" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
