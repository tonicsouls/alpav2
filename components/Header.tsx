import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            ALPA v2
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Local AI-Powered Document Processor
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                        </span>
                        <span className="text-blue-600 text-sm font-semibold">Local Processing</span>
                    </div>
                </div>
            </div>
        </header>
    );
};