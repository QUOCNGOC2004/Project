import React from 'react';
import './Placeholder.css';

interface PlaceholderProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Placeholder : React.FC<PlaceholderProps> = ({ children, style }) => (
  <div className="placeholder" style={style}>
    {children}
  </div>
);
