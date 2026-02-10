"use client";
import { useState } from "react";
import { PRESET_COLORS } from "@/lib/utils";

export default function ColorPicker({ value, onChange, label }) {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div>
      {label && (
        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)", marginBottom: 6 }}>
          {label}
        </label>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: color,
              border: value === color ? "2.5px solid var(--foreground)" : "2.5px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s ease",
              transform: value === color ? "scale(1.1)" : "scale(1)",
              boxShadow: value === color ? "0 0 0 2px var(--background), 0 0 0 4px " + color : "none",
              outline: "none",
            }}
            title={color}
          />
        ))}
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
            border: "2.5px solid transparent",
            cursor: "pointer",
            transition: "all 0.15s ease",
            position: "relative",
            outline: "none",
          }}
          title="Custom color"
        />
      </div>
      {showCustom && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: 40,
              height: 32,
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              padding: 0,
              background: "none",
            }}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input-base"
            style={{ width: 120, fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}
            placeholder="#000000"
          />
        </div>
      )}
    </div>
  );
}
