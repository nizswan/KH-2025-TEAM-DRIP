import { useLocation, useParams, useNavigate } from "react-router-dom";

export default function CharacterPage() {
    const { name } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const background = location.state?.background;
    const pronoun = location.state?.pronoun;

    const handleBack = () => {
        navigate('/ChooseCharacter');
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
                 <div className="absolute top-12 left-12 z-10">
                    <button
                        onClick={handleBack}
                        className="cursor-pointer bg-[#FFFFFF] text-[#000000] text-base px-4 py-1.5 rounded hover:bg-[#FFFFFF] hover:shadow-[0_0_30px_10px_#FFFFFF] transition-shadow duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="inline-block mr-2">
                            <path d="M10 19l-7-7 7-7M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Choose Your Character
                    </button>
                </div>
            </div>
            {/* Content above overlay */}
            <div className="relative flex flex-col items-center justify-between h-full pt-6 text-center text-white">
                <div>
                    <h1 className="text-8xl font-bold font-title mb-3">
                        Invincibot
                    </h1>
                    <p className="font-title text-3xl mb-90 font-light">
                        Chat with {name} and {pronoun} allies to receive summaries of materials you share
                    </p>
                </div>
            </div>
        </div>
    );
}