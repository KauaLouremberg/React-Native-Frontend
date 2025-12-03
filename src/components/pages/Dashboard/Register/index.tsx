import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, InfoIcon, User } from 'lucide-react-native';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { colors } from '../../../../core/constants/colors';
import { useRegisterRequestMutation } from '../../../../core/http/react-query/register';
import { ActionButtonInteface } from '../../../../core/interface/action-button-interface';
import { RegisterValidationDto } from '../../../../core/models/dto/register-validation-dto';
import { registerValidationSchema } from '../../../../core/models/validation-schemas/register-validation-schema';
import { loginStyle } from '../../../../styles/login/login-style';
import { ActionButton } from '../../../buttons/action-button';
import { ButtonCore } from '../../../buttons/button-core';
import SpinningIcon from '../../../ElementosForm/SpinningIcon';
import { ToastNotify } from '../../../ElementosForm/Toast';
import { Input } from '../../../input/input';
import { Texto } from '../../../texto';

export default function Register({ navigation }: any) {
  const {
    section,
    wrapper,
    container,
    text,
    title,
    loginWrapper,
    buttonWrapper,
    actionButtonWrapper,
    justiceWrapper,
    forgotPasswordText,
    clickHereWrapper
  } = loginStyle;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterValidationDto>({
    resolver: zodResolver(registerValidationSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  });

  const { registerRequestAsync, isRegisterRequesting } = useRegisterRequestMutation({
    onSuccess: () => {
      ToastNotify({
        type: 'success',
        title: 'Registrado!',
        message: 'Usuario Cadastrado!',
        time: 2500,
      });
      reset();
      navigation.navigate("Login")

    },
  });

  async function onSubmit(data: RegisterValidationDto) {
    try {
      await registerRequestAsync({ data });
    } catch {
      ToastNotify({
        type: 'error',
        title: 'Erro!',
        message: 'Ocorreu um erro ao efetuar o Registro!',
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
        <Texto style={title}>Registre sua conta aqui.</Texto>
      </View>

      <View style={loginWrapper}>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              label="Email"
              placeholder="Email"
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="username"
          render={({ field: { value, onChange } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              label="Username"
              placeholder="Username"
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

        <View style={buttonWrapper}>
          <ButtonCore
            onPress={handleSubmit(onSubmit)}
            disabled={isRegisterRequesting}
          >
            {!isRegisterRequesting ? "Registrar-se" : <SpinningIcon text={false} color="white" size={20} />}
          </ButtonCore>
        </View>
      </View>

      <View style={clickHereWrapper}>
          <Texto>Ja possui uma conta? </Texto>
          <Texto style={forgotPasswordText} onPress={() => navigation.navigate('Login')}>Toque aqui</Texto>
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
