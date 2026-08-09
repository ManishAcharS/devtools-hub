import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CopyButton } from '@/components/shared/copy-button';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('CopyButton', () => {
  it('renders the label', () => {
    render(<CopyButton value="hello" />);
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('copies the value and shows the copied state', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    render(<CopyButton value="secret-value" />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(writeText).toHaveBeenCalledWith('secret-value');
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    });
  });

  it('resets to the idle state after the success duration', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    render(<CopyButton value="x" successDuration={100} />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));

    await waitFor(
      () => {
        expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  });

  it('falls back to execCommand when the clipboard API is unavailable', async () => {
    const user = userEvent.setup();
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(navigator, 'clipboard', { value: {}, configurable: true });
    document.execCommand = execCommand;

    render(<CopyButton value="fallback-value" />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(execCommand).toHaveBeenCalledWith('copy');
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    });
  });

  it('is icon-only friendly', () => {
    render(<CopyButton value="x" iconOnly />);
    const button = screen.getByRole('button', { name: 'Copy' });
    expect(button.querySelector('svg')).toBeInTheDocument();
    expect(button).not.toHaveTextContent('Copy');
  });

  it('shows the failed state when copying throws', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    render(<CopyButton value="x" />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Failed' })).toBeInTheDocument();
    });
  });
});
