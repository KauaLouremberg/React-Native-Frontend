import { Fragment, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { colors } from "../../../core/constants/colors";
import { inputStyle } from "../../../styles/input/input";
import { Texto } from "../../texto";

const Select = ({
  options, 
  label, 
  value, 
  onChange,
  error, 
  variant, 
  size,
  style, 
  ...rest}: any) => {

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(null);

  const {
      container,
      label: Label,
      textContainer,
      errorMessage,
    } = inputStyle;

  const selectedOption = options.find((opt: any) => opt.value === value);

  return (
    <Fragment>
        <View style={container}>
          <View style={textContainer}>
            
          <Texto>{label}</Texto>

          <TouchableOpacity
            onPress={() => setIsOpen(!isOpen)} 
            style={{
              backgroundColor: colors.primaryLight,
              height: size ? size : 35
            }}
          >
            <Texto 
              style={{
                textAlign: 'center', 
                top: 5, 
                color: colors.white, 
                fontWeight: 'bold'
              }}>
              {selectedOption ? selectedOption.label : "Selecione um Item"}
            </Texto>
            
          </TouchableOpacity>

          {isOpen ? (<>
          {options.map((item: any, i: any) => ( 
            <TouchableOpacity
              key={i}
              style={style}
              onPress={() => {
                  onChange(item.value);
                  setIsOpen(!isOpen)
              }}
              >
              <Texto 
                style={{
                  left: 10,
                  top: 5
                }}
              >
              {item.value} - {item.label}
              </Texto>
            </TouchableOpacity>        
            ))}</>) : null}
            
            {error && <Texto style={errorMessage}>{error}</Texto>}
          </View>
        </View>
    </Fragment>
  )
}

export default Select