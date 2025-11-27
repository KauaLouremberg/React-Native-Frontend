import { MapPin, Minimize } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, StyleSheet, TouchableOpacity, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { ButtonCore } from '../../../buttons/button-core';
import api from '../../../conexao/api';
import { ToastNotify } from '../../../ElementosForm/Toast';
import { requestLocationPermission } from '../../../PermissionComponent';

export default function MapScreen() {
  const [coordenadas, setCoordenadas] = useState<any>(null);
  const [region, setRegion] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const mapRef = useRef<any>(null);
  const userType = useSelector((state: any) => state.userType);
  const user = useSelector((state: any) => state.user);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userType.responsavel_id || user.is_amparado !== false) return;

    const socketUrl = `ws://react-native-backend-sfc1.onrender.com/ws/localizacao/${userType.responsavel_id}/`;

    console.log("Conectando ao WS:", socketUrl);

    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      console.log("WS conectado!");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "recebe_localizacao") {
          const position = ({
            latitude: data.latitude,
            longitude: data.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          });

          setCoordenadas(position)

          console.log(position), 'coordenadas'

          if (mapRef.current && !user.is_amparado) {
            mapRef.current.animateToRegion(position, 500);
          }
        }
      } catch (e) {
        console.log("Erro ao parsear mensagem:", e);
      }
    };

    ws.current.onerror = (err) => {
      console.log("WebSocket erro:", err);
    };

    ws.current.onclose = () => {
      console.log("WS desconectado, tentando reconectar em 3s...");
      setTimeout(() => {
        if (ws.current?.readyState !== WebSocket.OPEN)
          ws.current = new WebSocket(socketUrl);
      }, 3000);
    };

    return () => {
      console.log("Fechando WS...");
      ws.current?.close();
    };
  }, [userType.responsavel_id]);

  const initLocation = async () => {
    const ok = await requestLocationPermission();
    if (!ok) return Alert.alert('Permissão negada', 'Ative localização nas configurações.');

    Geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        const initial = { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
        setRegion(initial);
        mapRef.current?.animateToRegion(initial, 500);
      },
      err => Alert.alert('Erro GPS', err.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleShowMap = async () => {
    if (!showMap) await initLocation();
    setShowMap(true);
  };

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
  };

  const handleDragEnd = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
  };

  const sendMarkerToBackend = async () => {
    if (!marker) return Alert.alert('Nenhum marcador', 'Toque no mapa para marcar um local primeiro.');
    try {
      const res = await api.post('teste-api/', {
        latitude: marker.latitude,
        longitude: marker.longitude,
        label: 'Local marcado',
      });
      if (!res) throw new Error('Erro ao enviar');
      ToastNotify({
        type: 'success',
        title: 'Sucesso!',
        message: 'Localização salva com sucesso!',
      });
    } catch (err) {
      console.warn(err);
      ToastNotify({
        type: 'error',
        title: 'Erro!',
        message: 'Ocorreu um erro ao salvar localização!',
      });
    }
  };

  return (
    <View style={styles.container}>
      {!showMap ? (
        <ButtonCore 
          onPress={handleShowMap} 
          style={
            {
              height: 100,
              width: 100, 
              top: 200
            }}
            >
          <MapPin />
        </ButtonCore>
      ) : (
        <>

          {region || coordenadas ? (
            <MapView
              provider={PROVIDER_GOOGLE}
              ref={mapRef}
              initialRegion={region}
              onPress={handleMapPress}
              onRegionChange={() => {}}
              style={isFullScreen ? styles.mapFull : styles.mapSmall}
              showsUserLocation={user.is_amparado ? true : false}
              showsMyLocationButton={false}
            >
              {marker && (
                <Marker
                  coordinate={marker}
                  draggable
                  onDragEnd={handleDragEnd}
                  title="Marcador"
                  description="Arraste para ajustar"
                />
              )}

              {!user.is_amparado && coordenadas && (
                <Marker
                  coordinate={{
                    latitude: coordenadas.latitude,
                    longitude: coordenadas.longitude
                  }}
                  title="Amparado"
                  description="Última localização"
                />
              )}
            </MapView>
          ) : ''}

          {isFullScreen ? (
            <TouchableOpacity
              style={styles.exitFullScreenButton}
              onPress={() => setIsFullScreen(false)}
            >
              <Minimize style={{right: 3}} />
            </TouchableOpacity>
          ) : (
            <View style={styles.controls}>
              <Button title="Tela cheia" onPress={() => setIsFullScreen(true)} />
              <Button title="Centralizar" onPress={() => mapRef.current?.animateToRegion(region, 500)} />
              <Button title="Salvar local" onPress={sendMarkerToBackend} />
              <Button title="Fechar Mapa" onPress={() => setShowMap(false)}/>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapSmall: {
    height: 250,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapFull: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exitFullScreenButton: {
    position: 'absolute',
    top: 730,
    left: 15,
    zIndex: 999,
    height: 40,
    width: 50,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});
