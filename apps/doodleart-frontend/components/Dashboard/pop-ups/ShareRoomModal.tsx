// ShareRoomModal.tsx
"use client"
import { Check, Clipboard, X } from "lucide-react";
import { useState } from "react";

interface shareRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    sharedKey: string;
    roomId: string;
}

export function ShareRoomModal({ isOpen, onClose, sharedKey, roomId }: shareRoomModalProps) {
    const [copied, setCopied] = useState(false);
    const url = `http://localhost:3000/canvas/${roomId}?sharedKey=${sharedKey}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-70" onClick={onClose}>

            </div>

            {/* Modal content */}
            <div className="bg-[#191933] rounded-lg shadow-xl p-6 w-full max-w-md z-10 relative">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Copy the Sharable Link</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>
                <div className="w-full max-w-sm">
                    <div className="mb-2 flex justify-between items-center">
                        <label htmlFor="website-url" className="text-sm font-medium text-gray-900 dark:text-white">
                            Verify your website:
                        </label>
                    </div>

                    <div className="relative flex items-center">
                        <span className="shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg dark:bg-gray-600 dark:text-white dark:border-gray-600">
                            URL
                        </span>

                        <input
                            id="website-url"
                            type="text"
                            value={url}
                            readOnly
                            disabled
                            className="w-full bg-gray-50 border border-e-0 border-s-0 border-gray-300 text-gray-200 text-sm focus:ring-purple-500 focus:border-purple-500 block p-2.5 dark:bg-gray-800 dark:border-gray-800  dark:focus:ring-purple-500 dark:focus:border-purple-500"/>

                        <button
                            onClick={handleCopy}
                            type="button"
                            className="shrink-0 inline-flex items-center justify-center py-3 px-4 text-sm font-medium text-white bg-[#5f00a3] hover:bg-[#5f00a3b4] rounded-e-lg focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-purple-800 border border-purple-700 "
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-green-300" />
                            ) : (
                                <Clipboard className="w-4 h-4" />
                            )}
                        </button>

                        <span className={`absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded bg-gray-800 text-white transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`}>
                            {copied ? 'Copied!' : 'Copy link'}
                        </span>
                    </div>

                    <p className="mt-8 text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M4.93 4.93a10 10 0 1 1 14.14 14.14A10 10 0 0 1 4.93 4.93z" />
                        </svg>
                        Do not share this link with anonymous users.
                    </p>

                </div>
            </div>
        </div>
    );
}