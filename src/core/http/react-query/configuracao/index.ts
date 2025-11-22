import { useMutation } from '@tanstack/react-query';
import { ConfigValidationDto } from '../../../models/dto/config-validation-dto';
import { getKey } from '../../../utils/getKey';
import { configRequest } from '../../requests/configuracao';

const KEYS = {
  CONFIG_REQUEST: getKey('CONFIG_REQUEST'),
};

type useConfigRequestMutationParams = {
  data: ConfigValidationDto;
};

type useConfigRequestMutationOptions = {
  onSuccess?: (data: useConfigRequestMutationParams) => void;
};

export function useConfigRequestMutation({
  onSuccess,
}: useConfigRequestMutationOptions) {
  const {
    mutateAsync: configRequestAsync,
    isPending: isConfigRequesting,  
    ...rest
  } = useMutation({
    mutationFn: ({ data }: useConfigRequestMutationParams) => configRequest(data as any),
    mutationKey: [KEYS.CONFIG_REQUEST],
    onSuccess,
  });

  return {
    configRequestAsync,
    isConfigRequesting,
    ...rest,
  };
}
