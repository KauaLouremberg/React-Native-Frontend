import { LocateFixed, MapPin, MapPinPlus, MapPinPlusInside, MapPinX } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { colors } from '../../../../core/constants/colors';
import { enviarNotificacao } from '../../../../notifications/send_notification';
import { ButtonCore } from '../../../buttons/button-core';
import api from '../../../conexao/api';
import { ToastNotify } from '../../../ElementosForm/Toast';
import { requestLocationPermission } from '../../../PermissionComponent';
import { Texto } from '../../../texto';

export default function MapScreen() {
  const [coordenadas, setCoordenadas] = useState<any>(null);
  const [region, setRegion] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const mapRef = useRef<any>(null);
  const userType = useSelector((state: any) => state.userType);
  const user = useSelector((state: any) => state.user);

  const [areas, setAreas] = useState<any[]>([]);
  const [drawingArea, setDrawingArea] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<any>(null);
  const [radius, setRadius] = useState(10);
  const [firstTime, setFirstTime] = useState(false);

  const ws = useRef<WebSocket | null>(null);

  const sendNotification = (id: any) => {
    try {
      if (!user.is_amparado) {
        ToastNotify({
          type: 'error',
          title: 'Erro!',
          message: 'Você é um responsável, não é permitido enviar notificações!',
        });
        return;
      }

      enviarNotificacao(id);
    } catch (err) {
      ToastNotify({
        type: 'error',
        title: 'Erro!',
        message: 'Ocorreu um erro ao enviar Notificação!',
      });
    } finally {
      if (user.is_amparado) {
        ToastNotify({
          type: 'success',
          title: 'Sucesso!',
          message: 'A notificação foi enviada com sucesso!',
        });
      }
    }
  }

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

          console.log(position)

          if (mapRef.current && !user.is_amparado && !firstTime) {
            mapRef.current.animateToRegion(position, 500);  
            setFirstTime(true);
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
  }, [userType.responsavel_id, firstTime]);

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

  if (drawingArea) {
    setSelectedCenter({ latitude, longitude } as any);
    return;
  }

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
  
  const saveArea = async () => {
    if (!selectedCenter) return;

    try {
      const res = await api.post("areas/", {
        center_lat: selectedCenter.latitude,
        center_lng: selectedCenter.longitude,
        radius
      });

      setAreas(prev => [...prev, {
        center: selectedCenter,
        radius
      }]);

      ToastNotify({
        type: "success",
        title: "Área salva!",
        message: "Área geográfica registrada com sucesso."
      });

    } catch (error) {
      ToastNotify({
        type: "error",
        title: "Erro",
        message: "Não foi possível salvar a área."
      });
    }

    setDrawingArea(false);
    setSelectedCenter(null);
  };

  useEffect(() => {
    async function loadAreas() {
      const res = await api.get("areas/");
      setAreas(res.data.map((a: any) => ({
        center: { latitude: a.latitude, longitude: a.longitude },
        radius: a.raio,
        nome: a.nome
      })));
    }

    loadAreas();
  }, []);

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

              {areas.map((area, index) => (
                <Circle
                  key={index}
                  center={area.center}
                  radius={area.radius}
                  style={{zIndex: 999}}
                  strokeColor="rgba(0, 122, 255, 0.8)"
                  fillColor="rgba(0, 122, 255, 0.2)"
                  strokeWidth={2}
                />
              ))}

              {selectedCenter && (
                <Circle
                  center={selectedCenter}
                  radius={radius}
                  style={{zIndex: 999}}
                  strokeColor="rgba(0,0,255,0.7)"
                  fillColor="rgba(0,0,255,0.3)"
                  strokeWidth={2}
                />
              )}

              {!user.is_amparado && coordenadas && (
                <Marker
                  title={user.nome}
                  coordinate={coordenadas}
                  anchor={{ x: 0.5, y: 0.5 }}
                >
                  <Image
                    source={require('../../../../../android/app/src/main/assets/icon_clean.png')}
                    style={{ width: 40, height: 40 }}
                  />
                </Marker>
              )}
            </MapView>

          {isFullScreen ? (
            <>
            {!coordenadas && !user.is_amparado && (
              <Texto
                style={{
                  position: "absolute",
                  top: "20%",
                  alignSelf: "center",
                  zIndex: 999,
                  backgroundColor: colors.background,
                  borderWidth: 0.5,
                  padding: 10,
                  borderRadius: 10
                }}
              >
                Nenhuma localização recebida!
              </Texto>
            )}

            {drawingArea && (
              <Texto
                style={{
                  position: "absolute",
                  top: "10%",
                  alignSelf: "center",
                  zIndex: 999,
                  backgroundColor: colors.background,
                  color: colors.primary,
                  borderWidth: 0.5,
                  padding: 10,
                  borderRadius: 10
                }}
              >
                Clique no mapa para selecionar uma Area
              </Texto>
            )}

            <View
              style={{
                position: 'absolute',
                right: 20, 
                bottom: 40,
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
                zIndex: 999
              }}
            >

              <TouchableOpacity onPress={() => setDrawingArea(!drawingArea)}>
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 60,
                  borderWidth: 1,
                  borderColor: colors.white,
                  backgroundColor: colors.primaryLight,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <MapPinPlusInside color={colors.white} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => user.is_amparado ? mapRef.current?.animateToRegion(region, 500) : mapRef.current?.animateToRegion(coordenadas, 500)}>
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 60,
                  borderWidth: 1,
                  borderColor: colors.white,
                  backgroundColor: colors.primaryLight,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <LocateFixed color={colors.white} />
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity onPress={() => setIsFullScreen(false)}>
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 60,
                  borderWidth: 1,
                  borderColor: colors.white,
                  backgroundColor: colors.primaryLight,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Scan color={colors.white} />
                </View>
              </TouchableOpacity> */}

              <TouchableOpacity onPress={() => user.is_amparado ? sendNotification(userType.responsavel_id) : 
                ToastNotify({
                  type: "error",
                  title: "Erro",
                  time: 2500,
                  message: "Você é um responsável, não pode enviar notificação!"
                })}>
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 60,
                  borderWidth: 1,
                  borderColor: colors.white,
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Texto style={{color: 'white', fontWeight: 'bold'}}>SOS</Texto>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{
                    position: "absolute",
                    bottom: 30,
                    left: 20,
                    zIndex: 999,
                  }}
            >
              {drawingArea && selectedCenter && (<>
              <View style={{
                flexDirection: 'row',
                gap: 25
              }}>
                <TouchableOpacity onPress={() => saveArea()}>
                  <View style={{
                    width: 130,
                    height: 40,
                    top: 20,
                    left: 2,
                    borderRadius: 20,
                    backgroundColor: colors.primaryLight,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 5
                  }}>
                    <MapPinPlus style={{}} color={colors.white}  />
                    <Texto style={{color: colors.white, fontWeight: 'bold'}}> 
                      Salvar
                    </Texto>
                  </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                setDrawingArea(false);
                setSelectedCenter(null);  
                }}
              >
                  <View style={{
                    width: 130,
                    height: 40,
                    top: 20,
                    left: 2,
                    borderRadius: 20,
                    backgroundColor: colors.primaryLight,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 5
                  }}>
                    <MapPinX style={{}} color={colors.white}  />
                    <Texto style={{color: 'white', fontWeight: 'bold'}}> 
                      Cancelar
                    </Texto>
                  </View>
              </TouchableOpacity>
              </View>
              </>
              )}
            </View>
          </>) : (
            <View style={styles.controls}>
              {/* <Button title="Tela cheia" onPress={() => setIsFullScreen(true)} /> */}
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
    height: '100%',
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
