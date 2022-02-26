import { Refine } from "@pankod/refine-core";
import { notificationProvider, Layout, LoginPage } from "@pankod/refine-antd";
import routerProvider from "@pankod/refine-react-router-v6";
import "@pankod/refine-antd/dist/styles.min.css";
import { dataProvider } from "@pankod/refine-supabase";

import authProvider from "./authProvider";
import { supabaseClient } from "utility";

function App() {
  return (
    <Refine
      routerProvider={routerProvider}
      notificationProvider={notificationProvider}
      Layout={Layout}
      dataProvider={dataProvider(supabaseClient)}
      authProvider={authProvider}
      LoginPage={LoginPage}
    />
  );
}

export default App;
