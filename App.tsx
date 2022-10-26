import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk';
import { RootSiblingParent } from 'react-native-root-siblings';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import authReducer from './store/reducers/auth';
import interestReducer from './store/reducers/interests'
import friendReducer from './store/reducers/friends'
// import * as Sentry from 'sentry-expo';


// Sentry.init({
//   dsn: 'https://2c14dd6a04894fa88d8687a2a46b79c4@o1276554.ingest.sentry.io/6471962',
//   enableInExpoDevelopment: true,
//   debug: true, 
// });

// Access any @sentry/react-native exports via:
// Sentry.Native.*

// Access any @sentry/browser exports via:
// Sentry.Browser.*

const rootReducer = combineReducers({
  auth: authReducer,
  interest: interestReducer,
  friend: friendReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(ReduxThunk)
  // composeWithDevTools()
);

export const queryClient = new QueryClient()

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      // console.log('notification: ', notification.request.content.data)
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RootSiblingParent>
            <SafeAreaProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </SafeAreaProvider>
          </RootSiblingParent>
        </QueryClientProvider>
      </Provider>
    );
  }
}
