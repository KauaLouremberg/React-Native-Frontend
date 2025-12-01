import { Frown, Trash } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../../../core/constants/colors';
import api from '../../conexao/api';
import SpinningIcon from '../../ElementosForm/SpinningIcon';
import { ToastNotify } from '../../ElementosForm/Toast';
import {
  HeaderNavigation,
  TabDefinition,
} from '../../headerNavigation/header-navigation';
import { Texto } from '../../texto';

type Values = {
  title: string;
  value: string | undefined;
};

type CardType = {
  values: Values[];
  onDelete?: () => void
  isLoadingDelete?: boolean
};

type MarkedType = {
  id: number
  criado_em: string;
  latitude: string;
  longitude: string;
  nome: string;
};

type AreaType = {
  id: number
  criado_em: string;
  raio: string;
  latitude: string;
  longitude: string;
  nome: string;
};

function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function Card({ values, onDelete, isLoadingDelete }: CardType) {
  return (
    <View style={card}>
      <View>
        {values.map((item, idx) => (
          <Texto key={idx}>
            {item.title}: {item.value}
          </Texto>
        ))}
      </View>
      {
        isLoadingDelete
        ?
        <SpinningIcon text={false} color='#777' style={{width: 'auto'}} size={20}/>
        :
        <Trash 
          color="red"
          onTouchEnd={onDelete}
        />
      }
    </View>
  );
}

function NoValues() {
  return (
    <View style={spinner}>
      <Frown 
        color={colors.primaryLight} 
        size={32} 
        style={{justifyContent: 'center', alignSelf: 'center', marginBottom: 10}}
      />
      <Texto 
        style={{
          justifyContent: 'center',
          alignSelf: 'center', 
          fontSize: 15,
          color: colors.primaryLight
        }}>
        Não existe nenhum registro!
      </Texto>
    </View>
  )
}

function MarkedsTabContent() {
  const [marked, setMarked] = useState<MarkedType[]>([]);
  const [deletingMarkerId, setDeletingMarkerId] = useState<number | string | null>(null);
  const usuario = useSelector((state: any) => state.user);
  const [isLoadingMarked, setIsLoadingMakerd] = useState<boolean>(true);

  const fetchMarkeds = () => {
    setIsLoadingMakerd(true);
    api
      .get('marcadores/')
      .then(result => setMarked(result.data))
      .catch(err => setMarked([]))
      .finally(() => setIsLoadingMakerd(false));
  };

  const deleteMarker = async(id: number) => {
    setDeletingMarkerId(id)
    try {

      await api.delete(`marcadores/${id}/`)

      ToastNotify({
        type: "success",
        title: "Sucesso!",
        message: "Marcador deletado com sucesso!",
        time: 1500
      }); 

    } catch (err) {
      console.error(err);

      ToastNotify({
        type: "error",
        title: "Erro!",
        message: "Ocorreu um erro ao tentar deletar o marcador!"
      });
    }
    setDeletingMarkerId(null)

  }



  useEffect(() => {
    if (usuario) {
      fetchMarkeds();
    }
  }, [usuario]);

  return isLoadingMarked ? (
    <View style={spinner}>
      <SpinningIcon />
    </View>
  ) : (<>
    {marked.length > 0 ? (
      <ScrollView style={section} contentContainerStyle={sectionGap}>
        {marked.map((item, index) => {
          const values: Values[] = [
            { title: 'Nome', value: item.nome },
            { title: 'Criado em', value: formatDateTime(item.criado_em) },
            { title: 'Latitude', value: item.latitude },
            { title: 'Longitude', value: item.longitude },
          ];

          return (
            <Card 
              key={index} 
              values={values} 
              onDelete={async () => {
                if(deletingMarkerId) return
                await deleteMarker(item.id)
                fetchMarkeds()
              }}
              isLoadingDelete={deletingMarkerId === item.id}
            />
          );
        })}
      </ScrollView>
    ): <NoValues />}
  </>);
}

function AreasTabContent() {
  const [areas, setAreas] = useState<AreaType[]>([]);
  const usuario = useSelector((state: any) => state.user);
  const [deletingAreaId, setDeletingAreaId] = useState<number | string | null>(null);
  const [isLoadingArea, setIsLoadingArea] = useState<boolean>(true);
  const areasMarkeds = () => {
    setIsLoadingArea(true);
    api
      .get('areas/')
      .then(result => setAreas(result.data))
      .catch(err => setAreas([]))
      .finally(() => setIsLoadingArea(false));
  };

  const deleteArea = async(id: number | string) => {
    setDeletingAreaId(id)
    try {

      await api.delete(`areas/${id}/`)

      ToastNotify({
        type: "success",
        title: "Sucesso!",
        message: "Área deletada com sucesso!",
        time: 1500
      }); 

    } catch (err) {
      console.error(err);

      ToastNotify({
        type: "error",
        title: "Erro!",
        message: "Ocorreu um erro ao tentar deletar a área!"
      });
    }
    setDeletingAreaId(null)
  }

  useEffect(() => {
    if (usuario) {
      areasMarkeds();
    }
  }, [usuario]);
  return isLoadingArea ? (
    <View style={spinner}>
      <SpinningIcon />
    </View>
  ) : (<>
    {areas.length > 0 ? (
      <ScrollView style={section} contentContainerStyle={sectionGap}>
        {areas.map((item, index) => {
          const values: Values[] = [
            { title: 'Nome', value: item.nome },
            { title: 'Criado em', value: formatDateTime(item.criado_em) },
            { title: 'Latitude', value: item.latitude },
            { title: 'Longitude', value: item.longitude },
            { title: 'Raio', value: `${item.raio} M` },
          ];

          return (
            <Card 
              key={index} 
              values={values} 
              onDelete={async () => {
                if(deletingAreaId) return
                await deleteArea(item.id)
                areasMarkeds()
              }}
              isLoadingDelete={deletingAreaId === item.id}
            />
          );
        })}
      </ScrollView>
    ): <NoValues />}
    
  </>);
}

export function MarkedsPage() {
  const tabs = useMemo<TabDefinition[]>(
    () => [
      {
        key: 'markers',
        title: 'Marcadores',
        render: () => <MarkedsTabContent />,
      },
      {
        key: 'area',
        title: 'Áreas',
        render: () => <AreasTabContent />,
      },
    ],
    [],
  );

  return (
    <HeaderNavigation title="Registros" initialTabKey="markers" tabs={tabs} />
  );
}

const { section, sectionGap, card, spinner } = StyleSheet.create({
  section: {
    height: '100%',
    width: '100%',
    padding: 16,
  },
  sectionGap: {
    gap: 16,
    paddingBottom: 230,
  },
  card: {
    minHeight: 120,
    width: '100%',
    backgroundColor: colors.neutral[100],
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spinner: {
    height: '100%',
    justifyContent: 'center',
    marginBottom: -90,
  },
});
