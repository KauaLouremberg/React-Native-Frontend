import { Frown } from 'lucide-react-native';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../../../core/constants/colors';
import { Texto } from '../../texto';
import { WithoutAmp } from './WithoutAmp/without-amp';
import { WithoutPerfil } from './WithoutAmp/without-perfil';

export default function Dashboard() {
  const user = useSelector((state: any) => state.user);
  const userType = useSelector((state: any) => state.userType);

  console.log(userType, 'userType');

  return (<>

    {!user.has_perfil ? 
      (
      <>
      <WithoutPerfil />
      </>
      ) :
      (!userType.amparado_id && !userType.responsavel_id ? 
      <WithoutAmp />
      : <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
              Tela não finalizada
            </Texto>
        </View>
      )
      }
      </>
)
}
