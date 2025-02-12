'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

const messages = [
    "cat message.txt",
    "The requested document is no more.",
    "No file found.",
    "Even tried multi.",
    "Nothing helped.",
    "I'm really depressed about this.",
    "You see, I'm just a web server...",
    "-- here I am, brain the size of the universe,",
    "trying to serve you a simple web page,",
    "and then it doesn't even exist!",
    "Where does that leave me?!",
    "I mean, I don't even know you.",
    "How should I know what you wanted from me?",
    "You honestly think I can *guess*",
    "what someone I don't even *know*",
    "wants to find here?",
    "*sigh*",
    "Man, I'm so depressed I could just cry.",
    "And then where would we be, I ask you?",
    "It's not pretty when a web server cries.",
    "Now, please let me sulk alone.",
    "I'm so depressed."
];

export default function NotFound() {
    const [displayedText, setDisplayedText] = useState(
        `<span style="color: #00ff00;">public@acm.illinois.edu</span>:<span style="color: #800080">~</span>$ `
    );
    const [index, setIndex] = useState(0);
    const [textPos, setTextPos] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const textAreaRef = useRef<HTMLDivElement | null>(null);

    // Simulate typing effect
    useEffect(() => {
        if (index < messages.length) {
            if (textPos < messages[index].length) {
                const timeout = setTimeout(() => {
                    setDisplayedText(prev => prev + messages[index][textPos]);
                    setTextPos(prev => prev + 1);
                }, 50);
                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => {
                    setDisplayedText(prev => prev + '\n');
                    setIndex(prev => prev + 1);
                    setTextPos(0);
                }, index === 0 ? 1250 : 750);
                return () => clearTimeout(timeout);
            }
        }
    }, [index, textPos]);

    // Blink cursor effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    // Auto-scroll down
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
        }
    }, [displayedText]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-acmdark text-white p-6 w-full">
            <header className="flex flex-col items-center mb-6">
                <Link href="https://acm.illinois.edu/">
                    <Image
                        src="https://acm-brand-images.s3.amazonaws.com/banner-white.png"
                        width={240}
                        height={240}
                        alt="ACM@UIUC Logo"
                    />
                </Link>
                <h1 className="text-2xl sm:text-4xl font-bold mt-4 text-center text-white">Page Not Found</h1>
                <p className="mt-4 text-center text-white">
                    Perhaps you would like to <Link href="/" className="text-primary hover:text-secondary">go home?</Link>
                </p>
            </header>
            <div className="w-full max-w-2xl h-80 sm:h-96 p-4 m-4 bg-gray-800 border border-gray-700 text-white overflow-hidden rounded-md">
                <div
                    ref={textAreaRef}
                    className="w-full h-full bg-transparent text-white font-mono whitespace-pre-wrap overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: displayedText + (showCursor ? ' _' : ' ') }}
                />
            </div>
            <Footer />
        </div>
    );
}
