import React from "react";

const generateUniqueId = (raceId) => `textMask-${raceId}`;

const CircleWithText = ({ raceId }) => {
  const maskId = generateUniqueId(raceId);

  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="100" height="100" fill="currentColor" />
          <text x="50" y="50" textAnchor="middle" alignmentBaseline="middle" >
            {raceId}
          </text>
        </mask>
      </defs>
      <circle cx="50" cy="50" r="40" fill="currentColor" stroke="none" mask={`url(#${maskId})`} />
    </svg>
  );
};

export default CircleWithText;
