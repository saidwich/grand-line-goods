export default function HatMark({ className = "" }: { className?: string }) {
  const ink = "#14110f";

  return (
    <svg viewBox="0 0 200 120" className={className} aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
      {/* frayed brim */}
      <path
        d="M6 80 C28 64 58 68 82 70 L150 66 C168 58 188 60 197 68 L192 73 L198 79 L188 81 L191 87 C172 93 150 95 128 97 C100 106 62 102 42 94 L26 96 L21 89 L9 90 Z"
        fill="#eba93b"
        stroke={ink}
        strokeWidth="1.6"
      />
      {/* brim hatching */}
      <g stroke={ink} strokeWidth="0.9" opacity="0.6" fill="none">
        <path d="M30 84 L52 90" />
        <path d="M44 80 L70 88" />
        <path d="M96 90 L124 90" />
        <path d="M110 84 L146 84" />
        <path d="M150 78 L176 76" />
        <path d="M60 94 L90 97" />
        <path d="M134 90 L164 86" />
      </g>

      {/* crown */}
      <path
        d="M54 78 C45 36 78 14 110 14 C144 14 163 42 157 78 Z"
        fill="#f6cd6e"
        stroke={ink}
        strokeWidth="1.8"
      />
      {/* crown shading */}
      <path d="M128 18 C152 28 162 52 157 78 L138 78 C146 52 140 32 128 18 Z" fill="#e0a63e" opacity="0.55" />
      {/* straw hatching */}
      <g stroke={ink} strokeWidth="0.9" opacity="0.65" fill="none">
        <path d="M70 30 C66 42 66 52 68 62" />
        <path d="M82 22 C78 38 78 52 80 64" />
        <path d="M95 18 C92 36 92 52 94 66" />
        <path d="M108 17 C106 36 106 52 108 66" />
        <path d="M121 19 C121 36 121 52 122 66" />
        <path d="M134 26 C136 40 136 52 135 64" />
        <path d="M146 38 C148 48 148 56 147 64" />
      </g>

      {/* red band */}
      <path
        d="M54 62 C80 72 132 72 158 60 L157 78 C132 90 80 90 54 78 Z"
        fill="#d6203a"
        stroke={ink}
        strokeWidth="1.8"
      />
      <path d="M118 74 C132 72 146 68 158 60 L157 78 C146 84 132 88 118 89 Z" fill="#9c1226" />
      {/* frayed band edge */}
      <path d="M54 62 L50 66 L55 68 L52 72 L54 78" fill="none" stroke={ink} strokeWidth="1.2" />
    </svg>
  );
}