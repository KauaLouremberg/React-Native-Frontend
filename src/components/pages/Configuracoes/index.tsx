/* eslint-disable react-native/no-inline-styles */
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import { useConfigRequestMutation } from '../../../core/http/react-query/configuracao';
import { perfilRequest } from '../../../core/http/requests/configuracao';
import { ConfigValidationDto } from '../../../core/models/dto/config-validation-dto';
import { configValidationSchema } from '../../../core/models/validation-schemas/config-validation-schema';
import { ButtonCore } from '../../buttons/button-core';
import FloatButton from '../../buttons/float-button';
import DateTimePickerComponent from '../../ElementosForm/DateTimePicker';
import { ToastNotify } from '../../ElementosForm/Toast';
import { HeaderNavigation } from '../../headerNavigation/header-navigation';
import { Input } from '../../input/input';
import { Texto } from '../../texto';

const Configuracoes = ({ navigation }: any) => {
  const usuario = useSelector((state: any) => state.user);
  const [value, setValue] = useState(null);
  const [activeTab, setActiveTab] = useState<'perfil' | 'endereco'>('perfil');
  const [open, setOpen] = useState(false);

  const [itens, setItens] = useState<string | any>([
    {label: 'Masculino', value: 'M'},
    {label: 'Feminino', value: 'F'}]  
  );

  const { isLoading, isFetching, data, isSuccess, isError } = useQuery({
    queryKey: ['config', usuario.id],
    enabled: !!usuario.id,
    queryFn: () => perfilRequest(),
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
        tipo_conta: usuario && usuario.is_amparado ? "U" : "A",
        sexo: '',
        data_nascimento: new Date() as any,
      },
    });

  useEffect(() => {
    if (data) {
      reset({
        cpf: data.cpf,
        tipo_conta: usuario && usuario.is_amparado ? "U" : "A",
        sexo: data.sexo,
        data_nascimento: new Date(data.data_nascimento) as any
      })
    }
  }, [reset, data])

  const { configRequestAsync, isConfigRequesting } = useConfigRequestMutation({
      onSuccess: () => {
        ToastNotify({
          type: 'success',
          title: 'Sucesso!',
          message: 'Suas informacoes foram enviadas com sucesso!',
        });
      },
    });
  
    async function onSubmit(data: ConfigValidationDto) {
      try {
        console.log('bateu aqui')
        await configRequestAsync({ data });
      } catch {
        ToastNotify({
          type: 'error',
          title: 'Erro!',
          message: 'Ocorreu um erro ao enviar os dados!',
          time: 2500,
        });
        console.log('bateu aqui')
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

              <Texto>{JSON.stringify(errors)}</Texto>

                
                {/* Componente pra esse infame tbm */}

                <ButtonCore
                  onPress={() => navigation.navigate('Amparado-Register')}
                >
                  Adicionar Amparado
                </ButtonCore>
              </View>
            ),
          },
          {
            key: 'endereco',
            title: 'Endereco',
            render: () => (
              <View>
                <Texto>teste</Texto>
              </View>
            ),
          },
        ]}
      />

      {activeTab === 'perfil' && (
        <FloatButton
          onPress={handleSubmit(onSubmit)}
          title="Enviar"
          type='submit'
          position={'bottom'}
          style={{ width: 100, left: 150 }}
        />
      )}
    </>
  );
};

export default Configuracoes;
