type JsonSchemaNode = Record<string, unknown>;

interface InferContext {
  name: string;
  enums: boolean;
}

function uniqueTypes(types: string[]): string[] {
  return Array.from(new Set(types));
}

function inferTypeName(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return Number.isInteger(value) ? 'integer' : 'number';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'object') return 'object';
  return 'string';
}

function inferArrayItems(value: unknown[], context: InferContext): JsonSchemaNode {
  if (value.length === 0) {
    return { type: 'array' };
  }

  if (context.enums) {
    const primitives = value.filter(
      (item) => typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean'
    );
    const primitiveTypes = uniqueTypes(primitives.map(inferTypeName));
    if (primitives.length === value.length && primitiveTypes.length === 1) {
      const unique = Array.from(new Set(primitives.map((item) => JSON.stringify(item)))).map(
        (item) => JSON.parse(item) as unknown
      );
      if (unique.length === value.length && unique.length > 0 && unique.length <= 50) {
        const node: JsonSchemaNode = { type: primitiveTypes[0] };
        if (unique.length > 1) node.enum = unique;
        return { type: 'array', items: node };
      }
    }
  }

  const itemTypes = uniqueTypes(value.map(inferTypeName));
  if (itemTypes.length === 1) {
    const itemType = itemTypes[0]!;
    if (itemType === 'object') {
      const objects = value as Record<string, unknown>[];
      const merged = mergeObjects(objects);
      return {
        type: 'array',
        items: inferValue(merged, { ...context, name: singularize(context.name) }),
      };
    }
    return {
      type: 'array',
      items: inferValue(value[0], { ...context, name: singularize(context.name) }),
    };
  }

  const anyOf = itemTypes
    .filter((itemType) => itemType !== 'array' && itemType !== 'object')
    .map((itemType) => ({ type: itemType }));
  const fallback: JsonSchemaNode = { type: 'array' };
  if (anyOf.length > 0) fallback.items = anyOf.length === 1 ? anyOf[0]! : { anyOf };
  return fallback;
}

function singularize(name: string): string {
  if (name.endsWith('ies')) return `${name.slice(0, -3)}y`;
  if (name.endsWith('ses')) return name.slice(0, -2);
  if (name.endsWith('s')) return name.slice(0, -1);
  return name;
}

function mergeObjects(objects: Record<string, unknown>[]): Record<string, unknown> {
  const merged: Record<string, unknown> = {};
  for (const object of objects) {
    for (const [key, value] of Object.entries(object)) {
      if (!(key in merged)) {
        merged[key] = value;
        continue;
      }
      const existing = merged[key];
      if (existing === null || value === null) {
        if (existing === null) merged[key] = value;
        continue;
      }
      if (Array.isArray(existing) && Array.isArray(value)) {
        merged[key] = [...existing, ...value];
        continue;
      }
      if (
        typeof existing === 'object' &&
        typeof value === 'object' &&
        !Array.isArray(existing) &&
        !Array.isArray(value)
      ) {
        merged[key] = mergeObjects([
          existing as Record<string, unknown>,
          value as Record<string, unknown>,
        ]);
        continue;
      }
      if (typeof existing !== typeof value) {
        continue;
      }
    }
  }
  return merged;
}

function propertyName(key: string): string {
  const clean = key.replace(/[^A-Za-z0-9_]/g, '_');
  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(clean)) return clean;
  return `p_${clean.replace(/^[^A-Za-z0-9_$]/, '')}`;
}

function formatConstraints(value: unknown): JsonSchemaNode | null {
  if (typeof value !== 'string') return null;
  const constraints: JsonSchemaNode = {};
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) constraints.format = 'email';
  else if (/^https?:\/\/\S+$/i.test(value)) constraints.format = 'uri';
  else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) constraints.format = 'date';
  else if (/^\d{4}-\d{2}-\d{2}T/.test(value)) constraints.format = 'date-time';
  else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    constraints.format = 'uuid';
  } else if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) constraints.format = 'ipv4';
  return Object.keys(constraints).length > 0 ? constraints : null;
}

function inferValue(value: unknown, context: InferContext): JsonSchemaNode {
  const type = inferTypeName(value);

  if (type === 'array') {
    return inferArrayItems(value as unknown[], context);
  }

  if (type === 'object') {
    const object = value as Record<string, unknown>;
    const keys = Object.keys(object);
    if (keys.length === 0) {
      return { type: 'object', additionalProperties: true };
    }
    const properties: Record<string, JsonSchemaNode> = {};
    for (const key of keys) {
      properties[key] = inferValue(object[key], { ...context, name: propertyName(key) });
    }
    const schema: JsonSchemaNode = {
      type: 'object',
      properties,
    };
    const required = keys.filter((key) => object[key] !== null);
    if (required.length > 0) {
      schema.required = required;
    }
    return schema;
  }

  const schema: JsonSchemaNode = { type };
  const constraints = formatConstraints(value);
  if (constraints) Object.assign(schema, constraints);
  return schema;
}

export interface JsonToSchemaOptions {
  indentSize?: 2 | 4;
  enums?: boolean;
}

export function jsonToSchema(jsonStr: string, options: JsonToSchemaOptions = {}): string {
  const trimmed = jsonStr.trim();
  if (!trimmed) {
    throw new Error('Enter a JSON document first.');
  }
  let value: unknown;
  try {
    value = JSON.parse(trimmed);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Invalid JSON.');
  }

  const schema = inferValue(value, {
    name: 'Root',
    enums: options.enums ?? true,
  });
  schema.$schema = 'https://json-schema.org/draft/2020-12/schema';
  schema.title = 'Generated Schema';

  return JSON.stringify(schema, null, options.indentSize ?? 2);
}
