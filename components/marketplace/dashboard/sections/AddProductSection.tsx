"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type AddProductSectionProps = {
  onBack: () => void;
};

const AddProductSection = ({ onBack }: AddProductSectionProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Add New Product</h2>
          <p className="text-sm text-slate-500">
            List a fresh item for buyers to discover.
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Products
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            Product Name
          </label>
          <Input className="mt-2" placeholder="e.g., Premium Brake Pad Kit" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            Category
          </label>
          <Input className="mt-2" placeholder="Braking, Lighting, Engine" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            Price
          </label>
          <Input className="mt-2" placeholder="PKR 0" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            Stock
          </label>
          <Input className="mt-2" placeholder="Available units" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase text-slate-500">
            Description
          </label>
          <Textarea
            className="mt-2"
            placeholder="Highlight features, fitment, and warranty details."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button>Save Draft</Button>
        <Button variant="outline">Publish</Button>
      </div>
    </div>
  );
};

export default AddProductSection;
