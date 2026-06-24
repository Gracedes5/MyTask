import type { NavigatorScreenParams } from "@react-navigation/native";

export type TabParamList = {
  Today: undefined;
  Upcoming: undefined;
  Search: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  CreateAccount: undefined;
  Tabs: NavigatorScreenParams<TabParamList>;
  AddTask: undefined;
};
