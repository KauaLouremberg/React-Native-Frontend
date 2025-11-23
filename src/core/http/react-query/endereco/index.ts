import { useMutation } from '@tanstack/react-query';
import { EnderecoValidationDto } from '../../../models/dto/endereco-validation-dto';
import { getKey } from '../../../utils/getKey';
import { enderecoPRequest } from '../../requests/configuracao';

const KEYS = {
  ENDERECO_REQUEST: getKey('ENDERECO_REQUEST'),
};

type useEnderecoRequestMutationParams = {
  data: EnderecoValidationDto;
};

type useEnderecoRequestMutationOptions = {
  onSuccess?: (data: useEnderecoRequestMutationParams) => void;
};

export function useEnderecoRequestMutation({
  onSuccess,
}: useEnderecoRequestMutationOptions) {
  const {
    mutateAsync: EnderecoRequestAsync,
    isPending: isEnderecoRequesting,  
    ...rest
  } = useMutation({
    mutationFn: ({ data }: useEnderecoRequestMutationParams) => enderecoPRequest(data as any),
    mutationKey: [KEYS.ENDERECO_REQUEST],
    onSuccess,
  });

  return {
    EnderecoRequestAsync,
    isEnderecoRequesting,
    ...rest,
  };
}
