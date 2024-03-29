/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Login: undefined;
  Invite: undefined;
  About: undefined;
  Contact: undefined;
  RequestInviteModal: undefined;
  Password: undefined;
  LoginContacts: undefined;
  Modal: undefined;
  SearchModal: undefined;
  ProfileModal: undefined;
  MyProfile: undefined;
  SavedInterests: undefined;
  SettingsModal: undefined;
  ContactModal: undefined;
  Message: undefined;
  ChangePassword: undefined;
  RecoveryEmail: undefined;
  ChangeRecoveryEmail: undefined;
  ForgotPassword: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Interests: undefined;
  Friends: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  // BottomTabScreenProps<RootTabParamList, Screen>,
  MaterialTopTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
