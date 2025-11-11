import { useMutation } from '@tanstack/react-query';
import { LoginValidationDto } from '../../../models/dto/login-validation-dto';
import { getKey } from '../../../utils/getKey';
import { loginRequest } from '../../requests/login';

const KEYS = {
  LOGIN_REQUEST: getKey('LOGIN_REQUEST'),
};

type useLoginRequestMutationParams = {
  data: LoginValidationDto;
};

type useLoginRequestMutationOptions = {
  onSuccess?: (data: useLoginRequestMutationParams) => void;
};

export function useLoginRequestMutation({
  onSuccess,
}: useLoginRequestMutationOptions) {
  const {
    mutateAsync: loginRequestAsync,
    isPending: isLoginRequesting,
    ...rest
  } = useMutation({
    mutationFn: ({ data }: useLoginRequestMutationParams) => loginRequest(data),
    mutationKey: [KEYS.LOGIN_REQUEST],
    onSuccess,
  });

  return {
    loginRequestAsync,
    isLoginRequesting,
    ...rest,
  };
}
