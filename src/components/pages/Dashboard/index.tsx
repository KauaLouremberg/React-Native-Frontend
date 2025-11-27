import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserType } from '../../../store/userTypeSlice';
import api from '../../conexao/api';
import GenerateCode from './GenerateCode/generate-code';
import { WithoutAmp } from './WithoutAmp/without-amp';

type InformationType = {
  responsavel_id: number | null;
  amparado_id: number | null;
};

export default function Dashboard() {
  const user = useSelector((state: any) => state.user);
  const [information, setInformation] = useState<InformationType>();
  const dispatch = useDispatch();

  const onReceiveInformation = useCallback(
    (data: any) => {
      const user = {
        responsavel_id: data.responsavel_id,
        amparado_id: data.amparado_id,
      };

      dispatch(setUserType(user));
    },
    [dispatch],
  );

  useEffect(() => {
    if (!user) return;
    api
      .get('information/')
      .then(res => {
        setInformation(res.data);
        onReceiveInformation(res.data);
      })
      .catch(err => console.log(err));
  }, [user, onReceiveInformation]);

  return information?.amparado_id ? <GenerateCode /> : <WithoutAmp />;
}
