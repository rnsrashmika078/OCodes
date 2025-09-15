export interface UserMessage {
  messageId: string;
  chatId: string;
  // messageId: string;
  // from: From;
  title?: string;
  user: string;
  ai: string;
  // message: string;
  time?: Date;
  loading?: boolean;
}
export interface AuthUser {
  id: string;
  fname: string;
  lname: string;
  email: string;
  token: string;
  authenticated?: string;
}
export interface UpdateChat {
  chatId: string;
  title: string;
}
export interface Reply {
  error: boolean;
  message: string;
}

export interface UserPreference {
  netstats: boolean;
  authstats: boolean;
}
export interface Tree {
  id: string; //this is the child id
  type: string;
  name: string;
  path: string;
  children?: Tree[];
}
export interface FilePath {
  path: string;
  tree: Tree[];
}

export interface OpenFile {
  id: string;
  name: string;
  content: string;
  path: string;
  type: string;

  // node: Tree | null;
}

// export interface Tabs {
//   title: string;
//   type: string;
//   path: string;
//   content: string;
// }
