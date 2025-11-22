/**
 * @format
 */

import { AppRegistry } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import { name as appName } from './app.json';
import TrackingService from './src/components/pages/Dashboard/MapScreen/trackingService';
import Root from "./src/root";

BackgroundFetch.registerHeadlessTask(async (event) => {
  console.log('[Headless] Executando em segundo plano');
  await TrackingService.sendLastLocation();
  BackgroundFetch.finish(event.taskId);
});
AppRegistry.registerComponent(appName, () => Root);
