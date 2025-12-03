import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { colors } from "../../../core/constants/colors";
import { useAmparadoRequestingMutation } from "../../../core/http/react-query/amparado";
import { AmparadoValidationDto } from "../../../core/models/dto/amparado-validation-dto";
import { registerValidationSchema } from "../../../core/models/validation-schemas/register-validation-schema";
import { loginStyle } from "../../../styles/login/login-style";
import { ButtonCore } from "../../buttons/button-core";
import FloatButton from "../../buttons/float-button";
import SpinningIcon from "../../ElementosForm/SpinningIcon";
import { ToastNotify } from "../../ElementosForm/Toast";
import { HeaderNavigation } from "../../headerNavigation/header-navigation";
import { Input } from "../../input/input";
import { Texto } from "../../texto";

const Amparado = ({navigation}: any) => {

  const {
      title,
      loginWrapper,
      buttonWrapper,
    } = loginStyle;

  const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<AmparadoValidationDto>({
      resolver: zodResolver(registerValidationSchema),
      defaultValues: {
        username: '',
        password: '',
        email: ''
      },
    });

    const { amparadoRequestAsync, isAmparadoRequesting } = useAmparadoRequestingMutation({
      onSuccess: () => {
        ToastNotify({
          type: 'success',
          title: 'Criado!',
          message: 'Amparado criado com sucesso!',
          time: 2500,
        });
        reset()
      }
    })

    async function onSubmit(data: AmparadoValidationDto) {
        try {
          await amparadoRequestAsync({ data });
        } catch {
          ToastNotify({
            type: 'error',
            title: 'Erro!',
            message: 'Ocorreu um erro ao criar o Amparado!',
            time: 2500,
          });
        }
      }

  return (
  <>
  <HeaderNavigation
    title="Amparado"
    initialTabKey="perfil"
    variant={'unique'}
    tabs={[
      {
        key: 'amparado',
        title: 'Amparado',
        render: () => (
          <View style={[loginWrapper, {position: 'relative', height: '100%', width: 380, alignSelf: "center"}]}>

            <Texto style={title}>Registre um Amparado aqui!</Texto>

            <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                  <Input 
                    label="Email" 
                    value={value} 
                    onChangeText={onChange} 
                    placeholder="Email" 
                    error={errors.email?.message} 
                  />
                )}
              />

              <Controller
                control={control}
                name="username"
                render={({ field: { value, onChange } }) => (
                  <Input label="Username" 
                    value={value} 
                    onChangeText={onChange} 
                    placeholder="Username" 
                    error={errors.username?.message} 
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                  <Input label="Senha" 
                    value={value} 
                    onChangeText={onChange} 
                    placeholder="Senha" 
                    isPassword
                    error={errors.password?.message} 
                  />
                )}
              />
            <View style={[buttonWrapper]}>
              <ButtonCore
                style={{backgroundColor: colors.primaryLight}}
                onPress={handleSubmit(onSubmit)}
                disabled={isAmparadoRequesting}
              >
                {!isAmparadoRequesting ? "Registrar Amparado" : <SpinningIcon text={false} color="white" size={20} />}
              </ButtonCore>
            </View>
          </View>
        ),
      },
    ]}
  />

    <FloatButton
      disabled={isAmparadoRequesting ? true : false}
      onPress={() => navigation.goBack()}
      title={'Voltar'}
      type='submit'
      position={'bottom'}
    />
  </>
  )
}

export default Amparado;