import { useQuery } from "@tanstack/react-query";
import { ChildrenAPI } from "@/api/children.api";

export function useMyChild(includeAnamnesis = true) {
  return useQuery({
    queryKey: ["parent", "child", "me", includeAnamnesis],
    queryFn: () => ChildrenAPI.getMe(includeAnamnesis),
    retry: 1,
  });
}
