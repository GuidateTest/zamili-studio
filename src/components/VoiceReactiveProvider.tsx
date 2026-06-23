import { VoiceReactiveContext } from "../hooks/useVoiceReactive";
import { useVoiceAmplitude } from "../hooks/useVoiceAmplitude";

export const VoiceReactiveProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { amplitude, bass } = useVoiceAmplitude();

  return (
    <VoiceReactiveContext.Provider value={{ amplitude, bass }}>
      {children}
    </VoiceReactiveContext.Provider>
  );
};
