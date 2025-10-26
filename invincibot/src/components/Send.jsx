export default function Send({ onClick }) {
    return (
        <div className="mt-8">
            <button
                type="button"
                onClick={() => document.getElementById().click()}
                className="cursor-pointer inline-block transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]"
            >
                <svg width="55" height="55" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="40" fill="black" />
                    <path d="M18.59375 58.2812L60.78125 40L18.59375 21.71875V35.7812L46.71875 40L18.59375 44.2188V58.2812Z" fill="white"/>
                </svg>
            </button>
        </div>
    );
}