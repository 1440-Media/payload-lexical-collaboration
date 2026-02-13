'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { formatTimeAgo } from '../../utils/time.js';
/**
 * Component for displaying relative time (e.g., "5 min ago")
 * Automatically updates periodically
 */ export const TimeAgo = ({ className = '', timestamp })=>{
    const [, setCounter] = useState(0);
    // Update the component periodically to keep the time display fresh
    useEffect(()=>{
        const id = setTimeout(()=>{
            setCounter((prev)=>prev + 1);
        }, 10000) // Update every 10 seconds
        ;
        return ()=>{
            clearTimeout(id);
        };
    }, []);
    return /*#__PURE__*/ _jsx("span", {
        className: className,
        children: formatTimeAgo(timestamp)
    });
};

//# sourceMappingURL=TimeAgo.js.map