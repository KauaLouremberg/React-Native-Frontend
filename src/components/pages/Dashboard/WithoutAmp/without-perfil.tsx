import { useNavigation } from "@react-navigation/native";
import { Flag } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { colors } from "../../../../core/constants/colors";
import { POPPINS } from "../../../../core/constants/poppins";
import { Texto } from "../../../texto";


export function WithoutPerfil() {
  const navigation = useNavigation<any>();
  
  return (
  <>
  <View style={style.section}>
      <View style={style.container}>
        <Flag
          size={36}
          fill={colors.primaryLight}
          stroke={colors.primaryLight}
        />
        <Texto style={style.withoutAmp}>
          Você não tem um Perfil cadastrado. Para cadastrar um perfil{' '}
          <Texto
            onPress={() => navigation.navigate('Configuracoes')}
            style={style.touch}
          >
            Toque aqui
          </Texto>
        </Texto>
      </View>
    </View>
  </>)
}

const style = StyleSheet.create({
  section: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  withoutAmp: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: POPPINS.regular,
    color: colors.secondaryForeground,
  },
  touch: {
    color: colors.primary,
    fontFamily: POPPINS.medium,
  },
});