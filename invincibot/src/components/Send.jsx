export default function Send({ onClick }) {
    return (

        <div className="mt">
            <button
            type="button"
            onClick={() => document.getElementById().click()}
            className="cursor-pointer inline-block transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
        >
                <svg width="55" height="55" viewBox="0 0 80 80" fill="none" >
                    <circle cx="40" cy="40" r="40" fill="black" />
                    <path
                        d="M8 40 L47 27.5 L8 15 V24 L36 27.5 L8 31 V40 Z"
                        fill="white"
                    />
                </svg>

        </button>
        </div>

    );
}