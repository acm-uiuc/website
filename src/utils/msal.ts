import { IPublicClientApplication, BrowserAuthError, createStandardPublicClientApplication, AccountInfo, InteractionRequiredAuthError } from "@azure/msal-browser";


export const UIUC_ENTRA_ID_TENANT = "44467e6f-462c-4ea2-823f-7800de5434e3";
export const CLIENT_ID = "d64e9c50-d144-4b4a-a315-ad2ed456c37c"
const scopes = ["https://graph.microsoft.com/.default"]

export const initMsalClient = async () => {
  const iPca = await createStandardPublicClientApplication({
    auth: {
      clientId: CLIENT_ID,
      authority: `https://login.microsoftonline.com/${UIUC_ENTRA_ID_TENANT}`,
    },
  });
  await iPca.initialize();
  return iPca;
}


export const getUserAccessToken = async (pca: IPublicClientApplication): Promise<string | null> => {
  let account = pca.getActiveAccount();
  if (!account) {
    try {
      const loginResponse = await pca.loginPopup({
        scopes,
      });
      pca.setActiveAccount(loginResponse.account);
      account = loginResponse.account;
    } catch (error) {
      if (error instanceof BrowserAuthError && error.errorCode === "popup_window_error") {
        alert("Your browser is blocking popups. Please allow popups for this site and then try logging in again.");
      }
      console.error("MSAL login failed:", error);
      return null;
    }
  }

  const tokenRequest = {
    scopes,
    account: account as AccountInfo,
    authority: `https://login.microsoftonline.com/${UIUC_ENTRA_ID_TENANT}`,
    forceRefresh: false
  };

  try {
    const response = await pca.acquireTokenSilent(tokenRequest);
    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      try {
        const response = await pca.acquireTokenPopup(tokenRequest);
        return response.accessToken;
      } catch (popupError) {
        if (popupError instanceof BrowserAuthError && popupError.errorCode === "popup_window_error") {
          alert("Your browser is blocking popups, which are required for this action. Please allow popups for this site and try again.");
        }
        console.error("MSAL popup token acquisition failed:", popupError);
        return null;
      }
    }

    console.error("MSAL silent token acquisition failed:", error);
    return null;
  }
};
