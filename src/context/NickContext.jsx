import { createContext, useState } from "react";

export const NickContext = createContext();

const NickContextProvider = ({ children }) => {
  const [nick, setNick] = useState("");

  const data = {
    nick,
    setNick,
  };

  return <NickContext.Provider value={data}>{children}</NickContext.Provider>;
};

export default NickContextProvider;
