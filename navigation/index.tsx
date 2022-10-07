/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import * as React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ColorSchemeName, Pressable, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

// Modals
import ModalScreen from '../screens/ModalScreen';
import ContactModalScreen from '../screens/ContactModalScreen';
import SearchModalScreen from '../screens/SearchModalScreen';
import ProfileModalScreen from '../screens/ProfileModalScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import SettingsModalScreen from '../screens/SettingsModalScreen';
import LoginScreen from '../screens/LoginScreen';
import PasswordScreen from '../screens/PasswordScreen';
import LoginContactScreen from '../screens/LoginContactScreen';
import InviteScreen from '../screens/InviteScreen';
import RequestInviteModalScreen from '../screens/RequestInviteModalScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import ChangePasswordScreen from '../screens/ChangePassword';
import RecoveryEmailScreen from '../screens/RecoveryEmail';
import ForgotPasswordScreen from '../screens/ForgotPassword';
import ChangeRecoveryEmailScreen from '../screens/ChangeRecoveryEmail';

import NotFoundScreen from '../screens/NotFoundScreen';
import InterestsScreen from '../screens/InterestsScreen';
import FriendsScreen from '../screens/FriendsScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { Text, View } from '../components/Themed';

// Components
import HeaderComponent from '../components/HeaderComponent';
import SearchHeader from '../components/SearchHeader';
import ContactSearchHeader from '../components/ContactSearchHeader';
import LoginContactSearchHeader from '../components/LoginContactSearchHeader';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const isAuth = useSelector(state => !!state.auth.token);
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);
  
  

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {!isAuth && <LoginNavigator />}
      {isAuth && <RootNavigator />} 
      {/* <RootNavigator />   */}
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */

const Stack = createNativeStackNavigator<RootStackParamList>();

function LoginNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={LoginScreen}
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
          name="Invite" 
          component={InviteScreen} 
          options={{ headerShown: false}} 
      />
      <Stack.Screen 
        name="RequestInviteModal"
        component={RequestInviteModalScreen}
        options={{
          headerShown: false,
          headerTitle: (props) => <ContactSearchHeader {...props} />
        }}
      />
      <Stack.Screen 
        name="Password" 
        component={PasswordScreen} 
        options={{ headerShown: false }} />
      <Stack.Screen 
        name="RecoveryEmail" 
        component={RecoveryEmailScreen} 
        options={{ headerShown: false }} />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen} 
        options={{ headerShown: false }} />
      <Stack.Screen 
        name="LoginContacts" 
        component={LoginContactScreen} 
        options={{ 
          headerShown: false, 
          // headerTitle: (props) => <LoginContactSearchHeader {...props} />,
          // headerBackVisible:false
          }} 
      />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={TopTabNavigator}
        options={{
          headerShown: true,
          headerTitle: (props) => <HeaderComponent {...props}/>
        }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen 
          name="MyProfile"
          component={MyProfileScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="ProfileModal"
          component={ProfileModalScreen}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="SettingsModal"
          component={SettingsModalScreen}
          options={{
              headerShown: true,
              title: 'Settings'
          }}
        />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
        <Stack.Screen
          name="SearchModal"
          component={SearchModalScreen}
          options={{
            headerShown: true,
            headerTitle: (props) => <SearchHeader {...props} />
          }}
        />
        <Stack.Screen 
          name="About"
          component={AboutScreen}
          options={{
              headerShown: true,
              title: 'About us'
          }}
        />
        <Stack.Screen 
          name="Message"
          component={ContactScreen}
          options={{
              headerShown: true,
              title: 'Message us'
          }}
        />
        <Stack.Screen 
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{
              headerShown: true,
              title: 'Change Password'
          }}
        />
        <Stack.Screen 
          name="ChangeRecoveryEmail" 
          component={ChangeRecoveryEmailScreen} 
          options={{
              headerShown: true, 
              title: 'Change recovery email' 
            }} 
        />
        <Stack.Screen 
          name="ContactModal" 
          component={ContactModalScreen} 
          options={{ 
            headerShown: false, 
            // headerTitle: (props) => <ContactSearchHeader {...props} />
            }} 
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const TopTab = createMaterialTopTabNavigator<RootTabParamList>();

function TopTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <TopTab.Navigator
      initialRouteName="Interests"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <TopTab.Screen
        name="Interests"
        component={InterestsScreen}
        options={({ navigation }: RootTabScreenProps<'Interests'>) => ({
          title: 'Interests',
        })}
      />
      <TopTab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          title: 'Friends',
        }}
      />
    </TopTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
