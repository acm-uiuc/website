import {
  BrowserAuthError,
  createStandardPublicClientApplication,
  InteractionRequiredAuthError,
  type IPublicClientApplication,
  type PopupRequest,
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
  pca: IPublicClientApplication
): Promise<string> => {
  const account = pca.getActiveAccount() || pca.getAllAccounts()[0];
  const request: PopupRequest = {
    ...loginRequest,
    account: account || undefined,
    redirectUri: '/auth-redirect',
  };

  if (!account) {
    try {
      const response = await pca.loginPopup(request);
      pca.setActiveAccount(response.account);
      return response.accessToken;
    } catch (error) {
      if (
        error instanceof BrowserAuthError &&
        error.errorCode === 'popup_window_error'
      ) {
        alert(
          'Your browser is blocking popups. Please allow popups for this site and then try logging in again.'
        );
      }
      console.error('MSAL login failed:', error);
      throw error;
    }
  }

  try {
    const response = await pca.acquireTokenSilent(request);
    return response.accessToken;
  } catch (e) {
    if (e instanceof InteractionRequiredAuthError) {
      try {
        const response = await pca.acquireTokenPopup(request);
        return response.accessToken;
      } catch (popupError) {
        if (
          popupError instanceof BrowserAuthError &&
          popupError.errorCode === 'popup_window_error'
        ) {
          alert(
            'Your browser is blocking popups, which are required for this action. Please allow popups for this site and try again.'
          );
        }
        console.error('MSAL popup token acquisition failed:', popupError);
        throw popupError;
      }
    }
    throw e;
  }
};
