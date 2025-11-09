import { Platform } from 'react-native';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';

export async function requestLocationPermission() {
  try {
    if (Platform.OS === 'android') {
      const res = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      return res === RESULTS.GRANTED;
    } else {
      const res = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      return res === RESULTS.GRANTED || res === RESULTS.LIMITED;
    }
  } catch (e) {
    console.warn(e);
    return false;
  }
}
