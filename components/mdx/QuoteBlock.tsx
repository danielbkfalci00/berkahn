"use client";

import { Quote } from "lucide-react";

interface QuoteBlockProps {
  children: React.ReactNode;
  author?: string;
  role?: string;
  variant?: "default" | "highlight" | "minimal";
}

export function QuoteBlock({
  children,
  author,
  role,
  variant = "default",
}: QuoteBlockProps) {
  if (variant === "minimal") {
    return (
      <blockquote className="my-8 border-l-4 border-neutral-300 pl-6 italic text-neutral-600">
        {children}
        {author && (
          <footer className="mt-4 text-sm not-italic text-neutral-500">
            — {author}
            {role && <span className="text-neutral-400">, {role}</span>}
          </footer>
        )}
      </blockquote>
    );
  }

  if (variant === "highlight") {
    return (
      <div className="my-8 bg-green-50 border border-green-200 rounded-xl p-8">
        <Quote className="h-8 w-8 text-green-300 mb-4" />
        <blockquote className="text-xl font-medium text-green-900 leading-relaxed">
          {children}
        </blockquote>
        {author && (
          <footer className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-green-200" />
            <span className="text-sm font-medium text-green-700">
              {author}
              {role && <span className="font-normal text-green-600">, {role}</span>}
            </span>
          </footer>
        )}
      </div>
    );
  }

  return (
    <div className="my-8 bg-neutral-50 border border-neutral-200 rounded-xl p-8">
      <Quote className="h-8 w-8 text-neutral-300 mb-4" />
      <blockquote className="text-xl font-medium text-neutral-800 leading-relaxed">
        {children}
      </blockquote>
      {author && (
        <footer className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-sm font-medium text-neutral-600">
            {author}
            {role && <span className="font-normal text-neutral-500">, {role}</span>}
          </span>
        </footer>
      )}
    </div>
  );
}
