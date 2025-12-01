import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import api from '../../../conexao/api';

function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
  function toRad(v: any) {
    return (v * Math.PI) / 180;
  }

  const R = 6371e3;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const { LocationModule } = NativeModules;

const TrackingService = {
  watchId: null as any,
  lastPosition: null as any,

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
    this.watchId = Geolocation.watchPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;

        if (!this.lastPosition) {
          this.lastPosition = { latitude, longitude };
        }

        const distancia = calcularDistancia(
          this.lastPosition.latitude,
          this.lastPosition.longitude,
          latitude,
          longitude
        );

        console.log("[TrackingService] Distância desde última posição:", distancia);

        if (distancia >= 10) {
          console.log("[TrackingService] Movimento detectado → ENVIANDO");

          await api.post("localizacao/", pos.coords);
          await api.post("geofencing/", { latitude, longitude });

          this.lastPosition = { latitude, longitude };
        } else {
          console.log("[TrackingService] Movimento insuficiente → ignorado");
        }
      },
      err => console.log("[WatchPosition-JS] erro:", err),
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 3000,
      }
    );

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
