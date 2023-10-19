import { useEraTimeLeft } from 'library/Hooks/useEraTimeLeft';
import { useEffect, useState } from 'react';

export const useEraMsLeftUpdatedEverySecond = () => {
  const { get } = useEraTimeLeft();

  const [eraSecondsLeft, setEraSecondsLeft] = useState(() => get().timeleft);

  useEffect(() => {
    const updateEraSeconds = () => {
      setEraSecondsLeft(get().timeleft);
    };

    const intervalId = setInterval(updateEraSeconds, 1000);

    return () => clearInterval(intervalId);
  }, [get]);

  return eraSecondsLeft.toNumber() * 1000;
};
