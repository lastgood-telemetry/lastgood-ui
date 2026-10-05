import React from "react";

export const PageHeader = ({
  title,
  description,
  icon: Icon,
  category,
  actions,
  children,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-3 border-b border-slate-800/60 pb-4 mb-6 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          {category && (
            <span className="text-xs font-medium text-slate-500 block mb-2">
              {category}
            </span>
          )}
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="p-1.5 rounded-lg bg-[#151b18] border border-slate-800 text-indigo-400 shrink-0">
                <Icon size={18} />
              </div>
            )}
            <h1 className="text-2xl md:text-[28px] md:leading-[1.2] font-normal tracking-[-0.045em] text-[#f1f2ef] flex items-center gap-2 font-sans">
              {title}
            </h1>
          </div>
          {description && (
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-2xl font-sans mt-2">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>

      {children && <div className="pt-2">{children}</div>}
    </div>
  );
};

export default PageHeader;
