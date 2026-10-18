// Contract mapping between the backend API (source of truth) and the UI.
// The backend uses lowercase enums and a leaner set of fields; the UI uses
// Title Case labels and richer/legacy field names. All conversions live here so
// the service layer stays thin and the components keep their existing shape.

const invert = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));

// Lookup that tolerates case/spacing differences; returns fallback (or the raw
// value) when no mapping is found.
const lookup = (map, value, fallback) => {
  if (value === null || value === undefined || value === '') return fallback;
  if (map[value] !== undefined) return map[value];
  const key = String(value).trim().toLowerCase();
  const match = Object.keys(map).find((k) => k.toLowerCase() === key);
  return match !== undefined ? map[match] : fallback !== undefined ? fallback : value;
};

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const PROJECT_STATUS_API_TO_UI = {
  planning: 'Planning',
  'in progress': 'In Progress',
  completed: 'Completed',
  'on hold': 'On Hold',
};
export const PROJECT_STATUS_UI_TO_API = invert(PROJECT_STATUS_API_TO_UI);

export const CONTENT_STATUS_API_TO_UI = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};
export const CONTENT_STATUS_UI_TO_API = invert(CONTENT_STATUS_API_TO_UI);

export const TASK_STATUS_API_TO_UI = {
  todo: 'To Do',
  'in progress': 'In Progress',
  'in review': 'In Review',
  done: 'Done',
  cancelled: 'Cancelled',
};
export const TASK_STATUS_UI_TO_API = invert(TASK_STATUS_API_TO_UI);

export const TASK_PRIORITY_API_TO_UI = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};
export const TASK_PRIORITY_UI_TO_API = invert(TASK_PRIORITY_API_TO_UI);

export const TECH_CATEGORY_API_TO_UI = {
  frontend: 'Frontend',
  backend: 'Backend',
  mobile: 'Mobile',
  devops: 'DevOps',
  database: 'Database',
  design: 'Design',
  testing: 'Testing',
};
export const TECH_CATEGORY_UI_TO_API = invert(TECH_CATEGORY_API_TO_UI);

export const DOCUMENT_CATEGORY_API_TO_UI = {
  requirement: 'Requirement',
  design: 'Design',
  contract: 'Contract',
  report: 'Report',
  other: 'Other',
};
export const DOCUMENT_CATEGORY_UI_TO_API = invert(DOCUMENT_CATEGORY_API_TO_UI);

// value-first conversions
export const projectStatusToUi = (v) => lookup(PROJECT_STATUS_API_TO_UI, v, 'Planning');
export const projectStatusToApi = (v) => lookup(PROJECT_STATUS_UI_TO_API, v, 'planning');

export const contentStatusToUi = (v) => lookup(CONTENT_STATUS_API_TO_UI, v, 'Draft');
export const contentStatusToApi = (v) => lookup(CONTENT_STATUS_UI_TO_API, v, 'draft');

export const taskStatusToUi = (v) => lookup(TASK_STATUS_API_TO_UI, v, 'To Do');
export const taskStatusToApi = (v) => lookup(TASK_STATUS_UI_TO_API, v, 'todo');

export const taskPriorityToUi = (v) => lookup(TASK_PRIORITY_API_TO_UI, v, 'Medium');
export const taskPriorityToApi = (v) => lookup(TASK_PRIORITY_UI_TO_API, v, 'medium');

export const techCategoryToUi = (v) => lookup(TECH_CATEGORY_API_TO_UI, v, 'Frontend');
export const techCategoryToApi = (v) => lookup(TECH_CATEGORY_UI_TO_API, v, 'frontend');

export const docCategoryToUi = (v) => lookup(DOCUMENT_CATEGORY_API_TO_UI, v, 'Other');
export const docCategoryToApi = (v) => lookup(DOCUMENT_CATEGORY_UI_TO_API, v, 'other');

// ---------------------------------------------------------------------------
// Field helpers
// ---------------------------------------------------------------------------

const toTagsArray = (tags) => {
  if (Array.isArray(tags)) return tags;
  if (!tags) return [];
  return String(tags)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
};

const toTagsString = (tags) => {
  if (Array.isArray(tags)) return tags.join(', ');
  return tags ?? '';
};

// ---------------------------------------------------------------------------
// Normalizers (API -> UI) and serializers (UI -> API)
// ---------------------------------------------------------------------------

export const normalizeProject = (p) => {
  if (!p) return p;
  const progress = Number(p.progressPercentage ?? p.progress ?? 0);
  return {
    ...p,
    clientName: p.clientName ?? p.client ?? '',
    client: p.clientName ?? p.client ?? '',
    progress,
    progressPercentage: progress,
    status: projectStatusToUi(p.status),
    trackingCode: p.trackingCode ?? p.code ?? '',
    technologies: p.technologies ?? [],
    teamMembers: p.memberIds ?? p.teamMembers ?? [],
    members: p.members ?? [],
  };
};

export const normalizeProjectList = (list = []) => list.map(normalizeProject);

export const normalizeCaseStudy = (cs) => {
  if (!cs) return cs;
  return {
    ...cs,
    featuredImage: cs.coverImage ?? cs.featuredImage ?? '',
    coverImage: cs.coverImage ?? cs.featuredImage ?? '',
    publishedDate: cs.publishedAt ?? cs.publishedDate ?? null,
    tags: toTagsArray(cs.tags),
    client: cs.client ?? cs.clientName ?? cs.project?.clientName ?? '',
    status: contentStatusToUi(cs.status),
  };
};

export const serializeCaseStudy = (data = {}) => ({
  projectId: data.projectId,
  title: data.title,
  slug: data.slug,
  challenge: data.challenge,
  solution: data.solution,
  outcome: data.outcome,
  coverImage: data.coverImage ?? data.featuredImage,
  status: contentStatusToApi(data.status),
  tags: toTagsString(data.tags),
  ...(data.publishedAt ? { publishedAt: data.publishedAt } : {}),
});

export const normalizeTestimonial = (t) => {
  if (!t) return t;
  return {
    ...t,
    quote: t.message ?? t.quote ?? '',
    message: t.message ?? t.quote ?? '',
    clientName: t.clientName ?? '',
    status: contentStatusToUi(t.status),
  };
};

export const serializeTestimonial = (data = {}) => ({
  projectId: data.projectId,
  clientName: data.clientName,
  rating: Number(data.rating) || 5,
  message: data.message ?? data.quote ?? '',
  status: contentStatusToApi(data.status),
});

export const normalizeClient = (c) => {
  if (!c) return c;
  const name = c.name ?? c.company_name ?? 'Client';
  return {
    ...c,
    name,
    company_name: name,
    contact_name: c.contact_name ?? c.contactPerson ?? '',
  };
};

export const serializeClient = (data = {}) => ({
  name: data.name ?? data.company_name,
  email: data.email ?? undefined,
  phone: data.phone ?? undefined,
  address: data.address ?? undefined,
});

// Builds a multipart/form-data body from a plain payload. Arrays (e.g. relation
// ids) are JSON-encoded because Elysia only parses multipart arrays from a JSON
// string or from repeated keys with 2+ values (a single repeated key collapses
// to a string and fails t.Array validation). null/undefined/'' scalars are
// skipped; Files are appended as-is.
export const toFormData = (payload = {}, fileFields = {}) => {
  const form = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      form.append(key, JSON.stringify(value));
    } else if (value !== '') {
      form.append(key, value);
    }
  });

  Object.entries(fileFields).forEach(([key, file]) => {
    if (file) form.append(key, file);
  });

  return form;
};

const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '-';
  const kb = bytes / 1024;
  return kb > 1000 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
};

const formatDate = (value) => {
  if (!value) return '-';
  try {
    return new Date(value).toISOString().split('T')[0];
  } catch {
    return '-';
  }
};

export const normalizeDocument = (d) => {
  if (!d) return d;
  return {
    ...d,
    category: docCategoryToUi(d.category),
    fileName: d.fileName ?? d.name ?? '',
    size: d.size ?? formatFileSize(d.fileSize),
    uploadDate: d.uploadDate ?? formatDate(d.createdAt),
  };
};

export const normalizeTask = (t) => {
  if (!t) return t;
  return {
    ...t,
    status: taskStatusToUi(t.status),
    priority: taskPriorityToUi(t.priority),
  };
};

export const serializeTask = (data = {}) => ({
  projectId: data.projectId,
  assigneeId: data.assigneeId,
  createdBy: data.createdBy,
  title: data.title,
  description: data.description ?? undefined,
  priority: taskPriorityToApi(data.priority),
  status: taskStatusToApi(data.status),
  ...(data.startDate ? { startDate: data.startDate } : {}),
  ...(data.dueDate ? { dueDate: data.dueDate } : {}),
});

export const normalizeTechnology = (t) => {
  if (!t) return t;
  return {
    ...t,
    category: techCategoryToUi(t.category),
    isActive: t.isActive !== undefined ? t.isActive : true,
  };
};

export const serializeTechnology = (data = {}) => ({
  name: data.name,
  category: techCategoryToApi(data.category),
  isActive: data.isActive !== undefined ? data.isActive : true,
});
