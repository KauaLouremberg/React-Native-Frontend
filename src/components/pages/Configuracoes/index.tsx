/* eslint-disable react-native/no-inline-styles */
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import { colors } from '../../../core/constants/colors';
import { useConfigRequestMutation } from '../../../core/http/react-query/configuracao';
import { useEnderecoRequestMutation } from '../../../core/http/react-query/endereco';
import { enderecoRequest, perfilRequest } from '../../../core/http/requests/configuracao';
import { ConfigValidationDto } from '../../../core/models/dto/config-validation-dto';
import { EnderecoValidationDto } from '../../../core/models/dto/endereco-validation-dto';
import { configValidationSchema } from '../../../core/models/validation-schemas/config-validation-schema';
import { enderecoValidationSchema } from '../../../core/models/validation-schemas/endereco-validation-schema';
import { ButtonCore } from '../../buttons/button-core';
import FloatButton from '../../buttons/float-button';
import DateTimePickerComponent from '../../ElementosForm/DateTimePicker';
import SpinningIcon from '../../ElementosForm/SpinningIcon';
import { ToastNotify } from '../../ElementosForm/Toast';
import { HeaderNavigation } from '../../headerNavigation/header-navigation';
import { Input } from '../../input/input';

const Configuracoes = ({ navigation }: any) => {
  const usuario = useSelector((state: any) => state.user);
  const [value, setValue] = useState(null);
  const [activeTab, setActiveTab] = useState<'perfil' | 'endereco'>('perfil');
  const [open, setOpen] = useState(false);
  const QueryClient = useQueryClient();

  const [itens, setItens] = useState<string | any>([
    {label: 'Masculino', value: 'M'},
    {label: 'Feminino', value: 'F'}]  
  );

  const { isLoading, isFetching, data } = useQuery({
    queryKey: ['config', usuario.id],
    enabled: !!usuario.id,
    queryFn: () => perfilRequest(),
    gcTime: 5 * 60 * 1000,
    staleTime: Infinity
  })

  const { isLoading: enderecoIsLoading, isFetching: enderecoIsFetching, data: enderecoData } = useQuery({
    queryKey: ['endereco', usuario.id],
    enabled: !!usuario.id,
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
        cpf: data.cpf,
        apelido: data.apelido,
        tipo_conta: usuario && usuario.is_amparado ? "U" : "A",
        sexo: data.sexo,
        data_nascimento: new Date(data.data_nascimento)
      })
    }
  }, [data])

  useEffect(() => {
    if (enderecoData) {
      console.log('enderecoData', enderecoData)
      enderecoReset({
        estado: enderecoData.estado,
        cidade: enderecoData.cidade,
        cep: enderecoData.cep,
        bairro: enderecoData.bairro,
        rua: enderecoData.rua,
        numero: enderecoData.numero,
      });
    }
  }, [enderecoData])

  const { configRequestAsync } = useConfigRequestMutation({
      onSuccess: () => {
        ToastNotify({
          type: 'success',
          title: 'Sucesso!',
          message: 'Suas informacoes foram salvas com sucesso!',
        });
        navigation.replace('MainTabs')
        QueryClient.invalidateQueries({ queryKey: ['config'] })
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

  const { EnderecoRequestAsync } = useEnderecoRequestMutation({
    onSuccess: () => {
      ToastNotify({
        type: 'success',
        title: 'Sucesso!',
        message: 'Suas informacoes de Endereco foram salvas com sucesso!',
      });
      navigation.replace('MainTabs')
      QueryClient.invalidateQueries({ queryKey: ['endereco'] })
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
              isLoading || isFetching ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", top: 325 }}>
                <SpinningIcon color={colors.primary} size={40}/>
              </View>
              ) : 
              (
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
                      value={value as any}
                      onChange={onChange}
                    />
                  )}
                />

                <Controller
                control={control}
                name='sexo'
                render={({ field: { value, onChange} }) => (
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={itens}
                    setOpen={setOpen}
                    setValue={setValue}
                    onChangeValue={onChange}
                    setItems={setItens}
                    placeholder="Selecione o Sexo"
                    style={{
                      borderColor: '#ccc',
                      borderWidth: 1,
                      borderRadius: 8,
                      top: 5,
                    }}
                  />
                )}
              />
                {/* Componente pra esse infame tbm */}

                <ButtonCore
                  onPress={() => navigation.navigate('Amparado-Register')}
                >
                  Adicionar Amparado
                </ButtonCore>
              </View>
              ) 
              
            ),
          },
          {
            key: 'endereco',
            title: 'Endereco',
            render: () => (
              enderecoIsLoading || enderecoIsFetching ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", top: 325 }}>
                <SpinningIcon color={colors.primary} size={40}/>
              </View>
              ) : 
              (
                <View style={{ paddingHorizontal: 24, height: '100%' }}>
                <Controller
                  control={enderecoControl}
                  name='estado'
                  render={({ field: { value, onChange } }) => (
                    <Input
                      label="Estado"
                      variant="form"
                      maxLength={255}
                      value={value}
                      onChangeText={onChange}
                      error={enderecoErrors.estado?.message}
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
                {/* Componente pra esse infame tbm */}
                

                <ButtonCore
                  onPress={() => navigation.navigate('Amparado-Register')}
                >
                  Adicionar Amparado
                </ButtonCore>
              </View>
              ) 
              
            ),
          },
        ]}
      />

      {activeTab && (
        <FloatButton
          onPress={activeTab !== 'endereco' ? handleSubmit(onSubmit) : enderecoHandleSubmit(onSubmitEndereco)}
          title="Salvar"
          type='submit'
          position={'bottom'}
          style={{ width: 100, left: 150 }}
        />
      )}
    </>
  );
};

export default Configuracoes;
