import React from "react";

export function Dialog({ children, ...props }) {
  return <div className="relative" {...props}>{children}</div>;
}

export function DialogTrigger({ className, ...props }) {
  return <button className={`text-sm font-medium ${className}`} {...props} />;
}

export function DialogContent({ className, ...props }) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6" {...props} />
    </div>
  );
}

export function DialogHeader({ className, ...props }) {
  return <div className={`space-y-2 ${className}`} {...props} />;
}

export function DialogTitle({ className, ...props }) {
  return <h2 className={`text-lg font-semibold ${className}`} {...props} />;
}

export function DialogDescription({ className, ...props }) {
  return <p className={`text-sm text-gray-500 ${className}`} {...props} />;
}