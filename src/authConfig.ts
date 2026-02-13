import {
  createStandardPublicClientApplication,
  InteractionRequiredAuthError,
  type IPublicClientApplication,
  type RedirectRequest,
} from '@azure/msal-browser';

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

export const getUserAccessToken = async (
  pca: IPublicClientApplication,
  returnPath?: string
): Promise<string> => {
  const account = pca.getActiveAccount() || pca.getAllAccounts()[0];
  const request: RedirectRequest = {
    ...loginRequest,
    account: account || undefined,
    redirectUri: '/auth-redirect',
    state: returnPath ?? window.location.pathname + window.location.search,
  };

  if (!account) {
    await pca.loginRedirect(request);
    throw new Error('Redirecting to login');
  }

  try {
    const response = await pca.acquireTokenSilent(request);
    return response.accessToken;
  } catch (e) {
    if (e instanceof InteractionRequiredAuthError) {
      await pca.acquireTokenRedirect(request);
      throw new Error('Redirecting to login', { cause: e });
    }
    throw e;
  }
};
