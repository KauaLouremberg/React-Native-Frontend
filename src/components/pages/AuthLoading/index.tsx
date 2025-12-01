import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function AuthLoading({ navigation }: any) {
  
  useEffect(() => {
    async function checkAuth() {
      const token = await AsyncStorage.getItem('accessToken');

      if (token) {
        navigation.replace("Requisitions", { animationEnabled: false });
      } else {
        navigation.replace("Login", { animationEnabled: false });

      }
    }

    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      
    </View>
  );
}
