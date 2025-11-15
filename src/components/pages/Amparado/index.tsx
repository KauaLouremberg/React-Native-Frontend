import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useAmparadoRequestingMutation } from "../../../core/http/react-query/amparado";
import { AmparadoValidationDto } from "../../../core/models/dto/amparado-validation-dto";
import { registerValidationSchema } from "../../../core/models/validation-schemas/register-validation-schema";
import { ButtonCore } from "../../buttons/button-core";
import { ToastNotify } from "../../ElementosForm/Toast";
import { Input } from "../../input/input";
import { Texto } from "../../texto";

const Amparado = () => {

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

    const { amparadoRequestAsync , isAmparadoRequesting } = useAmparadoRequestingMutation({
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
    <Texto style={{ fontSize: 25, marginTop: 20, textAlign: "center", marginRight: 25 }}>
      Amparado
    </Texto>

      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange } }) => (
          <Input label="" 
            value={value} 
            onChangeText={onChange} 
            placeholder="Email" 
            style={{width: "75%", marginLeft: 45, marginTop: 35}}
            error={errors.email?.message} 
          />
        )}
      />

      <Controller
        control={control}
        name="username"
        render={({ field: { value, onChange } }) => (
          <Input label="" 
            value={value} 
            onChangeText={onChange} 
            placeholder="Username" 
            style={{width: "75%", marginLeft: 45, marginTop: 35}}
            error={errors.username?.message} 
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange } }) => (
          <Input label="" 
            value={value} 
            onChangeText={onChange} 
            placeholder="Senha" 
            style={{width: "75%", marginLeft: 45, marginTop: 35}}
            error={errors.password?.message} 
          />
        )}
      />
    <ButtonCore onPress={handleSubmit(onSubmit)} style={{width: 300, marginLeft: 55, marginTop: 100}}>Create</ButtonCore>
  </>
  )
}

export default Amparado;