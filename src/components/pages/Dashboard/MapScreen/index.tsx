import { MapPin, Minimize } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Alert, Button, StyleSheet, TouchableOpacity, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';
import { ButtonCore } from '../../../buttons/button-core';
import api from '../../../conexao/api';
import { ToastNotify } from '../../../ElementosForm/Toast';
import { requestLocationPermission } from '../../../PermissionComponent';

export default function MapScreen({ navigation }: any) {
  const [region, setRegion] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const mapRef = useRef<any>(null);

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
        <ButtonCore onPress={handleShowMap} style={{height: 100, width: 100, top: 200}}>
          <MapPin />
        </ButtonCore>
      ) : (
        <>
          {region && (
            <MapView
              ref={mapRef}
              style={isFullScreen ? styles.mapFull : styles.mapSmall}
              initialRegion={region}
              onPress={handleMapPress}
              showsUserLocation={true}
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
            </MapView>
          )}

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
