import { useQuery } from "@tanstack/react-query";
import type { Profile } from "../backend.d";
import { useActor } from "./useActor";

export function useGetProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) {
        return {
          name: "",
          title: "",
          tagline: "",
          bio: "",
          skills: [],
          experience: [],
          projects: [],
          contacts: [],
        };
      }
      return actor.getProfile();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}
