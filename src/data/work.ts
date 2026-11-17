// Work data — case studies (full pages under /work/<slug>) + project list.
// Bilingual: EN (default) + DE (German).

export interface Localized {
  en: string;
  de: string;
}

export interface CaseStudy {
  slug: string;
  index: string;
  title: Localized;
  summary: Localized;
  year: string;
  role: Localized;
  githubUrl: string;
  overview: Localized;
  challenge: Localized;
  approach: string[];
  outcome: Localized;
  stack: string[];
}

export interface Project {
  title: string;
  description: Localized;
  tags: string[];
  githubUrl: string;
  year: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'conversational-rag-assistant',
    index: '01',
    title: {
      en: 'Conversational RAG Assistant',
      de: 'Dialogfähiger RAG-Assistent',
    },
    summary: {
      en: 'Production-grade conversational RAG platform with semantic retrieval, multi-turn memory, and real-time observability.',
      de: 'Produktionsreifer dialogfähiger RAG-Plattform mit semantischer Suche, Multi-Turn-Speichern und Echtzeit-Observability.',
    },
    year: '2025',
    role: { en: 'Design & Implementation', de: 'Design & Implementierung' },
    githubUrl: 'https://github.com/kirantushar10/Conversational-RAG-Assistant',
    overview: {
      en: 'An advanced Retrieval-Augmented Generation chatbot built with LangChain, Groq LLaMA 3, Chroma, and Hugging Face embeddings. It supports multi-turn conversations, contextual memory, and LangSmith tracing for real-time observability — combining knowledge retrieval with LLM reasoning for context-aware Q&A.',
      de: 'Ein fortgeschrittener Retrieval-Augmented-Generation-Chatbot, gebaut mit LangChain, Groq LLaMA 3, Chroma und Hugging Face Embeddings. Er unterstützt Multi-Turn-Gespräche, kontextuellen Speicher und LangSmith-Tracing für Echtzeit-Observability — kombiniert Wissenssuche mit LLM-Reasoning für kontextbewusstes Q&A.',
    },
    challenge: {
      en: 'A one-shot RAG chain forgets everything between turns: follow-up questions like "what about its pricing?" have no referent, so retrieval runs on the wrong query and the answer drifts. The system needed conversational state, history-aware retrieval, and a way to debug every step of the pipeline — while staying fast enough for real interaction.',
      de: 'Eine One-Shot-RAG-Kette vergisst alles zwischen den Turns: Follow-up-Fragen wie „Was ist mit den Preisen?" haben keinen Referenten, die Suche läuft auf der falschen Query und die Antwort driftet ab. Das System brauchte Gesprächsstatus, historienbasierte Suche und eine Möglichkeit, jeden Schritt der Pipeline zu debuggen — bei gleichzeitig schnell genug für echte Interaktion.',
    },
    approach: [
      'Embedded document chunks with all-MiniLM-L6-v2 (Hugging Face) into ChromaDB for semantic search over the knowledge base.',
      'Wrapped the chain with ChatMessageHistory + RunnableWithMessageHistory so every turn carries full conversation context.',
      'Used a history-aware retriever to rewrite follow-up questions into self-contained queries before retrieval — "its pricing" becomes "pricing of <subject>".',
      'Chose Groq for LLaMA 3 inference: high-speed responses keep the conversational loop feeling instant.',
      'Added LangSmith tracing to observe, debug, and profile every run in real time.',
      'Loaded external blog content with WebBaseLoader to extend the knowledge base beyond local documents.',
    ],
    outcome: {
      en: 'A conversational assistant that answers multi-turn questions over live web content with low-latency Groq inference, full retrieval context, and end-to-end pipeline observability via LangSmith.',
      de: 'Ein dialogfähiger Assistent, der Multi-Turn-Fragen über Live-Web-Inhalte beantwortet — mit Low-Latency-Groq-Inferenz, vollständigem Suchkontext und End-to-End-Observability der Pipeline über LangSmith.',
    },
    stack: ['LangChain', 'Groq (LLaMA 3)', 'ChromaDB', 'Hugging Face', 'LangSmith', 'Python'],
  },
  {
    slug: 'agentic-search-engine',
    index: '02',
    title: {
      en: 'Agentic Search Engine',
      de: 'Agentische Suchmaschine',
    },
    summary: {
      en: 'Autonomous reasoning agent that routes queries across Wikipedia, ArXiv papers, and live web search.',
      de: 'Autonomer Reasoning-Agent, der Queries über Wikipedia, ArXiv-Papers und Live-Web-Suche routet.',
    },
    year: '2025',
    role: { en: 'Design & Implementation', de: 'Design & Implementierung' },
    githubUrl: 'https://github.com/kirantushar10/Search-Engine-with-Tools-and-Agents',
    overview: {
      en: 'A search engine built with LangChain Tools, Groq LLaMA, HuggingFace Embeddings, and LangSmith Tracking. The agent decides which source each query needs — Wikipedia for encyclopedic facts, ArXiv for academic papers, and a custom web loader and retriever for live content — then synthesizes a grounded answer.',
      de: 'Eine Suchmaschine, gebaut mit LangChain Tools, Groq LLaMA, HuggingFace Embeddings und LangSmith Tracking. Der Agent entscheidet, welche Quelle jede Query benötigt — Wikipedia für enzyklopädische Fakten, ArXiv für wissenschaftliche Papers, ein eigener Web-Loader und Retriever für Live-Inhalte — und synthetisiert anschließend eine fundierte Antwort.',
    },
    challenge: {
      en: 'No single source covers everything: encyclopedic questions, research questions, and real-world questions each need different data. A fixed pipeline retrieves from one place and is wrong about two-thirds of queries. The system had to decide, per query, which tool(s) to call — and when to combine them.',
      de: 'Keine einzige Quelle deckt alles ab: Enzyklopädie-Fragen, Research-Fragen und Realworld-Fragen brauchen jeweils unterschiedliche Daten. Eine fixe Pipeline holt aus nur einer Quelle und liegt bei zwei Dritteln der Queries falsch. Das System musste pro Query entscheiden, welches Tool aufgerufen wird — und wann man sie kombiniert.',
    },
    approach: [
      'Built the agent on LangChain Tools so each source (Wikipedia, ArXiv, custom web loader + retriever) is a first-class callable tool.',
      'Used Groq LLaMA as the reasoning model that inspects the query, selects tools, and iterates on intermediate results.',
      'Embedded intermediate evidence with HuggingFace embeddings so the agent can compare and merge across sources.',
      'Instrumented the whole loop with LangSmith for step-by-step monitoring of tool calls, routing decisions, and latency.',
    ],
    outcome: {
      en: 'A search experience that adapts its source per query — Search, Fetch, Process, Trace — with the agent handling routing and synthesis automatically, and full observability of every decision.',
      de: 'Ein Sucherlebnis, das die Quelle pro Query anpasst — Search, Fetch, Process, Trace — der Agent übernimmt Routing und Synthese automatisch, mit vollständiger Observability jeder Entscheidung.',
    },
    stack: ['LangChain', 'LangGraph', 'Groq (LLaMA)', 'FAISS', 'Hugging Face', 'LangSmith', 'Python'],
  },
  {
    slug: 'end-to-end-ml-pipeline',
    index: '03',
    title: {
      en: 'End-to-End ML Pipeline',
      de: 'End-to-End-ML-Pipeline',
    },
    summary: {
      en: 'Complete MLOps pipeline: data versioning, experiment tracking, model registry, and CI/CD deployment.',
      de: 'Vollständige MLOps-Pipeline: Daten-Versionierung, Experiment-Tracking, Modell-Registry und CI/CD-Deployment.',
    },
    year: '2025',
    role: { en: 'Design & Implementation', de: 'Design & Implementierung' },
    githubUrl: 'https://github.com/kirantushar10/Machine-Learning-Pipeline-with-DVC-MLflow-and-DagsHub',
    overview: {
      en: 'A complete automated MLOps pipeline that handles data ingestion, validation, experiment tracking, model versioning, and containerized deployment — built on DVC for data, MLflow for experiments, and DagsHub for remote storage and CI.',
      de: 'Eine vollständige, automatisierte MLOps-Pipeline, die Daten-Ingestion, Validierung, Experiment-Tracking, Modell-Versionierung und Container-Deployment abdeckt — gebaut auf DVC für Daten, MLflow für Experimente und DagsHub für Remote-Speicher und CI.',
    },
    challenge: {
      en: 'Machine learning code is only as reproducible as its data. A model that scores well on a laptop and collapses in production is usually a data-provenance problem: nobody can say which dataset trained which model, or rerun the exact experiment. The pipeline needed data versioning, experiment metadata, and a deployable model artifact — all tied together.',
      de: 'Machine-Learning-Code ist nur so reproduzierbar wie seine Daten. Ein Modell, das auf dem Laptop gut abschneidet und in Produktion kollabiert, ist meist ein Daten-Herkunftsproblem: Niemand kann sagen, welcher Datensatz welches Modell trainiert hat, oder das Experiment exakt neu ausführen. Die Pipeline brauchte Daten-Versionierung, Experiment-Metadaten und ein deploybares Modell-Artefakt — alles verknüpft.',
    },
    approach: [
      'Versioned datasets and model artifacts with DVC, pushing them to DagsHub for remote storage and diffing.',
      'Tracked every training run with MLflow: parameters, metrics, and model artifacts in one registry.',
      'Connected DagsHub to GitHub Actions so data, experiments, and deploys run on a reproducible CI path.',
      'Trained a scikit-learn RandomForest baseline end-to-end through the pipeline as the reference workload.',
    ],
    outcome: {
      en: 'A reproducible MLOps workflow where any historical experiment can be re-run from versioned data, every run is traceable in MLflow, and new models deploy through CI without manual steps.',
      de: 'Ein reproduzierbarer MLOps-Workflow, in dem jedes historische Experiment aus versionierten Daten neu ausgeführt werden kann, jeder Run in MLflow nachvollziehbar ist und neue Modelle ohne manuelle Schritte über CI deployed werden.',
    },
    stack: ['DVC', 'MLflow', 'DagsHub', 'GitHub Actions', 'Scikit-learn', 'Docker', 'Python'],
  },
];

export const projects: Project[] = [
  {
    title: 'Automated CI/CD Flask Pipeline',
    description: {
      en: 'Automated CI/CD pipeline using Pytest, Docker, and GitHub Actions for continuous build-test-deploy on every commit.',
      de: 'Automatisierte CI/CD-Pipeline mit Pytest, Docker und GitHub Actions — kontinuierliches Build-Test-Deploy bei jedem Commit.',
    },
    tags: ['Docker', 'GitHub Actions', 'Flask', 'Pytest'],
    githubUrl: 'https://github.com/kirantushar10/CI-CD-Pipeline-for-Dockerized-Flask-Application',
    year: '2024',
  },
  {
    title: 'Enterprise Airflow & Postgres ETL',
    description: {
      en: 'Production-style Airflow pipeline pulling NASA APOD API data, transforming JSON payloads, and loading into Dockerized Postgres via custom hooks.',
      de: 'Produktionsreife Airflow-Pipeline, die Daten aus der NASA APOD API zieht, JSON-Payloads transformiert und über eigene Hooks in Dockerisierter Postgres lädt.',
    },
    tags: ['Apache Airflow', 'PostgreSQL', 'Docker', 'ETL'],
    githubUrl: 'https://github.com/kirantushar10/Apache-Airflow-ETL-With-Postgres-and-API',
    year: '2024',
  },
  {
    title: 'NVIDIA NIM Document QA Assistant',
    description: {
      en: 'Interactive Streamlit app leveraging NVIDIA Inference Microservices, FAISS vector search, and LLaMA 3.3 (70B) for deep document QA.',
      de: 'Interaktive Streamlit-App mit NVIDIA Inference Microservices, FAISS-Vektorsuche und LLaMA 3.3 (70B) für tiefe Dokumenten-Fragen.',
    },
    tags: ['NVIDIA NIM', 'LLaMA 3.3', 'FAISS', 'Streamlit'],
    githubUrl: 'https://github.com/kirantushar10/NVIDIA-NIM-RAG-Demo',
    year: '2025',
  },
  {
    title: 'Multi-Strategy Summarizer',
    description: {
      en: 'High-speed document summarizer supporting Stuff, Map-Reduce, and Refine chain architectures with multilingual output and token telemetry.',
      de: 'Schneller Dokumenten-Zusammenfasser mit Stuff-, Map-Reduce- und Refine-Chain-Architekturen, mehrsprachiger Ausgabe und Token-Telemetrie.',
    },
    tags: ['LangChain', 'Groq', 'LLaMA 3.1', 'NLP'],
    githubUrl: 'https://github.com/kirantushar10/Text-Summarization-using-LangChain-and-Groq-LLaMA',
    year: '2024',
  },
  {
    title: 'HamletGPT: LSTM vs GRU',
    description: {
      en: 'Architectural benchmark of LSTM vs GRU trained on Hamlet, deployed with a side-by-side interactive predictor.',
      de: 'Architektur-Benchmark von LSTM gegen GRU, trainiert auf Hamlet — deployed mit interaktivem Side-by-Side-Predictor.',
    },
    tags: ['LSTM', 'GRU', 'TensorFlow', 'Streamlit'],
    githubUrl: 'https://github.com/kirantushar10/HamletGPT-Next-Word-Prediction-with-LSTM-and-GRU',
    year: '2023',
  },
  {
    title: 'Movie Review Sentiment Analysis',
    description: {
      en: 'RNN binary classification model built with Keras/TensorFlow for real-time movie review sentiment inference.',
      de: 'RNN-Modell für Binärklassifikation mit Keras/TensorFlow für Echtzeit-Sentiment-Analyse von Filmkritiken.',
    },
    tags: ['RNN', 'Keras', 'NLP', 'Streamlit'],
    githubUrl: 'https://github.com/kirantushar10/IMDB-Movie-Review-Sentiment-Analyzer-using-RNN',
    year: '2023',
  },
  {
    title: 'Financial Analytics & ARIMA Forecasts',
    description: {
      en: 'Financial dashboard computing technical indicators (RSI, MACD) and 30-day ARIMA price forecasts.',
      de: 'Finanz-Dashboard, das technische Indikatoren (RSI, MACD) berechnet und 30-Tage-ARIMA-Preisprognosen ausgeben.',
    },
    tags: ['ARIMA', 'Time Series', 'yfinance', 'Plotly'],
    githubUrl: 'https://github.com/kirantushar10/Stock-Market-Analysis-and-Time-Series-Forecasting',
    year: '2023',
  },
  {
    title: 'Customer Churn Prediction',
    description: {
      en: 'End-to-end deep learning churn classifier with Keras & Scikit-learn, deployed with an interactive web GUI.',
      de: 'End-to-End-Deep-Learning-Classifier für Kunden-Churn mit Keras & Scikit-learn, deployed mit interaktiver Web-GUI.',
    },
    tags: ['ANN', 'Deep Learning', 'Scikit-learn', 'Streamlit'],
    githubUrl: 'https://github.com/kirantushar10/ANN-Classification-Churn',
    year: '2023',
  },
];

export const experiences = [
  {
    role: {
      en: 'AI/ML Engineer Intern',
      de: 'AI/ML-Engineering-Praktikant',
    },
    company: 'Analog Devices',
    location: { en: 'Munich, Germany', de: 'München, Deutschland' },
    period: 'May 2026 – Oct 2026',
    bullets: {
      en: [
        'Built an AI-assisted analytics platform cutting data exploration from ~50 min to ~10 sec via an interactive knowledge graph.',
        'Developed async FastAPI, PostgreSQL, and Docker backend with Redis session management.',
        'Automated nightly data updates with Apache Airflow ETL pipelines.',
        'Integrated LLMs via Portkey with multi-hop retrieval, model routing, and grounding checks.',
        'Built Cytoscape.js knowledge-graph UI and Chrome extension with multi-turn memory.',
      ],
      de: [
        'Eingebaut eine KI-gestützte Analytics-Plattform, die die Datenexploration von ~50 Min. auf ~10 Sek. reduziert — über einen interaktiven Knowledge Graph.',
        'Entwickelte einen asynchronen FastAPI-, PostgreSQL- und Docker-Backend mit Redis-Session-Management.',
        'Automatisierte nächtliche Datenaktualisierung mit Apache-Airflow-ETL-Pipelines.',
        'Integrierte LLMs über Portkey mit Multi-Hop-Retrieval, Modell-Routing und Grounding-Checks.',
        'Baut eine Cytoscape.js-Knowledge-Graph-UI und Chrome-Erweiterung mit Multi-Turn-Speicher.',
      ],
    },
  },
  {
    role: {
      en: 'Student Assistant – Cyber-Physical Systems',
      de: 'Studentische Hilfskraft — Cyber-Physical Systems',
    },
    company: 'Technische Universität Berlin',
    location: { en: 'Berlin, Germany', de: 'Berlin, Deutschland' },
    period: 'Mar 2026 – Apr 2026',
    bullets: {
      en: [
        'Delivered weekly ML and Python labs for 150+ engineering students.',
        'Mentored students on debugging and maintained the course GitHub repository.',
      ],
      de: [
        'Leitete wöchentliche ML- und Python-Labore für über 150 Ingenieur-Studierende.',
        'Begleitete Studierende beim Debugging und pflegte das GitHub-Repository des Kurses.',
      ],
    },
  },
  {
    role: {
      en: 'Associate Software Engineer II',
      de: 'Associate Software Engineer II',
    },
    company: 'Carelon Global Solutions',
    location: { en: 'Bengaluru, India', de: 'Bengaluru, Indien' },
    period: 'Aug 2022 – May 2023',
    bullets: {
      en: [
        'Backend transaction processing on IBM z/OS with COBOL, JCL, and IBM Db2.',
        'Automated 15+ JCL scripts (saving 10+ hrs/week) and resolved 50+ production incidents.',
      ],
      de: [
        'Backend-Transaktionsverarbeitung auf IBM z/OS mit COBOL, JCL und IBM Db2.',
        'Automatisierte 15+ JCL-Skripte (Ersparnis: 10+ Std./Woche) und löste 50+ Produktivitäts-Zustände.',
      ],
    },
  },
  {
    role: {
      en: 'Web Developer & Cyber Security Intern',
      de: 'Web-Development- & Cyber-Security-Praktikant',
    },
    company: 'Bharat Heavy Electricals Limited (BHEL)',
    location: { en: 'Nagpur, India', de: 'Nagpur, Indien' },
    period: 'Sept 2021 – Oct 2021',
    bullets: {
      en: [
        'Reduced report generation by 30% via multi-threaded PHP/PL/SQL processing.',
        'Conducted vulnerability assessments and ISO 27001:2013 compliance testing.',
      ],
      de: [
        'Reduzierte die Report-Generierung um 30 % über multithreadiges PHP/PL/SQL-Verarbeitung.',
        'Führte Schwachstellen-Bewertungen und ISO-27001:2013-Konformitätstests durch.',
      ],
    },
  },
];

export const skillGroups = [
  {
    label: { en: 'Generative AI & LLMs', de: 'Generative KI & LLMs' },
    items: ['LLM Applications', 'RAG Pipelines', 'AI Agents', 'LangChain', 'LangGraph', 'Hugging Face', 'LangSmith', 'Portkey', 'Groq (LLaMA 3)'],
  },
  {
    label: { en: 'Backend & MLOps', de: 'Backend & MLOps' },
    items: ['FastAPI', 'Docker', 'MLflow', 'DVC', 'GitHub Actions CI/CD', 'Apache Airflow', 'AsyncIO'],
  },
  {
    label: { en: 'Databases & Vector Search', de: 'Datenbanken & Vektorsuche' },
    items: ['ChromaDB', 'FAISS', 'PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'IBM Db2'],
  },
  {
    label: { en: 'Languages & Deep Learning', de: 'Sprachen & Deep Learning' },
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'TensorFlow', 'Keras', 'Scikit-learn', 'Pandas / NumPy'],
  },
];
