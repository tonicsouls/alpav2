import React, { useState, useCallback, useRef } from 'react';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

interface FileUploadProps {
    onFilesSelect: (files: File[]) => void;
    disabled: boolean;
    model: string;
    onModelChange: (model: string) => void;
    onLoadSamples: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelect, disabled, model, onModelChange, onLoadSamples }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            setSelectedFiles(filesArray);
            onFilesSelect(filesArray);
        }
    };
    
    const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
    }, []);

    const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files) {
            const filesArray = Array.from(event.dataTransfer.files);
            setSelectedFiles(filesArray);
            onFilesSelect(filesArray);
        }
    }, [onFilesSelect]);

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-6">
            <div>
                 <h2 className="text-lg font-semibold text-gray-900">1. Configure & Upload</h2>
                 <div className="mt-4 border-t border-red-300"></div>
            </div>
            
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Processing Mode
                </label>
                <div className="flex rounded-md shadow-sm">
                    <button
                        type="button"
                        onClick={() => onModelChange('local-gemma-7b')}
                        disabled={disabled}
                        className={`relative inline-flex items-center justify-center px-4 py-2 rounded-l-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition ${
                            model.startsWith('local-') 
                            ? 'bg-red-600 text-white border-red-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Local AI
                    </button>
                    <button
                        type="button"
                        onClick={() => onModelChange('gemini-2.5-pro')}
                        disabled={disabled}
                        className={`-ml-px relative inline-flex items-center justify-center px-4 py-2 rounded-r-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition ${
                            !model.startsWith('local-') 
                            ? 'bg-red-600 text-white border-red-600' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Cloud AI
                    </button>
                </div>
            </div>

            <label 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                htmlFor="file-upload" 
                className={`flex justify-center w-full h-32 px-4 transition bg-gray-50 border-2 border-gray-300 border-dashed rounded-md appearance-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-red-500'}`}
            >
                <span className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="font-medium text-gray-500">
                        Drop files to Attach, or <span className="text-red-600 font-semibold">browse</span>
                    </span>
                </span>
                <input 
                    id="file-upload" 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileChange} 
                    ref={fileInputRef}
                    disabled={disabled}
                    accept=".txt,.md,.json,.csv"
                />
            </label>
             <div className="text-center">
                <button
                    type="button"
                    onClick={onLoadSamples}
                    disabled={disabled}
                    className="text-sm font-semibold text-red-600 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Or, load sample documents to get started
                </button>
            </div>
            {selectedFiles.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-600">Selected files:</h3>
                    <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-2">
                        {selectedFiles.map((file, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600 bg-gray-100 p-2 rounded-md border border-gray-200">
                                <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-400" />
                                <span className="truncate flex-1">{file.name}</span>
                                <span className="ml-2 text-xs text-gray-500">{Math.round(file.size / 1024)} KB</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
