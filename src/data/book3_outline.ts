import { ChapterOutline, ChapterContent } from '../types';

export const book3ChaptersList: ChapterOutline[] = [
  { id: "human-nature-c1", chapterNumber: 1, title: "The Core Motivators", topic: "Human Motivation", description: "Analyzing the primal forces of personal gain, security seeking, social status, and preservation." },
  { id: "human-nature-c2", chapterNumber: 2, title: "Cognitive Blind spots and Biases", topic: "Cognitive Biases", description: "How the brain creates illusions to preserve ego and avoid intellectual fatigue." },
  { id: "human-nature-c3", chapterNumber: 3, title: "The Gap Between Declaration and Action", topic: "Emotional Triggers", description: "Deciphering the differences between what humans promise and what they execute." },
  { id: "human-nature-c4", chapterNumber: 4, title: "Deciphering Hidden Incentives", topic: "Incentives", description: "Analyzing the latent organizational incentives that dictate public statements." },
  { id: "human-nature-c5", chapterNumber: 5, title: "Emotional Hijacking and Irrationality", topic: "Social Behavior", description: "Understanding the biological pathways of fear, pride, and rapid response cycles." },
  { id: "human-nature-c6", chapterNumber: 6, title: "Social Proof and Peer Authority", topic: "Social Influence", description: "How crowd safety overrides individual judgment in crisis climates." },
  { id: "human-nature-c7", chapterNumber: 7, title: "The Vulnerability of Self-Awareness", topic: "Self-awareness", description: "Auditing the delusions that prevent humans from accepting their personal limitations." },
  { id: "human-nature-c8", chapterNumber: 8, title: "Human Needs and everyday Desire", topic: "Everyday Psychology", description: "Mapping basic physiological and esteem needs to commercial and social trends." },
  { id: "human-nature-c9", chapterNumber: 9, title: "Archetypes of Social Behavior", topic: "Personality Patterns", description: "Categorizing recurring social personalities for rapid defensive profiling." },
  { id: "human-nature-c10", chapterNumber: 10, title: "Building Deep Emotional Intelligence", topic: "Critical Thinking", description: "Synthesizing psychological frameworks to achieve a permanently focused, calm state." }
];

export const preseededBook3Content: Record<string, ChapterContent> = {
  "human-nature-c1": {
    chapterId: "human-nature-c1",
    chapterNumber: 1,
    title: "The Core Motivators",
    introduction: "To understand human nature, you must first strip away the decorative surface of morality, etiquette, and social narratives. At the baseline of biological life, human action is consistently guided by four primal prime forces: Security, Status, Incentive, and Preservation. Throughout history and modern boardrooms, every word, smile, or act of resistance is an attempt to optimize these parameters. When you stop listening to verbal explanations and begin mapping actions directly to these four coordinates, human behavior becomes highly predictable, logical, and easy to deconstruct.",
    concepts: [
      {
        name: "Security Seeking",
        description: "The obsessive biological push to avoid physical discomfort, financial precarity, social isolation, and professional extinction.",
        example: "A teammate refuses to adopt a faster, superior software stack, claiming 'it lacks long-term architecture studies'—when they actually fear highlighting their inability to learn new frameworks."
      },
      {
        name: "Status Optimisation",
        description: "The perpetual micro-calibration of rank, deference, credibility, and authority relative to immediate social circles.",
        example: "An executive buys the group's lunch but loudly mentions how busy he is managing a multi-million budget, instantly converting money into public rank signals."
      },
      {
        name: "Preservation of Ego",
        description: "The violent protection of one's current belief system, reputation, and self-worth from contradictory proof.",
        example: "A founder ignores direct user metrics showing product failure, blaming 'immature users who don't understand the vision' to preserve their creative identity."
      }
    ],
    explanation: "Most personal frustration comes from expecting humans to act out of abstract virtues like pure selflessness, mathematical fairness, or absolute logic. In reality, human brains are survival machines. In every conversation, the average interlocutor is running a sub-conscious evaluation: 'Does this boost or threaten my security? Does this make me look important? Does it support my existing cognitive beliefs?' Understanding this allows you to stop taking insults, delays, or broken promises personally. They are not attacks on you; they are self-optimization behaviors executed by another biological agent navigating life.",
    caseStudy: {
      title: "The Silent Department Shift",
      setup: "A high-performing software team leader is suddenly reassigned to head a small, low-impact legacy systems squad. Management frames this as 'a highly critical stability operation.'",
      outcome: "The leader becomes unsupportive, subtly delays deliverables, and begins speaking with flat sarcasm in meetings.",
      lessons: [
        "The manager's status was severely threatened by the title reassignment.",
        "Management attempted to dress a demotion as a virtue, creating massive ego-reality divergence.",
        "By ignoring the status motivator, management created a hostile internal saboteur."
      ]
    },
    exercises: [
      "Observe 3 coworker emails today. Identify which sentence supports security and which boosts status.",
      "Analyze your own last emotional flare. Which of the four primal forces was threatened?"
    ],
    reflectionQuestions: [
      "What percentage of your daily speech is aimed at showing status?",
      "Can we build leverage with people if we don't first address their security anxieties?",
      "Are you willing to let others believe they have higher status if it advances your strategic priorities?"
    ],
    keyLessons: [
      "Ignore explanations; map underlying motivators and incentives.",
      "Align your proposals directly with the recipient's status and security interests if you want immediate buy-in.",
      "The highest power is letting others look important while you capture actual operational leverage."
    ]
  },
  "human-nature-c2": {
    chapterId: "human-nature-c2",
    chapterNumber: 2,
    title: "Cognitive Blind spots and Biases",
    introduction: "Our cognitive apparatus did not evolve to discover absolute mathematical truths; it evolved to help us hunt, gather, and fit into tribal structures without being executed by the elders. Consequently, the human mind relies on shortcuts—cognitive biases—to preserve mental energy and dodge discomfort. These blind spots act as permanent bugs in our neurological operating systems. To understand behavior, you must recognize these biases not as rare defects, but as the standard operating conditions of human perception.",
    concepts: [
      {
        name: "Confirmation Bias",
        description: "The natural impulse to filter, highlight, and retain data that aligns with current theories, while aggressively discrediting counter-facts.",
        example: "A stock investor reads fifty news reports looking only for indicators of an upcoming boom, ignoring a multi-agency fraud warning."
      },
      {
        name: "Loss Aversion",
        description: "The psychological bias where the pain of losing something is twice as intense as the joy of matching gains.",
        example: "Holding onto a failed, value-leaking project for months because abandoning it means admitting a permanent loss."
      },
      {
        name: "Social Mirroring (Bandwagon Effect)",
        description: "Absorbing the opinions, stress-levels, and lifestyle speeds of peers purely to avoid standing out.",
        example: "An entire development department enters panic mode because they heard another firm is testing AI-generated coders."
      }
    ],
    explanation: "Human perception is not a clean glass window; it is a heavily curved prism shaped by ancestors who survived by fearing shadows. When you interact with anyone, you are never speaking with a completely detached, objective observer. You are speaking with an agent whose brain is actively filtering information to keep their beliefs stable and their efforts low. If you present facts that clash with their current belief system, their cognitive system reacts with somatic hostility, as if you are threatening their physical safety.",
    caseStudy: {
      title: "The Sunk Cost Campaign",
      setup: "An agency spends $500,000 on a custom tracking engine. Immediately, a free, superior open-source tracking framework is launched by an independent group.",
      outcome: "The board votes to spend another $100,000 updating the custom engine, claiming they 'must protect the initial assets.'",
      lessons: [
        "Loss aversion and sunk cost fallacies led the board to throw good resources after bad.",
        "Objectively, the custom project was dead. Emotionally, admitting death was unacceptable to leadership.",
        "Strategic masters calculate future cash flows and values, completely ignoring historic investments."
      ]
    },
    exercises: [
      "Identify one opinion you hold deeply. Write down three high-quality pieces of data that completely contradict it.",
      "The next time you lose a small bet or asset, monitor your pulse. Notice how loss aversion triggers physical spikes."
    ],
    reflectionQuestions: [
      "In what areas of life are you currently letting historic costs dictate future budgets?",
      "Are your opinions truly yours, or did you mirror them from comfortable newsletters?",
      "How do we benefit from knowing that our competitor is blinded by confirmation loops?"
    ],
    keyLessons: [
      "Admitting error is a massive strategic advantage, not a sign of weakness.",
      "People do not want truth; they want comfort first and confirmation second.",
      "The sovereign mind uses biases as predictable behavioral predictable lines to outmaneuver rivals."
    ]
  }
};
