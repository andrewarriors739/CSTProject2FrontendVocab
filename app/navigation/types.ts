export type Word = { id: number; term: string; definition: string };

export type RootStackParamList = {
  HomePage: undefined;
  Login: undefined;
  CreateAccount: undefined;

  // Your screens that pass params:
  LandingPage: { userID: string };
  AddWords: undefined;

  // Lists
  ListCreation: { userID: string };
  VocabListPage: { userID: string };
  PickList: { userID: string; currentWord: Word };
  WordListPage: { userID: string; listID: number };
};
