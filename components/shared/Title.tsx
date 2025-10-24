import React from "react";

interface TitleProps {
  title?: string;
  description?: string;
  align?: "left" | "center" | "right"; // optional prop for alignment flexibility
}

function Title({ title, description, align = "center" }: TitleProps) {
  return (
    <div
      className={`mb-10 ${
        align === "center"
          ? "text-center"
          : align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {/* Section Heading */}
      <h2 className="text-3xl font-bold text-primary">{title}</h2>

      {description && (
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}

export default Title;
