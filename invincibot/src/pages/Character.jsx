import { useLocation, useParams } from "react-router-dom";

export default function CharacterPage() {
    const { name } = useParams();
    const location = useLocation();
    const background = location.state?.background;
    const pronoun = location.state?.pronoun;

    return (
        <div
            className="h-screen w-full bg-cover bg-center text-white flex items-center justify-center"
            style={{
                backgroundImage: `url(${background})`,
            }}

        >
            <div className="absolute inset-0 bg-black/30">
                <div className="relative flex flex-col items-center justify-start h-full pt-6 text-center text-white">
                    <h1 className="text-8xl font-bold font-title mb-3">
                        Invincibot
                    </h1>
                    <p className="font-title text-3xl mb-90 font-light">Chat with {name} and {pronoun} allies to recieve summaries of materials you share</p>
                </div>
            </div>

        </div>
    );
}