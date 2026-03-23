import React, { useEffect, useRef, useState } from 'react';

const BattleLog = ({ messages, currentMessage }) => {
    const containerRef = useRef(null);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const typingRef = useRef(null);

    // Typewriter effect for currentMessage
    useEffect(() => {
        if (!currentMessage) {
            setDisplayedText('');
            return;
        }

        setIsTyping(true);
        setDisplayedText('');
        let index = 0;

        if (typingRef.current) clearInterval(typingRef.current);

        typingRef.current = setInterval(() => {
            if (index < currentMessage.length) {
                setDisplayedText(currentMessage.slice(0, index + 1));
                index++;
            } else {
                clearInterval(typingRef.current);
                setIsTyping(false);
            }
        }, 35);

        return () => clearInterval(typingRef.current);
    }, [currentMessage]);

    // Auto-scroll
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, displayedText]);

    return (
        <div
            style={{
                background: '#0a0a1a',
                border: '3px solid var(--pixel-border)',
                boxShadow: '4px 4px 0px rgba(255,215,0,0.2), inset 0 0 20px rgba(0,0,0,0.5)',
                padding: '14px',
                minHeight: '120px',
                maxHeight: '180px',
                position: 'relative',
            }}
        >
            <div
                ref={containerRef}
                style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: '20px',
                    color: 'var(--text-primary)',
                    lineHeight: '1.6',
                    overflowY: 'auto',
                    maxHeight: '150px',
                }}
            >
                {messages.slice(0, -1).map((msg, i) => (
                    <div key={i} style={{
                        opacity: 0.6,
                        color: msg.includes('super effective') ? 'var(--neon-yellow)' :
                            msg.includes('not very effective') ? 'var(--text-dim)' :
                                msg.includes('critical hit') ? 'var(--neon-red)' :
                                    msg.includes('fainted') ? 'var(--neon-red)' :
                                        msg.includes('wins') ? 'var(--neon-yellow)' :
                                            'var(--text-primary)',
                    }}>
                        {msg}
                    </div>
                ))}
                <div style={{
                    color: currentMessage?.includes('super effective') ? 'var(--neon-yellow)' :
                        currentMessage?.includes('not very effective') ? 'var(--text-dim)' :
                            currentMessage?.includes('critical hit') ? 'var(--neon-red)' :
                                currentMessage?.includes('fainted') ? 'var(--neon-red)' :
                                    currentMessage?.includes('wins') ? 'var(--neon-yellow)' :
                                        'var(--text-primary)',
                }}>
                    {displayedText}
                    {isTyping && (
                        <span style={{
                            animation: 'blink-cursor 0.5s step-end infinite',
                            marginLeft: '2px',
                        }}>
                            ▌
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BattleLog;
