import { useMutation } from '@tanstack/react-query';
import { RegisterValidationDto } from '../../../models/dto/register-validation-dto';
import { getKey } from '../../../utils/getKey';
import { registerRequest } from '../../requests/register';

const KEYS = {
  REGISTER_REQUEST: getKey('REGISTER_REQUEST'),
};

type useRegisterRequestMutationParams = {
  data: RegisterValidationDto;
};

type useRegisterRequestMutationOptions = {
  onSuccess?: (data: useRegisterRequestMutationParams) => void;
};

export function useRegisterRequestMutation({
  onSuccess,
}: useRegisterRequestMutationOptions) {
  const {
    mutateAsync: registerRequestAsync,
    isPending: isRegisterRequesting,
    ...rest
  } = useMutation({
    mutationFn: ({ data }: useRegisterRequestMutationParams) => registerRequest(data),
    mutationKey: [KEYS.REGISTER_REQUEST],
    onSuccess,
  });

  return {
    registerRequestAsync,
    isRegisterRequesting,
    ...rest,
  };
}
