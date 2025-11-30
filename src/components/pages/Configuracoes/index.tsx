/* eslint-disable react-native/no-inline-styles */
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '../../../core/constants/colors';
import { useConfigRequestMutation } from '../../../core/http/react-query/configuracao';
import { useEnderecoRequestMutation } from '../../../core/http/react-query/endereco';
import { enderecoRequest, perfilRequest } from '../../../core/http/requests/configuracao';
import { ConfigValidationDto } from '../../../core/models/dto/config-validation-dto';
import { EnderecoValidationDto } from '../../../core/models/dto/endereco-validation-dto';
import { configValidationSchema } from '../../../core/models/validation-schemas/config-validation-schema';
import { enderecoValidationSchema } from '../../../core/models/validation-schemas/endereco-validation-schema';
import { setUser } from '../../../store/userSlice';
import FloatButton from '../../buttons/float-button';
import DateTimePickerComponent from '../../ElementosForm/DateTimePicker';
import Select from '../../ElementosForm/Select';
import SpinningIcon from '../../ElementosForm/SpinningIcon';
import { ToastNotify } from '../../ElementosForm/Toast';
import { HeaderNavigation } from '../../headerNavigation/header-navigation';
import { Input } from '../../input/input';

const Configuracoes = () => {
  const usuario = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'perfil' | 'endereco'>('perfil');
  const has_perfil = useSelector((state: any) => state.user.has_perfil)

  console.log(has_perfil)

  const itens = [
    {label: 'Masculino', value: 'M'},
    {label: 'Feminino', value: 'F'}]  

  const { isLoading, isFetching, data } = useQuery({
    queryKey: ['config', usuario.id],
    enabled: !!usuario.id,
    queryFn: () => perfilRequest(),
    gcTime: 5 * 60 * 1000,
    staleTime: Infinity
  })

  const { isLoading: enderecoIsLoading, isFetching: enderecoIsFetching, data: enderecoData } = useQuery({
    queryKey: ['endereco', usuario.id],
    enabled: !!usuario.id && !!usuario.has_perfil,
    queryFn: () => enderecoRequest(),
    gcTime: 5 * 60 * 1000,
    staleTime: Infinity
  })

  const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<ConfigValidationDto>({
      resolver: zodResolver(configValidationSchema),
      defaultValues: {
        cpf: '',
        apelido: '',
        tipo_conta: usuario && usuario.is_amparado ? "U" : "A",
        sexo: '',
        data_nascimento: new Date() as any,
      },
    });
    
  const {
      control: enderecoControl,
      handleSubmit: enderecoHandleSubmit,
      reset: enderecoReset,
      formState: { errors: enderecoErrors },
    } = useForm<EnderecoValidationDto>({
      resolver: zodResolver(enderecoValidationSchema),
      defaultValues: {
        estado: '',
        cidade: '',
        cep: '',
        bairro: '',
        rua: '',
        numero: ''
      },
    });

  useEffect(() => {
    if (data) {
      reset({
        cpf: data.cpf ?? '',
        apelido: data.apelido ?? '',
        tipo_conta: usuario && usuario.is_amparado ? "U" : "A",
        sexo: data.sexo ?? '',
        data_nascimento: new Date(data.data_nascimento)
      })
    }
  }, [data, reset])

  useEffect(() => {
    if (enderecoData) {
      enderecoReset({
      estado: enderecoData.estado ?? '', 
      cidade: enderecoData.cidade ?? '',
      cep: enderecoData.cep ?? '',
      bairro: enderecoData.bairro ?? '',
      rua: enderecoData.rua ?? '',
      numero: enderecoData.numero ?? '',
    });
    }
  }, [enderecoData, enderecoReset])

  const { configRequestAsync, isConfigRequesting } = useConfigRequestMutation({
      onSuccess: () => {
        ToastNotify({
          type: 'success',
          title: 'Sucesso!',
          message: 'Suas informacoes foram salvas com sucesso!',
        });
        if (!usuario.has_perfil) {
          dispatch(setUser({ has_perfil: true }));
        }
      },
    });
  
    async function onSubmit(data: ConfigValidationDto) {
      try {
        await configRequestAsync({ data });
      } catch {
        ToastNotify({
          type: 'error',
          title: 'Erro!',
          message: 'Ocorreu um erro ao enviar os dados!',
          time: 2500,
        });
      }
    }

  const { EnderecoRequestAsync, isEnderecoRequesting } = useEnderecoRequestMutation({
    onSuccess: () => {
      ToastNotify({
        type: 'success',
        title: 'Sucesso!',
        message: 'Suas informacoes de Endereco foram salvas com sucesso!',
      });
    }
  })

  async function onSubmitEndereco(data: EnderecoValidationDto) {
    try {
      await EnderecoRequestAsync({ data });
    } catch {
      ToastNotify({
          type: 'error',
          title: 'Erro!',
          message: 'Ocorreu um erro ao salvar os dados!',
          time: 2500,
        });
    }
  }

  const FormularioPerfilContent = ({ control, errors, isLoading }: any) => {
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", top: 325 }}>
        <SpinningIcon color={colors.primary} size={40}/>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 24, height: '100%' }}>
      <Controller
        control={control}
        name='cpf'
        render={({ field: { value, onChange } }) => (
          <Input
            label="CPF"
            variant="form"
            inputMode={'numeric'}
            placeholder="CPF"
            maxLength={11}
            value={value}
            onChangeText={onChange}
            error={errors.cpf?.message}
      />
        )}
      />

      <Controller
        control={control}
        name='apelido'
        render={({ field: { value, onChange } }) => (
          
          <Input
            label="Apelido"
            variant="form"
            inputMode={'text'}
            placeholder="Apelido"
            maxLength={255}
            value={value}
            onChangeText={onChange}
            error={errors.apelido?.message}
      />
        )}
      />
      
      <Controller
        control={control}
        name='data_nascimento'
        render={({ field: { value, onChange} }) => (
          <DateTimePickerComponent
            label="Data de nascimento"
            value={value ? new Date(value) : new Date()}
            onChange={(date) => onChange(date)}
          />
        )}
      />

      <Controller
        control={control}
        name='sexo'
        render={({ field: { value, onChange} }) => (
          <Select
            label='Sexo'
            size={35}
            style={{
              backgroundColor: colors.background,
              borderRadius: 2,
              borderWidth: 1,
              borderTopWidth: 0,
              borderColor: colors.border,
              height: 35
            }}
            options={itens}
            value={value}
            onChange={onChange}
            error={errors.sexo?.message}
          />
        )}
      />
    </View>
  );
};

  const FormularioEnderecoContent = ({ control, errors, isLoading }: any) => {
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", top: 325 }}>
        <SpinningIcon color={colors.primary} size={40}/>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 24, height: '100%' }}>
      <Controller
        control={control}
        name='estado'
        render={({ field: { value, onChange } }) => (
          <Input
            label="Estado"
            variant="form"
            maxLength={255}
            value={value ?? ''} 
            onChangeText={onChange}
            error={errors.estado?.message}
          />
        )}
      />

      <Controller
        control={enderecoControl}
        name='cidade'
        render={({ field: { value, onChange } }) => (
          <Input
            label="Cidade"
            variant="form"
            maxLength={255}
            value={value}
            onChangeText={onChange}
            error={enderecoErrors.cidade?.message}
      />
        )}
      />
      
      <Controller
        control={enderecoControl}
        name='cep'
        render={({ field: { value, onChange } }) => (
          <Input
            label="Cep"
            variant="form"
            inputMode={'numeric'}
            maxLength={9}
            value={value}
            onChangeText={onChange}
            error={enderecoErrors.cep?.message}
      />
        )}
      />

      <Controller
        control={enderecoControl}
        name='bairro'
        render={({ field: { value, onChange } }) => (
          <Input
            label="Bairro"
            variant="form"
            maxLength={255}
            value={value}
            onChangeText={onChange}
            error={enderecoErrors.bairro?.message}
      />
        )}
      />

      <Controller
        control={enderecoControl}
        name='rua'
        render={({ field: { value, onChange } }) => (
          <Input
            label="Rua"
            variant="form"
            maxLength={255}
            value={value}
            onChangeText={onChange}
            error={enderecoErrors.rua?.message}
      />
        )}
      />

      <Controller
        control={enderecoControl}
        name='numero'
        render={({ field: { value, onChange } }) => (
          <Input
            label="Numero"
            variant="form"
            maxLength={20}
            value={value}
            onChangeText={onChange}
            error={enderecoErrors.numero?.message}
      />
        )}
      />
    </View>
  );
};

  return (
    <>
      <HeaderNavigation
        title="Configurações"
        initialTabKey="perfil"
        onTabChange={key =>
          setActiveTab(key === 'perfil' ? 'perfil' : 'endereco')
        }
        tabs={[
          {
            key: 'perfil',
            title: 'Perfil',
            render: () => (
              <FormularioPerfilContent 
                control={control} 
                errors={errors} 
                isLoading={isLoading || isFetching}
              />
            ),
          },
          {
            key: 'endereco',
            title: 'Endereco',
            disabled: !has_perfil,
            render: () => (
              <FormularioEnderecoContent 
                control={enderecoControl} 
                errors={enderecoErrors} 
                isLoading={enderecoIsLoading || enderecoIsFetching}
              />
            ),
          },
        ]}
      />

      {activeTab && (
          
          <FloatButton
            disabled={isConfigRequesting || isEnderecoRequesting ? true : false}
            onPress={activeTab !== 'endereco' ? handleSubmit(onSubmit) : enderecoHandleSubmit(onSubmitEndereco)}
            title={isConfigRequesting || isEnderecoRequesting ? (<SpinningIcon text={false} color={colors.white} size={20}/>) : "Salvar"}
            type='submit'
            position={'bottom'}
          />
        
      )}
    </>
  );
};

export default Configuracoes;
