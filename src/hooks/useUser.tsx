import { useSession } from "next-auth/react";

export function useCurrentUser() {
	const { data, status, update } = useSession();
	const user = data?.user ?? null;
	return {
		user,
		status,
		isLoading: status === "loading",
		isAuthenticated: status === "authenticated",
		isAdmin: user?.role === "ADMIN",
		update,
	};
}

export function useIsAdmin() {
	const { isAdmin, isLoading } = useCurrentUser();
	// Petit helper pour factoriser la detection d'un admin dans les composants.
	return { isAdmin, isChecking: isLoading };
}
