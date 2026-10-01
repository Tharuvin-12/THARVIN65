import React from 'react';

interface ComicArtRendererProps {
  customImageUrl?: string;
  sceneDescription: string;
  visualMood: string;
  panelNumber: number;
  eraTag?: string;
}

export const ComicArtRenderer: React.FC<ComicArtRendererProps> = ({
  customImageUrl,
  sceneDescription,
  visualMood,
  panelNumber,
  eraTag = 'Indian Historical',
}) => {
  if (customImageUrl) {
    return (
      <div className="relative w-full h-full min-h-[220px] sm:min-h-[280px] bg-[#1C1813] overflow-hidden">
        <img
          src={customImageUrl}
          alt={`Comic scene panel ${panelNumber}`}
          className="w-full h-full object-cover object-center filter contrast-110 saturate-110"
          referrerPolicy="no-referrer"
        />
        {/* Halftone & Ink paper overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#14120E]/50 pointer-events-none" />
        <div className="absolute inset-0 comic-halftone opacity-15 pointer-events-none" />
      </div>
    );
  }

  // Determine atmospheric colors based on visualMood or panelNumber
  const isNight =
    visualMood.toLowerCase().includes('night') ||
    visualMood.toLowerCase().includes('midnight') ||
    visualMood.toLowerCase().includes('dark') ||
    sceneDescription.toLowerCase().includes('midnight');

  const isFire =
    visualMood.toLowerCase().includes('fire') ||
    visualMood.toLowerCase().includes('torch') ||
    visualMood.toLowerCase().includes('battle') ||
    visualMood.toLowerCase().includes('smoke');

  const isDawn =
    visualMood.toLowerCase().includes('dawn') ||
    visualMood.toLowerCase().includes('sunrise') ||
    visualMood.toLowerCase().includes('morning') ||
    visualMood.toLowerCase().includes('golden');

  const isPalace =
    visualMood.toLowerCase().includes('palace') ||
    visualMood.toLowerCase().includes('durbar') ||
    sceneDescription.toLowerCase().includes('pataliputra') ||
    sceneDescription.toLowerCase().includes('throne');

  // Background gradients
  const bgGradient = isFire
    ? 'from-[#380E07] via-[#751C0C] to-[#C94D0F]'
    : isNight
    ? 'from-[#0A0D18] via-[#151C33] to-[#2B355A]'
    : isDawn
    ? 'from-[#2D123D] via-[#852C4D] to-[#E58C3B]'
    : isPalace
    ? 'from-[#1C1813] via-[#4A3B2C] to-[#8C6D45]'
    : 'from-[#181B1C] via-[#353E42] to-[#596A70]';

  return (
    <div
      className={`relative w-full h-full min-h-[220px] sm:min-h-[280px] bg-gradient-to-b ${bgGradient} overflow-hidden flex flex-col justify-end p-4`}
    >
      {/* Comic Halftone Texture Grid */}
      <div className="absolute inset-0 comic-halftone opacity-20 pointer-events-none" />

      {/* Atmospheric Moon or Sun */}
      {isNight && (
        <div className="absolute top-4 right-8 w-12 h-12 rounded-full bg-[#E8E1C7] shadow-[0_0_20px_rgba(255,255,255,0.4)] opacity-85 border border-[#3A456B]" />
      )}
      {isDawn && (
        <div className="absolute top-6 left-12 w-16 h-16 rounded-full bg-[#FCE38A] shadow-[0_0_30px_rgba(252,227,138,0.6)] opacity-90" />
      )}
      {isFire && (
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#FFA726]/30 to-transparent pointer-events-none" />
      )}

      {/* Distant Mountains / Sahyadri Peaks SVG */}
      <svg
        className="absolute bottom-12 inset-x-0 w-full h-28 opacity-40 fill-[#0A0907] pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 500 150"
      >
        <path d="M0,150 L0,80 L60,30 L130,90 L210,10 L300,70 L390,20 L460,85 L500,50 L500,150 Z" />
      </svg>

      {/* Fortress Ramparts & Watchtowers Silhouette */}
      <svg
        className="absolute bottom-0 inset-x-0 w-full h-24 opacity-85 fill-[#0F0D0A] stroke-[#1C1914] stroke-2 pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 600 120"
      >
        {/* Bastion parapets with battlements (Merlons) */}
        <path d="M0,120 L0,50 L30,50 L30,35 L50,35 L50,50 L70,50 L70,35 L90,35 L90,50 L110,50 L110,35 L130,35 L130,50 L200,50 L210,20 L240,20 L250,50 L350,50 L350,35 L370,35 L370,50 L390,50 L390,35 L410,35 L410,50 L500,50 L500,25 L530,25 L530,50 L600,50 L600,120 Z" />
      </svg>

      {/* Saffron Maratha Flag or Royal Standard Flapping */}
      <div className="absolute bottom-16 right-12 z-5 pointer-events-none">
        <svg className="w-8 h-8 fill-[#E26D16] stroke-[#000] stroke-1" viewBox="0 0 40 40">
          <path d="M5,5 L35,15 L5,25 Z" />
          <line x1="5" y1="5" x2="5" y2="38" stroke="#000" strokeWidth="2" />
        </svg>
      </div>

      {/* Foreground Hero Warriors Silhouette */}
      <div className="relative z-10 flex items-end justify-between pointer-events-none">
        <div className="flex items-end gap-2">
          {/* Warrior Silhouette with Talwar & Shield */}
          <svg
            className="w-20 h-28 sm:w-24 sm:h-36 fill-[#0C0B08] stroke-[#E5A93B]/30 stroke-1 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            viewBox="0 0 100 140"
          >
            {/* Turban kalgi */}
            <path d="M45,15 Q50,5 52,0 Q53,10 48,15 Z" fill="#E26D16" />
            {/* Head & Turban */}
            <circle cx="50" cy="25" r="14" />
            <path d="M36,25 Q50,15 64,25 Q50,32 36,25 Z" fill="#2C2418" />
            {/* Torso & Armor */}
            <path d="M38,38 L62,38 L68,75 L32,75 Z" />
            {/* Raised Sword (Talwar) */}
            <path d="M68,50 L85,25 L92,5 Q88,15 80,30 L66,56 Z" fill="#D4D0C5" />
            {/* Shield (Dhal) */}
            <circle cx="34" cy="55" r="13" fill="#1C1813" stroke="#C49B45" strokeWidth="2" />
            {/* Legs with Dhoti */}
            <path d="M32,75 L45,120 L50,120 L40,75 Z" />
            <path d="M60,75 L52,120 L58,120 L68,75 Z" />
          </svg>
        </div>

        {/* Ambient Stage Direction Note */}
        <div className="text-right max-w-[200px] bg-[#14120E]/80 backdrop-blur-xs p-1.5 rounded border border-[#2C2418] text-[9px] text-[#C4B498] font-mono leading-tight">
          <span className="text-[#E5A93B] block uppercase font-bold">{visualMood}</span>
          <span className="line-clamp-2 italic">{sceneDescription}</span>
        </div>
      </div>
    </div>
  );
};
