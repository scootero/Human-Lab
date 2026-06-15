import MadScientistArt from './MadScientistArt';

export default function Scientist({ animation = 'float', className = '', size = 72 }) {
  const h = Math.round(size * 1.32);
  return (
    <div
      className={`einstein-char-wrap ${animation} ${className}`}
      style={{ width: size, height: h }}
    >
      <MadScientistArt variant="center" />
    </div>
  );
}
