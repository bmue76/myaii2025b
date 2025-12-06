// mobile/src/services/heygenStreaming.ts
// HeyGen Streaming API + LiveKit – Service-Layer für den Avatar-Tab

const API_BASE_URL =
  process.env.EXPO_PUBLIC_HEYGEN_API_BASE_URL ?? 'https://api.heygen.com';

const API_KEY =
  process.env.EXPO_PUBLIC_HEYGEN_API_KEY ??
  // Dev-Fallback: nur für lokalen PoC, später entfernen!
  (__DEV__
    ? 'MWMwNjhhOTE0YTI3NDgyNDkyNDZjNTM4MTUxNjdkZjYtMTc1NDIzNzAwOQ=='
    : undefined);

const DEFAULT_AVATAR_ID =
  process.env.EXPO_PUBLIC_HEYGEN_DEFAULT_AVATAR_ID ?? '';
const DEFAULT_QUALITY =
  process.env.EXPO_PUBLIC_HEYGEN_AVATAR_QUALITY ?? 'high';
const KNOWLEDGE_BASE_ID = process.env.EXPO_PUBLIC_HEYGEN_KNOWLEDGE_BASE_ID;

export interface HeygenSession {
  sessionId: string;
  sessionToken: string;
  livekitUrl: string;
  livekitToken: string;
}

/**
 * Prüft, ob HeyGen (API-Key) verfügbar ist.
 * Loggt zusätzlich einen kleinen Debug-Hinweis in die Konsole.
 */
export function isHeygenConfigured(): boolean {
  const configured = Boolean(API_KEY);
  if (!configured) {
    console.warn('[HeyGen] API-Key nicht gefunden. process.env.EXPO_PUBLIC_HEYGEN_API_KEY =', process.env.EXPO_PUBLIC_HEYGEN_API_KEY
      ? `(Länge: ${String(process.env.EXPO_PUBLIC_HEYGEN_API_KEY.length)})`
      : 'undefined');
  } else {
    console.log('[HeyGen] API-Key konfiguriert (Länge):', String(API_KEY?.length));
  }
  return configured;
}

async function createSessionToken(): Promise<string> {
  if (!API_KEY) {
    throw new Error(
      'HEYGEN_API_KEY ist nicht gesetzt (EXPO_PUBLIC_HEYGEN_API_KEY).'
    );
  }

  const res = await fetch(`${API_BASE_URL}/v1/streaming.create_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // laut offizieller Streaming-API: X-Api-Key
      'X-Api-Key': API_KEY,
    },
  });

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    console.warn('[HeyGen] create_token: invalid JSON', text);
    throw new Error('create_token: Ungültige JSON-Antwort.');
  }

  if (!res.ok) {
    console.warn('[HeyGen] create_token failed', res.status, json);
    const msg =
      json?.message || json?.error || `create_token fehlgeschlagen (${res.status})`;
    throw new Error(msg);
  }

  const token =
    json?.data?.token ?? json?.data?.session_token ?? json?.token ?? null;

  if (!token) {
    console.warn('[HeyGen] create_token response', json);
    throw new Error('create_token: Kein Token in der Antwort gefunden.');
  }

  return token as string;
}

interface NewSessionOptions {
  avatarId?: string;
}

async function createNewSession(
  sessionToken: string,
  options: NewSessionOptions = {}
): Promise<HeygenSession> {
  const avatarId = options.avatarId ?? DEFAULT_AVATAR_ID;

  const body: any = {
    quality: DEFAULT_QUALITY,
    version: 'v2',
    video_encoding: 'H264',
  };

  // je nach Account-Konfiguration wird avatar_name oder avatar_id verwendet
  if (avatarId) {
    body.avatar_name = avatarId;
  }

  if (KNOWLEDGE_BASE_ID) {
    body.knowledge_base = {
      id: KNOWLEDGE_BASE_ID,
    };
  }

  const res = await fetch(`${API_BASE_URL}/v1/streaming.new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    console.warn('[HeyGen] streaming.new: invalid JSON', text);
    throw new Error('streaming.new: Ungültige JSON-Antwort.');
  }

  if (!res.ok) {
    console.warn('[HeyGen] streaming.new failed', res.status, json);
    const msg =
      json?.message ||
      json?.error ||
      `streaming.new fehlgeschlagen (${res.status})`;
    throw new Error(msg);
  }

  const data = json?.data ?? json;

  const sessionId: string | undefined = data?.session_id;
  const livekitUrl: string | undefined = data?.url;
  const livekitToken: string | undefined = data?.access_token;

  if (!sessionId || !livekitUrl || !livekitToken) {
    console.warn('[HeyGen] streaming.new missing fields', data);
    throw new Error(
      'streaming.new: session_id, url oder access_token fehlen in der Antwort.'
    );
  }

  return {
    sessionId,
    sessionToken,
    livekitUrl,
    livekitToken,
  };
}

async function startStreamingSession(session: HeygenSession): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/v1/streaming.start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.sessionToken}`,
    },
    body: JSON.stringify({
      session_id: session.sessionId,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    console.warn('[HeyGen] streaming.start failed', res.status, text);
    throw new Error(`streaming.start fehlgeschlagen (${res.status})`);
  }
}

/**
 * Öffentlicher Einstieg: Avatar-Session starten.
 * 1) streaming.create_token
 * 2) streaming.new
 * 3) streaming.start
 * → Session + LiveKit-Daten zurück
 */
export async function startAvatarSession(
  options?: NewSessionOptions
): Promise<HeygenSession> {
  console.log('[HeyGen] startAvatarSession – API_BASE_URL:', API_BASE_URL);
  const sessionToken = await createSessionToken();
  const session = await createNewSession(sessionToken, options);
  await startStreamingSession(session);
  return session;
}

/**
 * Text an den Avatar schicken (spricht dann per TTS).
 */
export async function sendTextToAvatar(
  session: HeygenSession,
  text: string,
  taskType: 'talk' | 'repeat' = 'talk'
): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;

  const res = await fetch(`${API_BASE_URL}/v1/streaming.task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.sessionToken}`,
    },
    body: JSON.stringify({
      session_id: session.sessionId,
      text: trimmed,
      task_type: taskType,
    }),
  });

  const bodyText = await res.text();
  if (!res.ok) {
    console.warn('[HeyGen] streaming.task failed', res.status, bodyText);
    throw new Error(`streaming.task fehlgeschlagen (${res.status})`);
  }
}

/**
 * Session beenden – Ressourcen aufräumen.
 */
export async function stopAvatarSession(
  session: HeygenSession
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/v1/streaming.stop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.sessionToken}`,
    },
    body: JSON.stringify({
      session_id: session.sessionId,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    // Kein harter Fehler – wir loggen nur.
    console.warn('[HeyGen] streaming.stop failed', res.status, text);
  }
}
