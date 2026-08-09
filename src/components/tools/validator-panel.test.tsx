import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ValidatorPanel } from '@/components/tools/validator-panel';
import type { ToolValidationResult } from '@/lib/tools/types';

const props = {
  inputId: 'validator-input',
  inputValue: '',
  onInputChange: vi.fn(),
  result: null,
  validMessage: 'Valid!',
  invalidMessage: 'Invalid!',
};

describe('ValidatorPanel', () => {
  it('shows the empty state', () => {
    render(<ValidatorPanel {...props} />);
    expect(screen.getByText('Validation results will appear here…')).toBeInTheDocument();
  });

  it('shows the valid message and stats', () => {
    const result: ToolValidationResult = {
      valid: true,
      error: null,
      issues: [],
      stats: [{ label: 'Characters', value: '12' }],
    };
    render(<ValidatorPanel {...props} inputValue='{"a":1}' result={result} />);
    expect(screen.getByText('Valid!')).toBeInTheDocument();
    expect(screen.getByText('Characters:')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('shows the invalid message, error, and issue positions', () => {
    const result: ToolValidationResult = {
      valid: false,
      error: 'Unexpected token',
      issues: [{ message: 'Unexpected token', line: 3, column: 8 }],
    };
    render(<ValidatorPanel {...props} inputValue="{oops" result={result} />);
    expect(screen.getByText('Invalid!')).toBeInTheDocument();
    expect(screen.getAllByText('Unexpected token').length).toBeGreaterThan(0);
    expect(screen.getByText(/line 3:8/)).toBeInTheDocument();
  });

  it('omits the position chip when line is unknown', () => {
    const result: ToolValidationResult = {
      valid: false,
      error: 'nope',
      issues: [{ message: 'nope' }],
    };
    render(<ValidatorPanel {...props} inputValue="x" result={result} />);
    expect(screen.queryByText(/line \d/)).not.toBeInTheDocument();
  });

  it('reports typing', () => {
    const onInputChange = vi.fn();
    render(<ValidatorPanel {...props} onInputChange={onInputChange} />);
    fireEvent.change(screen.getByLabelText('Input'), { target: { value: 'x' } });
    expect(onInputChange).toHaveBeenCalledWith('x');
  });
});
