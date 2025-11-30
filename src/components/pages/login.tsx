import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, InfoIcon, User } from 'lucide-react-native';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { colors } from '../../core/constants/colors';
import { useLoginRequestMutation } from '../../core/http/react-query/login';
import { ActionButtonInteface } from '../../core/interface/action-button-interface';
import { LoginValidationDto } from '../../core/models/dto/login-validation-dto';
import { loginValidationSchema } from '../../core/models/validation-schemas/login-validation-schema';
import { loginStyle } from '../../styles/login/login-style';
import { ActionButton } from '../buttons/action-button';
import { ButtonCore } from '../buttons/button-core';
import SpinningIcon from '../ElementosForm/SpinningIcon';
import { ToastNotify } from '../ElementosForm/Toast';
import { Input } from '../input/input';
import { Texto } from '../texto';

export default function Login({ navigation }: any) {
  const {
    section,
    wrapper,
    container,
    text,
    title,
    loginWrapper,
    forgotPasswordText,
    buttonWrapper,
    clickHereWrapper,
    actionButtonWrapper,
    justiceWrapper,
  } = loginStyle;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginValidationDto>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { loginRequestAsync, isLoginRequesting } = useLoginRequestMutation({
    onSuccess: () => {
      ToastNotify({
        type: 'success',
        title: 'Login!',
        message: 'Autenticação realizada!',
        time: 2500,
      });
      reset();
      navigation.replace("MainTabs");
    },
  });

  async function onSubmit(data: LoginValidationDto) {
    try {
      await loginRequestAsync({ data });
    } catch {
      ToastNotify({
        type: 'error',
        title: 'Erro!',
        message: 'Ocorreu um erro ao efetuar a autenticação!',
        time: 2500,
      });
    }
  }

  const values = useMemo<ActionButtonInteface[]>(
    () => [
      {
        icon: Globe,
        description: 'Website',
      },
      {
        icon: User,
        description: 'Suporte',
      },
      {
        icon: InfoIcon,
        description: 'Sobre nós',
      },
    ],
    [],
  );

  return (
    <ScrollView
      id="login-section"
      style={section}
      keyboardShouldPersistTaps="handled"
    >
      <View style={wrapper}>
        <View style={container}>
          <Texto style={text}>Bem-vindo ao Amparo.</Texto>
          <InfoIcon color={colors.neutral[500]} size={16} />
        </View>
        <Texto style={title}>Acesse sua conta aqui.</Texto>
      </View>

      <View style={loginWrapper}>
        <Controller
          control={control}
          name="username"
          render={({ field: { value, onChange } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              label="Login"
              placeholder="Login"
              error={errors.username?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              label="Senha"
              placeholder="Senha"
              error={errors.password?.message}
              isPassword
            />
          )}
        />

        <TouchableOpacity activeOpacity={0.6}>
          <Texto style={forgotPasswordText} align="right">
            Esqueceu sua senha?
          </Texto>
        </TouchableOpacity>

        <View style={buttonWrapper}>
          <ButtonCore
            onPress={handleSubmit(onSubmit)}
            disabled={isLoginRequesting}
          >
            {
              isLoginRequesting
              ? <SpinningIcon text={false} color="white"/>
              :
              "Entrar"
            }
          </ButtonCore>
        </View>

        <View style={clickHereWrapper}>
          <Texto>Ainda não possui uma conta? </Texto>
          <Texto style={forgotPasswordText} onPress={() => navigation.navigate('Register')}>Toque aqui</Texto>
        </View>
      </View>

      <View style={actionButtonWrapper}>
        <ActionButton values={values} />
      </View>

      <View style={justiceWrapper}>
        <Texto align="center">
          © 2025 Amparo. Todos os direitos reservados.
        </Texto>
      </View>
    </ScrollView>
  );
}
