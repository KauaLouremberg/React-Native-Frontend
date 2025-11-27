import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUserType } from '../../../store/userTypeSlice';
import api from '../../conexao/api';
import SpinningIcon from '../../ElementosForm/SpinningIcon';
import GenerateCode from './GenerateCode/generate-code';
import { WithoutAmp } from './WithoutAmp/without-amp';

type InformationType = {
  responsavel_id: number | null;
  amparado_id: number | null;
};

export default function Dashboard() {
  const user = useSelector((state: any) => state.user);
  const [information, setInformation] = useState<InformationType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const onReceiveInformation = useCallback(
    (data: InformationType) => {
      const userData = {
        responsavel_id: data.responsavel_id,
        amparado_id: data.amparado_id,
      };
      dispatch(setUserType(userData));
    },
    [dispatch],
  );

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    api
      .get<InformationType>('information/')
      .then(res => {
        setInformation(res.data);
        onReceiveInformation(res.data);
      })
      .catch(err => console.error('Erro ao buscar information:', err))
      .finally(() => setLoading(false));
  }, [user, onReceiveInformation]);

  if (loading)
    return (
      <View style={style.container}>
        <SpinningIcon />
      </View>
    );

  return !information?.amparado_id ? <GenerateCode /> : <WithoutAmp />;
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
