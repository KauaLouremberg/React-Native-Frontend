import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import api from '../../../conexao/api';

const { LocationModule } = NativeModules;

const TrackingService = {
  watchId: null as any,

  async startNative() {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        console.log('[TrackingService] Sem token para iniciar native service');
        return;
      }

      console.log(
        '[TrackingService] startNative → iniciando FOREGROUND SERVICE',
      );

      LocationModule.startService(token, 10000, 10);
    } catch (e) {
      console.log('Erro ao iniciar serviço nativo:', e);
    }
  },

  async stopNative() {
    try {
      console.log('[TrackingService] stopNative → parando FOREGROUND SERVICE');
      LocationModule.stopService();
    } catch (e) {
      console.log('Erro ao parar serviço nativo:', e);
    }
  },

  async start() {
    console.log('[TrackingService] Iniciando rastreamento JS (foreground)');
    console.log('[TrackingService] watchPosition iniciado, ID:', this.watchId);

    const granted = await this.requestPermissions();
    if (!granted) {
      console.log('[TrackingService] Permissões negadas');
      return;
    }

    this.startWatchPosition();
  },

  async requestPermissions() {
    try {
      if (Platform.OS === 'android') {
        const fine = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (fine !== PermissionsAndroid.RESULTS.GRANTED) return false;

        const bg = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );
        return bg === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (e) {
      console.log('[TrackingService] Erro permissão:', e);
      return false;
    }
  },

  startWatchPosition() {
    if (this.watchId) {
      Geolocation.clearWatch(this.watchId);
    }

    this.watchId = Geolocation.watchPosition(
      async pos => {
        console.log('[TrackingService] (JS) posição:', pos.coords);
        const { latitude, longitude } = pos.coords;

        await api.post('localizacao/', pos.coords);

        await api.post('geofencing/', {
          latitude,
          longitude,
        });
      },
      err => console.log('[WatchPosition-JS] erro:', err),
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 5000,
        fastestInterval: 3000,
      },
    );

    console.log('[TrackingService] watchPosition (JS) iniciado');
  },

  stop() {
    console.log('[TrackingService] Parando tudo');

    if (this.watchId) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    this.stopNative();
  },
};

export default TrackingService;
