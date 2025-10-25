import { useState } from "react";
import { useEffect } from "react";

export default function ChatBubble({ onSend }) {
    const [message, setMsg] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log(messages);
    }, [messages])

    const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const trimmed = message.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setMessages([...messages, trimmed]);
    setMsg("");
    };

    return (
        <div className="h-screen flex flex-col justify-end w-screen">
            <form
                onSubmit={handleSubmit}
                className="flex justify-end items-center p-3 me-14 mb-24"
            >
                <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Enter here"
                    className="bg-white w-3/4 text-black placeholder-red-500 px-4 py-10 rounded"  
                />
            </form>
        </div>
    )
}