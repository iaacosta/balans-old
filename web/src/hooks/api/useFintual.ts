import axios, { AxiosError, AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import { useMutation } from 'react-query';
import api from '../../constants/api';

type FintualTokenInput = {
  email: string;
  password: string;
};

type FintualTokenBody = {
  user: FintualTokenInput;
};

type FintualTokenResponse = {
  data: {
    type: 'access_token';
    attributes: {
      token: string;
    };
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useFintualToken = () => {
  const { enqueueSnackbar } = useSnackbar();
  const mutationTuple = useMutation(
    async ({ email, password }: FintualTokenInput) =>
      axios
        .post<FintualTokenBody, AxiosResponse<FintualTokenResponse>>(
          `${api.fintualApiUrl}/access_tokens`,
          { user: { email, password } },
        )
        .then(({ data }) => ({ token: data.data.attributes.token, email })),
    {
      onError: (error: AxiosError) => {
        let message = 'Unknown Fintual API error';
        if (error?.response?.status === 401) message = 'Wrong email or password';
        else if (error?.response?.status === 403) message = 'Forbidden access';
        enqueueSnackbar(message, { variant: 'error' });
      },
    },
  );

  return mutationTuple;
};
