import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileDropzone } from '@/components/tools/file-dropzone';

function makeFile(name: string, content = 'content', type = 'text/plain'): File {
  return new File([content], name, { type });
}

describe('FileDropzone', () => {
  it('renders the default label and hint', () => {
    render(<FileDropzone onFiles={vi.fn()} />);
    expect(screen.getByText('Click to upload')).toBeInTheDocument();
    expect(screen.getByText('or drag & drop files here')).toBeInTheDocument();
  });

  it('calls onFiles when a file is selected through the picker', () => {
    const onFiles = vi.fn();
    render(<FileDropzone onFiles={onFiles} multiple />);

    const input = screen.getByRole('button').querySelector('input');
    expect(input).not.toBeNull();
    fireEvent.change(input as HTMLInputElement, { target: { files: [makeFile('a.txt')] } });

    expect(onFiles).toHaveBeenCalledTimes(1);
    expect(onFiles).toHaveBeenCalledWith([expect.objectContaining({ name: 'a.txt' })]);
  });

  it('calls onFiles with dropped files', () => {
    const onFiles = vi.fn();
    render(<FileDropzone onFiles={onFiles} multiple />);

    const dropzone = screen.getByRole('button');
    fireEvent.drop(dropzone, { dataTransfer: { files: [makeFile('b.txt')] } });

    expect(onFiles).toHaveBeenCalledWith([expect.objectContaining({ name: 'b.txt' })]);
  });

  it('uses the custom label', () => {
    render(<FileDropzone onFiles={vi.fn()} label="Upload PDFs" />);
    expect(screen.getByRole('button', { name: 'Upload PDFs' })).toBeInTheDocument();
  });
});
