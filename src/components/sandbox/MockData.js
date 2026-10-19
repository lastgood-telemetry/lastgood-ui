// Real change data from our own production (2026-10-12, 17:49-19:30 UTC),
// anonymized: service and author names are changed and file paths generalized.
// Scores, ranking, reasons, correlations and the overall assessment are the real
// scoring engine's output on this data, computed offline with the same engine the
// console runs. The alert itself was fired during a live test of alert ingestion;
// every change event around it is real production activity.

export const initialMockServices = [
  {
    "id": "svc_1",
    "name": "storefront-web",
    "status": "active",
    "eventCount": 259,
    "lastActive": "2026-10-19T06:30:34Z",
    "apiKeyId": "key_storefront",
    "apiKeyValue": "lg_live_stfr_8f92j3n4v...",
    "apiKeyLastUsed": "2026-10-19T06:30:34Z"
  },
  {
    "id": "svc_2",
    "name": "checkout-api",
    "status": "active",
    "eventCount": 211,
    "lastActive": "2026-10-19T06:26:52Z",
    "apiKeyId": "key_checkout",
    "apiKeyValue": "lg_live_chkt_8f92j3n4v...",
    "apiKeyLastUsed": "2026-10-19T06:26:52Z"
  },
  {
    "id": "svc_3",
    "name": "marketing-site",
    "status": "active",
    "eventCount": 112,
    "lastActive": "2026-10-19T06:29:36Z",
    "apiKeyId": "key_marketing",
    "apiKeyValue": "lg_live_mktg_8f92j3n4v...",
    "apiKeyLastUsed": "2026-10-19T06:29:36Z"
  },
  {
    "id": "svc_4",
    "name": "orders-db",
    "status": "active",
    "eventCount": 5,
    "lastActive": "2026-10-14T19:05:05Z",
    "apiKeyId": "key_orders",
    "apiKeyValue": "lg_live_ordr_8f92j3n4v...",
    "apiKeyLastUsed": "2026-10-14T19:05:05Z"
  }
];

export const mockIncident = {
  "id": "INC-2026-10-12",
  "title": "High error-rate alert: orders-db",
  "service": "orders-db",
  "environment": "production",
  "status": "investigating",
  "startedAt": "2026-10-12T19:30:18.918Z",
  "severity": "critical"
};

export const mockTimelineEvents = [
  {
    "id": "evt_1",
    "timestamp": "2026-10-12T17:49:52.000Z",
    "type": "deployment",
    "source": "GitHub",
    "title": "Document the Chat integration as change context, not another alert bot",
    "author": "dev-1",
    "description": "This deployment to marketing-site (prod) scores 24/100 (low). Largest factor: Deployment with 2 code file(s). It is unlikely to be the primary cause.",
    "riskScore": 24,
    "riskRationale": "Deployment with 2 code file(s)",
    "isRootCauseCandidate": false,
    "color": "purple"
  },
  {
    "id": "evt_2",
    "timestamp": "2026-10-12T18:23:35.000Z",
    "type": "deployment",
    "source": "GitHub",
    "title": "Rewind: honor window, highlight and run deep-link params (Chat alert landing)",
    "author": "dev-1",
    "description": "This deployment to storefront-web (prod) scores 42/100 (medium). Largest factor: Storefront-web is set to critical. It may have contributed.",
    "riskScore": 42,
    "riskRationale": "Storefront-web is set to critical",
    "isRootCauseCandidate": false,
    "color": "purple"
  },
  {
    "id": "evt_3",
    "timestamp": "2026-10-12T18:23:46.000Z",
    "type": "deployment",
    "source": "GitHub",
    "title": "Demo: align shell with the console",
    "author": "dev-1",
    "description": "This deployment to storefront-web (prod) scores 43/100 (medium). Largest factor: Storefront-web is set to critical. It may have contributed.",
    "riskScore": 43,
    "riskRationale": "Storefront-web is set to critical",
    "isRootCauseCandidate": false,
    "color": "purple"
  },
  {
    "id": "evt_4",
    "timestamp": "2026-10-12T18:46:28.000Z",
    "type": "deployment",
    "source": "GitHub",
    "title": "Alert ingestion: generic + monitoring webhooks, incident lifecycle",
    "author": "dev-1",
    "description": "This deployment to checkout-api (prod) scores 52/100 (medium). Largest factor: Deployment that touches migration files (a migration file), sensitive files touched (a webhook routes file). It may have contributed.",
    "riskScore": 52,
    "riskRationale": "Deployment that touches migration files (a migration file), sensitive files touched (a webhook routes file)",
    "isRootCauseCandidate": false,
    "color": "purple"
  },
  {
    "id": "evt_5",
    "timestamp": "2026-10-12T18:48:57.000Z",
    "type": "migration",
    "source": "CI pipeline",
    "title": "Database migrations executed successfully for orders-db",
    "author": "dev-1",
    "description": "This migration to orders-db (prod) scores 65/100 (high). Largest factor: Migration that touches migration files (a migration file), sensitive files touched (a webhook routes file). Investigate it as a primary suspect.",
    "riskScore": 65,
    "riskRationale": "Migration that touches migration files (a migration file), sensitive files touched (a webhook routes file)",
    "isRootCauseCandidate": false,
    "color": "amber"
  },
  {
    "id": "evt_6",
    "timestamp": "2026-10-12T18:57:20.000Z",
    "type": "deployment",
    "source": "GitHub",
    "title": "Chat incident cards: OAuth install, one card per incident, noise rules",
    "author": "dev-1",
    "description": "This deployment to checkout-api (prod) scores 58/100 (medium). Largest factor: Deployment that touches migration files (an env example file, a migration file), touches 2 config/infra file(s), sensitive files touched (a Chat routes file, an encryption utility file). It may have contributed.",
    "riskScore": 58,
    "riskRationale": "Deployment that touches migration files (an env example file, a migration file), touches 2 config/infra file(s), sensitive files touched (a Chat routes file, an encryption utility file)",
    "isRootCauseCandidate": false,
    "color": "purple"
  },
  {
    "id": "evt_7",
    "timestamp": "2026-10-12T18:59:51.000Z",
    "type": "migration",
    "source": "CI pipeline",
    "title": "Database migrations executed successfully for orders-db",
    "author": "dev-1",
    "description": "This migration to orders-db (prod) scores 71/100 (high). Largest factor: Migration that touches migration files (an env example file, a migration file), touches 2 config/infra file(s), sensitive files touched (a Chat routes file, an encryption utility file). Investigate it as a primary suspect.",
    "riskScore": 71,
    "riskRationale": "Migration that touches migration files (an env example file, a migration file), touches 2 config/infra file(s), sensitive files touched (a Chat routes file, an encryption utility file)",
    "isRootCauseCandidate": true,
    "color": "amber"
  },
  {
    "id": "evt_8",
    "timestamp": "2026-10-12T19:02:40.000Z",
    "type": "deployment",
    "source": "GitHub",
    "title": "Redact secret credential fields from integration responses; Chat only via OAuth",
    "author": "dev-1",
    "description": "This deployment to checkout-api (prod) scores 42/100 (medium). Largest factor: Checkout-api is set to critical. It may have contributed.",
    "riskScore": 42,
    "riskRationale": "Checkout-api is set to critical",
    "isRootCauseCandidate": false,
    "color": "purple"
  },
  {
    "id": "evt_9",
    "timestamp": "2026-10-12T19:24:39.000Z",
    "type": "deployment",
    "source": "GitHub",
    "title": "Console: Chat notifications page (connect, channel picker, OAuth return states)",
    "author": "dev-1",
    "description": "This deployment to storefront-web (prod) scores 67/100 (high). Largest factor: Changed 2 min before the incident. Investigate it as a primary suspect.",
    "riskScore": 67,
    "riskRationale": "Changed 2 min before the incident",
    "isRootCauseCandidate": false,
    "color": "purple"
  },
  {
    "id": "evt_alert",
    "timestamp": "2026-10-12T19:30:18.918Z",
    "type": "alert",
    "source": "Alert webhook",
    "title": "High error-rate alert on orders-db",
    "author": "alert-monitor",
    "description": "A sev1 error-rate alert fired from the connected alert webhook on orders-db (production).",
    "riskScore": 100,
    "riskRationale": "Alert marker: this is the incident the window is built around, not a change candidate.",
    "isRootCauseCandidate": false,
    "color": "red"
  }
];

export const sandboxScoring = {
  "individual_scores": [
    {
      "role": "primary",
      "event": {
        "summary": "Database migrations executed successfully for orders-db",
        "type": "migration",
        "occurred_at": "2026-10-12T18:59:51.000Z",
        "service": "orders-db",
        "environment": "prod",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 71,
        "level": "high",
        "explanation": "This migration to orders-db (prod) scores 71/100 (high). Largest factor: Migration that touches migration files (an env example file, a migration file), touches 2 config/infra file(s), sensitive files touched (a Chat routes file, an encryption utility file). Investigate it as a primary suspect.",
        "reasons": [
          "Migration that touches migration files (an env example file, a migration file), touches 2 config/infra file(s), sensitive files touched (a Chat routes file, an encryption utility file)",
          "Same service as the incident (orders-db)",
          "Orders-db is set to critical",
          "Changed 30 min before the incident",
          "3 service(s) depend on orders-db (directly or not): checkout-api, storefront-web, admin-panel; 3 services changed within 10 min"
        ],
        "recommendations": [
          "CAUTION: DB migration on orders-db: verify rollback script safety before executing.",
          "Inspect active DB locks: SELECT pid, query, age(clock_timestamp(), query_start) FROM pg_stat_activity WHERE state != 'idle';"
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 49,
            "weight": 0.3,
            "contribution": 14.7,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "30 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 100,
            "weight": 0.25,
            "contribution": 25,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"migration\" base 85",
              "touches migration files (a migration file): at least 90",
              "touches 2 config/infra file(s): +15",
              "sensitive files touched (a Chat routes file, an encryption utility file): +10",
              "6 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "Change to the service that is failing",
            "evidence": [
              "same service: orders-db"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "orders-db is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 85,
            "weight": 0.05,
            "contribution": 4.3,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "3 service(s) depend on orders-db (directly or not): checkout-api, storefront-web, admin-panel",
              "3 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 11,
          "categories": {
            "config": 2,
            "migration": 1,
            "docs": 1,
            "code": 6,
            "test": 1
          },
          "risky_files": [
            "file",
            "file",
            "file"
          ],
          "sensitive_files": [
            "file",
            "file"
          ],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "contributing",
      "event": {
        "summary": "Console: Chat notifications page (connect, channel picker, OAuth return states)",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:24:39.000Z",
        "service": "storefront-web",
        "environment": "prod",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 67,
        "level": "high",
        "explanation": "This deployment to storefront-web (prod) scores 67/100 (high). Largest factor: Changed 2 min before the incident. Investigate it as a primary suspect.",
        "reasons": [
          "Changed 2 min before the incident",
          "Storefront-web is set to critical",
          "Deployment with 7 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))"
        ],
        "recommendations": [
          "Consider rolling back 'storefront-web' to the release before commit 9b066d0.",
          "Alert change author: @dev-1"
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 94,
            "weight": 0.3,
            "contribution": 28.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "2 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "7 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 8,
          "categories": {
            "code": 7,
            "test": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "contributing",
      "event": {
        "summary": "Database migrations executed successfully for orders-db",
        "type": "migration",
        "occurred_at": "2026-10-12T18:48:57.000Z",
        "service": "orders-db",
        "environment": "prod",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 65,
        "level": "high",
        "explanation": "This migration to orders-db (prod) scores 65/100 (high). Largest factor: Migration that touches migration files (a migration file), sensitive files touched (a webhook routes file). Investigate it as a primary suspect.",
        "reasons": [
          "Migration that touches migration files (a migration file), sensitive files touched (a webhook routes file)",
          "Same service as the incident (orders-db)",
          "Orders-db is set to critical",
          "Changed 41 min before the incident",
          "3 service(s) depend on orders-db (directly or not): checkout-api, storefront-web, admin-panel; 3 services changed within 10 min"
        ],
        "recommendations": [
          "CAUTION: DB migration on orders-db: verify rollback script safety before executing.",
          "Inspect active DB locks: SELECT pid, query, age(clock_timestamp(), query_start) FROM pg_stat_activity WHERE state != 'idle';"
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 38,
            "weight": 0.3,
            "contribution": 11.4,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "41 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 95,
            "weight": 0.25,
            "contribution": 23.8,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"migration\" base 85",
              "touches migration files (a migration file): at least 90",
              "sensitive files touched (a webhook routes file): +5",
              "9 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "Change to the service that is failing",
            "evidence": [
              "same service: orders-db"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "orders-db is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 85,
            "weight": 0.05,
            "contribution": 4.3,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "3 service(s) depend on orders-db (directly or not): checkout-api, storefront-web, admin-panel",
              "3 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 12,
          "categories": {
            "migration": 1,
            "docs": 1,
            "code": 9,
            "test": 1
          },
          "risky_files": [
            "file"
          ],
          "sensitive_files": [
            "file"
          ],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "contributing",
      "event": {
        "summary": "Chat incident cards: OAuth install, one card per incident, noise rules",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:57:20.000Z",
        "service": "checkout-api",
        "environment": "prod",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 58,
        "level": "medium",
        "explanation": "This deployment to checkout-api (prod) scores 58/100 (medium). Largest factor: Deployment that touches migration files (an env example file, a migration file), touches 2 config/infra file(s), sensitive files touched (a Chat routes file, an encryption utility file). It may have contributed.",
        "reasons": [
          "Deployment that touches migration files (an env example file, a migration file), touches 2 config/infra file(s), sensitive files touched (a Chat routes file, an encryption utility file)",
          "Checkout-api is set to critical",
          "Changed 33 min before the incident",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 3 services changed within 10 min"
        ],
        "recommendations": [
          "Check the diff of commit 09cb4a7 on 'checkout-api' before deciding on a rollback.",
          "Alert change author: @dev-1"
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 47,
            "weight": 0.3,
            "contribution": 14.1,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "33 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 100,
            "weight": 0.25,
            "contribution": 25,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "touches migration files (a migration file): at least 90",
              "touches 2 config/infra file(s): +15",
              "sensitive files touched (a Chat routes file, an encryption utility file): +10",
              "6 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "3 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 11,
          "categories": {
            "config": 2,
            "migration": 1,
            "docs": 1,
            "code": 6,
            "test": 1
          },
          "risky_files": [
            "file",
            "file",
            "file"
          ],
          "sensitive_files": [
            "file",
            "file"
          ],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "contributing",
      "event": {
        "summary": "Alert ingestion: generic + monitoring webhooks, incident lifecycle",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:46:28.000Z",
        "service": "checkout-api",
        "environment": "prod",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 52,
        "level": "medium",
        "explanation": "This deployment to checkout-api (prod) scores 52/100 (medium). Largest factor: Deployment that touches migration files (a migration file), sensitive files touched (a webhook routes file). It may have contributed.",
        "reasons": [
          "Deployment that touches migration files (a migration file), sensitive files touched (a webhook routes file)",
          "Checkout-api is set to critical",
          "Changed 44 min before the incident",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 3 services changed within 10 min"
        ],
        "recommendations": [
          "Check the diff of commit d47d8e6 on 'checkout-api' before deciding on a rollback.",
          "Alert change author: @dev-1"
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 36,
            "weight": 0.3,
            "contribution": 10.8,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "44 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 95,
            "weight": 0.25,
            "contribution": 23.8,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "touches migration files (a migration file): at least 90",
              "sensitive files touched (a webhook routes file): +5",
              "9 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "3 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 12,
          "categories": {
            "migration": 1,
            "docs": 1,
            "code": 9,
            "test": 1
          },
          "risky_files": [
            "file"
          ],
          "sensitive_files": [
            "file"
          ],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "contributing",
      "event": {
        "summary": "Demo: align shell with the console",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:23:46.000Z",
        "service": "storefront-web",
        "environment": "prod",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 43,
        "level": "medium",
        "explanation": "This deployment to storefront-web (prod) scores 43/100 (medium). Largest factor: Storefront-web is set to critical. It may have contributed.",
        "reasons": [
          "Storefront-web is set to critical",
          "Changed 24 min before the incident",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "3 services changed within 10 min"
        ],
        "recommendations": [
          "Check the diff of commit eedef59 on 'storefront-web' before deciding on a rollback.",
          "Alert change author: @dev-1"
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 58,
            "weight": 0.3,
            "contribution": 17.4,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "24 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 35,
            "weight": 0.05,
            "contribution": 1.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web",
              "3 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "contributing",
      "event": {
        "summary": "Redact secret credential fields from integration responses; Chat only via OAuth",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:02:40.000Z",
        "service": "checkout-api",
        "environment": "prod",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 42,
        "level": "medium",
        "explanation": "This deployment to checkout-api (prod) scores 42/100 (medium). Largest factor: Checkout-api is set to critical. It may have contributed.",
        "reasons": [
          "Checkout-api is set to critical",
          "Changed 28 min before the incident",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 3 services changed within 10 min"
        ],
        "recommendations": [
          "Check the diff of commit 549c338 on 'checkout-api' before deciding on a rollback.",
          "Alert change author: @dev-1"
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 53,
            "weight": 0.3,
            "contribution": 15.9,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "28 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "3 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "contributing",
      "event": {
        "summary": "Rewind: honor window, highlight and run deep-link params (Chat alert landing)",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:23:35.000Z",
        "service": "storefront-web",
        "environment": "prod",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 42,
        "level": "medium",
        "explanation": "This deployment to storefront-web (prod) scores 42/100 (medium). Largest factor: Storefront-web is set to critical. It may have contributed.",
        "reasons": [
          "Storefront-web is set to critical",
          "Changed 24 min before the incident",
          "Deployment with 3 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "3 services changed within 10 min"
        ],
        "recommendations": [
          "Check the diff of commit 3728ca3 on 'storefront-web' before deciding on a rollback.",
          "Alert change author: @dev-1"
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 57,
            "weight": 0.3,
            "contribution": 17.1,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "24 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "3 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 35,
            "weight": 0.05,
            "contribution": 1.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web",
              "3 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 4,
          "categories": {
            "code": 3,
            "test": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Document the Chat integration as change context, not another alert bot",
        "type": "deployment",
        "occurred_at": "2026-10-12T17:49:52.000Z",
        "service": "marketing-site",
        "environment": "prod",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 24,
        "level": "low",
        "explanation": "This deployment to marketing-site (prod) scores 24/100 (low). Largest factor: Deployment with 2 code file(s). It is unlikely to be the primary cause.",
        "reasons": [
          "Deployment with 2 code file(s)",
          "Marketing-site is set to medium",
          "Changed 48 min before the incident",
          "Different service from orders-db; topology unknown for marketing-site (add dependencies in Topology (or lastgood.yml) to sharpen this)",
          "3 services changed within 10 min",
          "Older change: score reduced because it is far from the incident"
        ],
        "recommendations": [
          "Check the diff of commit 2206c26 on 'marketing-site' before deciding on a rollback.",
          "Alert change author: @dev-1"
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 33,
            "weight": 0.3,
            "contribution": 9.9,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "48 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "2 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Different service from orders-db; topology unknown for marketing-site",
            "evidence": [
              "add dependencies in Topology (or lastgood.yml) to sharpen this"
            ]
          },
          {
            "name": "Service criticality",
            "score": 50,
            "weight": 0.2,
            "contribution": 10,
            "description": "marketing-site is set to medium",
            "evidence": [
              "explicit setting: medium"
            ]
          },
          {
            "name": "Blast radius",
            "score": 35,
            "weight": 0.05,
            "contribution": 1.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of marketing-site",
              "3 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 3,
          "categories": {
            "code": 2,
            "test": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Fix incidentTimestamp to use local timezone",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:27:38.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 13,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 13/100 (low). Largest factor: Changed 3 min before the incident. It is unlikely to be the primary cause.",
        "reasons": [
          "Changed 3 min before the incident",
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 94,
            "weight": 0.3,
            "contribution": 28.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "3 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Sidebar label: Notifications",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:22:44.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 12,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 12/100 (low). Largest factor: Changed 8 min before the incident. It is unlikely to be the primary cause.",
        "reasons": [
          "Changed 8 min before the incident",
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 84,
            "weight": 0.3,
            "contribution": 25.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "8 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Page title: Notifications",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:22:16.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 12,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 12/100 (low). Largest factor: Changed 8 min before the incident. It is unlikely to be the primary cause.",
        "reasons": [
          "Changed 8 min before the incident",
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 83,
            "weight": 0.3,
            "contribution": 24.9,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "8 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Route /notifications",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:20:06.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 11,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 11/100 (low). Largest factor: Changed 10 min before the incident. It is unlikely to be the primary cause.",
        "reasons": [
          "Changed 10 min before the incident",
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 79,
            "weight": 0.3,
            "contribution": 23.7,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "10 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Sidebar: Integrations entry under Workspace",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:19:54.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 11,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 11/100 (low). Largest factor: Changed 10 min before the incident. It is unlikely to be the primary cause.",
        "reasons": [
          "Changed 10 min before the incident",
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 79,
            "weight": 0.3,
            "contribution": 23.7,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "10 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add Notifications page",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:19:43.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 11,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 11/100 (low). Largest factor: Changed 11 min before the incident. It is unlikely to be the primary cause.",
        "reasons": [
          "Changed 11 min before the incident",
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 78,
            "weight": 0.3,
            "contribution": 23.4,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "11 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat panel as standalone Integrations page",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:19:32.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 11,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 11/100 (low). Largest factor: Changed 11 min before the incident. It is unlikely to be the primary cause.",
        "reasons": [
          "Changed 11 min before the incident",
          "Storefront-web is set to critical",
          "Deployment change; file list unavailable, so content was not checked",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 78,
            "weight": 0.3,
            "contribution": 23.4,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "11 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type only",
            "evidence": [
              "type \"deployment\" base 60",
              "no file list on this event, so content could not be checked"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "unknown",
          "files_total": 0,
          "categories": {},
          "risky_files": [],
          "sensitive_files": [],
          "source": "none"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Move Chat out of Ingestion Channels; forward OAuth return to /notifications",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:19:21.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 11,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 11/100 (low). Largest factor: Changed 11 min before the incident. It is unlikely to be the primary cause.",
        "reasons": [
          "Changed 11 min before the incident",
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 78,
            "weight": 0.3,
            "contribution": 23.4,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "11 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat panel as standalone Integrations page",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:18:53.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 11,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 11/100 (low). Largest factor: Changed 11 min before the incident. It is unlikely to be the primary cause.",
        "reasons": [
          "Changed 11 min before the incident",
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 77,
            "weight": 0.3,
            "contribution": 23.1,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "11 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat P1: add a migration file",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:55:20.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 11,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 11/100 (low). Largest factor: Deployment that touches migration files (a migration file). It is unlikely to be the primary cause.",
        "reasons": [
          "Deployment that touches migration files (a migration file)",
          "Checkout-api is set to critical",
          "Changed 35 min before the incident",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 45,
            "weight": 0.3,
            "contribution": 13.5,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "35 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 90,
            "weight": 0.25,
            "contribution": 22.5,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "touches migration files (a migration file): at least 90"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "migration": 1
          },
          "risky_files": [
            "file"
          ],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Revert \"Chat incident cards: OAuth install, one card per incident, noise rul…\"",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:50:52.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 11,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 11/100 (low). Largest factor: Deployment that touches migration files (a config file, an env example file), touches 2 config/infra file(s), sensitive files touched (a Chat routes file, an encryption utility file). It is unlikely to be the primary cause.",
        "reasons": [
          "Deployment that touches migration files (a config file, an env example file), touches 2 config/infra file(s), sensitive files touched (a Chat routes file, an encryption utility file)",
          "Checkout-api is set to critical",
          "Changed 39 min before the incident",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 3 services changed within 10 min",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 40,
            "weight": 0.3,
            "contribution": 12,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "39 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 100,
            "weight": 0.25,
            "contribution": 25,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "touches migration files (a migration file): at least 90",
              "touches 2 config/infra file(s): +15",
              "sensitive files touched (a Chat routes file, an encryption utility file): +10",
              "6 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "3 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 11,
          "categories": {
            "config": 2,
            "code": 6,
            "test": 1,
            "migration": 1,
            "docs": 1
          },
          "risky_files": [
            "file",
            "file",
            "file"
          ],
          "sensitive_files": [
            "file",
            "file"
          ],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat incident cards: OAuth install, one card per incident, noise rules",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:50:01.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 11,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 11/100 (low). Largest factor: Deployment that touches migration files (an env example file, a migration file), touches 2 config/infra file(s), sensitive files touched (a Chat routes file, an encryption utility file). It is unlikely to be the primary cause.",
        "reasons": [
          "Deployment that touches migration files (an env example file, a migration file), touches 2 config/infra file(s), sensitive files touched (a Chat routes file, an encryption utility file)",
          "Checkout-api is set to critical",
          "Changed 40 min before the incident",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 3 services changed within 10 min",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 39,
            "weight": 0.3,
            "contribution": 11.7,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "40 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 100,
            "weight": 0.25,
            "contribution": 25,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "touches migration files (a migration file): at least 90",
              "touches 2 config/infra file(s): +15",
              "sensitive files touched (a Chat routes file, an encryption utility file): +10",
              "6 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "3 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 11,
          "categories": {
            "config": 2,
            "migration": 1,
            "docs": 1,
            "code": 6,
            "test": 1
          },
          "risky_files": [
            "file",
            "file",
            "file"
          ],
          "sensitive_files": [
            "file",
            "file"
          ],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add ChatPanel component for Chat integration",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:16:05.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 10,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 10/100 (low). Largest factor: Changed 14 min before the incident. It is unlikely to be the primary cause.",
        "reasons": [
          "Changed 14 min before the incident",
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 72,
            "weight": 0.3,
            "contribution": 21.6,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "14 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat console: add src/util/chat.js",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:15:43.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 10,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 10/100 (low). Largest factor: Changed 15 min before the incident. It is unlikely to be the primary cause.",
        "reasons": [
          "Changed 15 min before the incident",
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 71,
            "weight": 0.3,
            "contribution": 21.3,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "15 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat console: add src/service/chat.js",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:15:32.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 10,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 10/100 (low). Largest factor: Changed 15 min before the incident. It is unlikely to be the primary cause.",
        "reasons": [
          "Changed 15 min before the incident",
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 71,
            "weight": 0.3,
            "contribution": 21.3,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "15 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add Chat integration and update channel logic",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:15:21.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 10,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 10/100 (low). Largest factor: Changed 15 min before the incident. It is unlikely to be the primary cause.",
        "reasons": [
          "Changed 15 min before the incident",
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 71,
            "weight": 0.3,
            "contribution": 21.3,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "15 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat P1: add an env example file",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:55:41.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 10,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 10/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment that touches 1 config/infra file(s)",
          "Changed 35 min before the incident",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 45,
            "weight": 0.3,
            "contribution": 13.5,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "35 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 75,
            "weight": 0.25,
            "contribution": 18.8,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "touches 1 config/infra file(s): +15"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "config": 1
          },
          "risky_files": [
            "file"
          ],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat P1: a config file",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:54:05.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 10,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 10/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment that touches 1 config/infra file(s)",
          "Changed 36 min before the incident",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 43,
            "weight": 0.3,
            "contribution": 12.9,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "36 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 75,
            "weight": 0.25,
            "contribution": 18.8,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "touches 1 config/infra file(s): +15"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "config": 1
          },
          "risky_files": [
            "file"
          ],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add notification_channels and notification_deliveries tables",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:07:12.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 10,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 10/100 (low). Largest factor: Deployment that touches migration files (a migration file). It is unlikely to be the primary cause.",
        "reasons": [
          "Deployment that touches migration files (a migration file)",
          "Checkout-api is set to critical",
          "Changed 83 min before the incident (risky change, still inside its 48h suspicion window)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 34,
            "weight": 0.3,
            "contribution": 10.2,
            "description": "Risky change keeps a slowly fading suspicion window (48h) because it can fail late",
            "evidence": [
              "83 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 90,
            "weight": 0.25,
            "contribution": 22.5,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "touches migration files (a migration file): at least 90"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "migration": 1
          },
          "risky_files": [
            "file"
          ],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Create incidents and alerts tables with policies",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:04:11.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 10,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 10/100 (low). Largest factor: Deployment that touches migration files (a migration file). It is unlikely to be the primary cause.",
        "reasons": [
          "Deployment that touches migration files (a migration file)",
          "Checkout-api is set to critical",
          "Changed 86 min before the incident (risky change, still inside its 48h suspicion window)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 34,
            "weight": 0.3,
            "contribution": 10.2,
            "description": "Risky change keeps a slowly fading suspicion window (48h) because it can fail late",
            "evidence": [
              "86 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 90,
            "weight": 0.25,
            "contribution": 22.5,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "touches migration files (a migration file): at least 90"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 60,
            "weight": 0.05,
            "contribution": 3,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "migration": 1
          },
          "risky_files": [
            "file"
          ],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Simplify incidentTimestamp state setup",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:32:26.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 9,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 9/100 (low). Largest factor: Storefront-web is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Storefront-web is set to critical",
          "Changed 2.1 min after the reported start",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 60,
            "weight": 0.3,
            "contribution": 18,
            "description": "Change is timestamped just after the reported incident start (clock skew allowance)",
            "evidence": [
              "2.1 min after the reported start"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add an env example file with Chat and encryption variables",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:09:06.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 9,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 9/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment that touches 1 config/infra file(s)",
          "Changed 81 min before the incident (risky change, still inside its 48h suspicion window)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 34,
            "weight": 0.3,
            "contribution": 10.2,
            "description": "Risky change keeps a slowly fading suspicion window (48h) because it can fail late",
            "evidence": [
              "81 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 75,
            "weight": 0.25,
            "contribution": 18.8,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "touches 1 config/infra file(s): +15"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "config": 1
          },
          "risky_files": [
            "file"
          ],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Config: Chat settings",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:08:12.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 9,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 9/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment that touches 1 config/infra file(s)",
          "Changed 82 min before the incident (risky change, still inside its 48h suspicion window)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 34,
            "weight": 0.3,
            "contribution": 10.2,
            "description": "Risky change keeps a slowly fading suspicion window (48h) because it can fail late",
            "evidence": [
              "82 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 75,
            "weight": 0.25,
            "contribution": 18.8,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "touches 1 config/infra file(s): +15"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "config": 1
          },
          "risky_files": [
            "file"
          ],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat P1: add a Chat routes file",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:55:09.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 8,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 8/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment that sensitive files touched (a Chat routes file)",
          "Changed 35 min before the incident",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 44,
            "weight": 0.3,
            "contribution": 13.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "35 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 65,
            "weight": 0.25,
            "contribution": 16.3,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "sensitive files touched (a Chat routes file): +5",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [
            "file"
          ],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat P1: add an encryption utility file",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:54:37.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 8,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 8/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment that sensitive files touched (an encryption utility file)",
          "Changed 36 min before the incident",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 44,
            "weight": 0.3,
            "contribution": 13.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "36 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 65,
            "weight": 0.25,
            "contribution": 16.3,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "sensitive files touched (an encryption utility file): +5",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [
            "file"
          ],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat P1: add services/NotificationService.ts",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:54:59.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 7,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 7/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Changed 35 min before the incident",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 44,
            "weight": 0.3,
            "contribution": 13.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "35 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat P1: add services/ChatClient.ts",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:54:47.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 7,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 7/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Changed 36 min before the incident",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 44,
            "weight": 0.3,
            "contribution": 13.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "36 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat P1: server.ts",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:53:53.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 7,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 7/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Changed 36 min before the incident",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 43,
            "weight": 0.3,
            "contribution": 12.9,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "36 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add new migration for notification tables",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:53:42.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 7,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 7/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Changed 37 min before the incident",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 43,
            "weight": 0.3,
            "contribution": 12.9,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "37 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Use production Rewind analysis and diagnosis split view in the demo",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:21:55.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 5,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 5/100 (low). Largest factor: Storefront-web is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Changed 68 min before the incident",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 21,
            "weight": 0.3,
            "contribution": 6.3,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "68 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 35,
            "weight": 0.05,
            "contribution": 1.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Rewind link: add window, highlight (top suspect) and run=1",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:17:10.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 5,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 5/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 73 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 18,
            "weight": 0.3,
            "contribution": 5.4,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "73 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Redact secret credential fields from integration responses; Chat only via OAuth",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:15:59.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 5,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 5/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 74 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 18,
            "weight": 0.3,
            "contribution": 5.4,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "74 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add Chat OAuth install and channel routes",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:08:01.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 5,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 5/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment that sensitive files touched (a Chat routes file)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 82 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 15,
            "weight": 0.3,
            "contribution": 4.5,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "82 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 65,
            "weight": 0.25,
            "contribution": 16.3,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "sensitive files touched (a Chat routes file): +5",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [
            "file"
          ],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add AES-256-GCM helper for integration secrets",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:07:25.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 5,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 5/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment that sensitive files touched (an encryption utility file)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 83 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 15,
            "weight": 0.3,
            "contribution": 4.5,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "83 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 65,
            "weight": 0.25,
            "contribution": 16.3,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "sensitive files touched (an encryption utility file): +5",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [
            "file"
          ],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Enhance SignalRow with highlighted prop for alerts",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:19:27.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 4/100 (low). Largest factor: Storefront-web is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Changed 71 min before the incident",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 19,
            "weight": 0.3,
            "contribution": 5.7,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "71 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 35,
            "weight": 0.05,
            "contribution": 1.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Rewind: apply deep-link window, autorun and highlight",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:18:03.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 4/100 (low). Largest factor: Storefront-web is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Changed 72 min before the incident",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 19,
            "weight": 0.3,
            "contribution": 5.7,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "72 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 35,
            "weight": 0.05,
            "contribution": 1.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Rewind: parse window, highlight and run deep-link params",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:17:51.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 4/100 (low). Largest factor: Storefront-web is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Changed 72 min before the incident",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 19,
            "weight": 0.3,
            "contribution": 5.7,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "72 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 35,
            "weight": 0.05,
            "contribution": 1.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Align demo shell with the console",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:14:58.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to storefront-web (dev) scores 4/100 (low). Largest factor: Storefront-web is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Storefront-web is set to critical",
          "Deployment with 1 code file(s)",
          "Changed 75 min before the incident",
          "Downstream of orders-db: it depends on the failing service (storefront-web -> checkout-api -> orders-db (2 hops))",
          "2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 18,
            "weight": 0.3,
            "contribution": 5.4,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "75 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 35,
            "weight": 0.05,
            "contribution": 1.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Start notification worker and register Chat routes",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:08:34.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 4/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 82 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 15,
            "weight": 0.3,
            "contribution": 4.5,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "82 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Register migration 023 in setup-db",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:08:22.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 4/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 82 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 15,
            "weight": 0.3,
            "contribution": 4.5,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "82 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add incident notification service (one card per incident)",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:07:47.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 4/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 83 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 15,
            "weight": 0.3,
            "contribution": 4.5,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "83 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add Chat Web API client",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:07:36.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 4/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 83 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 15,
            "weight": 0.3,
            "contribution": 4.5,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "83 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Register alert webhook and incident routes",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:06:28.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 4/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 84 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 14,
            "weight": 0.3,
            "contribution": 4.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "84 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Register migration 022 in setup-db",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:06:18.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 4/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 84 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 14,
            "weight": 0.3,
            "contribution": 4.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "84 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Worker: process alert jobs",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:06:06.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 4/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 84 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 14,
            "weight": 0.3,
            "contribution": 4.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "84 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Queue: add alert job type and enqueueAlert",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:05:33.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 4/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 85 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 14,
            "weight": 0.3,
            "contribution": 4.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "85 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add alert webhook and incident read routes",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:05:19.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 4/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment that sensitive files touched (a webhook routes file)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 85 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 14,
            "weight": 0.3,
            "contribution": 4.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "85 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 65,
            "weight": 0.25,
            "contribution": 16.3,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "sensitive files touched (a webhook routes file): +5",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [
            "file"
          ],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add alert grouping and incident lifecycle",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:05:08.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 4/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 85 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 14,
            "weight": 0.3,
            "contribution": 4.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "85 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add Incident model",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:04:58.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 4/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 85 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel; 2 services changed within 10 min",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 14,
            "weight": 0.3,
            "contribution": 4.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "85 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add incident lifecycle event hook",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:04:46.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 4/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 86 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 14,
            "weight": 0.3,
            "contribution": 4.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "86 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 60,
            "weight": 0.05,
            "contribution": 3,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add alert adapters (generic, monitoring) and severity helpers",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:04:32.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to checkout-api (dev) scores 4/100 (low). Largest factor: Checkout-api is set to critical. It is unlikely to be the primary cause.",
        "reasons": [
          "Checkout-api is set to critical",
          "Deployment with 1 code file(s)",
          "Downstream of orders-db: it depends on the failing service (checkout-api -> orders-db (1 hop))",
          "Changed 86 min before the incident",
          "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 14,
            "weight": 0.3,
            "contribution": 4.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "86 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 60,
            "weight": 0.05,
            "contribution": 3,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Style the Chat workflow in existing charcoal and mint system",
        "type": "deployment",
        "occurred_at": "2026-10-12T17:46:36.000Z",
        "service": "marketing-site",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 3,
        "level": "low",
        "explanation": "This deployment to marketing-site (dev) scores 3/100 (low). Largest factor: Deployment with 1 code file(s). It is unlikely to be the primary cause.",
        "reasons": [
          "Deployment with 1 code file(s)",
          "Marketing-site is set to medium",
          "Different service from orders-db; topology unknown for marketing-site (add dependencies in Topology (or lastgood.yml) to sharpen this)",
          "Changed 1.7 h before the incident",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 9,
            "weight": 0.3,
            "contribution": 2.7,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "1.7 h before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Different service from orders-db; topology unknown for marketing-site",
            "evidence": [
              "add dependencies in Topology (or lastgood.yml) to sharpen this"
            ]
          },
          {
            "name": "Service criticality",
            "score": 50,
            "weight": 0.2,
            "contribution": 10,
            "description": "marketing-site is set to medium",
            "evidence": [
              "explicit setting: medium"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of marketing-site"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add Chat change-context workflow and illustrative suspect card",
        "type": "deployment",
        "occurred_at": "2026-10-12T17:46:01.000Z",
        "service": "marketing-site",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 3,
        "level": "low",
        "explanation": "This deployment to marketing-site (dev) scores 3/100 (low). Largest factor: Deployment with 1 code file(s). It is unlikely to be the primary cause.",
        "reasons": [
          "Deployment with 1 code file(s)",
          "Marketing-site is set to medium",
          "Different service from orders-db; topology unknown for marketing-site (add dependencies in Topology (or lastgood.yml) to sharpen this)",
          "Changed 1.7 h before the incident",
          "Older change: score reduced because it is far from the incident",
          "Dev change during a prod incident: x0.2"
        ],
        "recommendations": [
          "Notice: change occurred in dev. Verify whether it was promoted to production before acting."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 9,
            "weight": 0.3,
            "contribution": 2.7,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "1.7 h before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 60,
            "weight": 0.25,
            "contribution": 15,
            "description": "Risk from change type and the files touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 code file(s)"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Different service from orders-db; topology unknown for marketing-site",
            "evidence": [
              "add dependencies in Topology (or lastgood.yml) to sharpen this"
            ]
          },
          {
            "name": "Service criticality",
            "score": 50,
            "weight": 0.2,
            "contribution": 10,
            "description": "marketing-site is set to medium",
            "evidence": [
              "explicit setting: medium"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of marketing-site"
            ]
          }
        ],
        "content": {
          "content_class": "mixed",
          "files_total": 1,
          "categories": {
            "code": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": false,
        "ruled_out_reason": null
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat console: add src/util/chat.test.js",
        "type": "deployment",
        "occurred_at": "2026-10-12T19:15:54.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 8,
        "level": "low",
        "explanation": "This deployment to storefront-web is ruled out as a suspect: tests-only change (1 file, no runtime code touched).",
        "reasons": [
          "Ruled out: tests-only change (1 file, no runtime code touched)"
        ],
        "recommendations": [
          "Ruled out: tests-only change (1 file, no runtime code touched). No action needed on this change."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 72,
            "weight": 0.3,
            "contribution": 21.6,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "14 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 15,
            "weight": 0.25,
            "contribution": 3.8,
            "description": "Tests and docs only; no runtime code touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 file(s), tests/docs only: scaled to 25%"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web"
            ]
          }
        ],
        "content": {
          "content_class": "tests-only",
          "files_total": 1,
          "categories": {
            "test": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": true,
        "ruled_out_reason": "tests-only change (1 file, no runtime code touched)"
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat P1: scripts/test-alert-logic.ts",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:54:18.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 6,
        "level": "low",
        "explanation": "This deployment to checkout-api is ruled out as a suspect: tests-only change (1 file, no runtime code touched).",
        "reasons": [
          "Ruled out: tests-only change (1 file, no runtime code touched)"
        ],
        "recommendations": [
          "Ruled out: tests-only change (1 file, no runtime code touched). No action needed on this change."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 44,
            "weight": 0.3,
            "contribution": 13.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "36 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 15,
            "weight": 0.25,
            "contribution": 3.8,
            "description": "Tests and docs only; no runtime code touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 file(s), tests/docs only: scaled to 25%"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "tests-only",
          "files_total": 1,
          "categories": {
            "test": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": true,
        "ruled_out_reason": "tests-only change (1 file, no runtime code touched)"
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Chat P1: add docs/chat-integration.md",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:55:31.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 5,
        "level": "low",
        "explanation": "This deployment to checkout-api is ruled out as a suspect: docs-only change (1 file, all documentation).",
        "reasons": [
          "Ruled out: docs-only change (1 file, all documentation)"
        ],
        "recommendations": [
          "Ruled out: docs-only change (1 file, all documentation). No action needed on this change."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 45,
            "weight": 0.3,
            "contribution": 13.5,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "35 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 0,
            "weight": 0.25,
            "contribution": 0,
            "description": "Documentation only",
            "evidence": [
              "1 file(s), all docs"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "docs-only",
          "files_total": 1,
          "categories": {
            "docs": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": true,
        "ruled_out_reason": "docs-only change (1 file, all documentation)"
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Test the extended Rewind link params",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:15:45.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 4,
        "level": "low",
        "explanation": "This deployment to checkout-api is ruled out as a suspect: tests-only change (1 file, no runtime code touched).",
        "reasons": [
          "Ruled out: tests-only change (1 file, no runtime code touched)"
        ],
        "recommendations": [
          "Ruled out: tests-only change (1 file, no runtime code touched). No action needed on this change."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 18,
            "weight": 0.3,
            "contribution": 5.4,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "75 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 15,
            "weight": 0.25,
            "contribution": 3.8,
            "description": "Tests and docs only; no runtime code touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 file(s), tests/docs only: scaled to 25%"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "tests-only",
          "files_total": 1,
          "categories": {
            "test": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": true,
        "ruled_out_reason": "tests-only change (1 file, no runtime code touched)"
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Test deep-link param parsing",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:18:25.000Z",
        "service": "storefront-web",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 3,
        "level": "low",
        "explanation": "This deployment to storefront-web is ruled out as a suspect: tests-only change (1 file, no runtime code touched).",
        "reasons": [
          "Ruled out: tests-only change (1 file, no runtime code touched)"
        ],
        "recommendations": [
          "Ruled out: tests-only change (1 file, no runtime code touched). No action needed on this change."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 19,
            "weight": 0.3,
            "contribution": 5.7,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "72 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 15,
            "weight": 0.25,
            "contribution": 3.8,
            "description": "Tests and docs only; no runtime code touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 file(s), tests/docs only: scaled to 25%"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "storefront-web -> checkout-api -> orders-db (2 hops)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "storefront-web is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 35,
            "weight": 0.05,
            "contribution": 1.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of storefront-web",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "tests-only",
          "files_total": 1,
          "categories": {
            "test": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": true,
        "ruled_out_reason": "tests-only change (1 file, no runtime code touched)"
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Docs: Chat app setup and API",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:08:55.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 3,
        "level": "low",
        "explanation": "This deployment to checkout-api is ruled out as a suspect: docs-only change (1 file, all documentation).",
        "reasons": [
          "Ruled out: docs-only change (1 file, all documentation)"
        ],
        "recommendations": [
          "Ruled out: docs-only change (1 file, all documentation). No action needed on this change."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 15,
            "weight": 0.3,
            "contribution": 4.5,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "81 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 0,
            "weight": 0.25,
            "contribution": 0,
            "description": "Documentation only",
            "evidence": [
              "1 file(s), all docs"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "docs-only",
          "files_total": 1,
          "categories": {
            "docs": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": true,
        "ruled_out_reason": "docs-only change (1 file, all documentation)"
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Extend logic checks: encryption, card, Rewind link",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:08:44.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 3,
        "level": "low",
        "explanation": "This deployment to checkout-api is ruled out as a suspect: tests-only change (1 file, no runtime code touched).",
        "reasons": [
          "Ruled out: tests-only change (1 file, no runtime code touched)"
        ],
        "recommendations": [
          "Ruled out: tests-only change (1 file, no runtime code touched). No action needed on this change."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 15,
            "weight": 0.3,
            "contribution": 4.5,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "82 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 15,
            "weight": 0.25,
            "contribution": 3.8,
            "description": "Tests and docs only; no runtime code touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 file(s), tests/docs only: scaled to 25%"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "tests-only",
          "files_total": 1,
          "categories": {
            "test": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": true,
        "ruled_out_reason": "tests-only change (1 file, no runtime code touched)"
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Docs: alert ingestion setup (generic webhook, monitoring)",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:06:49.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 3,
        "level": "low",
        "explanation": "This deployment to checkout-api is ruled out as a suspect: docs-only change (1 file, all documentation).",
        "reasons": [
          "Ruled out: docs-only change (1 file, all documentation)"
        ],
        "recommendations": [
          "Ruled out: docs-only change (1 file, all documentation). No action needed on this change."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 15,
            "weight": 0.3,
            "contribution": 4.5,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "83 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 0,
            "weight": 0.25,
            "contribution": 0,
            "description": "Documentation only",
            "evidence": [
              "1 file(s), all docs"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "docs-only",
          "files_total": 1,
          "categories": {
            "docs": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": true,
        "ruled_out_reason": "docs-only change (1 file, all documentation)"
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Add pure-logic checks for alert adapters",
        "type": "deployment",
        "occurred_at": "2026-10-12T18:06:39.000Z",
        "service": "checkout-api",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 3,
        "level": "low",
        "explanation": "This deployment to checkout-api is ruled out as a suspect: tests-only change (1 file, no runtime code touched).",
        "reasons": [
          "Ruled out: tests-only change (1 file, no runtime code touched)"
        ],
        "recommendations": [
          "Ruled out: tests-only change (1 file, no runtime code touched). No action needed on this change."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 14,
            "weight": 0.3,
            "contribution": 4.2,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "84 min before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 15,
            "weight": 0.25,
            "contribution": 3.8,
            "description": "Tests and docs only; no runtime code touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 file(s), tests/docs only: scaled to 25%"
            ]
          },
          {
            "name": "Service relevance",
            "score": 30,
            "weight": 0.2,
            "contribution": 6,
            "description": "Downstream of orders-db: it depends on the failing service",
            "evidence": [
              "checkout-api -> orders-db (1 hop)"
            ]
          },
          {
            "name": "Service criticality",
            "score": 100,
            "weight": 0.2,
            "contribution": 20,
            "description": "checkout-api is set to critical",
            "evidence": [
              "explicit setting: critical"
            ]
          },
          {
            "name": "Blast radius",
            "score": 75,
            "weight": 0.05,
            "contribution": 3.8,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "2 service(s) depend on checkout-api (directly or not): storefront-web, admin-panel",
              "2 services changed within 10 min"
            ]
          }
        ],
        "content": {
          "content_class": "tests-only",
          "files_total": 1,
          "categories": {
            "test": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": true,
        "ruled_out_reason": "tests-only change (1 file, no runtime code touched)"
      }
    },
    {
      "role": "candidate",
      "event": {
        "summary": "Test Chat workflow copy, four-step flow and ranked suspects",
        "type": "deployment",
        "occurred_at": "2026-10-12T17:47:00.000Z",
        "service": "marketing-site",
        "environment": "dev",
        "meta": {
          "author": "dev-1"
        }
      },
      "risk_assessment": {
        "score": 2,
        "level": "low",
        "explanation": "This deployment to marketing-site is ruled out as a suspect: tests-only change (1 file, no runtime code touched).",
        "reasons": [
          "Ruled out: tests-only change (1 file, no runtime code touched)"
        ],
        "recommendations": [
          "Ruled out: tests-only change (1 file, no runtime code touched). No action needed on this change."
        ],
        "factors": [
          {
            "name": "Timing",
            "score": 9,
            "weight": 0.3,
            "contribution": 2.7,
            "description": "Timing decays smoothly (half-life 30 min)",
            "evidence": [
              "1.7 h before the incident"
            ]
          },
          {
            "name": "Change risk",
            "score": 15,
            "weight": 0.25,
            "contribution": 3.8,
            "description": "Tests and docs only; no runtime code touched",
            "evidence": [
              "type \"deployment\" base 60",
              "1 file(s), tests/docs only: scaled to 25%"
            ]
          },
          {
            "name": "Service relevance",
            "score": 25,
            "weight": 0.2,
            "contribution": 5,
            "description": "Different service from orders-db; topology unknown for marketing-site",
            "evidence": [
              "add dependencies in Topology (or lastgood.yml) to sharpen this"
            ]
          },
          {
            "name": "Service criticality",
            "score": 50,
            "weight": 0.2,
            "contribution": 10,
            "description": "marketing-site is set to medium",
            "evidence": [
              "explicit setting: medium"
            ]
          },
          {
            "name": "Blast radius",
            "score": 20,
            "weight": 0.05,
            "contribution": 1,
            "description": "Services that depend on this one, and concurrent changes",
            "evidence": [
              "no registered dependents of marketing-site"
            ]
          }
        ],
        "content": {
          "content_class": "tests-only",
          "files_total": 1,
          "categories": {
            "test": 1
          },
          "risky_files": [],
          "sensitive_files": [],
          "source": "diff_stats"
        },
        "ruled_out": true,
        "ruled_out_reason": "tests-only change (1 file, no runtime code touched)"
      }
    }
  ],
  "overall_assessment": {
    "score": 85,
    "level": "critical",
    "explanation": "Overall: critical (85/100). Analyzed 72 changes, 10 ruled out. 3 high-scoring suspects. 3 correlations found. ",
    "reasons": [
      "Headline = 0.8 x top suspect (71) + 0.2 x second (67)",
      "Correlation bump +15 (capped at 15): 35 deployments to checkout-api within 2h can compound; A database migration alongside a deployment is high-risk; Changes across 4 services within 2h",
      "Top suspect: migration on orders-db",
      "10 change(s) ruled out and excluded"
    ],
    "recommendations": [
      "Primary suspect: DB migration on orders-db. Check active locks and rollback script safety.",
      "Secondary suspect 2: deployment to storefront-web (prod) (score: 67)",
      "Secondary suspect 3: migration to orders-db (prod) (score: 65)"
    ]
  },
  "correlations": [
    {
      "description": "35 deployments to checkout-api within 2h can compound",
      "confidence": 80,
      "riskIncrease": 10
    },
    {
      "description": "A database migration alongside a deployment is high-risk",
      "confidence": 70,
      "riskIncrease": 10
    },
    {
      "description": "Changes across 4 services within 2h",
      "confidence": 60,
      "riskIncrease": 6
    }
  ],
  "ai_diagnosis": {
    "stage": "rules",
    "status": "completed",
    "source": "rule_fallback",
    "executive_summary": "Overall: critical (85/100). Analyzed 72 changes, 10 ruled out. 3 high-scoring suspects. 3 correlations found. ",
    "primary_cause_headline": "High risk change event detected on orders-db (85/100)",
    "recommended_action": "Review recent deployments and consider initiating rollback if errors persist."
  }
};
