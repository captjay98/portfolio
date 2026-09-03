const generateSessionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  
  // Use modern APIs for browser info, with fallbacks
  const browserInfo = [
    navigator.userAgent.substring(0, 32),
    navigator.language,
    navigator.hardwareConcurrency || '',
    window.screen.width + 'x' + window.screen.height
  ].join('-');
  
  const hash = btoa(`${browserInfo}-${timestamp}-${random}`).replace(/[/+=]/g, '');
  return hash.substring(0, 32);
};

export const getOrCreateSessionId = (): string => {
  const existingSessionId = localStorage.getItem("visitor_session_id");
  if (existingSessionId) {
    return existingSessionId;
  }
  
  const newSessionId = generateSessionId();
  localStorage.setItem("visitor_session_id", newSessionId);
  return newSessionId;
};
