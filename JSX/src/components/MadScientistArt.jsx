import scientistImg from '../assets/scientist.png';

const ART = { w: 443, h: 399 };

const VIEWBOX = {
  center: `0 0 ${ART.w} ${ART.h}`,
  // Left peek: show face + upper body without clipping the head
  'peek-left': `0 0 ${Math.round(ART.w * 0.68)} ${Math.round(ART.h * 0.88)}`,
  'peek-right': `${Math.round(ART.w * 0.32)} 0 ${Math.round(ART.w * 0.68)} ${Math.round(ART.h * 0.88)}`,
};

export default function MadScientistArt({ variant = 'center', className = '' }) {
  const vb = VIEWBOX[variant] || VIEWBOX.center;

  return (
    <svg
      className={`mad-scientist-svg ${className}`}
      viewBox={vb}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      role="img"
      aria-hidden
      preserveAspectRatio="xMidYMax meet"
      style={{ overflow: 'visible', display: 'block', width: '100%', height: '100%' }}
    >
      <title>Dr. Einstein</title>
      <image href={scientistImg} x="0" y="0" width={ART.w} height={ART.h} preserveAspectRatio="xMidYMid meet" />
    </svg>
  );
}
