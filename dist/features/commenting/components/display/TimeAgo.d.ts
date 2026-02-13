import React from 'react';
type TimeAgoProps = {
    className?: string;
    timestamp: number;
};
/**
 * Component for displaying relative time (e.g., "5 min ago")
 * Automatically updates periodically
 */
export declare const TimeAgo: React.FC<TimeAgoProps>;
export {};
