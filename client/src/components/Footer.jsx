import React from "react";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 px-6 md:px-12 py-6 flex items-center justify-between text-sm text-gray-700">
      <span className="flex items-center gap-1.5 font-medium">
        <span className="text-base">©</span> KenineCorp
      </span>
      <div className="flex items-center gap-6">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 hover:text-emerald-600"
        >
          <Github size={16} /> GitHub
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 hover:text-emerald-600"
        >
          <Linkedin size={16} /> LinkedIn
        </a>
      </div>
    </footer>
  );
}
