import { StyleSheet, View } from "react-native";
import { colors } from "../../core/constants/colors";
import { loginStyle } from "../../styles/login/login-style";
import MenuBar from "../ElementosForm/MenuBar";
import { Texto } from "../texto";

const Header = () => {
  const {text} = loginStyle;

  return (
    <View style={{backgroundColor: colors.primaryDark, width: "100%", height: 45,}}>
      <Texto style={[text, styles_rest.rest]}>
        AMPARO
      </Texto>
      <MenuBar style={{bottom: 25}} />
    </View>
  )
}

export const styles_rest = StyleSheet.create({
  rest: {
    textAlign: "center",
    fontSize: 20
  }
})

export default Header;