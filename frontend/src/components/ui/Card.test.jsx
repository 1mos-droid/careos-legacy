import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card Component TDD Redesign', () => {
  it('should render children text correctly', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText(/card content/i)).toBeInTheDocument();
  });

  it('should apply base glass-card class', () => {
    render(<Card>Card Content</Card>);
    const cardElement = screen.getByText(/card content/i);
    expect(cardElement.className).toContain('glass-card');
  });

  it('should apply hover class when isHoverable is true', () => {
    render(<Card isHoverable={true}>Card Content</Card>);
    const cardElement = screen.getByText(/card content/i);
    expect(cardElement.className).toContain('glass-card-hover');
  });

  it('should apply premium glass-card classes when isPremium is true', () => {
    render(<Card isPremium={true}>Card Content</Card>);
    const cardElement = screen.getByText(/card content/i);
    expect(cardElement.className).toContain('glass-card-premium');
  });

  it('should apply neomorphic classes when isNeumorphic is true', () => {
    render(<Card isNeumorphic={true}>Card Content</Card>);
    const cardElement = screen.getByText(/card content/i);
    expect(cardElement.className).toContain('neumorphic-convex');
  });
});
