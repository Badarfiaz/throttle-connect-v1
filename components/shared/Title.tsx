import React from "react";

interface TitleProps {
  title?: string;
  description?: string;
  align?: "left" | "center" | "right"; // optional prop for alignment flexibility
  spacing?: "default" | "tight";
}

function Title({
  title,
  description,
  align = "center",
  spacing = "default",
}: TitleProps) {
  const containerSpacing = spacing === "tight" ? "mb-4" : "mb-10";
  const descriptionSpacing = spacing === "tight" ? "mt-1" : "mt-2";

  return (
    <div
      className={`${containerSpacing} ${
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
        <p
          className={`text-muted-foreground ${descriptionSpacing} max-w-2xl mx-auto`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export default Title;
