import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/userSlice";
import { ButtonCore } from "../../buttons/button-core";
import api from "../../conexao/api";
import { Texto } from "../../texto";
import MapScreen from "./MapScreen";

export default function Dashboard() {
  const dispatch = useDispatch();
  const [userPerfil, setUserPerfil] = useState<any>();

  useEffect(() => {
    api.get("user/").then((res: any) => {
      setUserPerfil({
        id: res.data.id,
        nome: res.data.nome,
        perfil: res.data.perfil
      })
      dispatch(setUser(userPerfil));
    }
    )
    .catch((err) =>

      console.log(err))
    
  }, [])

  return <>
    <Texto>Bem vindo a minha pequena bagunca</Texto>
    <ButtonCore>
      Botao teste
    </ButtonCore>
    <MapScreen/>
  </>;
}
