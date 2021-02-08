const hideCookiePopupName = 'hideCookiePopup';

export const get = (): boolean => !!localStorage.getItem(hideCookiePopupName);
export const set = (): void => localStorage.setItem(hideCookiePopupName, 'yes');
export const clear = (): void => localStorage.removeItem(hideCookiePopupName);
