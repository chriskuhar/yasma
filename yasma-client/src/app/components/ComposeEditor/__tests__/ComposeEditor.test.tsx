import React from 'react';
import { render, screen } from '@testing-library/react';
import { ComposeEditor } from '../ComposeEditor';

// Mock the TipTap dependencies
jest.mock('@tiptap/react', () => ({
  useEditor: jest.fn(),
  EditorContent: ({ editor }: { editor: any }) => (
    <div data-testid="editor-content" data-editor={editor ? 'present' : 'missing'}>
      Editor Content
    </div>
  ),
}));

jest.mock('../ComposeEditorToolbar', () => ({
  ComposeEditorToolbar: ({ editor }: { editor: never }) => (
    <div data-testid="compose-editor-toolbar" data-editor={editor ? 'present' : 'missing'}>
      Compose Editor Toolbar
    </div>
  ),
}));

jest.mock('@tiptap/starter-kit', () => 'StarterKit');

describe('ComposeEditor', () => {
  const mockUseEditor = require('@tiptap/react').useEditor;

  beforeEach(() => {
    mockUseEditor.mockClear();
  });

  it('should render editor with toolbar when editor is available', () => {
    const mockEditor = {
      isEditable: true,
      commands: {},
    };

    mockUseEditor.mockReturnValue(mockEditor);

    render(<ComposeEditor />);

    expect(screen.getByTestId('compose-editor-toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('editor-content')).toBeInTheDocument();
    expect(screen.getByTestId('compose-editor-toolbar')).toHaveAttribute('data-editor', 'present');
    expect(screen.getByTestId('editor-content')).toHaveAttribute('data-editor', 'present');
  });

  it('should not render when editor is null', () => {
    mockUseEditor.mockReturnValue(null);

    const { container } = render(<ComposeEditor />);

    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('compose-editor-toolbar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('editor-content')).not.toBeInTheDocument();
  });

  it('should call useEditor with correct configuration', () => {
    const mockEditor = {
      isEditable: true,
      commands: {},
    };

    mockUseEditor.mockReturnValue(mockEditor);

    render(<ComposeEditor />);

    expect(mockUseEditor).toHaveBeenCalledWith({
      extensions: ['StarterKit'],
      content: '<p>Hello World! 🌎️</p>',
    });
  });

  it('should render with correct CSS classes', () => {
    const mockEditor = {
      isEditable: true,
      commands: {},
    };

    mockUseEditor.mockReturnValue(mockEditor);

    const { container } = render(<ComposeEditor />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('mt-9', 'ml-5', 'mr-5', 'flex', 'flex-col');

    const toolbarDiv = screen.getByTestId('compose-editor-toolbar').parentElement;
    expect(toolbarDiv).toHaveClass('flex-none');

    const contentDiv = screen.getByTestId('editor-content').parentElement;
    expect(contentDiv).toHaveClass('grow', 'overflow-auto');
  });

  it('should pass editor instance to toolbar and content components', () => {
    const mockEditor = {
      isEditable: true,
      commands: {},
    };

    mockUseEditor.mockReturnValue(mockEditor);

    render(<ComposeEditor />);

    const toolbar = screen.getByTestId('compose-editor-toolbar');
    const content = screen.getByTestId('editor-content');

    expect(toolbar).toHaveAttribute('data-editor', 'present');
    expect(content).toHaveAttribute('data-editor', 'present');
  });

  it('should handle editor state changes', () => {
    const mockEditor = {
      isEditable: true,
      commands: {},
    };

    mockUseEditor.mockReturnValue(mockEditor);

    const { rerender } = render(<ComposeEditor />);

    // Initially should render
    expect(screen.getByTestId('compose-editor-toolbar')).toBeInTheDocument();

    // Change editor to null
    mockUseEditor.mockReturnValue(null);
    rerender(<ComposeEditor />);

    // Should not render
    expect(screen.queryByTestId('compose-editor-toolbar')).not.toBeInTheDocument();

    // Change editor back to valid
    mockUseEditor.mockReturnValue(mockEditor);
    rerender(<ComposeEditor />);

    // Should render again
    expect(screen.getByTestId('compose-editor-toolbar')).toBeInTheDocument();
  });

  it('should maintain component structure', () => {
    const mockEditor = {
      isEditable: true,
      commands: {},
    };

    mockUseEditor.mockReturnValue(mockEditor);

    const { container } = render(<ComposeEditor />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv.tagName).toBe('DIV');

    const children = mainDiv.children;
    expect(children).toHaveLength(2);

    // First child should be toolbar container
    expect(children[0]).toHaveClass('flex-none');
    expect(children[0].firstChild).toHaveAttribute('data-testid', 'compose-editor-toolbar');

    // Second child should be content container
    expect(children[1]).toHaveClass('grow', 'overflow-auto');
    expect(children[1].firstChild).toHaveAttribute('data-testid', 'editor-content');
  });
});

