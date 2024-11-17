/**
 * Retrieves the access token from localStorage.
 */
export const getAccessToken = (): string | null => {
    return localStorage.getItem("accessToken");
};

/**
 * Retrieves the refresh token from localStorage.
 */
export const getRefreshToken = (): string | null => {
    return localStorage.getItem("refreshToken");
};

/**
 * Stores the access token in localStorage.
 * @param token - The access token to store.
 */
export const setAccessToken = (token: string): void => {
    localStorage.setItem("accessToken", token);
};

/**
 * Stores the refresh token in localStorage.
 * @param token - The refresh token to store.
 */
export const setRefreshToken = (token: string): void => {
    localStorage.setItem("refreshToken", token);
};

/**
 * Clears both access and refresh tokens from localStorage.
 */
export const clearTokens = (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};
