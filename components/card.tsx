import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`bg-white p-4 rounded shadow hover:shadow-lg transition-shadow ${className}`}
    >
      {children}
    </div>
  );
};
