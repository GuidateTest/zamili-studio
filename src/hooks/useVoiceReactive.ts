import { createContext, useContext } from "react";

type VoiceReactiveContextValue = {
  amplitude: number;
  bass: number;
};

export const VoiceReactiveContext = createContext<VoiceReactiveContextValue>({
  amplitude: 0,
  bass: 0,
});

export const useVoiceReactive = () => useContext(VoiceReactiveContext);
