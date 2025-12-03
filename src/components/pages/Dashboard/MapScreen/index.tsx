import { useFocusEffect } from '@react-navigation/native';
import { LocateFixed, MapPin, MapPinCheck, MapPinned, MapPinOff, MapPinPen, MapPinPlusInside, MapPinX } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { colors } from '../../../../core/constants/colors';
import { enviarNotificacao } from '../../../../notifications/send_notification';
import { ButtonCore } from '../../../buttons/button-core';
import api from '../../../conexao/api';
import { ToastNotify } from '../../../ElementosForm/Toast';
import { Input } from '../../../input/input';
import { requestLocationPermission } from '../../../PermissionComponent';
import { Texto } from '../../../texto';

export default function MapScreen() {

  const { width } = Dimensions.get('window');
  const [coordenadas, setCoordenadas] = useState<any>(null);
  const [region, setRegion] = useState<any>(null);
  const [showMap, setShowMap] = useState(true);
  const isFullScreen = true;
  const mapRef = useRef<any>(null);
  const userType = useSelector((state: any) => state.userType);
  const user = useSelector((state: any) => state.user);
  const [markers, setMarkers] = useState([]);
  const [blocked, setIsBlocked] = useState(false);

  const [areas, setAreas] = useState<any[]>([]);
  const [drawingArea, setDrawingArea] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<any>(null);
  const [radius, setRadius] = useState(10);
  const [firstTime, setFirstTime] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [valueRadius, setValueRadius] = useState();
  const [nomeValue, setNomeValue] = useState('Area Segura');
  const [nome, setNome] = useState('Area Segura');
  const [isActive, setIsActive] = useState(false);
  const [markerSelected, setMarkerSelected] = useState<string | number | any >(null);
  const [markersBlock, setMarkersBlock] = useState(false);

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

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    if (drawingArea) {
      setSelectedCenter({ latitude, longitude });
      return;
    }

    if (!user.is_amparado) {
      return;
    }

    const newMarker = {
      id: Date.now(),
      latitude,
      longitude
    };

    setMarkers(prev => [...prev, newMarker] as any);
  };
  
  const saveArea = async () => {
    if (!selectedCenter) return;

    if (user.is_amparado) {
      ToastNotify({
        type: "error",
        title: "Erro",
        message: "Essa função é apenas para Responsável!"
      });

      return;
    }

    try {
      const res = await api.post("areas/", {
        center_lat: selectedCenter.latitude,
        center_lng: selectedCenter.longitude,
        radius,
        nome: nome
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

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadAll = async () => {
        try {
          const [areasRes, markersRes] = await Promise.all([
            api.get('areas/'),
            api.get('marcadores/'),
          ]);

          if (!isActive) return;

          setAreas(
            areasRes.data.map((a: any) => ({
              center: { latitude: a.latitude, longitude: a.longitude },
              radius: a.raio,
              nome: a.nome,
            })),
          );

          if (!isActive) return;
          setMarkers(markersRes.data);

          if (!isActive) return;
          await initLocation();
        } catch (err) {
          if (!isActive) return;
          console.warn('loadAll failed', err);
        }
      };

      loadAll();

      return () => {
        isActive = false;
      };
    }, [])
  );

  async function loadMarkers() {
    try {
      const res = await api.get("marcadores/");
      setMarkers(res.data);
    } catch (err) {
      console.log('loadMarkers error', err);
    }
  }
  
  const saveMarkersToBackend = async () => {
    setMarkersBlock(true);
    if (markers.length === 0) {
      setMarkersBlock(false);

      return ToastNotify({
        type: "error",
        title: "Nenhum ponto",
        message: "Toque no mapa para adicionar marcadores primeiro."
      });
    }

    try {
      const newMarkers = markers.filter((m: any) => m.id > 999999999999);

      for (const marker of newMarkers as any) {
        await api.post("marcadores/", {
          latitude: marker.latitude,
          longitude: marker.longitude,
          nome: marker.nome || "Marcador"
        });
      }

      setMarkersBlock(false);

      ToastNotify({
        type: "success",
        title: "Sucesso!",
        message: "Todos os marcadores foram salvos!",
        time: 2500
      });

      await loadMarkers();

      setMarkers(prev => prev.filter((m: any) => m.criado_em));

    } catch (err) {
      setMarkersBlock(false);
      console.log(err);
      ToastNotify({
        type: "error",
        title: "Erro!",
        message: "Não foi possível salvar os marcadores."
      });
    }
  };

  const deleteMarker = async(marker: any) => {
    try {

      if (!marker.criado_em) {
        setMarkers(prev => prev.filter((m: any) => m.id !== marker.id));
        setIsActive(false);
        return;
      }

      await api.delete(`marcadores/${marker.id}/`)

      ToastNotify({
        type: "success",
        title: "Sucesso!",
        message: "Marcador deletado com sucesso!",
        time: 1500
      }); 

      setIsActive(false);
      setMarkerSelected(null);

      loadMarkers();

    } catch (err) {
      console.error(err);

      ToastNotify({
        type: "error",
        title: "Erro!",
        message: "Ocorreu um erro ao tentar deletar o marcador!"
      });
    }
  }

  return (
    <View style={styles.container}>
      {!showMap ? (
        <ButtonCore 
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
          {coordenadas || region ? (
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

              {markers.map((marker: { id: React.Key | null | undefined; latitude: any; longitude: any; nome: any; criado_em: any}) => (
                <Marker
                  key={marker.id}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude
                  }}
                  title={marker.nome || 'Marcador'}
                  draggable={marker.criado_em ? false : true}
                  onSelect={() => {
                    setIsActive(true)
                    setMarkerSelected(marker)
                  }}
                  onDeselect={() => setIsActive(false)}
                  onDragEnd={(e) => {
                    const { latitude, longitude } = e.nativeEvent.coordinate;

                    setMarkers(prev =>
                      prev.map(m =>
                        (m as any).id === marker.id ? { ...m as any, latitude, longitude } : m
                      ) as any
                    );
                  }}
                />
              ))}


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
                  title={userType.amparado_nome || 'Amparado'}
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
          ) : null}
            

          {isFullScreen ? (
            <>
            {!coordenadas && !user.is_amparado && (
              <Texto
                style={{
                  position: "absolute",
                  top: "10%",
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

            {isOpen ? (
                <View 
                  style={{
                    top: "20%",
                    alignSelf: "center",
                    zIndex: 999,
                    width: width * 0.9,
                    height: width * 0.6,
                    backgroundColor: colors.background,
                    borderWidth: 0.5,
                    padding: 10,
                    borderRadius: 10,
                    gap: 30
                  }}
                >

                  <Input 
                    label='Nome da Área Segura' 
                    variant='form' 
                    inputMode={'text'}
                    value={nomeValue}
                    onChangeText={setNomeValue}
                    maxLength={255} 
                    style={{ width: width * 0.85, height: 40 }}

                   />

                  <Input 
                    label='Tamanho do Raio das Áreas Seguras (M)' 
                    variant='form'
                    inputMode={'numeric'}
                    value={valueRadius}
                    onChangeText={setValueRadius as any}
                    maxLength={4} 
                    style={{ width: width * 0.85, height: 40 }}

                   />

                   <TouchableOpacity onPress={() => {
                      setRadius(Number(valueRadius));
                      setNome(nomeValue);
                      setIsOpen(false);
                      ToastNotify({
                        type: 'success',
                        title: 'Sucesso!',
                        message: 'Configuracao salva com sucesso!',
                      });

                    }} 
                    style={{
                      backgroundColor: colors.primaryLight,
                      borderRadius: 8,
                      height: 35,
                      width: width * 0.85,
                      justifyContent: 'center'
                    }}
                    >
                      <View style={{alignContent: 'center'}}>
                        <Texto
                          style={{
                            justifyContent: 'center',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: colors.white,
                          }}
                        >
                          Salvar  
                        </Texto>
                      </View>
                   </TouchableOpacity>
                </View>
              ): null}

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
                bottom: 60,
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
                zIndex: 999
              }}
            >
              {!user.is_amparado ? (
                <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
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
                    <MapPinPen color={colors.white} />
                  </View>
              </TouchableOpacity>
              ) : null}

              {user.is_amparado && isActive ? (
                <TouchableOpacity onPress={() => deleteMarker(markerSelected)}>
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
                    <MapPinOff color={colors.white} />
                  </View>
              </TouchableOpacity>
              ) : null}
              
              {user.is_amparado ? (
                <TouchableOpacity onPress={() => {
                  saveMarkersToBackend()
                  }}>
                  <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 60,
                    borderWidth: 1,
                    borderColor: colors.white,
                    backgroundColor: !markersBlock ? colors.primaryLight : 'grey',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <MapPinned color={colors.white} />
                  </View>
                </TouchableOpacity>
              ): null}
              
              {!user.is_amparado ? (
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
              ): null}
              
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

              <TouchableOpacity disabled={blocked} onPress={() => {
                if (user.is_amparado) {
                  
                  if (!userType.responsavel_id)
                  sendNotification(userType.responsavel_id);
                  setIsBlocked(true);
                  setTimeout(() => {setIsBlocked(false)}, 2500);
                }
                else {
                  ToastNotify({
                    type: "error",
                    title: "Erro",
                    time: 2500,
                    message: "Você é um responsável, não pode enviar notificação!"
                  })
                }
                }}>
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 60,
                  borderWidth: 1,
                  borderColor: colors.white,
                  backgroundColor: !blocked ? 'red' : 'grey',
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
                }}
                >
                <TouchableOpacity onPress={() => saveArea()}>
                  <View style={{
                    width: 130,
                    height: 40,
                    top: 20,
                    left: 2,
                    borderRadius: 18,
                    backgroundColor: colors.primaryLight,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 5
                  }}>
                    <MapPinCheck color={colors.white}  />
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
                    borderRadius: 18,
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
            null
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