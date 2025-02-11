import React, { useState } from 'react';


const config = {
    visible: true,
    title: "HackIllinois is an event of all time.",
    link: "https://hackillinois.org",
    linkTitle: "Learn more",
    bgColor: "#000000"
}

const CloseButton = () => {
    return (<>
        <span className="sr-only">Close menu</span>
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    </>);
}
const StickyHeader = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;
    if (!config.visible) {
        return null;
    }
    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white px-4 py-2 flex items-center justify-center mb-4" style={{ background: config.bgColor }}>
                <div className="flex items-center justify-between w-full max-w-6xl">
                    <div className="flex-1"></div>
                    <div className="">
                        {config.title}{' '}
                        <a href={config.link} target="_blank" className="text-blue-400 hover:text-blue-300 underline">
                            {config.linkTitle}
                        </a>
                    </div>
                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-gray-400 hover:text-white focus:outline-none"
                            aria-label="Close banner"
                        >
                            <CloseButton />
                        </button>
                    </div>
                </div>
            </div>
            <h1 className="py-6"></h1>
        </>

    );
};

export default StickyHeader;