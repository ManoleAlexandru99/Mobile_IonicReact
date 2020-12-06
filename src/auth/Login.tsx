import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { IonButton, IonContent, IonHeader, IonInput, IonLoading, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { AuthContext } from './AuthProvider';
import { getLogger } from '../core';
import { Plugins } from '@capacitor/core';

const log = getLogger('Login');

interface LoginState {
  username?: string;
  password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { isAuthenticated, isAuthenticating, login, authenticationError } = useContext(AuthContext);
  const [state, setState] = useState<LoginState>({});
  const { username, password } = state;
  const handleLogin = () => {
    log('handleLogin...');
    login?.(username, password);
  };
  log('render');
  if (isAuthenticated) {
    return <Redirect to={{ pathname: '/' }} />
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput
          placeholder="Username"
          value={username}
          onIonChange={e => setState({
            ...state,
            username: e.detail.value || ''
          })}/>
        <IonInput 
          type="password"
          placeholder="Password"
          value={password}
          onIonChange={e => setState({
            ...state,
            password: e.detail.value || ''
          })}/>
        <IonLoading isOpen={isAuthenticating}/>
        {authenticationError && (
          <div>{authenticationError.message || 'Failed to authenticate'}</div>
        )}
        <IonButton onClick={handleLogin}>Login</IonButton>
      </IonContent>
    </IonPage>
  );
};

/*
export function mylocalStorage() {
  (async () => {
    const { Storage } = Plugins;

    // Saving ({ key: string, value: string }) => Promise<void>
    await Storage.set({
      key: 'user',
      value: JSON.stringify({
        username: 'a', password: 'a',
      })
    });

    // Loading value by key ({ key: string }) => Promise<{ value: string | null }>
    const res = await Storage.get({ key: 'user' });
    if (res.value) {
      console.log('User found', JSON.parse(res.value));
    } else {
      console.log('User not found');
    }

    // Loading keys () => Promise<{ keys: string[] }>
    const { keys } = await Storage.keys();
    console.log('Keys found', keys);

    // Removing value by key, ({ key: string }) => Promise<void>
    await Storage.remove({ key: 'user' });
    console.log('Keys found after remove', await Storage.keys());

    // Clear storage () => Promise<void>
    await Storage.clear();
  })();
}
*/