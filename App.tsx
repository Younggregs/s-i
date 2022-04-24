import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import authReducer from './store/reducers/auth';
import interestReducer from './store/reducers/interests'
import friendReducer from './store/reducers/friends'

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

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </Provider>
    );
  }
}
