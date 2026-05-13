interface KineticWordsProps {
  text: string;
  className?: string;
  wordClassName?: string;
}

export function KineticWords({ text, className = '', wordClassName = '' }: KineticWordsProps) {
  return (
    <span className={className}>
      {text.split(' ').map((word, index, words) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-baseline">
          <span className={`products-kinetic-word inline-block ${wordClassName}`}>{word}</span>
          {index < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
