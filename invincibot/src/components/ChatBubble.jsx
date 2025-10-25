import { useState, useEffect } from "react";

export default function ChatBubble({ onSend, selectedFile, onClearFile }) {
    const [message, setMsg] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log(messages);
    }, [messages])

    const handleSubmit = (e) => {
        e.preventDefault();

        if (message.trim() || selectedFile) {
            const trimmed = message.trim();
            onSend(trimmed);
            setMessages([...messages, trimmed]);
            setMsg("");
        }
    };

    return (
        <div className="w-screen">
            <form
                onSubmit={handleSubmit}
                className="flex mt-6 items-center me-14"
            >
                <div className="relative w-3/4">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMsg(e.target.value)}
                        placeholder={selectedFile ? "" : "Enter here"}
                        className="bg-white w-full text-black placeholder-red-500 px-4 py-6 rounded"
                    />
                    {selectedFile && (
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sm text-black bg-blue-100 px-2 py-1 rounded flex items-center z-10">
                            📎 {selectedFile.name}
                            <button
                                type="button"
                                onClick={onClearFile}
                                className="ml-2 text-red-500 hover:text-red-700 font-bold"
                            >
                                ×
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}