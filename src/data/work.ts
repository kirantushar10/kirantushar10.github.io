// Work data — case studies (full pages under /work/<slug>) + project list.
// English only.

export interface CaseStudy {
  slug: string;
  index: string;
  title: string;
  summary: string;
  year: string;
  role: string;
  githubUrl: string;
  overview: string;
  challenge: string;
  approach: string[];
  outcome: string;
  stack: string[];
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  year: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'conversational-rag-assistant',
    index: '01',
    title: 'Conversational RAG Assistant',
    summary: 'Production-grade conversational RAG platform with semantic retrieval, multi-turn memory, and real-time observability.',
    year: '2025',
    role: 'Design & Implementation',
    githubUrl: 'https://github.com/kirantushar10/Conversational-RAG-Assistant',
    overview: 'An advanced Retrieval-Augmented Generation chatbot built with LangChain, Groq LLaMA 3, Chroma, and Hugging Face embeddings. It supports multi-turn conversations, contextual memory, and LangSmith tracing for real-time observability — combining knowledge retrieval with LLM reasoning for context-aware Q&A.',
    challenge: 'A one-shot RAG chain forgets everything between turns: follow-up questions like "what about its pricing?" have no referent, so retrieval runs on the wrong query and the answer drifts. The system needed conversational state, history-aware retrieval, and a way to debug every step of the pipeline — while staying fast enough for real interaction.',
    approach: [
      'Embedded document chunks with all-MiniLM-L6-v2 (Hugging Face) into ChromaDB for semantic search over the knowledge base.',
      'Wrapped the chain with ChatMessageHistory + RunnableWithMessageHistory so every turn carries full conversation context.',
      'Used a history-aware retriever to rewrite follow-up questions into self-contained queries before retrieval — "its pricing" becomes "pricing of <subject>".',
      'Chose Groq for LLaMA 3 inference: high-speed responses keep the conversational loop feeling instant.',
      'Added LangSmith tracing to observe, debug, and profile every run in real time.',
      'Loaded external blog content with WebBaseLoader to extend the knowledge base beyond local documents.',
    ],
    outcome: 'A conversational assistant that answers multi-turn questions over live web content with low-latency Groq inference, full retrieval context, and end-to-end pipeline observability via LangSmith.',
    stack: ['LangChain', 'Groq (LLaMA 3)', 'ChromaDB', 'Hugging Face', 'LangSmith', 'Python'],
  },
  {
    slug: 'agentic-search-engine',
    index: '02',
    title: 'Agentic Search Engine',
    summary: 'Autonomous reasoning agent that routes queries across Wikipedia, ArXiv papers, and live web search.',
    year: '2025',
    role: 'Design & Implementation',
    githubUrl: 'https://github.com/kirantushar10/Search-Engine-with-Tools-and-Agents',
    overview: 'A search engine built with LangChain Tools, Groq LLaMA, HuggingFace Embeddings, and LangSmith Tracking. The agent decides which source each query needs — Wikipedia for encyclopedic facts, ArXiv for academic papers, and a custom web loader and retriever for live content — then synthesizes a grounded answer.',
    challenge: 'No single source covers everything: encyclopedic questions, research questions, and real-world questions each need different data. A fixed pipeline retrieves from one place and is wrong about two-thirds of queries. The system had to decide, per query, which tool(s) to call — and when to combine them.',
    approach: [
      'Built the agent on LangChain Tools so each source (Wikipedia, ArXiv, custom web loader + retriever) is a first-class callable tool.',
      'Used Groq LLaMA as the reasoning model that inspects the query, selects tools, and iterates on intermediate results.',
      'Embedded intermediate evidence with HuggingFace embeddings so the agent can compare and merge across sources.',
      'Instrumented the whole loop with LangSmith for step-by-step monitoring of tool calls, routing decisions, and latency.',
    ],
    outcome: 'A search experience that adapts its source per query — Search, Fetch, Process, Trace — with the agent handling routing and synthesis automatically, and full observability of every decision.',
    stack: ['LangChain', 'LangGraph', 'Groq (LLaMA)', 'FAISS', 'Hugging Face', 'LangSmith', 'Python'],
  },
  {
    slug: 'end-to-end-ml-pipeline',
    index: '03',
    title: 'End-to-End ML Pipeline',
    summary: 'Complete MLOps pipeline: data versioning, experiment tracking, model registry, and CI/CD deployment.',
    year: '2025',
    role: 'Design & Implementation',
    githubUrl: 'https://github.com/kirantushar10/Machine-Learning-Pipeline-with-DVC-MLflow-and-DagsHub',
    overview: 'A complete automated MLOps pipeline that handles data ingestion, validation, experiment tracking, model versioning, and containerized deployment — built on DVC for data, MLflow for experiments, and DagsHub for remote storage and CI.',
    challenge: 'Machine learning code is only as reproducible as its data. A model that scores well on a laptop and collapses in production is usually a data-provenance problem: nobody can say which dataset trained which model, or rerun the exact experiment. The pipeline needed data versioning, experiment metadata, and a deployable model artifact — all tied together.',
    approach: [
      'Versioned datasets and model artifacts with DVC, pushing them to DagsHub for remote storage and diffing.',
      'Tracked every training run with MLflow: parameters, metrics, and model artifacts in one registry.',
      'Connected DagsHub to GitHub Actions so data, experiments, and deploys run on a reproducible CI path.',
      'Trained a scikit-learn RandomForest baseline end-to-end through the pipeline as the reference workload.',
    ],
    outcome: 'A reproducible MLOps workflow where any historical experiment can be re-run from versioned data, every run is traceable in MLflow, and new models deploy through CI without manual steps.',
    stack: ['DVC', 'MLflow', 'DagsHub', 'GitHub Actions', 'Scikit-learn', 'Docker', 'Python'],
  },
];

export const projects: Project[] = [
  {
    title: 'Automated CI/CD Flask Pipeline',
    description: 'Automated CI/CD pipeline using Pytest, Docker, and GitHub Actions for continuous build-test-deploy on every commit.',
    tags: ['Docker', 'GitHub Actions', 'Flask', 'Pytest'],
    githubUrl: 'https://github.com/kirantushar10/CI-CD-Pipeline-for-Dockerized-Flask-Application',
    year: '2024',
  },
  {
    title: 'Enterprise Airflow & Postgres ETL',
    description: 'Production-style Airflow pipeline pulling NASA APOD API data, transforming JSON payloads, and loading into Dockerized Postgres via custom hooks.',
    tags: ['Apache Airflow', 'PostgreSQL', 'Docker', 'ETL'],
    githubUrl: 'https://github.com/kirantushar10/Apache-Airflow-ETL-With-Postgres-and-API',
    year: '2024',
  },
  {
    title: 'NVIDIA NIM Document QA Assistant',
    description: 'Interactive Streamlit app leveraging NVIDIA Inference Microservices, FAISS vector search, and LLaMA 3.3 (70B) for deep document QA.',
    tags: ['NVIDIA NIM', 'LLaMA 3.3', 'FAISS', 'Streamlit'],
    githubUrl: 'https://github.com/kirantushar10/NVIDIA-NIM-RAG-Demo',
    year: '2025',
  },
  {
    title: 'Multi-Strategy Summarizer',
    description: 'High-speed document summarizer supporting Stuff, Map-Reduce, and Refine chain architectures with multilingual output and token telemetry.',
    tags: ['LangChain', 'Groq', 'LLaMA 3.1', 'NLP'],
    githubUrl: 'https://github.com/kirantushar10/Text-Summarization-using-LangChain-and-Groq-LLaMA',
    year: '2024',
  },
  {
    title: 'HamletGPT: LSTM vs GRU',
    description: 'Architectural benchmark of LSTM vs GRU trained on Hamlet, deployed with a side-by-side interactive predictor.',
    tags: ['LSTM', 'GRU', 'TensorFlow', 'Streamlit'],
    githubUrl: 'https://github.com/kirantushar10/HamletGPT-Next-Word-Prediction-with-LSTM-and-GRU',
    year: '2023',
  },
  {
    title: 'Movie Review Sentiment Analysis',
    description: 'RNN binary classification model built with Keras/TensorFlow for real-time movie review sentiment inference.',
    tags: ['RNN', 'Keras', 'NLP', 'Streamlit'],
    githubUrl: 'https://github.com/kirantushar10/IMDB-Movie-Review-Sentiment-Analyzer-using-RNN',
    year: '2023',
  },
  {
    title: 'Financial Analytics & ARIMA Forecasts',
    description: 'Financial dashboard computing technical indicators (RSI, MACD) and 30-day ARIMA price forecasts.',
    tags: ['ARIMA', 'Time Series', 'yfinance', 'Plotly'],
    githubUrl: 'https://github.com/kirantushar10/Stock-Market-Analysis-and-Time-Series-Forecasting',
    year: '2023',
  },
  {
    title: 'Customer Churn Prediction',
    description: 'End-to-end deep learning churn classifier with Keras & Scikit-learn, deployed with an interactive web GUI.',
    tags: ['ANN', 'Deep Learning', 'Scikit-learn', 'Streamlit'],
    githubUrl: 'https://github.com/kirantushar10/ANN-Classification-Churn',
    year: '2023',
  },
];

export const experiences = [
  {
    role: 'AI/ML Engineer Intern',
    company: 'Analog Devices',
    location: 'Munich, Germany',
    period: 'May 2026 – Oct 2026',
    bullets: [
      'Built an AI-assisted analytics platform cutting data exploration from ~50 min to ~10 sec via an interactive knowledge graph.',
      'Developed async FastAPI, PostgreSQL, and Docker backend with Redis session management.',
      'Automated nightly data updates with Apache Airflow ETL pipelines.',
      'Integrated LLMs via Portkey with multi-hop retrieval, model routing, and grounding checks.',
      'Built Cytoscape.js knowledge-graph UI and Chrome extension with multi-turn memory.',
    ],
  },
  {
    role: 'Student Assistant – Cyber-Physical Systems',
    company: 'Technische Universität Berlin',
    location: 'Berlin, Germany',
    period: 'Mar 2026 – Apr 2026',
    bullets: [
      'Delivered weekly ML and Python labs for 150+ engineering students.',
      'Mentored students on debugging and maintained the course GitHub repository.',
    ],
  },
  {
    role: 'Associate Software Engineer II',
    company: 'Carelon Global Solutions',
    location: 'Bengaluru, India',
    period: 'Aug 2022 – May 2023',
    bullets: [
      'Backend transaction processing on IBM z/OS with COBOL, JCL, and IBM Db2.',
      'Automated 15+ JCL scripts (saving 10+ hrs/week) and resolved 50+ production incidents.',
    ],
  },
  {
    role: 'Web Developer & Cyber Security Intern',
    company: 'Bharat Heavy Electricals Limited (BHEL)',
    location: 'Nagpur, India',
    period: 'Sept 2021 – Oct 2021',
    bullets: [
      'Reduced report generation by 30% via multi-threaded PHP/PL/SQL processing.',
      'Conducted vulnerability assessments and ISO 27001:2013 compliance testing.',
    ],
  },
];

export const skillGroups = [
  {
    label: 'Generative AI & LLMs',
    items: ['LLM Applications', 'RAG Pipelines', 'AI Agents', 'LangChain', 'LangGraph', 'Hugging Face', 'LangSmith', 'Portkey', 'Groq (LLaMA 3)'],
  },
  {
    label: 'Backend & MLOps',
    items: ['FastAPI', 'Docker', 'MLflow', 'DVC', 'GitHub Actions CI/CD', 'Apache Airflow', 'AsyncIO'],
  },
  {
    label: 'Databases & Vector Search',
    items: ['ChromaDB', 'FAISS', 'PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'IBM Db2'],
  },
  {
    label: 'Languages & Deep Learning',
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'TensorFlow', 'Keras', 'Scikit-learn', 'Pandas / NumPy'],
  },
];
