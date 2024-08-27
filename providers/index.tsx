"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { SessionProvider } from "next-auth/react";

interface Props {
  children: ReactNode;
}

// const Providers = ({ children }: Props) => {
//   return {children};
// };
// export default Providers;

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}
