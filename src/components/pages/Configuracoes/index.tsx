/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import { ButtonCore } from '../../buttons/button-core';
import FloatButton from '../../buttons/float-button';
import api from '../../conexao/api';
import DateTimePickerComponent from '../../ElementosForm/DateTimePicker';
import { ToastNotify } from '../../ElementosForm/Toast';
import { HeaderNavigation } from '../../headerNavigation/header-navigation';
import { Input } from '../../input/input';
import { Texto } from '../../texto';

const Configuracoes = ({ navigation }: any) => {
  const usuario = useSelector((state: any) => state.user.id);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [activeTab, setActiveTab] = useState<'perfil' | 'endereco'>('perfil');
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [form, setForm] = useState({
    cpf: '',
    usuario: usuario,
    sexo: '',
    tipo_conta: '',
  });

  const [tipoConta, setTipoConta] = useState([
    { label: 'Responsavel', value: 'A' },
    { label: 'Usuario', value: 'U' },
  ]);

  useEffect(() => {
    async function LoadData() {
      try {
        const response = await api.get('perfil/');
        const data = response.data;

        console.log(data);

        setForm({
          cpf: data.cpf,
          usuario: data.usuario,
          sexo: data.sexo,
          tipo_conta: data.tipo_conta,
        });
        setValue(data.tipo_conta);
        setDataNascimento(
          data.data_nascimento ? new Date(data.data_nascimento) : null,
        );
      } catch {
        ToastNotify({
          type: 'error',
          title: 'Erro!',
          message: 'Ocorreu um erro ao tentar carregar suas informacoes!',
        });
      }
    }

    LoadData();
  }, []);

  const handleChange = (field: string, val: any) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const onFinishPerfil = async () => {
    let payload = {
      params: {
        cpf: form.cpf,
        usuario: usuario,
        sexo: form.sexo,
        tipo_conta: value,
        data_nascimento: dataNascimento,
      },
    };

    try {
      const response = await api.post('perfil/', {
        payload,
      });

      if (response) {
        ToastNotify({
          type: 'success',
          title: 'Sucesso!',
          message: 'Suas informacoes foram enviadas com sucesso!',
        });
      }
    } catch {
      ToastNotify({
        type: 'error',
        title: 'Erro!',
        message: 'Ocorreu um erro ao enviar os dados!',
      });
    }
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
              <View style={{ width: 250, top: 50, left: 20 }}>
                <Texto style={{ left: 0, top: -20, fontSize: 32, height: 50 }}>
                  PERFIL
                </Texto>

                {/* Usei esses inputs, mas tem que criar outro pra uso como esses tbm, sem ser o de login */}

                <Input
                  label="CPF"
                  value={form.cpf}
                  onChangeText={e => handleChange('cpf', e)}
                  style={{ height: 40, borderRadius: 5 }}
                />

                <DateTimePickerComponent
                  label="Data de nascimento"
                  value={dataNascimento}
                  onChange={setDataNascimento}
                />

                {/* Alterar para dropdownPicker */}
                <Input
                  label="Sexo"
                  value={form.sexo}
                  onChangeText={e => handleChange('sexo', e)}
                  style={{ height: 40, borderRadius: 5 }}
                />

                {/* Componente pra esse infame tbm */}
                <Texto>Tipo de Conta</Texto>
                <DropDownPicker
                  open={open}
                  value={value}
                  items={tipoConta}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setTipoConta}
                  placeholder="Selecione o Tipo de Conta"
                  style={{
                    borderColor: '#ccc',
                    borderWidth: 1,
                    borderRadius: 8,
                    top: 5,
                  }}
                />

                <ButtonCore
                  onPress={() => {
                    AsyncStorage.removeItem('accessToken');
                    navigation.navigate('Login');
                  }}
                >
                  ir pra tela de login, teste
                </ButtonCore>
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
          onPress={() => onFinishPerfil()}
          title="Enviar"
          position={'bottom'}
          style={{ width: 100, left: 150 }}
        />
      )}
    </>
  );
};

export default Configuracoes;
