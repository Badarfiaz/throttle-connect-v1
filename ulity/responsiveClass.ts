export interface ResponsiveConfig {
  mobile?: number; // items per slide on mobile (< 640px)
  tablet?: number; // items per slide on tablet (640px - 1024px)
  desktop?: number; // items per slide on desktop (> 1024px)
}

export const getResponsiveClasses = (
  mobile: number,
  tablet: number,
  desktop: number
) => {
  const mobileClass =
    mobile === 1
      ? "basis-full"
      : mobile === 2
        ? "basis-1/2"
        : mobile === 3
          ? "basis-1/3"
          : mobile === 4
            ? "basis-1/4"
            : mobile === 5
              ? "basis-1/5"
              : mobile === 6
                ? "basis-1/6"
                : "basis-full";

  const tabletClass =
    tablet === 1
      ? "sm:basis-full"
      : tablet === 2
        ? "sm:basis-1/2"
        : tablet === 3
          ? "sm:basis-1/3"
          : tablet === 4
            ? "sm:basis-1/4"
            : tablet === 5
              ? "sm:basis-1/5"
              : tablet === 6
                ? "sm:basis-1/6"
                : "sm:basis-full";

  const desktopClass =
    desktop === 1
      ? "lg:basis-full"
      : desktop === 2
        ? "lg:basis-1/2"
        : desktop === 3
          ? "lg:basis-1/3"
          : desktop === 4
            ? "lg:basis-1/4"
            : desktop === 5
              ? "lg:basis-1/5"
              : desktop === 6
                ? "lg:basis-1/6"
                : "lg:basis-full";

  return `${mobileClass} ${tabletClass} ${desktopClass}`;
};
