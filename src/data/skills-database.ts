/**
 * Skills Database for Skill Autofill System
 * Hardcoded NLP logic - No database required
 * Contains predefined skills, synonyms, and categories
 */

// Skill Categories
export type SkillCategory = 
  | 'Programming Languages'
  | 'Frameworks & Libraries'
  | 'Tools & Platforms'
  | 'Databases'
  | 'Core CS / Concepts'
  | 'Soft Skills';

export interface SkillDefinition {
  name: string;
  category: SkillCategory;
  synonyms: string[];
  keywords: string[]; // Additional keywords to detect this skill
}

// Comprehensive Skills Database
export const SKILLS_DATABASE: SkillDefinition[] = [
  // ==================== Programming Languages ====================
  { name: 'JavaScript', category: 'Programming Languages', synonyms: ['JS', 'ECMAScript', 'ES6', 'ES2015', 'ES2020'], keywords: ['javascript', 'js', 'ecmascript'] },
  { name: 'TypeScript', category: 'Programming Languages', synonyms: ['TS'], keywords: ['typescript', 'ts'] },
  { name: 'Python', category: 'Programming Languages', synonyms: ['Python3', 'Py'], keywords: ['python', 'py', 'python3'] },
  { name: 'Java', category: 'Programming Languages', synonyms: ['JDK', 'J2SE', 'J2EE'], keywords: ['java', 'jdk', 'jvm'] },
  { name: 'C', category: 'Programming Languages', synonyms: ['C Language', 'ANSI C'], keywords: [] },
  { name: 'C++', category: 'Programming Languages', synonyms: ['CPP', 'C Plus Plus'], keywords: ['c++', 'cpp', 'cplusplus'] },
  { name: 'C#', category: 'Programming Languages', synonyms: ['CSharp', 'C Sharp'], keywords: ['c#', 'csharp'] },
  { name: 'Go', category: 'Programming Languages', synonyms: ['Golang', 'Go Language'], keywords: ['golang', 'go'] },
  { name: 'Rust', category: 'Programming Languages', synonyms: ['Rust Language'], keywords: ['rust'] },
  { name: 'Ruby', category: 'Programming Languages', synonyms: ['Ruby Language'], keywords: ['ruby'] },
  { name: 'PHP', category: 'Programming Languages', synonyms: ['PHP7', 'PHP8'], keywords: ['php'] },
  { name: 'Swift', category: 'Programming Languages', synonyms: ['Swift Language'], keywords: ['swift'] },
  { name: 'Kotlin', category: 'Programming Languages', synonyms: ['Kotlin Language'], keywords: ['kotlin'] },
  { name: 'Scala', category: 'Programming Languages', synonyms: ['Scala Language'], keywords: ['scala'] },
  { name: 'R', category: 'Programming Languages', synonyms: ['R Language', 'R Programming'], keywords: [] },
  { name: 'MATLAB', category: 'Programming Languages', synonyms: ['Mat Lab'], keywords: ['matlab'] },
  { name: 'SQL', category: 'Programming Languages', synonyms: ['Structured Query Language'], keywords: ['sql', 'queries'] },
  { name: 'HTML', category: 'Programming Languages', synonyms: ['HTML5', 'HyperText Markup Language'], keywords: ['html', 'html5'] },
  { name: 'CSS', category: 'Programming Languages', synonyms: ['CSS3', 'Cascading Style Sheets'], keywords: ['css', 'css3', 'styling'] },
  { name: 'Dart', category: 'Programming Languages', synonyms: ['Dart Language'], keywords: ['dart'] },
  { name: 'Perl', category: 'Programming Languages', synonyms: ['Perl5'], keywords: ['perl'] },
  { name: 'Shell', category: 'Programming Languages', synonyms: ['Bash', 'Shell Script', 'Bash Script'], keywords: ['bash', 'shell', 'scripting'] },

  // ==================== Frameworks & Libraries ====================
  { name: 'React', category: 'Frameworks & Libraries', synonyms: ['ReactJS', 'React.js', 'React JS'], keywords: ['react', 'reactjs', 'jsx', 'hooks', 'usestate', 'useeffect'] },
  { name: 'Next.js', category: 'Frameworks & Libraries', synonyms: ['NextJS', 'Next JS', 'Nextjs'], keywords: ['next', 'nextjs', 'next.js', 'ssr', 'server-side rendering'] },
  { name: 'Vue.js', category: 'Frameworks & Libraries', synonyms: ['Vue', 'VueJS', 'Vue 3'], keywords: ['vue', 'vuejs', 'vue.js', 'vuex'] },
  { name: 'Angular', category: 'Frameworks & Libraries', synonyms: ['AngularJS', 'Angular 2+', 'Angular JS'], keywords: ['angular', 'angularjs', 'ng'] },
  { name: 'Node.js', category: 'Frameworks & Libraries', synonyms: ['NodeJS', 'Node JS', 'Node'], keywords: ['node', 'nodejs', 'node.js', 'npm'] },
  { name: 'Express.js', category: 'Frameworks & Libraries', synonyms: ['Express', 'ExpressJS'], keywords: ['express', 'expressjs'] },
  { name: 'Django', category: 'Frameworks & Libraries', synonyms: ['Django Framework'], keywords: ['django'] },
  { name: 'Flask', category: 'Frameworks & Libraries', synonyms: ['Flask Framework'], keywords: ['flask'] },
  { name: 'FastAPI', category: 'Frameworks & Libraries', synonyms: ['Fast API'], keywords: ['fastapi'] },
  { name: 'Spring Boot', category: 'Frameworks & Libraries', synonyms: ['Spring', 'Spring Framework', 'SpringBoot'], keywords: ['spring', 'springboot'] },
  { name: 'Ruby on Rails', category: 'Frameworks & Libraries', synonyms: ['Rails', 'RoR'], keywords: ['rails', 'ruby on rails'] },
  { name: '.NET', category: 'Frameworks & Libraries', synonyms: ['DotNet', '.NET Core', 'ASP.NET'], keywords: ['dotnet', '.net', 'asp.net'] },
  { name: 'Laravel', category: 'Frameworks & Libraries', synonyms: ['Laravel Framework'], keywords: ['laravel'] },
  { name: 'Flutter', category: 'Frameworks & Libraries', synonyms: ['Flutter SDK'], keywords: ['flutter'] },
  { name: 'React Native', category: 'Frameworks & Libraries', synonyms: ['ReactNative', 'RN'], keywords: ['react native', 'reactnative'] },
  { name: 'Svelte', category: 'Frameworks & Libraries', synonyms: ['SvelteJS', 'Svelte Kit'], keywords: ['svelte', 'sveltekit'] },
  { name: 'jQuery', category: 'Frameworks & Libraries', synonyms: ['JQuery'], keywords: ['jquery'] },
  { name: 'Bootstrap', category: 'Frameworks & Libraries', synonyms: ['Bootstrap CSS', 'Bootstrap 5'], keywords: ['bootstrap'] },
  { name: 'Tailwind CSS', category: 'Frameworks & Libraries', synonyms: ['Tailwind', 'TailwindCSS'], keywords: ['tailwind', 'tailwindcss'] },
  { name: 'Material UI', category: 'Frameworks & Libraries', synonyms: ['MUI', 'Material-UI'], keywords: ['material ui', 'mui'] },
  { name: 'Redux', category: 'Frameworks & Libraries', synonyms: ['Redux Toolkit', 'React Redux'], keywords: ['redux', 'redux toolkit'] },
  { name: 'GraphQL', category: 'Frameworks & Libraries', synonyms: ['Graph QL'], keywords: ['graphql', 'apollo'] },
  { name: 'TensorFlow', category: 'Frameworks & Libraries', synonyms: ['TF', 'Tensor Flow'], keywords: ['tensorflow', 'tf'] },
  { name: 'PyTorch', category: 'Frameworks & Libraries', synonyms: ['Py Torch'], keywords: ['pytorch'] },
  { name: 'Keras', category: 'Frameworks & Libraries', synonyms: ['Keras API'], keywords: ['keras'] },
  { name: 'Pandas', category: 'Frameworks & Libraries', synonyms: ['Python Pandas'], keywords: ['pandas', 'dataframe'] },
  { name: 'NumPy', category: 'Frameworks & Libraries', synonyms: ['Numpy', 'Numerical Python'], keywords: ['numpy', 'np'] },
  { name: 'Scikit-learn', category: 'Frameworks & Libraries', synonyms: ['Sklearn', 'Scikit Learn'], keywords: ['sklearn', 'scikit-learn', 'scikit'] },
  { name: 'OpenCV', category: 'Frameworks & Libraries', synonyms: ['Open CV', 'CV2'], keywords: ['opencv', 'cv2', 'computer vision'] },
  { name: 'Matplotlib', category: 'Frameworks & Libraries', synonyms: ['Mat Plot Lib'], keywords: ['matplotlib', 'plt'] },
  { name: 'Seaborn', category: 'Frameworks & Libraries', synonyms: [], keywords: ['seaborn'] },
  { name: 'Selenium', category: 'Frameworks & Libraries', synonyms: ['Selenium WebDriver'], keywords: ['selenium', 'webdriver'] },
  { name: 'Jest', category: 'Frameworks & Libraries', synonyms: [], keywords: ['jest', 'testing'] },
  { name: 'Mocha', category: 'Frameworks & Libraries', synonyms: [], keywords: ['mocha'] },
  { name: 'Cypress', category: 'Frameworks & Libraries', synonyms: [], keywords: ['cypress', 'e2e testing'] },
  { name: 'Prisma', category: 'Frameworks & Libraries', synonyms: ['Prisma ORM'], keywords: ['prisma'] },
  { name: 'Mongoose', category: 'Frameworks & Libraries', synonyms: [], keywords: ['mongoose', 'mongodb odm'] },
  { name: 'Sequelize', category: 'Frameworks & Libraries', synonyms: [], keywords: ['sequelize'] },
  { name: 'Socket.io', category: 'Frameworks & Libraries', synonyms: ['SocketIO', 'Socket IO'], keywords: ['socket.io', 'socketio', 'websocket'] },

  // ==================== Tools & Platforms ====================
  { name: 'Git', category: 'Tools & Platforms', synonyms: ['Git VCS'], keywords: ['git', 'version control'] },
  { name: 'GitHub', category: 'Tools & Platforms', synonyms: ['Git Hub'], keywords: ['github'] },
  { name: 'GitLab', category: 'Tools & Platforms', synonyms: ['Git Lab'], keywords: ['gitlab'] },
  { name: 'Bitbucket', category: 'Tools & Platforms', synonyms: ['Bit Bucket'], keywords: ['bitbucket'] },
  { name: 'Docker', category: 'Tools & Platforms', synonyms: ['Docker Container'], keywords: ['docker', 'containerization', 'dockerfile'] },
  { name: 'Kubernetes', category: 'Tools & Platforms', synonyms: ['K8s', 'K8'], keywords: ['kubernetes', 'k8s'] },
  { name: 'AWS', category: 'Tools & Platforms', synonyms: ['Amazon Web Services', 'Amazon AWS'], keywords: ['aws', 'ec2', 's3', 'lambda', 'amazon web services'] },
  { name: 'Azure', category: 'Tools & Platforms', synonyms: ['Microsoft Azure', 'MS Azure'], keywords: ['azure', 'microsoft azure'] },
  { name: 'Google Cloud', category: 'Tools & Platforms', synonyms: ['GCP', 'Google Cloud Platform'], keywords: ['gcp', 'google cloud', 'gcloud'] },
  { name: 'Heroku', category: 'Tools & Platforms', synonyms: [], keywords: ['heroku'] },
  { name: 'Vercel', category: 'Tools & Platforms', synonyms: ['Zeit', 'Vercel Platform'], keywords: ['vercel'] },
  { name: 'Netlify', category: 'Tools & Platforms', synonyms: [], keywords: ['netlify'] },
  { name: 'Firebase', category: 'Tools & Platforms', synonyms: ['Google Firebase'], keywords: ['firebase', 'firestore'] },
  { name: 'Supabase', category: 'Tools & Platforms', synonyms: [], keywords: ['supabase'] },
  { name: 'Jenkins', category: 'Tools & Platforms', synonyms: ['Jenkins CI'], keywords: ['jenkins', 'ci/cd'] },
  { name: 'CircleCI', category: 'Tools & Platforms', synonyms: ['Circle CI'], keywords: ['circleci'] },
  { name: 'GitHub Actions', category: 'Tools & Platforms', synonyms: ['GH Actions'], keywords: ['github actions', 'gh actions'] },
  { name: 'Terraform', category: 'Tools & Platforms', synonyms: [], keywords: ['terraform', 'iac', 'infrastructure as code'] },
  { name: 'Ansible', category: 'Tools & Platforms', synonyms: [], keywords: ['ansible'] },
  { name: 'Nginx', category: 'Tools & Platforms', synonyms: ['NGINX'], keywords: ['nginx'] },
  { name: 'Apache', category: 'Tools & Platforms', synonyms: ['Apache Server'], keywords: ['apache'] },
  { name: 'Linux', category: 'Tools & Platforms', synonyms: ['Linux OS', 'Ubuntu', 'CentOS', 'Debian'], keywords: ['linux', 'ubuntu', 'centos', 'debian'] },
  { name: 'VS Code', category: 'Tools & Platforms', synonyms: ['Visual Studio Code', 'VSCode'], keywords: ['vscode', 'vs code', 'visual studio code'] },
  { name: 'IntelliJ IDEA', category: 'Tools & Platforms', synonyms: ['IntelliJ', 'IDEA'], keywords: ['intellij', 'idea'] },
  { name: 'Postman', category: 'Tools & Platforms', synonyms: [], keywords: ['postman', 'api testing'] },
  { name: 'Jira', category: 'Tools & Platforms', synonyms: ['Atlassian Jira'], keywords: ['jira'] },
  { name: 'Confluence', category: 'Tools & Platforms', synonyms: ['Atlassian Confluence'], keywords: ['confluence'] },
  { name: 'Slack', category: 'Tools & Platforms', synonyms: [], keywords: ['slack'] },
  { name: 'Figma', category: 'Tools & Platforms', synonyms: [], keywords: ['figma', 'design'] },
  { name: 'Webpack', category: 'Tools & Platforms', synonyms: [], keywords: ['webpack', 'bundler'] },
  { name: 'Vite', category: 'Tools & Platforms', synonyms: ['ViteJS'], keywords: ['vite', 'vitejs'] },
  { name: 'npm', category: 'Tools & Platforms', synonyms: ['Node Package Manager'], keywords: ['npm'] },
  { name: 'Yarn', category: 'Tools & Platforms', synonyms: [], keywords: ['yarn'] },
  { name: 'pnpm', category: 'Tools & Platforms', synonyms: [], keywords: ['pnpm'] },
  { name: 'Gradle', category: 'Tools & Platforms', synonyms: [], keywords: ['gradle'] },
  { name: 'Maven', category: 'Tools & Platforms', synonyms: ['Apache Maven'], keywords: ['maven', 'pom.xml'] },
  { name: 'Jupyter Notebook', category: 'Tools & Platforms', synonyms: ['Jupyter', 'IPython Notebook'], keywords: ['jupyter', 'notebook', 'ipython'] },
  { name: 'Tableau', category: 'Tools & Platforms', synonyms: [], keywords: ['tableau', 'visualization'] },
  { name: 'Power BI', category: 'Tools & Platforms', synonyms: ['PowerBI', 'Microsoft Power BI'], keywords: ['power bi', 'powerbi'] },

  // ==================== Databases ====================
  { name: 'MySQL', category: 'Databases', synonyms: ['My SQL'], keywords: ['mysql'] },
  { name: 'PostgreSQL', category: 'Databases', synonyms: ['Postgres', 'PG'], keywords: ['postgresql', 'postgres', 'psql'] },
  { name: 'MongoDB', category: 'Databases', synonyms: ['Mongo', 'Mongo DB'], keywords: ['mongodb', 'mongo', 'nosql'] },
  { name: 'Redis', category: 'Databases', synonyms: ['Redis Cache'], keywords: ['redis', 'caching'] },
  { name: 'SQLite', category: 'Databases', synonyms: ['SQL Lite'], keywords: ['sqlite'] },
  { name: 'Oracle', category: 'Databases', synonyms: ['Oracle DB', 'Oracle Database'], keywords: ['oracle', 'oracle db'] },
  { name: 'SQL Server', category: 'Databases', synonyms: ['MS SQL', 'Microsoft SQL Server', 'MSSQL'], keywords: ['sql server', 'mssql'] },
  { name: 'Cassandra', category: 'Databases', synonyms: ['Apache Cassandra'], keywords: ['cassandra'] },
  { name: 'DynamoDB', category: 'Databases', synonyms: ['AWS DynamoDB'], keywords: ['dynamodb'] },
  { name: 'Elasticsearch', category: 'Databases', synonyms: ['Elastic Search', 'ES'], keywords: ['elasticsearch', 'elastic'] },
  { name: 'Neo4j', category: 'Databases', synonyms: ['Neo 4j'], keywords: ['neo4j', 'graph database'] },
  { name: 'MariaDB', category: 'Databases', synonyms: ['Maria DB'], keywords: ['mariadb'] },
  { name: 'CouchDB', category: 'Databases', synonyms: ['Couch DB'], keywords: ['couchdb'] },
  { name: 'Firebase Realtime Database', category: 'Databases', synonyms: ['Firebase RTDB'], keywords: ['realtime database'] },
  { name: 'Firestore', category: 'Databases', synonyms: ['Cloud Firestore'], keywords: ['firestore'] },

  // ==================== Core CS / Concepts ====================
  { name: 'Data Structures', category: 'Core CS / Concepts', synonyms: ['DS', 'DSA'], keywords: ['data structures', 'dsa', 'arrays', 'linked list', 'trees', 'graphs', 'stacks', 'queues'] },
  { name: 'Algorithms', category: 'Core CS / Concepts', synonyms: ['Algo'], keywords: ['algorithms', 'sorting', 'searching', 'dynamic programming', 'recursion'] },
  { name: 'Object-Oriented Programming', category: 'Core CS / Concepts', synonyms: ['OOP', 'OOPs', 'Object Oriented'], keywords: ['oop', 'oops', 'object oriented', 'inheritance', 'polymorphism', 'encapsulation'] },
  { name: 'REST APIs', category: 'Core CS / Concepts', synonyms: ['RESTful APIs', 'REST', 'RESTful'], keywords: ['rest', 'restful', 'api', 'endpoints'] },
  { name: 'System Design', category: 'Core CS / Concepts', synonyms: ['HLD', 'LLD', 'Architecture'], keywords: ['system design', 'architecture', 'scalability'] },
  { name: 'Database Management', category: 'Core CS / Concepts', synonyms: ['DBMS', 'RDBMS'], keywords: ['dbms', 'rdbms', 'database management', 'normalization'] },
  { name: 'Operating Systems', category: 'Core CS / Concepts', synonyms: ['OS'], keywords: ['operating systems', 'os', 'processes', 'threads', 'memory management'] },
  { name: 'Computer Networks', category: 'Core CS / Concepts', synonyms: ['CN', 'Networking'], keywords: ['computer networks', 'networking', 'tcp/ip', 'http', 'dns'] },
  { name: 'Machine Learning', category: 'Core CS / Concepts', synonyms: ['ML'], keywords: ['machine learning', 'ml', 'classification', 'regression', 'clustering'] },
  { name: 'Deep Learning', category: 'Core CS / Concepts', synonyms: ['DL', 'Neural Networks'], keywords: ['deep learning', 'dl', 'neural network', 'cnn', 'rnn', 'lstm'] },
  { name: 'Natural Language Processing', category: 'Core CS / Concepts', synonyms: ['NLP'], keywords: ['nlp', 'natural language', 'text processing', 'tokenization'] },
  { name: 'Computer Vision', category: 'Core CS / Concepts', synonyms: ['CV', 'Image Processing'], keywords: ['computer vision', 'cv', 'image processing', 'object detection'] },
  { name: 'DevOps', category: 'Core CS / Concepts', synonyms: ['Dev Ops'], keywords: ['devops', 'ci/cd', 'continuous integration', 'continuous deployment'] },
  { name: 'Agile', category: 'Core CS / Concepts', synonyms: ['Agile Methodology', 'Scrum'], keywords: ['agile', 'scrum', 'sprint', 'kanban'] },
  { name: 'Test-Driven Development', category: 'Core CS / Concepts', synonyms: ['TDD'], keywords: ['tdd', 'test driven', 'unit testing'] },
  { name: 'Microservices', category: 'Core CS / Concepts', synonyms: ['Micro Services'], keywords: ['microservices', 'microservice architecture'] },
  { name: 'Cloud Computing', category: 'Core CS / Concepts', synonyms: ['Cloud'], keywords: ['cloud computing', 'cloud', 'saas', 'paas', 'iaas'] },
  { name: 'Cybersecurity', category: 'Core CS / Concepts', synonyms: ['Security', 'InfoSec'], keywords: ['cybersecurity', 'security', 'encryption', 'authentication'] },
  { name: 'Blockchain', category: 'Core CS / Concepts', synonyms: ['Distributed Ledger'], keywords: ['blockchain', 'smart contracts', 'web3'] },
  { name: 'Data Analysis', category: 'Core CS / Concepts', synonyms: ['Data Analytics'], keywords: ['data analysis', 'analytics', 'data visualization'] },
  { name: 'Big Data', category: 'Core CS / Concepts', synonyms: [], keywords: ['big data', 'hadoop', 'spark'] },
  { name: 'CRUD Operations', category: 'Core CS / Concepts', synonyms: ['CRUD'], keywords: ['crud', 'create', 'read', 'update', 'delete'] },
  { name: 'Authentication', category: 'Core CS / Concepts', synonyms: ['Auth', 'AuthN'], keywords: ['authentication', 'auth', 'oauth', 'jwt', 'login'] },
  { name: 'Authorization', category: 'Core CS / Concepts', synonyms: ['AuthZ'], keywords: ['authorization', 'rbac', 'permissions'] },
  { name: 'Responsive Design', category: 'Core CS / Concepts', synonyms: ['Mobile-First', 'RWD'], keywords: ['responsive', 'responsive design', 'mobile-first'] },

  // ==================== Soft Skills ====================
  { name: 'Communication', category: 'Soft Skills', synonyms: ['Communication Skills', 'Verbal Communication'], keywords: ['communication', 'verbal', 'written', 'presentation'] },
  { name: 'Problem Solving', category: 'Soft Skills', synonyms: ['Problem-Solving'], keywords: ['problem solving', 'analytical', 'critical thinking'] },
  { name: 'Teamwork', category: 'Soft Skills', synonyms: ['Team Work', 'Collaboration'], keywords: ['teamwork', 'collaboration', 'team player'] },
  { name: 'Leadership', category: 'Soft Skills', synonyms: ['Team Lead', 'Team Leadership'], keywords: ['leadership', 'lead', 'leading', 'mentor'] },
  { name: 'Time Management', category: 'Soft Skills', synonyms: [], keywords: ['time management', 'deadline', 'prioritization'] },
  { name: 'Adaptability', category: 'Soft Skills', synonyms: ['Flexibility'], keywords: ['adaptability', 'flexible', 'adaptable'] },
  { name: 'Critical Thinking', category: 'Soft Skills', synonyms: ['Analytical Thinking'], keywords: ['critical thinking', 'analytical'] },
  { name: 'Creativity', category: 'Soft Skills', synonyms: ['Creative Thinking', 'Innovation'], keywords: ['creativity', 'creative', 'innovative'] },
  { name: 'Attention to Detail', category: 'Soft Skills', synonyms: ['Detail-Oriented'], keywords: ['attention to detail', 'detail oriented', 'meticulous'] },
  { name: 'Project Management', category: 'Soft Skills', synonyms: ['PM'], keywords: ['project management', 'manage projects'] },
  { name: 'Public Speaking', category: 'Soft Skills', synonyms: ['Presentation Skills'], keywords: ['public speaking', 'presentations', 'speaking'] },
  { name: 'Mentoring', category: 'Soft Skills', synonyms: ['Coaching'], keywords: ['mentoring', 'coaching', 'mentor'] },
];

// Context keywords that indicate skill presence
export const CONTEXT_KEYWORDS = [
  'built',
  'developed',
  'created',
  'implemented',
  'designed',
  'worked on',
  'worked with',
  'using',
  'utilized',
  'leveraged',
  'proficient in',
  'proficient with',
  'experienced in',
  'experienced with',
  'expertise in',
  'skilled in',
  'knowledge of',
  'familiar with',
  'hands-on',
  'projects',
  'experience',
  'technologies',
  'tech stack',
  'tools',
  'skills',
  'languages',
  'frameworks',
];

// Section headers in resumes that commonly contain skills
export const SKILL_SECTION_HEADERS = [
  'skills',
  'technical skills',
  'technologies',
  'tech stack',
  'tools',
  'proficiencies',
  'expertise',
  'competencies',
  'programming languages',
  'frameworks',
  'libraries',
  'platforms',
  'software',
];

// Category color mapping for UI
export const CATEGORY_COLORS: Record<SkillCategory, { bg: string; text: string; border: string }> = {
  'Programming Languages': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Frameworks & Libraries': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Tools & Platforms': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  'Databases': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Core CS / Concepts': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Soft Skills': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
};

// Order for displaying categories
export const CATEGORY_ORDER: SkillCategory[] = [
  'Programming Languages',
  'Frameworks & Libraries',
  'Databases',
  'Tools & Platforms',
  'Core CS / Concepts',
  'Soft Skills',
];
