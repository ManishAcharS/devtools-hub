export interface AriaRole {
  name: string;
  description: string;
  requiredAttrs?: string[];
  notes?: string;
}

export interface AriaAttribute {
  name: string;
  type: string;
  description: string;
}

export const ARIA_ROLES: AriaRole[] = [
  {
    name: 'alert',
    description: 'A message with important, and usually time-sensitive, information.',
    notes: 'Implicitly a live region with aria-live="assertive".',
  },
  {
    name: 'alertdialog',
    description:
      'A modal dialog that interrupts the user with urgent information and requests a response.',
    notes: 'Use only for urgent interruptions, and manage focus inside the dialog.',
  },
  {
    name: 'article',
    description: 'A self-contained composition in a document, page, or site.',
  },
  {
    name: 'banner',
    description: 'A region that contains site-oriented content, such as the site header.',
    notes: 'Equivalent to the <header> element when not nested inside sections.',
  },
  {
    name: 'button',
    description: 'An interactive element that triggers an action when activated.',
    notes: 'Prefer the native <button> element whenever possible.',
  },
  {
    name: 'checkbox',
    description: 'A checkable input that has two or three possible values.',
    requiredAttrs: ['aria-checked'],
    notes: 'Prefer <input type="checkbox"> where possible.',
  },
  {
    name: 'columnheader',
    description: 'A cell that contains header information for a column.',
  },
  {
    name: 'combobox',
    description: 'An input that controls another element, such as a listbox or grid.',
    requiredAttrs: ['aria-expanded'],
    notes: 'Connect the popup with aria-controls and use aria-activedescendant for selections.',
  },
  {
    name: 'complementary',
    description: 'A supporting section designed to be complementary to the main content.',
    notes: 'Equivalent to the <aside> element.',
  },
  {
    name: 'contentinfo',
    description: 'A region that contains information about the parent document, such as a footer.',
    notes: 'Equivalent to the <footer> element.',
  },
  {
    name: 'dialog',
    description: 'A window that is separate from the rest of the page content.',
    notes: 'Set aria-modal="true" for modal dialogs and manage focus.',
  },
  {
    name: 'document',
    description: 'A region that contains content representing a document or application.',
  },
  {
    name: 'grid',
    description: 'A composite widget containing rows and columns of cells.',
    notes: 'Keyboard navigation between cells is typically handled with arrow keys.',
  },
  {
    name: 'gridcell',
    description: 'A cell in a grid or treegrid that may be focusable.',
  },
  {
    name: 'group',
    description:
      'A set of user interface objects that are not intended to be included in the page summary.',
  },
  {
    name: 'heading',
    description: 'A heading for a section of the page.',
    requiredAttrs: ['aria-level'],
    notes: 'Prefer native h1-h6 elements.',
  },
  {
    name: 'img',
    description: 'A container for a single image or image-like content.',
    notes: 'Provide an accessible name with aria-label or a visible caption.',
  },
  {
    name: 'link',
    description: 'An interactive reference to an internal or external resource.',
    notes: 'Prefer the native <a> element.',
  },
  {
    name: 'list',
    description: 'A group of list items.',
    notes: 'Prefer native <ul> or <ol> elements.',
  },
  {
    name: 'listbox',
    description: 'A widget that allows the user to select one or more items from a list.',
    notes: 'Highlight the active option with aria-activedescendant.',
  },
  {
    name: 'log',
    description: 'A live region where new information is added in order, such as a chat log.',
    notes: 'Implicitly aria-live="polite".',
  },
  {
    name: 'main',
    description: 'The primary content of a document.',
    notes: 'Use only one <main> landmark per page.',
  },
  {
    name: 'menu',
    description: 'A widget offering a list of choices to the user.',
    notes: 'Distinct from listbox; often used for application menus.',
  },
  {
    name: 'menubar',
    description:
      'A presentation of a menu that usually remains visible, such as an application menu bar.',
  },
  {
    name: 'menuitem',
    description: 'An option in a set of choices contained by a menu or menubar.',
  },
  {
    name: 'menuitemcheckbox',
    description: 'A menuitem with a checkable state.',
    requiredAttrs: ['aria-checked'],
  },
  {
    name: 'menuitemradio',
    description: 'A menuitem that is part of a group of mutually exclusive items.',
    requiredAttrs: ['aria-checked'],
  },
  {
    name: 'navigation',
    description: 'A collection of navigation links.',
    notes: 'Equivalent to the <nav> element.',
  },
  {
    name: 'option',
    description: 'An item in a listbox that is selectable.',
    requiredAttrs: ['aria-selected'],
  },
  {
    name: 'progressbar',
    description: 'An element that displays the progress of a task.',
    requiredAttrs: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
  },
  {
    name: 'radio',
    description: 'A checkable input that is part of a group of mutually exclusive options.',
    requiredAttrs: ['aria-checked'],
  },
  {
    name: 'radiogroup',
    description: 'A group of radio buttons.',
  },
  {
    name: 'region',
    description: 'A perceivable section of content that is important enough to be navigated to.',
    notes: 'Give the region an accessible name.',
  },
  {
    name: 'row',
    description: 'A row of cells in a grid, table, or treegrid.',
  },
  {
    name: 'rowheader',
    description: 'A cell that contains header information for a row.',
  },
  {
    name: 'scrollbar',
    description: 'A control that allows the user to scroll content.',
    requiredAttrs: ['aria-controls', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
  },
  {
    name: 'search',
    description: 'A landmark region with search functionality.',
    notes: 'Equivalent to the <search> element.',
  },
  {
    name: 'searchbox',
    description: 'A text input intended for search queries.',
  },
  {
    name: 'slider',
    description: 'An input where the user selects a value from within a given range.',
    requiredAttrs: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
  },
  {
    name: 'spinbutton',
    description:
      'A form of range input that expects the user to select a value from discrete choices.',
    requiredAttrs: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
  },
  {
    name: 'status',
    description: 'A container whose content is advisory information for the user.',
    notes: 'Implicitly aria-live="polite".',
  },
  {
    name: 'switch',
    description: 'A checkable input that represents on/off values.',
    requiredAttrs: ['aria-checked'],
  },
  {
    name: 'tab',
    description: 'A grouping label that provides a mechanism for selecting tab content.',
    requiredAttrs: ['aria-selected'],
  },
  {
    name: 'table',
    description: 'A section containing data arranged in rows and columns.',
  },
  {
    name: 'tablist',
    description: 'A list of tab elements, which reference tabpanel elements.',
  },
  {
    name: 'tabpanel',
    description: 'A container for the content associated with a tab.',
  },
  {
    name: 'textbox',
    description: 'An input that allows free-form text.',
    notes: 'Prefer the native <input> or <textarea> element.',
  },
  {
    name: 'timer',
    description: 'A live region containing a numerical counter, such as a countdown.',
  },
  {
    name: 'toolbar',
    description: 'A collection of commonly used function buttons.',
  },
  {
    name: 'tooltip',
    description: 'A contextual popup that displays a description for an element.',
    notes: 'Tooltips should not contain interactive content.',
  },
  {
    name: 'tree',
    description: 'A widget that displays a hierarchy of items.',
  },
  {
    name: 'treeitem',
    description: 'An item in a tree or treegrid.',
    requiredAttrs: ['aria-level'],
  },
];

export const ARIA_ATTRIBUTES: AriaAttribute[] = [
  {
    name: 'aria-activedescendant',
    type: 'ID reference',
    description: 'Identifies the currently active descendant of a composite widget.',
  },
  {
    name: 'aria-atomic',
    type: 'boolean',
    description:
      'Indicates whether a live region will present all changed content or only the change.',
  },
  {
    name: 'aria-autocomplete',
    type: 'token (none | inline | list | both)',
    description: 'Indicates whether input text completion is provided and how.',
  },
  {
    name: 'aria-busy',
    type: 'boolean',
    description: 'Indicates that an element is being updated.',
  },
  {
    name: 'aria-checked',
    type: 'token (true | false | mixed)',
    description: 'Indicates the checked state of checkboxes, radio buttons, and switches.',
  },
  {
    name: 'aria-controls',
    type: 'ID reference list',
    description: 'Lists the elements that are controlled by the current element.',
  },
  {
    name: 'aria-current',
    type: 'token (page | step | location | date | time | true | false)',
    description: 'Indicates the element that represents the current item within a set.',
  },
  {
    name: 'aria-describedby',
    type: 'ID reference list',
    description: 'Identifies the elements that describe the current element.',
  },
  {
    name: 'aria-disabled',
    type: 'boolean',
    description: 'Indicates that the element is perceivable but disabled.',
  },
  {
    name: 'aria-errormessage',
    type: 'ID reference',
    description: 'Identifies the element that provides an error message for the current element.',
  },
  {
    name: 'aria-expanded',
    type: 'boolean',
    description: 'Indicates whether a control is expanded or collapsed.',
  },
  {
    name: 'aria-haspopup',
    type: 'token (false | true | menu | listbox | tree | grid | dialog)',
    description: 'Indicates the kind of popup triggered by the element.',
  },
  {
    name: 'aria-hidden',
    type: 'boolean',
    description: 'Removes the element from the accessibility tree.',
  },
  {
    name: 'aria-invalid',
    type: 'token (false | grammar | spelling | true)',
    description: 'Indicates that the entered value does not conform to the expected format.',
  },
  {
    name: 'aria-keyshortcuts',
    type: 'string',
    description: 'Indicates keyboard shortcuts that activate or focus an element.',
  },
  {
    name: 'aria-label',
    type: 'string',
    description: 'Provides an accessible name that overrides any native name.',
  },
  {
    name: 'aria-labelledby',
    type: 'ID reference list',
    description: 'Identifies the elements that label the current element.',
  },
  {
    name: 'aria-level',
    type: 'integer',
    description: 'Defines the hierarchical level of an element within a structure.',
  },
  {
    name: 'aria-live',
    type: 'token (off | polite | assertive)',
    description: 'Sets the priority with which live region updates are announced.',
  },
  {
    name: 'aria-modal',
    type: 'boolean',
    description:
      'Indicates whether an element is modal and blocks interaction with the rest of the page.',
  },
  {
    name: 'aria-multiselectable',
    type: 'boolean',
    description: 'Indicates that the user may select more than one item from the current set.',
  },
  {
    name: 'aria-orientation',
    type: 'token (horizontal | vertical)',
    description: 'Defines the orientation of a widget.',
  },
  {
    name: 'aria-owns',
    type: 'ID reference list',
    description:
      'Identifies elements that are children of the current element in the accessibility tree.',
  },
  {
    name: 'aria-placeholder',
    type: 'string',
    description: 'Provides a short hint of the expected input value.',
  },
  {
    name: 'aria-posinset',
    type: 'integer',
    description: 'Defines the position of the current item within a set.',
  },
  {
    name: 'aria-pressed',
    type: 'token (true | false | mixed)',
    description: 'Indicates the pressed state of a toggle button.',
  },
  {
    name: 'aria-readonly',
    type: 'boolean',
    description: 'Indicates that the value of an input cannot be edited by the user.',
  },
  {
    name: 'aria-required',
    type: 'boolean',
    description: 'Indicates that user input is required before form submission.',
  },
  {
    name: 'aria-selected',
    type: 'boolean',
    description: 'Indicates the selected state of an option in a set.',
  },
  {
    name: 'aria-setsize',
    type: 'integer',
    description: 'Defines the number of items in the current set.',
  },
  {
    name: 'aria-sort',
    type: 'token (none | ascending | descending | other)',
    description: 'Indicates the sort direction of a column in a table or grid.',
  },
  {
    name: 'aria-valuemax',
    type: 'number',
    description: 'Defines the maximum allowed value of a range widget.',
  },
  {
    name: 'aria-valuemin',
    type: 'number',
    description: 'Defines the minimum allowed value of a range widget.',
  },
  {
    name: 'aria-valuenow',
    type: 'number',
    description: 'Defines the current value of a range widget.',
  },
  {
    name: 'aria-valuetext',
    type: 'string',
    description: 'Provides a human-readable representation of the current value of a range widget.',
  },
];
