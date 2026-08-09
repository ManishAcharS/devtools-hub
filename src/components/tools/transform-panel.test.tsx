import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TransformPanel } from '@/components/tools/transform-panel';

const baseProps = {
  inputId: 'input-1',
  inputValue: '',
  onInputChange: vi.fn(),
  outputValue: '',
  fileName: 'output.txt',
};

describe('TransformPanel', () => {
  it('renders labels and placeholders', () => {
    render(<TransformPanel {...baseProps} />);
    expect(screen.getByLabelText('Input')).toBeInTheDocument();
    expect(screen.getByText('Output')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Paste content here…')).toBeInTheDocument();
    expect(screen.getByText('Output will appear here…')).toBeInTheDocument();
  });

  it('reflects the input value and reports typing', () => {
    const onInputChange = vi.fn();
    render(<TransformPanel {...baseProps} inputValue="abc" onInputChange={onInputChange} />);

    const textarea = screen.getByLabelText('Input');
    expect(textarea).toHaveValue('abc');
    expect(screen.getByText('3 characters')).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: 'abcd' } });
    expect(onInputChange).toHaveBeenCalledWith('abcd');
  });

  it('clears the input', () => {
    const onInputChange = vi.fn();
    render(<TransformPanel {...baseProps} inputValue="abc" onInputChange={onInputChange} />);

    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(onInputChange).toHaveBeenCalledWith('');
  });

  it('shows the output value and stats', () => {
    render(
      <TransformPanel
        {...baseProps}
        outputValue='{"ok":true}'
        stats={[{ label: 'Lines', value: '1' }]}
      />
    );
    expect(screen.getByText('{"ok":true}')).toBeInTheDocument();
    expect(screen.getByText('Lines:')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows the error when there is no output', () => {
    render(<TransformPanel {...baseProps} error="Invalid JSON." />);
    expect(screen.getByText('Invalid JSON.')).toBeInTheDocument();
  });

  it('shows warnings', () => {
    render(<TransformPanel {...baseProps} warnings={['Heads up!']} />);
    expect(screen.getByText('Heads up!')).toBeInTheDocument();
  });

  it('disables the output actions when there is no output', () => {
    render(<TransformPanel {...baseProps} />);
    expect(screen.getByRole('button', { name: 'Copy' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Download' })).toBeDisabled();
  });
});
