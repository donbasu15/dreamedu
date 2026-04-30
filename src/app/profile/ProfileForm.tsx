"use client";

import { useState } from "react";
import { updateProfile } from "../actions/profile";

type UserProfile = {
  name: string | null;
  email: string;
  currentInstitution: string | null;
  gradeOrClass: string | null;
  phone: string | null;
  address: string | null;
  role: string;
};

export default function ProfileForm({ user }: { user: UserProfile }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      currentInstitution: formData.get("currentInstitution") as string,
      gradeOrClass: formData.get("gradeOrClass") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
    };

    try {
      await updateProfile(data);
      setMessage("Profile updated successfully!");
    } catch (error: any) {
      setMessage(error.message || "An error occurred while updating profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md text-sm font-medium ${message.includes("success") ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
        <input
          type="email"
          disabled
          defaultValue={user.email}
          className="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm text-slate-500 dark:text-slate-400 sm:text-sm cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Your email address cannot be changed.</p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={user.name || ""}
          required
          className="mt-1 block w-full px-3 py-2 bg-card dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
        />
      </div>

      <div>
        <label htmlFor="currentInstitution" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Current Institution</label>
        <input
          type="text"
          name="currentInstitution"
          id="currentInstitution"
          defaultValue={user.currentInstitution || ""}
          placeholder="e.g. Guwahati University"
          className="mt-1 block w-full px-3 py-2 bg-card dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
        />
      </div>

      <div>
        <label htmlFor="gradeOrClass" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Grade / Class / Level</label>
        <select
          name="gradeOrClass"
          id="gradeOrClass"
          defaultValue={user.gradeOrClass || ""}
          className="mt-1 block w-full px-3 py-2 bg-card dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
        >
          <option value="" disabled>Select your level</option>
          <option value="Class 1-5">Class 1-5</option>
          <option value="Class 6-8">Class 6-8</option>
          <option value="Class 9-10">Class 9-10</option>
          <option value="Class 11-12">Class 11-12</option>
          <option value="Undergraduate">Undergraduate</option>
          <option value="Postgraduate">Postgraduate</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
        <input
          type="tel"
          name="phone"
          id="phone"
          defaultValue={user.phone || ""}
          placeholder="+91 9876543210"
          className="mt-1 block w-full px-3 py-2 bg-card dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
        <textarea
          name="address"
          id="address"
          rows={3}
          defaultValue={user.address || ""}
          placeholder="Your full address..."
          className="mt-1 block w-full px-3 py-2 bg-card dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
        ></textarea>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Profile"
          )}
        </button>
      </div>
    </form>
  );
}
