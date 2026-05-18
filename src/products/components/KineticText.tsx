interface KineticWordsProps {
    text: string;
    className?: string;
    wordClassName?: string;
    /**
     * Words from `text` that should render with a special "highlight"
     * treatment — serif italic yuzu, with drop-shadow. Use to give the
     * climactic phrase in a long headline its own typographic voice.
     * Case-insensitive comparison. Punctuation is stripped for matching.
     */
    highlightWords?: string[];
    /** Override the highlight class. Defaults to editorial italic yuzu. */
    highlightClassName?: string;
}

const DEFAULT_HIGHLIGHT =
    'font-serif italic font-normal text-yuzu drop-shadow-[0_0_32px_rgba(204,255,0,0.32)]';

function normalize(word: string) {
    return word.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
}

export function KineticWords({
    text,
    className = '',
    wordClassName = '',
    highlightWords,
    highlightClassName = DEFAULT_HIGHLIGHT,
}: KineticWordsProps) {
    const normalizedHighlights = highlightWords
        ? new Set(highlightWords.map(normalize))
        : null;

    return (
        <span className={className}>
            {text.split(' ').map((word, index, words) => {
                const isHighlight =
                    normalizedHighlights &&
                    normalizedHighlights.has(normalize(word));
                return (
                    <span key={`${word}-${index}`}>
                        <span
                            className={[
                                'products-kinetic-word inline-block align-baseline will-change-transform',
                                wordClassName,
                                isHighlight ? highlightClassName : '',
                            ]
                                .filter(Boolean)
                                .join(' ')}
                        >
                            {word}
                        </span>
                        {index < words.length - 1 ? ' ' : ''}
                    </span>
                );
            })}
        </span>
    );
}
