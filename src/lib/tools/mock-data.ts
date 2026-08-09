export type MockField =
  'name' | 'email' | 'phone' | 'address' | 'city' | 'country' | 'company' | 'jobTitle' | 'id';

export type MockDataFormat = 'json' | 'csv' | 'sql';

export type Rng = () => number;

export const MOCK_FIELDS: MockField[] = [
  'name',
  'email',
  'phone',
  'address',
  'city',
  'country',
  'company',
  'jobTitle',
  'id',
];

export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES: string[] = [
  'Ada',
  'Alan',
  'Grace',
  'Margaret',
  'Katherine',
  'Linus',
  'Dennis',
  'Barbara',
  'Donald',
  'Tim',
  'James',
  'Andrew',
  'Guido',
  'Brendan',
  'Yukihiro',
  'Anders',
  'Bjarne',
  'Rasmus',
  'Richard',
  'Ken',
  'John',
  'Robert',
  'Larry',
  'Brian',
  'Tony',
  'Ivan',
  'Douglas',
  'Vint',
  'Marc',
  'Radia',
  'Edsger',
  'Niklaus',
  'Charles',
  'Claude',
  'Eliza',
  'Florence',
  'Hedy',
  'Mary',
  'Rosalind',
  'Marie',
  'Sophie',
  'Daniel',
  'Samuel',
  'Emma',
  'Olivia',
  'Noah',
  'Liam',
  'Ava',
  'Mia',
  'Lucas',
  'Isabella',
  'Mateo',
  'Amelia',
  'Elias',
  'Camila',
];

const LAST_NAMES: string[] = [
  'Lovelace',
  'Turing',
  'Hopper',
  'Hamilton',
  'Johnson',
  'Torvalds',
  'Ritchie',
  'Liskov',
  'Knuth',
  'Berners-Lee',
  'Gosling',
  'Tanenbaum',
  'van Rossum',
  'Eich',
  'Matsumoto',
  'Hejlsberg',
  'Stroustrup',
  'Lerdorf',
  'Stallman',
  'Thompson',
  'Backus',
  'Kay',
  'Wall',
  'Kernighan',
  'Nygaard',
  'Sutherland',
  'Engelbart',
  'Cerf',
  'Andreessen',
  'Perlman',
  'Dijkstra',
  'Wirth',
  'Babbage',
  'Shannon',
  'Whitby',
  'Nightingale',
  'Lamarr',
  'Curie',
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
];

const STREETS: string[] = [
  'Main Street',
  'Oak Avenue',
  'Maple Drive',
  'Cedar Lane',
  'Park Boulevard',
  'Lakeview Road',
  'Hillcrest Way',
  'Sunset Boulevard',
  'Riverside Drive',
  'Meadow Lane',
  'Forest Avenue',
  'Highland Road',
  'Elm Street',
  'Birchwood Drive',
  'Willow Court',
  'Chestnut Street',
  'Market Street',
  'Union Street',
  'Church Road',
  'Station Road',
  'Victoria Street',
  'Broadway',
  'Fifth Avenue',
  'Tech Park Drive',
  'Innovation Way',
  'Founders Lane',
  'Enterprise Road',
  'Startup Alley',
  'Data Street',
  'Server Road',
];

const CITIES: string[] = [
  'London',
  'New York',
  'San Francisco',
  'Seattle',
  'Austin',
  'Boston',
  'Berlin',
  'Paris',
  'Amsterdam',
  'Toronto',
  'Vancouver',
  'Sydney',
  'Tokyo',
  'Singapore',
  'Stockholm',
  'Zurich',
  'Dublin',
  'Madrid',
  'Barcelona',
  'Lisbon',
  'Prague',
  'Warsaw',
  'Copenhagen',
  'Oslo',
  'Helsinki',
  'Milan',
  'Munich',
  'Chicago',
  'Denver',
  'Portland',
  'Miami',
  'Atlanta',
  'Nashville',
  'Raleigh',
  'Boulder',
  'Cambridge',
  'Oxford',
  'Manchester',
];

const COUNTRIES: string[] = [
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'France',
  'Netherlands',
  'Spain',
  'Portugal',
  'Italy',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Switzerland',
  'Ireland',
  'Australia',
  'New Zealand',
  'Japan',
  'Singapore',
  'Poland',
  'Czech Republic',
  'Austria',
  'Belgium',
  'Brazil',
  'Mexico',
  'India',
  'Israel',
  'Estonia',
  'South Korea',
  'Ukraine',
];

const COMPANIES: string[] = [
  'Acme Corp',
  'Globex',
  'Initech',
  'Umbrella Labs',
  'Stark Industries',
  'Wayne Enterprises',
  'Cyberdyne Systems',
  'Tyrell Corporation',
  'Hooli',
  'Pied Piper',
  'Wonka Industries',
  'Massive Dynamic',
  'Vandelay Industries',
  'Black Mesa',
  'Aperture Science',
  'Oscorp',
  'Daily Planet',
  'Nimbus Dynamics',
  'Dunder Mifflin',
  'Sterling Cooper',
  'Virtucon',
  'Blauth Industries',
  'The Cloud Group',
  'DataStream Inc',
  'ByteWorks',
  'QuantumLeap Soft',
  'FusionCore',
  'Nimbus Networks',
  'PixelForge',
  'CodeCraft',
  'DevStack',
  'Streamline IO',
];

const JOB_TITLES: string[] = [
  'Software Engineer',
  'Senior Frontend Developer',
  'Backend Developer',
  'Full-Stack Engineer',
  'DevOps Engineer',
  'Site Reliability Engineer',
  'Data Scientist',
  'Data Engineer',
  'Machine Learning Engineer',
  'QA Engineer',
  'Engineering Manager',
  'Technical Lead',
  'Product Manager',
  'Project Manager',
  'UX Designer',
  'UI Designer',
  'Product Designer',
  'Security Engineer',
  'Cloud Architect',
  'Solutions Architect',
  'Systems Administrator',
  'Database Administrator',
  'Network Engineer',
  'Mobile Developer',
  'iOS Developer',
  'Android Developer',
  'Platform Engineer',
  'Infrastructure Engineer',
  'Release Manager',
  'Technical Writer',
  'Support Engineer',
  'Sales Engineer',
  'Scrum Master',
];

const EMAIL_DOMAINS: string[] = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'protonmail.com',
  'icloud.com',
  'example.com',
  'corpmail.io',
  'devmail.net',
  'startup.io',
  'techmail.co',
];

const AREA_CODES: string[] = [
  '201',
  '212',
  '305',
  '408',
  '415',
  '503',
  '510',
  '617',
  '646',
  '650',
  '702',
  '718',
  '720',
  '801',
  '916',
  '972',
];

function pick<T>(rng: Rng, pool: readonly T[]): T {
  return pool[Math.floor(rng() * pool.length)];
}

function randomUuid(rng: Rng): string {
  const bytes = new Uint8Array(16);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Math.floor(rng() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}

function makeEmail(first: string, last: string, rng: Rng): string {
  const firstClean = first.toLowerCase().replace(/[^a-z0-9]/g, '');
  const lastClean = last.toLowerCase().replace(/[^a-z0-9]/g, '');
  const style = Math.floor(rng() * 4);
  const local =
    style === 0
      ? `${firstClean}.${lastClean}`
      : style === 1
        ? `${firstClean}${lastClean}`
        : style === 2
          ? `${firstClean.charAt(0)}${lastClean}`
          : `${firstClean}_${lastClean}`;
  const suffix = rng() < 0.2 ? String(Math.floor(rng() * 99)) : '';
  return `${local}${suffix}@${pick(rng, EMAIL_DOMAINS)}`;
}

function generateRow(fields: MockField[], rng: Rng): Record<string, string> {
  const first = pick(rng, FIRST_NAMES);
  const last = pick(rng, LAST_NAMES);
  const streetNumber = String(Math.floor(rng() * 900) + 10);
  const city = pick(rng, CITIES);
  const country = pick(rng, COUNTRIES);
  const company = pick(rng, COMPANIES);
  const jobTitle = pick(rng, JOB_TITLES);
  const row: Record<string, string> = {};
  for (const field of fields) {
    switch (field) {
      case 'name':
        row.name = `${first} ${last}`;
        break;
      case 'email':
        row.email = makeEmail(first, last, rng);
        break;
      case 'phone':
        row.phone = `+1 (${pick(rng, AREA_CODES)}) ${String(Math.floor(rng() * 900) + 100)}-${String(Math.floor(rng() * 10000)).padStart(4, '0')}`;
        break;
      case 'address':
        row.address = `${streetNumber} ${pick(rng, STREETS)}`;
        break;
      case 'city':
        row.city = city;
        break;
      case 'country':
        row.country = country;
        break;
      case 'company':
        row.company = company;
        break;
      case 'jobTitle':
        row.jobTitle = jobTitle;
        break;
      case 'id':
        row.id = randomUuid(rng);
        break;
    }
  }
  return row;
}

export function generateMockRows(
  fields: MockField[],
  count: number,
  rng: Rng
): Record<string, string>[] {
  const rows: Record<string, string>[] = [];
  for (let i = 0; i < count; i += 1) {
    rows.push(generateRow(fields, rng));
  }
  return rows;
}

function collectHeaders(rows: Record<string, string>[]): string[] {
  const headers: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        headers.push(key);
      }
    }
  }
  return headers;
}

function escapeCsvCell(cell: string): string {
  if (cell.includes(',') || cell.includes('"') || cell.includes('\n') || cell.includes('\r')) {
    return `"${cell.replace(/"/g, '""')}"`;
  }
  return cell;
}

export function toCsv(rows: Record<string, string>[]): string {
  if (rows.length === 0) return '';
  const headers = collectHeaders(rows);
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsvCell(row[header] ?? '')).join(','));
  }
  return `${lines.join('\n')}\n`;
}

export function toSqlInsert(rows: Record<string, string>[], table: string): string {
  if (rows.length === 0) return '';
  const headers = collectHeaders(rows);
  const columnList = headers.map((header) => `"${header.replace(/"/g, '""')}"`).join(', ');
  const statements: string[] = [];
  for (const row of rows) {
    const values = headers
      .map((header) => {
        const value = row[header] ?? '';
        if (value === '') return 'NULL';
        return `'${value.replace(/'/g, "''")}'`;
      })
      .join(', ');
    statements.push(
      `INSERT INTO "${table.replace(/"/g, '""')}" (${columnList}) VALUES (${values});`
    );
  }
  return `${statements.join('\n')}\n`;
}
