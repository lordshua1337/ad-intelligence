type WebhookPayload = {
  readonly event: string;
  readonly timestamp: string;
  readonly data: Record<string, unknown>;
};

type WebhookConnection = {
  readonly url: string;
  readonly secret?: string;
};

function parseWebhookConnections(): readonly WebhookConnection[] {
  const raw = process.env.WEBHOOK_CONNECTIONS;
  if (!raw || raw === "{}") {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.values(parsed).filter(
      (v): v is WebhookConnection =>
        typeof v === "object" && v !== null && "url" in v && typeof (v as WebhookConnection).url === "string"
    );
  } catch {
    console.error("[webhook] Failed to parse WEBHOOK_CONNECTIONS env var");
    return [];
  }
}

async function sendToWebhook(
  connection: WebhookConnection,
  payload: WebhookPayload
): Promise<void> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (connection.secret) {
    headers["X-Webhook-Secret"] = connection.secret;
  }

  const response = await fetch(connection.url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `Webhook to ${connection.url} failed with status ${response.status}`
    );
  }
}

export async function sendAdIntelWebhook(
  event: string,
  data: Record<string, unknown>
): Promise<void> {
  const connections = parseWebhookConnections();

  if (connections.length === 0) {
    return;
  }

  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    data,
  };

  const results = await Promise.allSettled(
    connections.map((connection) => sendToWebhook(connection, payload))
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `[webhook] Failed to send to connection ${index}:`,
        result.reason
      );
    }
  });
}
