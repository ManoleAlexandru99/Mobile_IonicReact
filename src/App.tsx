import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {BookEdit, BookList, Dog, Dog2 } from './tasks';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { BookProvider } from './tasks/ItemProvider';
import { AuthProvider, Login, PrivateRoute } from './auth';
import BookList2 from './tasks/itemList2';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <AuthProvider>
            <Route path="/login" component={Login} exact={true}/>
          <BookProvider>
            <PrivateRoute path="/books" component={BookList2} exact={true} />
            <PrivateRoute path="/book" component={BookEdit} exact={true} />
            <PrivateRoute path="/book/:id" component={BookEdit} exact={true} />
          </BookProvider>
            <Route path="/dogs" component={Dog} exact={true} />
            <Route path="/dogs2" component={Dog2} exact={true} />
            <Route exact path="/" render={() => <Redirect to="/books" />} />          
        </AuthProvider>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
