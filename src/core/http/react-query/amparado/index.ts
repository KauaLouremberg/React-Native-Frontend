import { useMutation } from '@tanstack/react-query';
import { AmparadoValidationDto } from '../../../models/dto/amparado-validation-dto';
import { getKey } from '../../../utils/getKey';
import { amparadoRequest } from '../../requests/amparado';

const KEYS = {
  REGISTER_REQUEST: getKey('AMPARADO_REQUEST'),
};

type useAmparadoRequestMutationParams = {
  data: AmparadoValidationDto;
};

type useAmparadoRequestMutationOptions = {
  onSuccess?: (data: useAmparadoRequestMutationParams) => void;
};

export function useAmparadoRequestingMutation({
  onSuccess,
}: useAmparadoRequestMutationOptions) {
  const {
    mutateAsync: amparadoRequestAsync,
    isPending: isAmparadoRequesting,
    ...rest
  } = useMutation({
    mutationFn: ({ data }: useAmparadoRequestMutationParams) => amparadoRequest(data),
    mutationKey: [KEYS.REGISTER_REQUEST],
    onSuccess,
  });

  return {
    amparadoRequestAsync,
    isAmparadoRequesting,
    ...rest,
  };
}
