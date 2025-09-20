interface DiagnosticInfo {
  timestamp: string;
  environment: {
    nodeEnv?: string;
    isServer: boolean;
  };
  stripe: {
    hasSecretKey: boolean;
    secretKeyFormat: boolean;
    hasWebhookSecret: boolean;
    webhookSecretFormat: boolean;
  };
  email: {
    hasResendKey: boolean;
    keyFormat: boolean;
    isServer: boolean;
    environment?: string;
  };
  recommendations: string[];
}

export async function GET(req: Request) {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    console.log('🔍 === DIAGNOSTIC WEBHOOK ===');
    
    // Vérifier les variables d'environnement
    const resendKey = process.env.RESEND_API_KEY;
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const nodeEnv = process.env.NODE_ENV;
    
    const diagnostics: DiagnosticInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv,
        isServer: typeof window === 'undefined'
      },
      stripe: {
        hasSecretKey: !!stripeSecret,
        secretKeyFormat: stripeSecret?.startsWith('sk_') || false,
        hasWebhookSecret: !!webhookSecret,
        webhookSecretFormat: webhookSecret?.startsWith('whsec_') || false
      },
      email: {
        hasResendKey: !!resendKey,
        keyFormat: resendKey?.startsWith('re_') || false,
        isServer: typeof window === 'undefined',
        environment: nodeEnv
      },
      recommendations: []
    };

    // Générer des recommandations
    if (!diagnostics.email.hasResendKey) {
      diagnostics.recommendations.push('❌ Ajouter RESEND_API_KEY dans .env.local');
    }
    if (!diagnostics.email.keyFormat) {
      diagnostics.recommendations.push('❌ Vérifier le format de RESEND_API_KEY (doit commencer par "re_")');
    }
    if (!diagnostics.stripe.hasSecretKey) {
      diagnostics.recommendations.push('❌ Ajouter STRIPE_SECRET_KEY dans .env.local');
    }
    if (!diagnostics.stripe.hasWebhookSecret) {
      diagnostics.recommendations.push('❌ Ajouter STRIPE_WEBHOOK_SECRET dans .env.local');
    }
    if (diagnostics.recommendations.length === 0) {
      diagnostics.recommendations.push('✅ Configuration semble correcte');
    }

    console.log('📋 Diagnostic complet:', diagnostics);

    return new Response(JSON.stringify(diagnostics), { status: 200 });

  } catch (error) {
    console.error('❌ Erreur diagnostic:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined
    }), { status: 500 });
  }
}
