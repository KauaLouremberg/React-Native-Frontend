import { useEffect, useState } from "react";
import { View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useDispatch, useSelector } from "react-redux";
import { ButtonCore } from "../../buttons/button-core";
import FloatButton from "../../buttons/float-button";
import api from "../../conexao/api";
import DateTimePickerComponent from "../../ElementosForm/DateTimePicker";
import { ToastNotify } from "../../ElementosForm/Toast";
import { Input } from "../../input/input";
import { Texto } from "../../texto";

const Configuracoes = () => {
  const dispatch = useDispatch();
  const usuario = useSelector((state: any) => state.user.id);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [enderecoView, setEnderecoView] = useState<boolean | any>(false);
  const [perfilView, setPerfilView] = useState<boolean | any>(true);
  const [dataNascimento, setDataNascimento] = useState<Date | null>(null);
  const [form, setForm] = useState({
    cpf: '',
    usuario: usuario,
    sexo: '',
    tipo_conta: ''
  })

  const [tipoConta, setTipoConta] = useState([
    {label: "Responsavel", value: 'A'},
    {label: "Usuario", value: 'U'}
  ]);


  useEffect(() => {
    async function LoadData() {
      try {
        const response = await api.get("perfil/");
        const data = response.data;

        console.log(data)

        setForm({
          cpf: data.cpf,
          usuario: data.usuario,
          sexo: data.sexo,
          tipo_conta: data.tipo_conta
        })
        setValue(data.tipo_conta);
        setDataNascimento(data.data_nascimento ? new Date(data.data_nascimento) : null);
        
      } catch (err) {
        ToastNotify({
          type: 'error',
          title: 'Erro!',
          message: 'Ocorreu um erro ao tentar carregar suas informacoes!'
        })
      }
    }

    LoadData();

  }, [])

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const onFinishPerfil = async() => {

    let payload = {
      params: {
        cpf: form.cpf,
        usuario: usuario,
        sexo: form.sexo,
        tipo_conta: value,
        data_nascimento: dataNascimento,
      }
    }

    try {
      const response = await api.post("perfil/", {
        payload
      })
      
      if (response) {
        ToastNotify({
          type: 'success',
          title: 'Sucesso!',
          message: 'Suas informacoes foram enviadas com sucesso!'
        })
        
      }
    } catch (err) {

      ToastNotify({
        type: 'error',
        title: 'Erro!',
        message: 'Ocorreu um erro ao enviar os dados!'
      })
    }
  }

  return (<>
    <View style={{backgroundColor: 'red', width: "100%", height: 40}}>
      {/* E melhor transformar isso em um componente depois */}
      <View style={{flexDirection: "row"}}>
        <ButtonCore 
          onPress={() => {
            setPerfilView(true);
            setEnderecoView(false);
          }} 
          style={{width: "50%", height: 40, borderRadius: 0 }}
          >
            Perfil
        </ButtonCore>

        <ButtonCore 
          onPress={() => {
            setPerfilView(false);
            setEnderecoView(true);
          }}  
          style={{width: "50%", height: 40, borderRadius: 0 }}
        >
          Endereco
        </ButtonCore>
      </View>
      
    </View>
    <View style={{width: 250, top: 50, left: 20, display: perfilView ? 'flex' : 'none'}}>
      <Texto style={{left: 0, top: -20, fontSize: 32, height: 50}}>PERFIL</Texto>

      {/* Usei esses inputs, mas tem que criar outro pra uso como esses tbm, sem ser o de login */}

      <Input label="CPF" value={form.cpf} onChangeText={(e) => handleChange("cpf", e)} style={{ height: 40, borderRadius: 5 }}  />

      <DateTimePickerComponent
        label="Data de nascimento"
        value={dataNascimento}
        onChange={setDataNascimento}
      />
      
      {/* Alterar para dropdownPicker */}
      <Input label="Sexo" value={form.sexo} onChangeText={(e) => handleChange("sexo", e)} style={{ height: 40, borderRadius: 5 }}  />

      {/* Componente pra esse infame tbm */}
      <Texto>
        Tipo de Conta
      </Texto>
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
          top: 5
        }}
      />
    </View>

    <View style={{display: enderecoView ? 'flex' : 'none'}}>
      <Texto>
        teste
      </Texto>
    </View>

    <FloatButton onPress={() => onFinishPerfil()} title="Enviar" position={'bottom'} style={{width: 100, left: 150}} />
    </>
  )
}

export default Configuracoes;