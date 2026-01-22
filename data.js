// Namespace global LuciData (dacă nu există deja)
window.LuciData = window.LuciData || {};

// -----------------------------------------------------
//  DATA PRINCIPALE PENTRU PLATFORMĂ + METADATE AI
// -----------------------------------------------------

LuciData.data = {
  // ==========================
  //         ANGAJAȚI (HR)
  // ==========================
  employees: [
    {
      name: "Maria Ionescu",
      department: "HR",
      role: "Manager",
      status: "Activ",
      salary: 3000,
      evalScore: 95,
      isNew: true,
      onLeave: false,

      // Date AI avansate
      ai: {
        performancePrediction: 0.94, // 0–1
        burnoutRisk: 0.18,           // 0–1
        engagementScore: 0.88,       // 0–1
        promotionPotential: 0.9,     // 0–1
        riskFactors: [
          "Răspunde la un volum mare de solicitări",
          "Responsabilitate ridicată pe zona de people management"
        ],
        trainingRecommendation: "Leadership avansat & coaching pentru manageri"
      }
    },
    {
      name: "Dan Popa",
      department: "Sales",
      role: "Executiv",
      status: "Activ",
      salary: 2500,
      evalScore: 90,
      isNew: false,
      onLeave: false,

      ai: {
        performancePrediction: 0.89,
        burnoutRisk: 0.22,
        engagementScore: 0.82,
        promotionPotential: 0.75,
        riskFactors: [
          "Targeturi comerciale agresive",
          "Program prelungit în perioadele de vârf"
        ],
        trainingRecommendation: "Tehnici avansate de negociere & time management"
      }
    },
    {
      name: "Ana Radu",
      department: "IT",
      role: "Developer",
      status: "Activ",
      salary: 4000,
      evalScore: 92,
      isNew: true,
      onLeave: true,

      ai: {
        performancePrediction: 0.91,
        burnoutRisk: 0.35,
        engagementScore: 0.8,
        promotionPotential: 0.78,
        riskFactors: [
          "Implicare în proiecte critice cu deadline strâns",
          "Posibile ore suplimentare pe termen scurt"
        ],
        trainingRecommendation: "Arhitectură software & mentoring pentru juniori"
      }
    }
  ],

  // ==========================
  //     CLIENȚI / LEAD-URI
  // ==========================
 clients: [
  {
    id: "C001",
    name: "Ion Popescu / x SRL",
    contact: "ion@x.ro",
    status: "Activ",                // Lead / Activ / Pierdut
    contractValue: 12000,
    lastInteraction: "2025-12-01",  // format YYYY-MM-DD
    owner: "Maria Ionescu",
    followUp: "Email follow-up",

    // --- câmpuri suplimentare pentru AI (pseudo-ML) ---
    createdAt: "2025-09-10",
    lifecycleStage: "Client",       // Lead / MQL / SQL / Client / Churn-risk
    lifetimeValue: 42354,           // valoare viață estimată
    industry: "Software",
    interactions: {
      total: 11,
      calls: 4,
      emails: 6,
      meetings: 1,
      lastChannel: "Email"
    },
    sentimentManual: 0.76,          // dacă ai evaluări manuale
    complaintsCount: 0,
    upsellPotential: 0.82,          // 0–1, estimare subiectivă acum

    // --- AI actual (va fi calculat / recalculat de engine) ---
    ai: {
      leadScore: 0.71,              // 0–1 (în UI îl afișăm ca 71/100)
      churnRisk: 0.31,              // 0–1
      sentimentScore: 0.76,         // 0–1
      segment: "Hot",               // Hot / Warm / Cold
      followupPriority: "High",     // High / Medium / Low

      nextBestAction: "Trimite follow-up telefonic",
      nextBestOffer: "Pachet LuciData CRM + Sales AI",

      rationaleShort: "Lead valoros, contact recent, potențial mare de upsell.",
      rationaleChurn: "Analiză automată AI bazată pe interacțiuni, istoric și pattern-uri similare."
    }
  },

  {
    id: "C002",
    name: "Andrei Georgescu / y SRL",
    contact: "andrei@y.ro",
    status: "Lead",
    contractValue: 5000,
    lastInteraction: "2025-11-30",
    owner: "Dan Popa",
    followUp: "Telefon follow-up",

    createdAt: "2025-10-02",
    lifecycleStage: "SQL",
    lifetimeValue: 72171,
    industry: "Tech",
    interactions: {
      total: 7,
      calls: 3,
      emails: 3,
      meetings: 1,
      lastChannel: "Telefon"
    },
    sentimentManual: 0.63,
    complaintsCount: 0,
    upsellPotential: 0.7,

    ai: {
      leadScore: 0.75,
      churnRisk: 0.09,
      sentimentScore: 0.63,
      segment: "Hot",
      followupPriority: "High",

      nextBestAction: "Trimite un studiu de caz relevant",
      nextBestOffer: "Pachet AI pentru analiza clienților",

      rationaleShort: "Lead interesat, răspunde la contact și are potențial ridicat.",
      rationaleChurn: "Risc scăzut pe baza frecvenței interacțiunilor și a interesului constant."
    }
  },

  {
    id: "C003",
    name: "z SRL",
    contact: "contact@z.com",
    status: "Lead",
    contractValue: 25000,
    lastInteraction: "2025-12-05",
    owner: "Maria Ionescu",
    followUp: "Întâlnire online",

    createdAt: "2025-11-01",
    lifecycleStage: "MQL",
    lifetimeValue: 74531,
    industry: "Retail",
    interactions: {
      total: 5,
      calls: 1,
      emails: 3,
      meetings: 1,
      lastChannel: "Meeting"
    },
    sentimentManual: 0.66,
    complaintsCount: 0,
    upsellPotential: 0.9,

    ai: {
      leadScore: 0.70,
      churnRisk: 0.23,
      sentimentScore: 0.66,
      segment: "Warm",
      followupPriority: "High",

      nextBestAction: "Trimite email personalizat cu oferta AI",
      nextBestOffer: "Modul HR AI + Predictive Performance",

      rationaleShort: "Lead cu buget mare și interes pentru AI, necesită follow-up personalizat.",
      rationaleChurn: "Risc moderat dacă nu se menține ritmul comunicării și personalizarea ofertei."
    }
  }
],

  // ==========================
  //          PROIECTE
  // ==========================
  projects: [
    {
      name: "Implementare CRM",
      manager: "Dan Popa",
      deadline: "15.12.2025",
      progress: 70,
      employeesCount: 5,

      ai: {
        delayRisk: 28,  // 0–100
        timelineConfidence: 0.82,
        predictedCompletionDate: "18.12.2025",
        workloadIndex: 0.76,  // 0–1
        bottleneckExplanation: "Dependință de feedback-ul clientului pentru câteva integrări critice.",
        resourceRecommendation: "Implicați încă un developer pentru integrarea API-urilor externe."
      }
    },
    {
      name: "Upgrade ERP",
      manager: "Maria Ionescu",
      deadline: "31.12.2025",
      progress: 40,
      employeesCount: 3,

      ai: {
        delayRisk: 54,
        timelineConfidence: 0.64,
        predictedCompletionDate: "10.01.2026",
        workloadIndex: 0.83,
        bottleneckExplanation: "Resurse limitate pe zona de testare și validare cu departamentul financiar.",
        resourceRecommendation: "Alocarea unui QA dedicat și definirea unui plan clar de testare pe etape."
      }
    },
    {
      name: "Website LuciData",
      manager: "Ana Radu",
      deadline: "20.12.2025",
      progress: 90,
      employeesCount: 2,

      ai: {
        delayRisk: 12,
        timelineConfidence: 0.93,
        predictedCompletionDate: "19.12.2025",
        workloadIndex: 0.58,
        bottleneckExplanation: "Așteaptă doar aprobarea finală a conținutului de marketing.",
        resourceRecommendation: "Focalizare pe optimizare SEO și pregătirea materialelor pentru campania de lansare."
      }
    }
  ],

  // ==========================
  //       SECURITATE / ALERTE
  // ==========================
  securityAlerts: [
    {
      type: "Acces suspect",
      description: "Login din IP neobișnuit",
      date: "04.12.2025",
      severity: "high",
      ai: {
        riskScore: 87, // 0–100
        sourceClassification: "IP necunoscut, regiune nouă",
        recommendedAction: "Forțează resetarea parolei și cere autentificare 2FA.",
        falsePositiveProbability: 0.12
      }
    },
    {
      type: "Concediu neaprobat",
      description: "Cerere concediu angajat X fără aprobarea managerului",
      date: "05.12.2025",
      severity: "medium",
      ai: {
        riskScore: 42,
        sourceClassification: "Procedură internă nefinalizată",
        recommendedAction: "Notifică managerul de departament pentru clarificare.",
        falsePositiveProbability: 0.35
      }
    }
  ],

  // ==========================
  //          GRAFICE
  // ==========================
  charts: {
    clientStatus: {
      labels: ["Lead", "Activ", "Pierdut"],
      data: [20, 35, 5]
    },
    revenue: {
      labels: ["Ianuarie", "Februarie", "Martie", "Aprilie"],
      data: [10000, 12000, 15000, 14000]
    },
    attendance: {
      labels: ["Săptămâna 1", "Săptămâna 2", "Săptămâna 3", "Săptămâna 4"],
      presence: [110, 112, 108, 115],
      absence: [10, 8, 12, 5]
    },
    projectProgress: {
      labels: ["CRM", "ERP", "Website"],
      progress: [70, 40, 90]
    },
    salesTrend: {
      labels: ["Ianuarie", "Februarie", "Martie", "Aprilie"],
      data: [15000, 18000, 20000, 22000]
    },
    salesFunnel: {
      labels: ["Lead", "Contact", "Negociere", "Închis"],
      data: [50, 40, 30, 25]
    }
  }
};
