import { useLocation, useParams, useNavigate } from "react-router-dom";
import ChatBubble from "../components/ChatBubble";
import AttachFile from "../components/AttachFile";
import {useState} from "react";

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

    const [messages, setMsg] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleSend = (msg) => {
    setMsg([...messages, { id: Date.now(), text: msg }]);
    };

    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    return (
        <div
            className="h-screen w-full bg-cover bg-center text-white"
            style={{
                backgroundImage: `url(${background})`,
            }}
        >
            {/* Black overlay */}
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
            <div className="relative flex flex-col justify-between h-full pt-6 text-white">
                <div className="text-center items-center">
                    <h1 className="text-8xl font-bold font-title mb-3">
                        Invincibot
                    </h1>
                    <p className="font-title text-3xl mb-90 font-light">
                        Chat with {name} and {pronoun} allies to receive summaries of materials you share
                    </p>
                </div>
                <div className="flex flex-row ms-20 items-center space-x-14 mb-10">
                    <img
                        src={image}
                        alt={name}
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    {/* <ChatBubble onSend={handleSend} />
                    <AttachFile onFileSelect={handleFileSelect} selectedFile={selectedFile} onClearFile={() => setSelectedFile(null)} /> */}
                    {/* Wrapper for chat input with file button */}
                    {/* <div className="relative flex-1 max-w-2xl"> */}
                        <AttachFile 
                            onFileSelect={handleFileSelect}
                            selectedFile={selectedFile}
                            onClearFile={() => setSelectedFile(null)}
                        />
                        <ChatBubble 
                            onSend={handleSend}
                            selectedFile={selectedFile}
                            hasFile={!!selectedFile}
                        />
                    
                </div>
                </div>

                {/* <div>
                    {messages.map((m) => (
                    <div key={m.id} className="bg-blue-600 text-white p-3 rounded-lg ml-auto">
                        {m.text}
                    </div>
                    ))}
                </div> */}
        </div>
    );
}