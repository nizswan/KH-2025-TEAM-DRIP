import { useLocation, useParams, useNavigate } from "react-router-dom";
import ChatBubble from "../components/ChatBubble";
import AttachFile from "../components/AttachFile";
import Audio from "../components/Audio";
// import Send from "../components/Send";
import { useState } from "react";
import { useRef, useEffect } from "react";
import { summarizeText, summarizeAudio, summarizeTextProgressive, streamTextProgressive, tts as synthesizeTTS} from "../lib/api";


export default function CharacterPage() {
    const { name } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const background = location.state?.background;
    const pronoun = location.state?.pronoun;
    const image = location.state?.image;

    const handleBack = () => {
        navigate('/ChooseCharacter');
    };

    // file attachment handlers
    const handleClearFile = () => {
        setSelectedFile(null);
    };

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    const [messages, setMsg] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const VOICE_BY_CHAR = { "Invincible": "mark", "Atom Eve": "eve", "OmniMan": "omni" };
    const voice = VOICE_BY_CHAR[name] ?? "mark";

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    let speakChain = Promise.resolve();
    const speak = (text) => {
    if (!text) return;
    speakChain = speakChain.then(async () => {
        try {
        const url = await synthesizeTTS({ text, voice });
        await new Promise((resolve) => {
            const audio = new Audio(url);
            audio.onended = resolve;
            audio.onerror = resolve;
            audio.play().catch(resolve);
        });
        } catch (_) {
        }
    });
    };

    const handleSend = (msg) => {
    setMsg([...messages, { id: Date.now(), text: msg }]); // user message (no TTS)

    (async () => {
        try {
        setIsLoading(true);
        setError(null);

        if (selectedFile) {
            const f = selectedFile;
            const fname = f?.name || "";
            const type = f?.type || "";
            const looksText = type.startsWith("text/") || /\.txt$/i.test(fname);

            if (looksText) {
            const fileText = await f.text();

            try {
                let i = 0;
                for await (const evt of streamTextProgressive({
                text: fileText,
                voice,
                max_iters: 5,
                tolerance: 0.05,
                })) {
                if (evt.type === "part") {
                    const idBase = Date.now();
                    const part = evt.text || "";
                    setMsg((curr) => [...curr, { id: idBase + (++i), text: part }]);
                    speak(part); // <- speak each bot chunk
                } else if (evt.type === "error") {
                    throw new Error(evt.message || "stream error");
                }
                }
            } catch (e) {
                const res = await summarizeTextProgressive({
                text: fileText, voice, max_iters: 5, tts: false
                });
                const parts = Array.isArray(res?.parts) && res.parts.length ? res.parts : null;
                if (parts) {
                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i] || "";
                    setMsg((curr) => [...curr, { id: Date.now() + i + 1, text: part }]);
                    speak(part);
                }
                } else {
                const botText = res?.final_text || "(No summary produced)";
                setMsg((curr) => [...curr, { id: Date.now() + 1, text: botText }]);
                speak(botText);
                }
            }
            } else {
            const res = await summarizeAudio(f, { voice, tts: false });
            const botText = res?.summary || res?.transcript || "(No summary produced)";
            setMsg((curr) => [...curr, { id: Date.now() + 1, text: botText }]);
            speak(botText);
            }
        } else {
            // Plain text progressive (stream first, fallback to JSON)
            try {
            let i = 0;
            for await (const evt of streamTextProgressive({
                text: msg,
                voice,
                max_iters: 5,
                tolerance: 0.05,
            })) {
                if (evt.type === "part") {
                const idBase = Date.now();
                const part = evt.text || "";
                setMsg((curr) => [...curr, { id: idBase + (++i), text: part }]);
                speak(part);
                } else if (evt.type === "error") {
                throw new Error(evt.message || "stream error");
                }
            }
            } catch (e) {
            const res = await summarizeTextProgressive({ text: msg, voice, max_iters: 5, tts: false });
            const parts = Array.isArray(res?.parts) && res.parts.length ? res.parts : null;
            if (parts) {
                for (let i = 0; i < parts.length; i++) {
                const part = parts[i] || "";
                setMsg((curr) => [...curr, { id: Date.now() + i + 1, text: part }]);
                speak(part);
                }
            } else {
                const botText = res?.final_text || "(No summary produced)";
                setMsg((curr) => [...curr, { id: Date.now() + 1, text: botText }]);
                speak(botText);
            }
            }
        }

        } catch (e) {
        setError(e?.message || "Failed to fetch");
        setMsg((curr) => [...curr, { id: Date.now() + 2, text: "Error: request failed." }]);
        } finally {
        setIsLoading(false);
        setSelectedFile(null);
        }
    })();
    };

    const messagesEndRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollTo({
            top: messagesEndRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages])

    return (
        <div
            className="h-screen w-full bg-cover bg-center text-white"
            style={{
                backgroundImage: `url(${background})`,
            }}
        >
            <div className="absolute inset-0 bg-black/30"></div>

            <div>
                <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 z-10">
                    <button
                        onClick={handleBack}
                        className="cursor-pointer bg-[#FFFFFF] text-[#000000] text-base px-4 py-1.5 rounded hover:bg-[#FFFFFF] hover:shadow-[0_0_30px_10px_#FFFFFF] transition-shadow duration-300 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="inline-block mr-2">
                            <path d="M10 19l-7-7 7-7M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Choose Your Character
                    </button>
                </div>
            </div>
            {/* Content above overlay */}
            <div className="relative flex flex-col h-screen pt-6 text-white">
                <div className="text-center shrink-0">
                    <h1 className="text-8xl font-bold font-title mb-3">
                        Invincibot
                    </h1>
                    <p className="font-title text-3xl mb-12 font-light">
                        Chat with {name} and {pronoun} allies to receive summaries of materials you share
                    </p>
                </div>

                {/* working on return msg feature */}
                <div className="overflow-hidden flex flex-col-reverse flex-1 w-full">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={messagesEndRef}>
                        {messages.map((m) => (
                            <div key={m.id} className="flex justify-end" >
                                <div className="bg-white w-3/4 text-black p-4 rounded self-end max-w-[65%]">{m.text} </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-row shrink-0 ms-20 items-center space-x-14 p-4">
                        <img
                            src={image}
                            alt={name}
                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                        <div className="flex items-center space-x-4">
                            <AttachFile
                                onFileSelect={handleFileSelect}
                                selectedFile={selectedFile}
                                onClearFile={handleClearFile}
                            />
                            <Audio />
                            {/* <Send/> */}
                        </div>

                        <ChatBubble
                            onSend={handleSend}
                            selectedFile={selectedFile}
                            onClearFile={handleClearFile}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}