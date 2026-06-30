import { SECTION_TITLE_CONTAINER, SECTION_CONTAINER } from "@/types/main";
import Title from "@/components/shared/Title";

type SectionProps = {
  children: React.ReactNode;
  bg?: string;
  className?: string;
  title?: string;
  description?: string;
};

export const SectionWrapper = ({
  children,
  bg,
  className,
  title,
  description,
}: SectionProps) => {
  return (
    <div
      className={`${className ?? ""} py-6`}
      style={bg ? { backgroundColor: bg } : undefined}
    >
      {(title || description) && (
        <div className={SECTION_TITLE_CONTAINER + " pt-2"}>
          <Title title={title} description={description} spacing="tight" />
        </div>
      )}
      <div className={SECTION_CONTAINER}>
        {children}
      </div>
    </div>
  );
};
