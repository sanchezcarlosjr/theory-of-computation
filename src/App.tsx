import {Admin, Resource} from 'react-admin';
import grammar from './grammars';
import {dataProvider} from "./@shared/DataProvider";
import {authProvider} from "./@shared/AuthProvider";
import LoginPage from "./@core/application/layout/Login";
import {Helmet} from "react-helmet";
import React from "react";
import {theme} from "./@core/application/layout/Theme";


const App = () => (
    <main>
        <Helmet>
            <title>Grammar</title>
            <meta name="description" content="Theory of computation - UABC | Carlos Eduardo Sanchez Torres"/>
        </Helmet>
        <Admin
            theme={theme}
            authProvider={authProvider}
            dataProvider={dataProvider}
            loginPage={LoginPage}
        >
            <Resource name="grammars" {...grammar} />
        </Admin>
    </main>
);

export default App;
