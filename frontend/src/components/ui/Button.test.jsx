import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component TDD Redesign', () => {
  it('should render children text correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should trigger onClick callback on user click', () => {
    const onClickMock = vi.fn();
    render(<Button onClick={onClickMock}>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(buttonElement);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should render loading state correctly and disable the button', () => {
    render(<Button isLoading={true}>Click Me</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should apply primary variant classes by default', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement.className).toContain('bg-brand-primary');
  });

  it('should apply neumorphic variant classes when specified', () => {
    render(<Button variant="neumorphic">Neumorphic Button</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement.className).toContain('neumorphic-convex');
  });
});
