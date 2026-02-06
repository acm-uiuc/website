import { createStandardPublicClientApplication } from '@azure/msal-browser';

export const loginRequest = {
  scopes: ['User.Read'],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};


export const initMsalClient = async () => {
  const iPca = await createStandardPublicClientApplication({
    auth: {
      clientId: import.meta.env.PUBLIC_AZURE_CLIENT_ID,
      authority: `https://login.microsoftonline.com/${import.meta.env.PUBLIC_AZURE_TENANT_ID}`,
      navigateToLoginRequestUrl: false,
    },
  });
  await iPca.initialize();
  return iPca;
};
