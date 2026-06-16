// API Functions
const API_URL = 'http://localhost:3001/api';

// ========== User management APIs ==========

const login = async (credentials) => {
    /*
      Your server uses Passport LocalStrategy without usernameField: 'email'.
      Therefore, it expects:
      {
        username: "...",
        password: "..."
      }

      If your LoginForm uses "email", call this function with:
      API.login({ username: email, password });
    */

    const response = await fetch(`${API_URL}/sessions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Login failed');
    }

    return await response.json();
};

const logout = async () => {
    const response = await fetch(`${API_URL}/sessions/current`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Logout failed');
    }
};

const getCurrentUser = async () => {
    const response = await fetch(`${API_URL}/sessions/current`, {
        method: 'GET',
        credentials: 'include'
    });

    if (response.ok) {
        return await response.json();
    }
    return null;
};

// ========== Network APIs ==========

const getNetwork = async () => {
    const response = await fetch(`${API_URL}/network`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to get network');
    }

    return await response.json();
};

// ========== Game management APIs ==========

const startNewGame = async () => {
    /*
      Your POST /api/games creates a new game and returns:
      - gameId
      - startStation
      - destinationStation
      - startedAt
      - timeLimit
      - stations
      - segments

      So this is also the API used to initialize the planning phase.
    */

    const response = await fetch(`${API_URL}/games`, {
        method: 'POST',
        credentials: 'include'
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to start new game');
    }

    return await response.json();
};

const submitRoute = async (gameId, route) => {
    /*
      The server expects:
      {
        route: [1, 2, 3, ...]
      }

      Not:
      {
        segments: [...]
      }
    */

    const response = await fetch(`${API_URL}/games/${gameId}/route`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ route })
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to submit route');
    }

    return await response.json();
};

// ========== Ranking APIs ==========

const getRanking = async () => {
    const response = await fetch(`${API_URL}/ranking`, {
        method: 'GET',
        credentials: 'include'
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to get ranking');
    }

    return await response.json();
};

const API = {
    // user management
    login,
    logout,
    getCurrentUser,

    // network
    getNetwork,

    // game management
    startNewGame,
    submitRoute,

    // ranking
    getRanking
};

export default API;