import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input Component TDD Redesign', () => {
  it('should render label text when provided', () => {
    render(<Input label="Username" placeholder="Enter name" />);
    expect(screen.getByText(/username/i)).toBeInTheDocument();
  });

  it('should render placeholder text correctly', () => {
    render(<Input placeholder="Enter name" />);
    expect(screen.getByPlaceholderText(/enter name/i)).toBeInTheDocument();
  });

  it('should call onChange callback when user types', () => {
    const onChangeMock = vi.fn();
    render(<Input placeholder="Enter name" onChange={onChangeMock} />);
    const inputElement = screen.getByPlaceholderText(/enter name/i);
    fireEvent.change(inputElement, { target: { value: 'Kwame' } });
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });

  it('should render error message when provided', () => {
    render(<Input error="Field required" />);
    expect(screen.getByRole('alert')).toHaveTextContent(/field required/i);
  });

  it('should apply base input-field class', () => {
    render(<Input placeholder="Enter name" />);
    const inputElement = screen.getByPlaceholderText(/enter name/i);
    expect(inputElement.className).toContain('input-field');
  });

  it('should apply neomorphic-concave classes when isNeumorphic is true', () => {
    render(<Input placeholder="Enter name" isNeumorphic={true} />);
    const inputElement = screen.getByPlaceholderText(/enter name/i);
    expect(inputElement.className).toContain('neumorphic-concave');
  });
});
