'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  multiple?: boolean; // true = multi select
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  className?: string;
};

export default function SocialSelector({
  options,
  multiple = true,
  defaultValue,
  onChange,
  className,
}: Props) {
  const [selected, setSelected] = useState<string[] | string>(
    defaultValue ?? (multiple ? [] : '')
  );

  const handleSelect = (value: string) => {
    if (multiple) {
      const current = selected as string[];

      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      setSelected(updated);
      onChange?.(updated);
    } else {
      setSelected(value);
      onChange?.(value);
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {options.map((option) => {
        const isActive = multiple
          ? (selected as string[]).includes(option.value)
          : selected === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all border',
              isActive
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted text-muted-foreground border-border hover:bg-accent'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
