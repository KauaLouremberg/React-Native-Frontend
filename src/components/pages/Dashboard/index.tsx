import { useSelector } from 'react-redux';
import GenerateCode from './GenerateCode/generate-code';
import { WithoutAmp } from './WithoutAmp/without-amp';

export default function Dashboard() {
  const user = useSelector((state: any) => state.user);
  const userType = useSelector((state: any) => state.userType);

  return !user.has_perfil || (!user.is_amparado && !userType?.amparado_id) ? (
    <WithoutAmp />
  ) : (
    <GenerateCode />
  );
}
