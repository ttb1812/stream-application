/**
 * @format
 */

import {AppRegistry} from 'react-native';
import EntryPoint from './src/entry-point';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => EntryPoint);
