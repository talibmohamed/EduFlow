/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

// The page's global "energy" mood. The landing wrapper turns this into a
// class (energy-rest / energy-spark) that re-tones the page.
const EnergyCtx = createContext({ energy: 'calm', setEnergy: () => {} });

export function EnergyProvider({ children }) {
  const [energy, setEnergy] = useState('calm');
  return <EnergyCtx.Provider value={{ energy, setEnergy }}>{children}</EnergyCtx.Provider>;
}

export const useEnergy = () => useContext(EnergyCtx);

export const energyGlyph = {
  rest: '😴',
  calm: '🙂',
  spark: '⚡',
};
