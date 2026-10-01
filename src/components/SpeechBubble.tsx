import React, { useState } from 'react';
import { DialogueBalloon, DialogueType } from '../types/comic';

interface SpeechBubbleProps {
  balloon: DialogueBalloon;
  onUpdateText?: (newText: string) => void;
  isEditable?: boolean;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  balloon,
  onUpdateText,
  isEditable = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(balloon.text);

  const handleBlur = () => {
    setIsEditing(false);
    if (onUpdateText && currentText !== balloon.text) {
      onUpdateText(currentText);
    }
  };

  const isShout = balloon.type === 'shout';
  const isThought = balloon.type === 'thought';
  const isWhisper = balloon.type === 'whisper';

  // Position positioning classes
  const positionClass =
    balloon.position === 'top-right'
      ? 'self-end mr-2 mt-2'
      : balloon.position === 'bottom-left'
      ? 'self-start ml-2 mb-2'
      : balloon.position === 'bottom-right'
      ? 'self-end mr-2 mb-2'
      : 'self-start ml-2 mt-2';

  return (
    <div
      className={`relative z-20 max-w-[85%] sm:max-w-[75%] transition-all ${positionClass} ${
        isEditable ? 'cursor-pointer hover:scale-[1.02]' : ''
      }`}
      onClick={() => isEditable && !isEditing && setIsEditing(true)}
      title={isEditable ? 'Click to edit dialogue' : undefined}
    >
      {/* Balloon Speaker Label */}
      <div className="flex items-center gap-1 mb-0.5 ml-2">
        <span
          className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded shadow-[1px_1px_0px_#000] border border-[#000] ${
            isShout
              ? 'bg-[#E26D16] text-[#FFF]'
              : 'bg-[#FEE028] text-[#14120E]'
          }`}
        >
          {balloon.speaker}
        </span>
      </div>

      {/* Balloon Shape Container */}
      <div
        className={`relative px-3 py-2 text-xs sm:text-sm font-semibold text-[#14120E] shadow-[3px_3px_0px_#000] ${
          isShout
            ? 'bg-[#FFF9D2] border-[2.5px] border-[#000] font-black uppercase tracking-wide transform rotate-[-1deg]'
            : isThought
            ? 'bg-[#FFFFFF] border-[2px] border-dashed border-[#000] rounded-2xl italic'
            : isWhisper
            ? 'bg-[#F2EFE9] border-[1.5px] border-dashed border-[#555] rounded-xl text-[#3A352E]'
            : 'bg-[#FFFFFF] border-[2px] border-[#000] rounded-xl'
        }`}
      >
        {isEditing ? (
          <textarea
            autoFocus
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleBlur();
              }
            }}
            className="w-full bg-amber-50 text-stone-900 border border-amber-400 p-1 text-xs sm:text-sm rounded font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
            rows={2}
          />
        ) : (
          <p className="leading-snug select-none">{balloon.text}</p>
        )}

        {/* Comic Tail */}
        {!isThought && (
          <svg
            className={`absolute -bottom-2.5 left-4 w-4 h-3 pointer-events-none fill-white stroke-black stroke-[2] ${
              isShout ? 'fill-[#FFF9D2]' : 'fill-white'
            }`}
            viewBox="0 0 20 15"
          >
            <path d="M0,0 L20,0 L5,15 Z" />
          </svg>
        )}

        {/* Thought bubbles little bubbles */}
        {isThought && (
          <div className="absolute -bottom-3 left-4 flex gap-1 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-white border border-black" />
            <span className="w-1.5 h-1.5 rounded-full bg-white border border-black mt-1" />
          </div>
        )}
      </div>
    </div>
  );
};
