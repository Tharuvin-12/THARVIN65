import React from 'react';
import { SoundEffect } from '../types/comic';

interface SoundEffectBurstProps {
  sfx: SoundEffect;
}

export const SoundEffectBurst: React.FC<SoundEffectBurstProps> = ({ sfx }) => {
  if (!sfx || !sfx.text) return null;

  const isExplosive = sfx.style === 'explosive' || sfx.text.includes('DHAAAM') || sfx.text.includes('BOOM');
  const isBlade = sfx.style === 'blade' || sfx.text.includes('SHING') || sfx.text.includes('CLANG') || sfx.text.includes('KHADAK');

  return (
    <div className="absolute z-15 pointer-events-none transform -rotate-6 select-none flex items-center justify-center">
      {/* Visual Comic Starburst backdrop for explosive SFX */}
      {isExplosive && (
        <svg
          className="absolute w-24 h-24 sm:w-32 sm:h-32 text-[#E26D16] fill-current animate-pulse opacity-90 filter drop-shadow-[2px_2px_0px_#000]"
          viewBox="0 0 100 100"
        >
          <polygon points="50,0 63,35 100,20 75,50 100,80 63,65 50,100 37,65 0,80 25,50 0,20 37,35" />
        </svg>
      )}

      {/* Speed lines backdrop for blade SFX */}
      {isBlade && (
        <div className="absolute -inset-2 bg-[#FEE028]/40 -skew-x-12 rounded border-y border-[#000]" />
      )}

      {/* Dramatic Text */}
      <span
        className={`relative z-10 font-comic text-2xl sm:text-3xl lg:text-4xl tracking-widest text-[#FEE028] ${
          isExplosive ? 'text-[#FFF275]' : ''
        }`}
        style={{
          WebkitTextStroke: '2.5px #000',
          textShadow: '3px 3px 0px #000, -2px -2px 0px #000',
        }}
      >
        {sfx.text}
      </span>
    </div>
  );
};
