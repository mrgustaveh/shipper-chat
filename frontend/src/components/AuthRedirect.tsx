import { Fragment, useEffect, type PropsWithChildren } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

export const AuthRedirect = ({ children }: PropsWithChildren) => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  return <Fragment>{children}</Fragment>;
};
