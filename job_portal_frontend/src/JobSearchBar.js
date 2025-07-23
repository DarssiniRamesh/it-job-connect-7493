import React, { useState } from "react";

/**
 * Search/filter bar for job listing. Controlled by parent (JobList).
 * Props: search, location, onSearch(search, location)
 */
export default function JobSearchBar({
  search: initialSearch = "",
  location: initialLocation = "",
  onSearch,
}) {
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);

  const submit = (e) => {
    e.preventDefault();
    onSearch && onSearch(search.trim(), location.trim());
  };

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: 18,
        flexWrap: "wrap",
        alignItems: "center",
        maxWidth: 600,
      }}
    >
      <input
        type="text"
        placeholder="Search for job title, company..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          flex: 2,
          minWidth: 120,
          padding: "10px",
          borderRadius: 7,
          border: "1px solid var(--border-color)",
          fontSize: 16,
        }}
        aria-label="Job title or company"
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={e => setLocation(e.target.value)}
        style={{
          flex: 1,
          minWidth: 80,
          padding: "10px",
          borderRadius: 7,
          border: "1px solid var(--border-color)",
          fontSize: 16,
        }}
        aria-label="Job location"
      />
      <button
        type="submit"
        className="theme-toggle"
        style={{
          fontWeight: 600,
          fontSize: "15px",
          padding: "10px 16px"
        }}
      >
        Search
      </button>
    </form>
  );
}
