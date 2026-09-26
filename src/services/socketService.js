import { io } from 'socket.io-client';
import { BASE_URL, SOCKET_URL } from '../config/setting';
import { getAuthToken } from '../config/apicall';

let socket = null;

export function getSocket() {
  return socket;
}

export function connectSocket(tokenOverride) {
  const token = tokenOverride || getAuthToken() || '';

  if (socket && socket.connected) {
    console.log('✅ [SOCKET] Connected successfully! Socket ID:', socket.id);
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  const targetUrl = SOCKET_URL || BASE_URL;
  console.log('⚡ [SOCKET] Attempting connection to:', targetUrl, token ? '(Authenticated)' : '(Unauthenticated)');

  socket = io(targetUrl, {
    path: '/socket.io',
    auth: {
      token: token || undefined,
    },
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 3000,
  });

  let hasLoggedConnectError = false;

  socket.on('connect', () => {
    hasLoggedConnectError = false;
    console.log('✅ [SOCKET] Connected successfully! Socket ID:', socket.id);
  });

  socket.on('disconnect', reason => {
    console.log('❌ [SOCKET] Disconnected. Reason:', reason);
  });

  socket.on('connect_error', err => {
    const errorMsg = err?.message || String(err);
    if (!hasLoggedConnectError) {
      console.log('⚡ [SOCKET] Socket server offline or unavailable at:', targetUrl, `(${errorMsg})`);
      hasLoggedConnectError = true;
    }
  });

  // Global Event Listeners as requested
  socket.on('ride:request:new', req => {
    console.log('🚗 [SOCKET EVENT] ride:request:new:', req);
  });

  socket.on('ride:request:cancelled', payload => {
    console.log('🚫 [SOCKET EVENT] ride:request:cancelled:', payload);
  });

  socket.on('ride:accepted', d => {
    console.log('🤝 [SOCKET EVENT] ride:accepted:', d);
  });

  socket.on('ride:arrived', d => {
    console.log('📍 [SOCKET EVENT] ride:arrived:', d);
  });

  socket.on('ride:started', d => {
    console.log('🚀 [SOCKET EVENT] ride:started:', d);
  });

  socket.on('ride:ended', d => {
    console.log('🏁 [SOCKET EVENT] ride:ended:', d);
  });

  socket.on('ride:cancelled', d => {
    console.log('❌ [SOCKET EVENT] ride:cancelled:', d);
  });

  socket.on('ride:status', d => {
    console.log('🔄 [SOCKET EVENT] ride:status:', d);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    console.log('⚡ [SOCKET] Disconnecting socket...');
    socket.disconnect();
    socket = null;
  }
}

export function subscribeSocketEvent(event, callback) {
  if (!socket) {
    console.warn(`⚠️ [SOCKET] Cannot subscribe to "${event}": Socket not initialized.`);
    return () => {};
  }
  socket.on(event, callback);
  return () => {
    socket.off(event, callback);
  };
}

export function syncRideStatus(rideId) {
  if (socket && socket.connected) {
    console.log('🔄 [SOCKET] Emitting ride:sync for rideId:', rideId);
    socket.emit('ride:sync', rideId);
  } else {
    console.warn('⚠️ [SOCKET] Cannot sync ride status: Socket not connected.');
  }
}
