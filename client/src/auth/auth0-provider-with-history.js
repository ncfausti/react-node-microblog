// src/auth/auth0-provider-with-history.js

// import React from 'react';
// import { useHistory } from 'react-router-dom';
// import { Auth0Provider } from '@auth0/auth0-react';

// const Auth0ProviderWithHistory = ({ children }) => {
//   const domain = process.env.REACT_APP_AUTH0_DOMAIN;
//   const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

//   const history = useHistory();

//   const onRedirectCallback = (appState) => {
//     history.push(appState?.returnTo || window.location.pathname);
//   };

//   return (
//     <Auth0Provider
//       domain={domain}
//       clientId={clientId}
//       redirectUri={window.location.origin}
//       onRedirectCallback={onRedirectCallback}
//     >
//       {children}
//     </Auth0Provider>
//   );
// };

// export default Auth0ProviderWithHistory;

import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { withRouter } from 'react-router-dom';

class Auth0ProviderWithHistory extends React.Component {
  domain = process.env.REACT_APP_AUTH0_DOMAIN;

  clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

  audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  onRedirectCallback = (appState) => {
    this.props.history.push(appState?.returnTo || window.location.pathname);
  };

  render() {
    return (
      <Auth0Provider
        domain={this.domain}
        clientId={this.clientId}
        redirectUri={window.location.origin}
        onRedirectCallback={this.onRedirectCallback}
        audience={this.audience}
      >
        {this.props.children}
      </Auth0Provider>
    );
  }
}

export default withRouter(Auth0ProviderWithHistory);
