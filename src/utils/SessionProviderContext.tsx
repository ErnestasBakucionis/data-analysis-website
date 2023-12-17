'use client'
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ReactNode } from "react";

export const SessionProviderContext: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const session: Session = {expires: "2028-01-18T18:25:43.511Z"};
  
    return (
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    );
  };