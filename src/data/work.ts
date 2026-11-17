// Work data — case studies (full pages under /work/<slug>) + project list.

export interface CaseStudy {
  slug: string;
  index: string;
  title: { en: string; zh: string };
  summary: { en: string; zh: string };
  year: string;
  role: { en: string; zh: string };
  githubUrl: string;
  overview: { en: string; zh: string };
  challenge: { en: string; zh: string };
  approach: string[];
  outcome: { en: string; zh: string };
  stack: string[];
}

export interface Project {
  title: string;
  description: { en: string; zh: string };
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
      zh: '对话式 RAG 助手',
    },
    summary: {
      en: 'Production-grade conversational RAG platform with semantic retrieval, multi-turn memory, and real-time observability.',
      zh: '生产级对话式 RAG 平台：语义检索、多轮记忆与实时可观测性。',
    },
    year: '2025',
    role: { en: 'Design & Implementation', zh: '设计与实现' },
    githubUrl: 'https://github.com/kirantushar10/Conversational-RAG-Assistant',
    overview: {
      en: 'An advanced Retrieval-Augmented Generation chatbot built with LangChain, Groq LLaMA 3, Chroma, and Hugging Face embeddings. It supports multi-turn conversations, contextual memory, and LangSmith tracing for real-time observability — combining knowledge retrieval with LLM reasoning for context-aware Q&A.',
      zh: '基于 LangChain、Groq LLaMA 3、Chroma 与 Hugging Face 嵌入构建的高级 RAG 聊天机器人，支持多轮对话、上下文记忆，并通过 LangSmith 追踪实现实时可观测性——将知识检索与 LLM 推理结合，实现上下文感知的问答。',
    },
    challenge: {
      en: 'A one-shot RAG chain forgets everything between turns: follow-up questions like "what about its pricing?" have no referent, so retrieval runs on the wrong query and the answer drifts. The system needed conversational state, history-aware retrieval, and a way to debug every step of the pipeline — while staying fast enough for real interaction.',
      zh: '单轮 RAG 链路在轮次之间丢失全部上下文：像"它的定价呢？"这样的追问没有指代对象，检索会跑偏，回答也随之漂移。系统需要会话状态、基于历史的检索，以及逐步调试管线的手段——同时保持足够快的响应速度。',
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
      zh: '一个可基于实时网页内容进行多轮问答的对话助手：Groq 低延迟推理、完整的检索上下文，并通过 LangSmith 实现端到端管线可观测性。',
    },
    stack: ['LangChain', 'Groq (LLaMA 3)', 'ChromaDB', 'Hugging Face', 'LangSmith', 'Python'],
  },
  {
    slug: 'agentic-search-engine',
    index: '02',
    title: {
      en: 'Agentic Search Engine',
      zh: '智能体搜索引擎',
    },
    summary: {
      en: 'Autonomous reasoning agent that routes queries across Wikipedia, ArXiv papers, and live web search.',
      zh: '自主推理智能体，在维基百科、ArXiv 论文与实时网页检索之间动态路由查询。',
    },
    year: '2025',
    role: { en: 'Design & Implementation', zh: '设计与实现' },
    githubUrl: 'https://github.com/kirantushar10/Search-Engine-with-Tools-and-Agents',
    overview: {
      en: 'A search engine built with LangChain Tools, Groq LLaMA, HuggingFace Embeddings, and LangSmith Tracking. The agent decides which source each query needs — Wikipedia for encyclopedic facts, ArXiv for academic papers, and a custom web loader and retriever for live content — then synthesizes a grounded answer.',
      zh: '基于 LangChain Tools、Groq LLaMA、HuggingFace 嵌入与 LangSmith 追踪构建的搜索引擎。智能体判断每条查询需要什么来源——维基百科查百科事实、ArXiv 查学术论文、自定义网页加载器与检索器查实时内容——再合成有依据的回答。',
    },
    challenge: {
      en: 'No single source covers everything: encyclopedic questions, research questions, and real-world questions each need different data. A fixed pipeline retrieves from one place and is wrong about two-thirds of queries. The system had to decide, per query, which tool(s) to call — and when to combine them.',
      zh: '没有任何单一来源能覆盖所有问题：百科问题、研究问题与现实世界问题各需不同数据。固定管线只从一个地方检索，对约三分之二的查询给出错误结果。系统必须按查询决定调用哪个工具——以及何时组合使用。',
    },
    approach: [
      'Built the agent on LangChain Tools so each source (Wikipedia, ArXiv, custom web loader + retriever) is a first-class callable tool.',
      'Used Groq LLaMA as the reasoning model that inspects the query, selects tools, and iterates on intermediate results.',
      'Embedded intermediate evidence with HuggingFace embeddings so the agent can compare and merge across sources.',
      'Instrumented the whole loop with LangSmith for step-by-step monitoring of tool calls, routing decisions, and latency.',
    ],
    outcome: {
      en: 'A search experience that adapts its source per query — Search, Fetch, Process, Trace — with the agent handling routing and synthesis automatically, and full observability of every decision.',
      zh: '按查询自适应选择来源的搜索体验——Search、Fetch、Process、Trace——路由与合成全部由智能体自动完成，每个决策均可完整追溯。',
    },
    stack: ['LangChain', 'LangGraph', 'Groq (LLaMA)', 'FAISS', 'Hugging Face', 'LangSmith', 'Python'],
  },
  {
    slug: 'end-to-end-ml-pipeline',
    index: '03',
    title: {
      en: 'End-to-End ML Pipeline',
      zh: '端到端 ML 流水线',
    },
    summary: {
      en: 'Complete MLOps pipeline: data versioning, experiment tracking, model registry, and CI/CD deployment.',
      zh: '完整 MLOps 流水线：数据版本控制、实验追踪、模型注册中心与 CI/CD 部署。',
    },
    year: '2025',
    role: { en: 'Design & Implementation', zh: '设计与实现' },
    githubUrl: 'https://github.com/kirantushar10/Machine-Learning-Pipeline-with-DVC-MLflow-and-DagsHub',
    overview: {
      en: 'A complete automated MLOps pipeline that handles data ingestion, validation, experiment tracking, model versioning, and containerized deployment — built on DVC for data, MLflow for experiments, and DagsHub for remote storage and CI.',
      zh: '一套完整的自动化 MLOps 流水线，覆盖数据摄取、校验、实验追踪、模型版本控制与容器化部署——以 DVC 管理数据、MLflow 管理实验、DagsHub 提供远程存储与 CI。',
    },
    challenge: {
      en: 'Machine learning code is only as reproducible as its data. A model that scores well on a laptop and collapses in production is usually a data-provenance problem: nobody can say which dataset trained which model, or rerun the exact experiment. The pipeline needed data versioning, experiment metadata, and a deployable model artifact — all tied together.',
      zh: '机器学习代码的可复现性取决于数据。在笔记本上得分良好、上线后崩塌的模型，通常出在数据溯源上：没人能说清哪个数据集训练了哪个模型，也无法精确复现实验。流水线需要把数据版本、实验元数据与可部署的模型产物全部关联起来。',
    },
    approach: [
      'Versioned datasets and model artifacts with DVC, pushing them to DagsHub for remote storage and diffing.',
      'Tracked every training run with MLflow: parameters, metrics, and model artifacts in one registry.',
      'Connected DagsHub to GitHub Actions so data, experiments, and deploys run on a reproducible CI path.',
      'Trained a scikit-learn RandomForest baseline end-to-end through the pipeline as the reference workload.',
    ],
    outcome: {
      en: 'A reproducible MLOps workflow where any historical experiment can be re-run from versioned data, every run is traceable in MLflow, and new models deploy through CI without manual steps.',
      zh: '一套可复现的 MLOps 工作流：任何历史实验都能基于版本化数据重跑，所有运行在 MLflow 中可追溯，新模型通过 CI 自动部署、无需人工步骤。',
    },
    stack: ['DVC', 'MLflow', 'DagsHub', 'GitHub Actions', 'Scikit-learn', 'Docker', 'Python'],
  },
];

export const projects: Project[] = [
  {
    title: 'Automated CI/CD Flask Pipeline',
    description: {
      en: 'Automated CI/CD pipeline using Pytest, Docker, and GitHub Actions for continuous build-test-deploy on every commit.',
      zh: '基于 Pytest、Docker 与 GitHub Actions 的自动化 CI/CD 流水线，每次提交持续执行构建—测试—部署。',
    },
    tags: ['Docker', 'GitHub Actions', 'Flask', 'Pytest'],
    githubUrl: 'https://github.com/kirantushar10/CI-CD-Pipeline-for-Dockerized-Flask-Application',
    year: '2024',
  },
  {
    title: 'Enterprise Airflow & Postgres ETL',
    description: {
      en: 'Production-style Airflow pipeline pulling NASA APOD API data, transforming JSON payloads, and loading into Dockerized Postgres via custom hooks.',
      zh: '生产级 Airflow 流水线：拉取 NASA APOD API 数据，转换 JSON 载荷，通过自定义 Hook 写入容器化 Postgres。',
    },
    tags: ['Apache Airflow', 'PostgreSQL', 'Docker', 'ETL'],
    githubUrl: 'https://github.com/kirantushar10/Apache-Airflow-ETL-With-Postgres-and-API',
    year: '2024',
  },
  {
    title: 'NVIDIA NIM Document QA Assistant',
    description: {
      en: 'Interactive Streamlit app leveraging NVIDIA Inference Microservices, FAISS vector search, and LLaMA 3.3 (70B) for deep document QA.',
      zh: '交互式 Streamlit 应用：基于 NVIDIA 推理微服务、FAISS 向量检索与 LLaMA 3.3 (70B) 实现深度文档问答。',
    },
    tags: ['NVIDIA NIM', 'LLaMA 3.3', 'FAISS', 'Streamlit'],
    githubUrl: 'https://github.com/kirantushar10/NVIDIA-NIM-RAG-Demo',
    year: '2025',
  },
  {
    title: 'Multi-Strategy Summarizer',
    description: {
      en: 'High-speed document summarizer supporting Stuff, Map-Reduce, and Refine chain architectures with multilingual output and token telemetry.',
      zh: '高速文档摘要器，支持 Stuff、Map-Reduce 与 Refine 三种链式架构，输出多语言并附带 token 遥测。',
    },
    tags: ['LangChain', 'Groq', 'LLaMA 3.1', 'NLP'],
    githubUrl: 'https://github.com/kirantushar10/Text-Summarization-using-LangChain-and-Groq-LLaMA',
    year: '2024',
  },
  {
    title: 'HamletGPT: LSTM vs GRU',
    description: {
      en: 'Architectural benchmark of LSTM vs GRU trained on Hamlet, deployed with a side-by-side interactive predictor.',
      zh: '基于《哈姆雷特》训练 LSTM 与 GRU 的架构对比实验，附带并排交互式预测器部署。',
    },
    tags: ['LSTM', 'GRU', 'TensorFlow', 'Streamlit'],
    githubUrl: 'https://github.com/kirantushar10/HamletGPT-Next-Word-Prediction-with-LSTM-and-GRU',
    year: '2023',
  },
  {
    title: 'Movie Review Sentiment Analysis',
    description: {
      en: 'RNN binary classification model built with Keras/TensorFlow for real-time movie review sentiment inference.',
      zh: '基于 Keras/TensorFlow 的 RNN 二分类模型，用于实时影评情感推断。',
    },
    tags: ['RNN', 'Keras', 'NLP', 'Streamlit'],
    githubUrl: 'https://github.com/kirantushar10/IMDB-Movie-Review-Sentiment-Analyzer-using-RNN',
    year: '2023',
  },
  {
    title: 'Financial Analytics & ARIMA Forecasts',
    description: {
      en: 'Financial dashboard computing technical indicators (RSI, MACD) and 30-day ARIMA price forecasts.',
      zh: '金融仪表盘：计算技术指标（RSI、MACD）并输出 30 天 ARIMA 价格预测。',
    },
    tags: ['ARIMA', 'Time Series', 'yfinance', 'Plotly'],
    githubUrl: 'https://github.com/kirantushar10/Stock-Market-Analysis-and-Time-Series-Forecasting',
    year: '2023',
  },
  {
    title: 'Customer Churn Prediction',
    description: {
      en: 'End-to-end deep learning churn classifier with Keras & Scikit-learn, deployed with an interactive web GUI.',
      zh: '端到端深度学习流失预测分类器：Keras 与 Scikit-learn 构建，交互式 Web GUI 部署。',
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
      zh: 'AI/ML 工程师实习生',
    },
    company: 'Analog Devices',
    location: { en: 'Munich, Germany', zh: '德国·慕尼黑' },
    period: 'May 2026 – Oct 2026',
    bullets: {
      en: [
        'Built an AI-assisted analytics platform cutting data exploration from ~50 min to ~10 sec via an interactive knowledge graph.',
        'Developed async FastAPI, PostgreSQL, and Docker backend with Redis session management.',
        'Automated nightly data updates with Apache Airflow ETL pipelines.',
        'Integrated LLMs via Portkey with multi-hop retrieval, model routing, and grounding checks.',
        'Built Cytoscape.js knowledge-graph UI and Chrome extension with multi-turn memory.',
      ],
      zh: [
        '构建 AI 辅助分析平台，通过交互式知识图谱将数据探索时间从约 50 分钟缩短至约 10 秒。',
        '开发基于 FastAPI、PostgreSQL 与 Docker 的异步后端，使用 Redis 管理会话。',
        '使用 Apache Airflow ETL 流水线自动化每晚数据更新。',
        '通过 Portkey 集成 LLM，实现多跳检索、模型路由与答案溯源校验。',
        '构建 Cytoscape.js 知识图谱 UI 与带多轮记忆的 Chrome 扩展。',
      ],
    },
  },
  {
    role: {
      en: 'Student Assistant – Cyber-Physical Systems',
      zh: '学生助教——信息物理系统课程',
    },
    company: 'Technische Universität Berlin',
    location: { en: 'Berlin, Germany', zh: '德国·柏林' },
    period: 'Mar 2026 – Apr 2026',
    bullets: {
      en: [
        'Delivered weekly ML and Python labs for 150+ engineering students.',
        'Mentored students on debugging and maintained the course GitHub repository.',
      ],
      zh: [
        '为 150+ 名工科学生每周讲授机器学习与 Python 实验课。',
        '指导学生调试，并维护课程 GitHub 仓库。',
      ],
    },
  },
  {
    role: {
      en: 'Associate Software Engineer II',
      zh: '软件工程师（二级）',
    },
    company: 'Carelon Global Solutions',
    location: { en: 'Bengaluru, India', zh: '印度·班加罗尔' },
    period: 'Aug 2022 – May 2023',
    bullets: {
      en: [
        'Backend transaction processing on IBM z/OS with COBOL, JCL, and IBM Db2.',
        'Automated 15+ JCL scripts (saving 10+ hrs/week) and resolved 50+ production incidents.',
      ],
      zh: [
        '基于 IBM z/OS 的后端交易处理，使用 COBOL、JCL 与 IBM Db2。',
        '自动化 15+ 个 JCL 脚本（每周节省 10+ 小时），解决 50+ 起生产事故。',
      ],
    },
  },
  {
    role: {
      en: 'Web Developer & Cyber Security Intern',
      zh: 'Web 开发与安全实习生',
    },
    company: 'Bharat Heavy Electricals Limited (BHEL)',
    location: { en: 'Nagpur, India', zh: '印度·那格浦尔' },
    period: 'Sept 2021 – Oct 2021',
    bullets: {
      en: [
        'Reduced report generation by 30% via multi-threaded PHP/PL/SQL processing.',
        'Conducted vulnerability assessments and ISO 27001:2013 compliance testing.',
      ],
      zh: [
        '通过多线程 PHP/PL/SQL 处理将报表生成时间缩短 30%。',
        '执行漏洞评估与 ISO 27001:2013 合规性测试。',
      ],
    },
  },
];

export const skillGroups = [
  {
    label: { en: 'Generative AI & LLMs', zh: '生成式 AI 与 LLM' },
    items: ['LLM Applications', 'RAG Pipelines', 'AI Agents', 'LangChain', 'LangGraph', 'Hugging Face', 'LangSmith', 'Portkey', 'Groq (LLaMA 3)'],
  },
  {
    label: { en: 'Backend & MLOps', zh: '后端与 MLOps' },
    items: ['FastAPI', 'Docker', 'MLflow', 'DVC', 'GitHub Actions CI/CD', 'Apache Airflow', 'AsyncIO'],
  },
  {
    label: { en: 'Databases & Vector Search', zh: '数据库与向量检索' },
    items: ['ChromaDB', 'FAISS', 'PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'IBM Db2'],
  },
  {
    label: { en: 'Languages & Deep Learning', zh: '语言与深度学习' },
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'TensorFlow', 'Keras', 'Scikit-learn', 'Pandas / NumPy'],
  },
];
