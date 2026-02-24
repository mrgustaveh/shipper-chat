import { useSession } from "@clerk/clerk-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAccount,
  createAccount,
  updateAccount,
  getUsers,
} from "@/lib/api/auth";

export const useApiAuth = () => {
  const { session } = useSession();

  const getAccountQuery = useQuery({
    queryKey: ["get-account"],
    queryFn: async () => {
      const token = await session?.getToken();
      return getAccount({ token: token ?? "" });
    },
    enabled: !!session,
  });

  const listUsersQuery = useQuery({
    queryKey: ["list-users"],
    queryFn: async () => {
      const token = await session?.getToken();
      return getUsers({ token: token ?? "" });
    },
    enabled: !!session,
  });

  const createAccountMutation = useMutation({
    mutationFn: async (
      args: Omit<Parameters<typeof createAccount>[0], "token">,
    ) => {
      const token = await session?.getToken();
      return createAccount({ ...args, token: token ?? "" });
    },
  });

  const updateAccountMutation = useMutation({
    mutationFn: async (
      args: Omit<Parameters<typeof updateAccount>[0], "token">,
    ) => {
      const token = await session?.getToken();
      return updateAccount({ ...args, token: token ?? "" });
    },
  });

  return {
    getAccountQuery,
    createAccountMutation,
    updateAccountMutation,
    listUsersQuery,
  };
};
