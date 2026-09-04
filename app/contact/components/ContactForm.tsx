"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { contactService } from "@app/services/contactService";

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
      await contactService.submitContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setSubmitStatus({
        success: true,
        message: "Message sent successfully! I will get back to you soon.",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        success: false,
        message: "Something went wrong. Please write directly to captjay98@gmail.com.",
      });
    } finally {
      setIsSubmitting(false);

      setTimeout(() => {
        setSubmitStatus({});
      }, 6000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-mono uppercase tracking-wider text-light-subtle dark:text-dark-subtle mb-1.5"
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
            className="w-full px-3.5 py-2.5 rounded-lg bg-light-subtle/5 dark:bg-[#0a0e14] 
              border border-light-subtle/20 dark:border-[#1e2430] 
              focus:outline-none focus:ring-1 focus:ring-[#e6b450]/40 focus:border-[#e6b450] 
              text-sm text-light-text dark:text-dark-text transition-colors duration-200 placeholder:text-light-subtle/40 dark:placeholder:text-dark-subtle/40"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-mono uppercase tracking-wider text-light-subtle dark:text-dark-subtle mb-1.5"
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
            className="w-full px-3.5 py-2.5 rounded-lg bg-light-subtle/5 dark:bg-[#0a0e14] 
              border border-light-subtle/20 dark:border-[#1e2430] 
              focus:outline-none focus:ring-1 focus:ring-[#e6b450]/40 focus:border-[#e6b450] 
              text-sm text-light-text dark:text-dark-text transition-colors duration-200 placeholder:text-light-subtle/40 dark:placeholder:text-dark-subtle/40"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-xs font-mono uppercase tracking-wider text-light-subtle dark:text-dark-subtle mb-1.5"
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
          className="w-full px-3.5 py-2.5 rounded-lg bg-light-subtle/5 dark:bg-[#0a0e14] 
            border border-light-subtle/20 dark:border-[#1e2430] 
            focus:outline-none focus:ring-1 focus:ring-[#e6b450]/40 focus:border-[#e6b450] 
            text-sm text-light-text dark:text-dark-text transition-colors duration-200 placeholder:text-light-subtle/40 dark:placeholder:text-dark-subtle/40"
          placeholder="Project collaboration / Engineering inquiry"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs font-mono uppercase tracking-wider text-light-subtle dark:text-dark-subtle mb-1.5"
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
          className="w-full px-3.5 py-2.5 rounded-lg bg-light-subtle/5 dark:bg-[#0a0e14] 
            border border-light-subtle/20 dark:border-[#1e2430] 
            focus:outline-none focus:ring-1 focus:ring-[#e6b450]/40 focus:border-[#e6b450] 
            text-sm text-light-text dark:text-dark-text transition-colors duration-200 resize-y placeholder:text-light-subtle/40 dark:placeholder:text-dark-subtle/40"
          placeholder="Tell me about what you are building, your timeline, or any questions..."
        ></textarea>
      </div>

      {/* Form status message */}
      {submitStatus.message && (
        <div
          className={`p-3.5 rounded-lg text-xs font-mono flex items-center gap-2.5 border ${
            submitStatus.success
              ? "bg-[#aad94c]/10 border-[#aad94c]/30 text-[#aad94c]"
              : "bg-[#f07178]/10 border-[#f07178]/30 text-[#f07178]"
          }`}
        >
          {submitStatus.success ? (
            <CheckCircle2 size={15} className="shrink-0" />
          ) : (
            <AlertCircle size={15} className="shrink-0" />
          )}
          <span>{submitStatus.message}</span>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#e6b450] text-[#0a0e14] font-mono text-xs font-semibold hover:bg-[#e6b450]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-xs active:scale-[0.99] cursor-pointer"
        >
          {isSubmitting ? (
            <span>Sending...</span>
          ) : (
            <>
              <span>Send Message</span>
              <Send size={13} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
