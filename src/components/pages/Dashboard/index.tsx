import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import GenerateCode from './GenerateCode/generate-code';
import { WithoutAmp } from './WithoutAmp/without-amp';

type InformationType = {
  responsavel_id: number | null;
  amparado_id: number | null;
};

export default function Dashboard() {
  const user = useSelector((state: any) => state.user);
  const userType = useSelector((state: any) => state.userType);
  const [loading, setLoading] = useState<boolean>(false);

  return !user.has_perfil || !user.is_amparado && !userType?.amparado_id ? <WithoutAmp /> : <GenerateCode />;
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
