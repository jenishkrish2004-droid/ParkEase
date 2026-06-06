// ============================================================
// UI Component Barrel Export
// Phase 1: Complete Design System Primitives
// ============================================================

// ── Form Controls ────────────────────────────────────────────
export { Button }              from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { Input }               from './Input';
export type { InputProps }     from './Input';

export { TextArea }            from './TextArea';
export type { TextAreaProps }  from './TextArea';

export { Select }              from './Select';
export type { SelectProps, SelectOption } from './Select';

export { Checkbox }            from './Checkbox';
export type { CheckboxProps }  from './Checkbox';

export { Radio, RadioGroup }   from './Radio';
export type { RadioProps, RadioGroupProps, RadioOption } from './Radio';

// ── Feedback ─────────────────────────────────────────────────
export { Modal }               from './Modal';
export type { ModalProps, ModalSize } from './Modal';

export { Toaster, showToast, toast } from './Toast';

export { Spinner, FullPageSpinner, InlineSpinner } from './Spinner';
export type { SpinnerProps, SpinnerSize, SpinnerVariant } from './Spinner';

export { EmptyState }          from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { ErrorState }          from './ErrorState';
export type { ErrorStateProps, ErrorStateType } from './ErrorState';

// ── Data Display ─────────────────────────────────────────────
export { Card, CardHeader, CardBody, CardFooter } from './Card';
export type { CardProps, CardHeaderProps, CardFooterProps } from './Card';

export { Badge, StatusBadge }  from './Badge';
export type { BadgeProps, BadgeVariant, BadgeSize, StatusBadgeProps, StatusBadgeStatus } from './Badge';

export { Avatar, AvatarGroup } from './Avatar';
export type { AvatarProps, AvatarGroupProps, AvatarSize } from './Avatar';
