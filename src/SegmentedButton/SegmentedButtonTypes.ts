import React from 'react';

export interface SegmentedButtonProps {
    format: 'light' | 'dark';
    name: string;
    inputProps?: React.HTMLProps<HTMLInputElement>;
}

export interface SBBCProps extends React.HTMLAttributes<HTMLSpanElement> {
    disabled: boolean;
    format: 'light' | 'dark';
    size: string;
}
