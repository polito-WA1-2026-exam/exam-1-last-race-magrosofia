// API Functions
const API_URL = 'http://localhost:3001/api';

// ========== User management APIs ==========
// React components call these functions instead of using fetch directly.

const login = async (credentials) => {

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
    login,
    logout,
    getCurrentUser,
    getNetwork,
    startNewGame,
    submitRoute,
    getRanking
};

export default API;