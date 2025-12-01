import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../../../core/constants/colors';
import api from '../../conexao/api';
import SpinningIcon from '../../ElementosForm/SpinningIcon';
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
};

type MarkedType = {
  criado_em: string;
  latitude: string;
  longitude: string;
  nome: string;
};

type AreaType = {
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

function Card({ values }: CardType) {
  return (
    <View style={card}>
      <View>
        {values.map((item, idx) => (
          <Texto key={idx}>
            {item.title}: {item.value}
          </Texto>
        ))}
      </View>
    </View>
  );
}

function MarkedsTabContent() {
  const [marked, setMarked] = useState<MarkedType[]>([]);
  const usuario = useSelector((state: any) => state.user);
  const [isLoadingMarked, setIsLoadingMakerd] = useState<boolean>(true);

  const fetchMarkeds = () => {
    setIsLoadingMakerd(true);
    api
      .get('marcadores/')
      .then(result => setMarked(result.data))
      .finally(() => setIsLoadingMakerd(false));
  };

  useEffect(() => {
    if (usuario) {
      fetchMarkeds();
    }
  }, [usuario]);

  return isLoadingMarked ? (
    <View style={spinner}>
      <SpinningIcon />
    </View>
  ) : (
    <ScrollView style={section} contentContainerStyle={sectionGap}>
      {marked.map((item, index) => {
        const values: Values[] = [
          { title: 'Nome', value: item.nome },
          { title: 'Criado em', value: formatDateTime(item.criado_em) },
          { title: 'Latitude', value: item.latitude },
          { title: 'Longitude', value: item.longitude },
        ];

        return <Card key={index} values={values} />;
      })}
    </ScrollView>
  );
}

function AreasTabContent() {
  const [areas, setAreas] = useState<AreaType[]>([]);
  const usuario = useSelector((state: any) => state.user);
  const [isLoadingArea, setIsLoadingArea] = useState<boolean>(true);
  const areasMarkeds = () => {
    setIsLoadingArea(true);
    api
      .get('areas/')
      .then(result => setAreas(result.data))
      .finally(() => setIsLoadingArea(false));
  };

  useEffect(() => {
    if (usuario) {
      areasMarkeds();
    }
  }, [usuario]);
  return isLoadingArea ? (
    <View style={spinner}>
      <SpinningIcon />
    </View>
  ) : (
    <ScrollView style={section} contentContainerStyle={sectionGap}>
      {areas.map((item, index) => {
        const values: Values[] = [
          { title: 'Nome', value: item.nome },
          { title: 'Criado em', value: formatDateTime(item.criado_em) },
          { title: 'Latitude', value: item.latitude },
          { title: 'Longitude', value: item.longitude },
          { title: 'Raio', value: `${item.raio} M` },
        ];

        return <Card key={index} values={values} />;
      })}
    </ScrollView>
  );
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
    flexDirection: 'column',
  },
  spinner: {
    height: '100%',
    justifyContent: 'center',
    marginBottom: -90,
  },
});
