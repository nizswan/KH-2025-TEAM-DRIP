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
        <div className="w-screen">
            <form
                onSubmit={handleSubmit}
                className="flex mt-6 items-center mr-14"
            >
                <input 
                    type="text"
                    value={message}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Enter here"
                    className="bg-white w-3/4 text-black placeholder-red-500 px-4 py-6 rounded"  
                />
            </form>
        </div>
    )
}