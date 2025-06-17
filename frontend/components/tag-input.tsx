"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus, Hash } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  suggestions?: string[];
  maxTags?: number;
  placeholder?: string;
}

export function TagInput({
  tags,
  onTagsChange,
  suggestions = [],
  maxTags = 10,
  placeholder = "Add a tag...",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input and exclude already added tags
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions
        .filter(
          (suggestion) =>
            suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
            !tags.includes(suggestion.toLowerCase())
        )
        .slice(0, 8); // Limit to 8 suggestions
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      // Show popular suggestions when input is empty
      const popular = suggestions
        .filter((suggestion) => !tags.includes(suggestion.toLowerCase()))
        .slice(0, 12);
      setFilteredSuggestions(popular);
      setShowSuggestions(false);
    }
  }, [inputValue, tags, suggestions]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();

    // Validation
    if (!trimmedTag) return;
    if (trimmedTag.length < 2 || trimmedTag.length > 20) return;
    if (tags.includes(trimmedTag)) return;
    if (tags.length >= maxTags) return;

    // Add tag
    onTagsChange([...tags, trimmedTag]);
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-3">
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-[#2a2a2a] rounded-lg border border-gray-600">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              className="bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30 hover:bg-[#1DB954]/30 transition-colors"
            >
              <Hash className="w-3 h-3 mr-1" />
              {tag}
              <Button
                type="button"
                onClick={() => removeTag(tag)}
                className="w-4 h-4 ml-1 bg-transparent hover:bg-red-500/20 text-[#1DB954] hover:text-red-400 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={
            tags.length >= maxTags
              ? `Maximum ${maxTags} tags reached`
              : placeholder
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay hiding suggestions to allow clicking
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          disabled={tags.length >= maxTags}
          className="bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus:border-[#1DB954] focus:ring-[#1DB954] pr-10"
          maxLength={20}
        />
        <Button
          type="button"
          onClick={() => addTag(inputValue)}
          disabled={!inputValue.trim() || tags.length >= maxTags}
          className="absolute right-1 top-1 h-8 w-8 bg-[#1DB954] hover:bg-[#1ed760] text-black disabled:bg-gray-600 disabled:text-gray-400"
        >
          <Plus className="w-4 h-4" />
        </Button>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#2a2a2a] border border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            <div className="p-2">
              <p className="text-xs text-gray-400 mb-2 px-2">
                {inputValue ? "Matching tags:" : "Popular tags:"}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left px-2 py-1 text-sm text-gray-300 hover:bg-[#1DB954]/20 hover:text-[#1DB954] rounded transition-colors"
                  >
                    <Hash className="w-3 h-3 inline mr-1" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Press Enter or comma to add a tag</p>
        <p>
          • Tags help listeners discover your music through search and
          recommendations
        </p>
        <p>• Use descriptive words like mood, style, or instruments</p>
      </div>
    </div>
  );
}
