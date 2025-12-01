import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { View } from "react-native";
import { colors } from "../../core/constants/colors";
import { registerDevice } from "../../notifications/fcm";
import store from "../../store";
import { setUser } from "../../store/userSlice";
import { setUserType } from "../../store/userTypeSlice";
import api from "../conexao/api";
import SpinningIcon from "../ElementosForm/SpinningIcon";
import TrackingService from "../pages/Dashboard/MapScreen/trackingService";

export function Requisitions({ navigation }: any) {
  useEffect(() => {
    async function load() {
      try {
        const token = await AsyncStorage.getItem("accessToken");

        if (!token) {
          navigation.replace("Login");
          return;
        }

        const responseUser = await api.get("user/");
        const has_perfil = responseUser.data.has_perfil ?? false;
        const userData = has_perfil ? responseUser.data.data : responseUser.data;

        store.dispatch(
          setUser({
            id: userData.id,
            nome: userData.nome,
            token,
            is_amparado: userData.is_amparado,
            has_perfil,
          })
        );

        if (has_perfil) {
          try {
            const responseInfo = await api.get("information/");
            const infoData = responseInfo.data;

            store.dispatch(
              setUserType({
                responsavel_id: infoData.responsavel_id,
                responsavel_name: infoData.responsavel_name,
                amparado_id: infoData.amparado_id,
                amparado_name: infoData.amparado_name,
              })
            );
          } catch {
            console.warn("Information Error!");
          }
        }

        await registerDevice();

        if (userData.is_amparado) {
          await TrackingService.start();
        }

        navigation.replace("MainTabs", { animationEnabled: false });
      } catch (error) {
        console.error("Erro ao validar token:", error);
        await AsyncStorage.removeItem("accessToken");
        navigation.replace("Login");
      }
    }

    load();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
      <SpinningIcon color={colors.primary} size={40} />
    </View>
  );
}
