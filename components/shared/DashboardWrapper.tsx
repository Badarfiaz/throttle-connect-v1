import React from "react";
type dashboardWrapperProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};
function DashboardWrapper({
  children,
  title,
  description,
}: dashboardWrapperProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {title && (
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      )}
      {description && <p className="text-sm text-slate-500">{description}</p>}
      {children}
    </div>
  );
}

export default DashboardWrapper;
