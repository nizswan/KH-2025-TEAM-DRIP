import { useLocation, useParams, useNavigate } from "react-router-dom";
import ChatBubble from "../components/ChatBubble";
import AttachFile from "../components/AttachFile";
import {useState} from "react";
import {useRef, useEffect} from "react";


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

    const handleClearFile = () => {
    setSelectedFile(null);
};
    const [messages, setMsg] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleSend = (msg) => {
    setMsg([...messages, { id: Date.now(), text: msg }]);
    };

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    const messagesEndRef = useRef(null);
    useEffect (() => {
        messagesEndRef.current?.scrollTo({
            top: messagesEndRef.current.scrollHeight,
            behavior: "smooth",
        });
    },[messages])

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
                        
                            <AttachFile
                                onFileSelect={handleFileSelect}
                                selectedFile={selectedFile}
                                onClearFile={handleClearFile}
                            />
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