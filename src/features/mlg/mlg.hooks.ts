import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mlgApi } from "./mlg.api";
import { mlgQueryKeys } from "./mlg.query-keys";
import type { MlgGroupSearchCond, MlgGroupUpdateReqDto } from "./mlg.types";

interface UpdateParams {
  mlgCodeVal: string;
  data: MlgGroupUpdateReqDto;
}

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------

export const useMlgList = (params?: MlgGroupSearchCond) =>
  useQuery({
    queryKey: mlgQueryKeys.list(params),
    queryFn: () => mlgApi.getList(params).then((res) => res.data.body),
  });

export const useMlgDetail = (mlgCodeVal: string) =>
  useQuery({
    queryKey: mlgQueryKeys.detail(mlgCodeVal),
    queryFn: () => mlgApi.getOne(mlgCodeVal).then((res) => res.data.body),
    enabled: !!mlgCodeVal,
  });

export const useMlgBundle = (lang?: string) =>
  useQuery({
    queryKey: mlgQueryKeys.bundle(lang),
    queryFn: () => mlgApi.getBundle(lang).then((res) => res.data.body),
  });

// ---------------------------------------------------------------------------
// Mutation
// ---------------------------------------------------------------------------

export const useMlgCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mlgApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mlgQueryKeys.all });
    },
  });
};

export const useMlgUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mlgCodeVal, data }: UpdateParams) => mlgApi.update(mlgCodeVal, data),
    onSuccess: (_, { mlgCodeVal }) => {
      queryClient.invalidateQueries({ queryKey: mlgQueryKeys.detail(mlgCodeVal) });
      queryClient.invalidateQueries({ queryKey: mlgQueryKeys.list() });
    },
  });
};

export const useMlgDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mlgApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mlgQueryKeys.all });
    },
  });
};
