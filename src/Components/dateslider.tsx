// src/Components/DateSlider.tsx
import {  useRef } from 'react';

interface DateSliderProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
    daysCount?: number;
}

function formatDateValue(date: Date): string {
    return date.toISOString().split('T')[0];
}

function formatDateLabel(date: Date): { month: string; day: string } {
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate().toString();
    return { month, day };
}

export function DateSlider({ selectedDate, onDateChange, daysCount = 20 }: DateSliderProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const dates: Date[] = [];
    const today = new Date();
    for (let i = 0; i < daysCount; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        dates.push(d);
    }

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '12px 0',
        marginBottom: '16px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
    };

    const dateTileStyle = (isActive: boolean): React.CSSProperties => ({
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56px',
        height: '56px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontFamily: 'Bebas Neue',
        backgroundColor: isActive ? '#22c55e' : '#111111',
        border: isActive ? 'none' : '1px solid #1a1a1a',
        color: isActive ? '#000000' : '#ffffff',
        transition: 'all 0.15s',
    });

    return (
        <div ref={scrollRef} style={containerStyle}>
            {dates.map((date) => {
                const value = formatDateValue(date);
                const { month, day } = formatDateLabel(date);
                const isActive = value === selectedDate;

                return (
                    <div
                        key={value}
                        style={dateTileStyle(isActive)}
                        onClick={() => onDateChange(value)}
                    >
                        <span style={{ fontSize: '11px', opacity: 0.8 }}>{month}</span>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{day}</span>
                    </div>
                );
            })}
        </div>
    );
}