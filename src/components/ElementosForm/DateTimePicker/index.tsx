import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Button, Platform, Text, View } from 'react-native';

interface DateTimePickerComponentProps {
  value?: Date | null;
  onChange: (date: Date) => void; 
  label?: string;
}

const DateTimePickerComponent = ({ value, onChange, label }: DateTimePickerComponentProps) => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState<Date>(value || new Date());

  const handleChange = (_event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios')
    setDate(currentDate);
    onChange(currentDate);
  };

  useEffect(() => {
    if (value) setDate(value);
  }, [value]);

  return (
    <View style={{ marginVertical: 10 }}>
      {label && <Text style={{ marginBottom: 6 }}>{label}</Text>}

      <Button title="Selecionar data" onPress={() => setShow(true)} />

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}

      <Text style={{ marginTop: 6 }}>
        {date ? date.toLocaleDateString('pt-BR') : 'Nenhuma data selecionada'}
      </Text>
    </View>
  );
};

export default DateTimePickerComponent;
