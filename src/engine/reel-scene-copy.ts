import type { GeneratedProjectSettings } from "./reel-config";

export type ReelSceneCopy = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  video: string;
  lottie?: string;
};

const fallbackPrompt =
  "Create a Reel explaining how AI automation helps business owners save time.";

const isRealEstatePrompt = (prompt: string) => /real estate|realtor|property|listing/i.test(prompt);

const workflowBody = (energy: GeneratedProjectSettings["energy"], ar: boolean) => {
  if (ar) {
    if (energy === "energetic") return "استفسار → رد فوري → جولة → عرض → إغلاق.";
    if (energy === "calm") return "تأهيل تلقائي، متابعة هادئة، ومواعيد منظمة.";
    return "استفسار → تأهيل → جولة → عرض → إغلاق — دون متابعة يدوية.";
  }
  if (energy === "energetic") return "Inquiry → instant reply → tour booked → offer → close.";
  if (energy === "calm") return "Quiet lead nurture, steady follow-ups, and organized showings.";
  return "Inquiry → qualify → tour → offer → close — without manual chasing.";
};

const realEstateScenes = (
  project: GeneratedProjectSettings,
  ar: boolean,
): ReelSceneCopy[] => {
  const location = project.location?.trim() ?? "";
  const locSuffix = location ? (ar ? ` في ${location}` : ` in ${location}`) : "";

  if (ar) {
    return [
      {
        id: "hook",
        eyebrow: "ريل عقاري",
        title: "الذكاء الاصطناعي يوفر الوقت ويغلق صفقات أكثر",
        body: `مصمم لوكلاء العقارات${locSuffix}.`,
        video: location.toLowerCase().includes("dubai")
          ? "assets/videos/dubai-real-estate.mp4"
          : "assets/videos/real-estate-agent-phone.mp4",
      },
      {
        id: "pain",
        eyebrow: "المشكلة",
        title: "المتابعة اليدوية تسرق يومك",
        body: "ردود على زنون، جدولة معاينات، CMA، وتذكيرات العملاء تتراكم بسرعة.",
        video: "assets/videos/office-workspace.mp4",
      },
      {
        id: "automation",
        eyebrow: "الحل",
        title: "الأتمتة تتابع العملاء نيابة عنك",
        body: "ردود فورية، تسلسلات متابعة، وتذكيرات معاينات تعمل تلقائياً.",
        video: "assets/videos/smartphone-notifications.mp4",
        lottie: "automation",
      },
      {
        id: "workflow",
        eyebrow: "سير العمل",
        title: "من استفسار إلى إغلاق",
        body: workflowBody(project.energy, true),
        video: "assets/videos/customer-texting.mp4",
      },
      {
        id: "proof",
        eyebrow: "النتيجة",
        title: "ساعات أكثر للبيع",
        body: "وكلاء يقضون وقتاً أقل في الإدارة ووقتاً أكثر في التفاوض والإغلاق.",
        video: "assets/videos/property-investment.mp4",
      },
      {
        id: "cta",
        eyebrow: "ابدأ",
        title: "أتمت خط أنابيبك اليوم",
        body: "اضبطها مرة واحدة. دع الذكاء الاصطناعي يحرك الصفقات.",
        video: location.toLowerCase().includes("dubai")
          ? "assets/videos/luxury-apartment-dubai.mp4"
          : "assets/videos/sales-call.mp4",
        lottie: "success",
      },
    ];
  }

  return [
    {
      id: "hook",
      eyebrow: "Real Estate Reel",
      title: "AI automation saves time and closes more deals",
      body: `Built for real estate agents${locSuffix}.`,
      video: location.toLowerCase().includes("dubai")
        ? "assets/videos/dubai-real-estate.mp4"
        : "assets/videos/real-estate-agent-phone.mp4",
    },
    {
      id: "pain",
      eyebrow: "The Problem",
      title: "Manual follow-up steals your day",
      body: "Lead replies, showings, CMAs, and client reminders pile up faster than you can chase them.",
      video: "assets/videos/office-workspace.mp4",
    },
    {
      id: "automation",
      eyebrow: "The Shift",
      title: "AI runs your follow-up machine",
      body: "Instant lead replies, nurture sequences, and showing reminders on autopilot.",
      video: "assets/videos/smartphone-notifications.mp4",
      lottie: "automation",
    },
    {
      id: "workflow",
      eyebrow: "Workflow",
      title: "Inquiry to close",
      body: workflowBody(project.energy, false),
      video: "assets/videos/customer-texting.mp4",
    },
    {
      id: "proof",
      eyebrow: "Impact",
      title: "10+ hours back every week",
      body: "Agents spend less time on admin and more time negotiating, showing, and closing.",
      video: "assets/videos/property-investment.mp4",
    },
    {
      id: "cta",
      eyebrow: "Ready",
      title: "Automate your pipeline today",
      body: "Set it once. Let AI keep deals moving while you focus on clients.",
      video: location.toLowerCase().includes("dubai")
        ? "assets/videos/luxury-apartment-dubai.mp4"
        : "assets/videos/sales-call.mp4",
      lottie: "success",
    },
  ];
};

const genericScenes = (project: GeneratedProjectSettings): ReelSceneCopy[] => {
  const prompt = project.prompt?.trim() || fallbackPrompt;
  const lines = prompt
    .replace(/[.!?]+/g, ".")
    .split(".")
    .map((s) => s.trim())
    .filter(Boolean);
  const tone = workflowBody(project.energy, false);

  return [
    {
      id: "hook",
      eyebrow: "AI Reel",
      title: lines[0] ?? "AI automation saves time",
      body: project.location?.trim()
        ? `Built for your business in ${project.location.trim()}.`
        : "Built for your business.",
      video: "assets/videos/businessman-working.mp4",
    },
    {
      id: "pain",
      eyebrow: "The Problem",
      title: "Manual tasks steal the day",
      body: "Inbox follow-ups, reports, bookings, reminders, and admin work pile up fast.",
      video: "assets/videos/office-workspace.mp4",
    },
    {
      id: "automation",
      eyebrow: "The Shift",
      title: "AI handles repetitive work",
      body: "Automations reply, route leads, update records, and trigger the next step instantly.",
      video: "assets/videos/smartphone-notifications.mp4",
      lottie: "automation",
    },
    {
      id: "workflow",
      eyebrow: "Workflow",
      title: "Prompt → system → result",
      body: tone,
      video: "assets/videos/customer-texting.mp4",
    },
    {
      id: "proof",
      eyebrow: "Impact",
      title: "More time for growth",
      body: "Spend less time chasing operations and more time closing, serving, and scaling.",
      video: "assets/videos/property-investment.mp4",
    },
    {
      id: "cta",
      eyebrow: "Ready",
      title: "Let AI run the busywork",
      body: "Create once. Automate daily. Save hours every week.",
      video: "assets/videos/sales-call.mp4",
      lottie: "success",
    },
  ];
};

export const buildReelScenes = (project: GeneratedProjectSettings): ReelSceneCopy[] => {
  const prompt = project.prompt?.trim() || fallbackPrompt;
  const ar = project.language === "ar";

  if (isRealEstatePrompt(prompt) || ar) {
    return realEstateScenes(project, ar);
  }

  return genericScenes(project);
};
