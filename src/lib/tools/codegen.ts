export interface JsonToTypeScriptOptions {
  kind?: 'interface' | 'type';
  rootName?: string;
}

export interface JsonToCodeOptions {
  rootName?: string;
}

function parseJsonValue(jsonStr: string): unknown {
  const trimmed = jsonStr.trim();
  if (!trimmed) {
    throw new Error('Enter a JSON document first.');
  }
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Invalid JSON.');
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function splitWords(key: string): string[] {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .filter((word) => word.length > 0);
}

function pascalCase(key: string, fallback: string): string {
  const name = splitWords(key)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  const safe = name.length > 0 ? name : fallback;
  return /^[0-9]/.test(safe) ? `N${safe}` : safe;
}

function singularize(key: string, fallback: string): string {
  const name = pascalCase(key, fallback);
  if (name.endsWith('ies') && name.length > 3) return `${name.slice(0, -3)}y`;
  if (name.endsWith('ses') && name.length > 3) return name.slice(0, -2);
  if (name.endsWith('s') && name.length > 1) return name.slice(0, -1);
  return name;
}

function arrayItemName(name: string): string {
  const singular = singularize(name, 'Item');
  return singular === name ? `${name}Item` : singular;
}

function uniqueName(base: string, used: Set<string>): string {
  let candidate = base;
  let index = 2;
  while (used.has(candidate)) {
    candidate = `${base}${index}`;
    index += 1;
  }
  used.add(candidate);
  return candidate;
}

function propertyLiteral(key: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
}

function jsonTypeName(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') return 'string';
  return 'object';
}

interface TsBuilder {
  kind: 'interface' | 'type';
  interfaces: string[];
  usedNames: Set<string>;
}

function tsTypeOf(value: unknown, name: string, builder: TsBuilder, depth = 1): string {
  const type = jsonTypeName(value);

  if (type === 'null') return 'null';
  if (type === 'boolean') return 'boolean';
  if (type === 'number') return 'number';
  if (type === 'string') return 'string';

  if (type === 'array') {
    const items = value as unknown[];
    if (items.length === 0) return 'unknown[]';
    const typeNames = Array.from(new Set(items.map(jsonTypeName)));
    const elementName = arrayItemName(name);
    if (typeNames.length === 1) {
      return `${tsTypeOf(items[0], elementName, builder, depth)}[]`;
    }
    const primitiveOnly = items.every(
      (item) =>
        item === null ||
        typeof item === 'boolean' ||
        typeof item === 'number' ||
        typeof item === 'string'
    );
    if (primitiveOnly) {
      const unique = Array.from(
        new Set(items.map((item) => tsTypeOf(item, elementName, builder, depth)))
      );
      return `(${unique.join(' | ')})[]`;
    }
    return 'unknown[]';
  }

  if (builder.kind === 'type') {
    const object = value as Record<string, unknown>;
    const keys = Object.keys(object);
    if (keys.length === 0) return 'Record<string, unknown>';
    const lines = keys.map(
      (key) =>
        `${'  '.repeat(depth)}${propertyLiteral(key)}: ${tsTypeOf(object[key]!, key, builder, depth + 1)};`
    );
    return `{\n${lines.join('\n')}\n${'  '.repeat(depth - 1)}}`;
  }

  const className = uniqueName(pascalCase(name, 'Root'), builder.usedNames);
  buildTsInterface(value as Record<string, unknown>, className, builder);
  return className;
}

function buildTsInterface(
  object: Record<string, unknown>,
  className: string,
  builder: TsBuilder
): void {
  const lines = Object.entries(object).map(([key, value]) => {
    const type = tsTypeOf(value, key, builder);
    return `  ${propertyLiteral(key)}: ${type};`;
  });
  const block = [`export interface ${className} {`, ...lines, '}'].join('\n');
  builder.interfaces.push(block);
}

function rootTsShape(value: unknown, rootName: string, builder: TsBuilder): string {
  const type = jsonTypeName(value);
  if (type === 'array') {
    const items = value as unknown[];
    if (items.length === 0) return `export type ${rootName} = unknown[];`;
    const itemName = arrayItemName(rootName);
    const typeNames = Array.from(new Set(items.map(jsonTypeName)));
    if (typeNames.length === 1) {
      const element = tsTypeOf(items[0], itemName, builder);
      return `export type ${rootName} = ${element}[];`;
    }
    const primitiveOnly = items.every(
      (item) =>
        item === null ||
        typeof item === 'boolean' ||
        typeof item === 'number' ||
        typeof item === 'string'
    );
    if (primitiveOnly) {
      const unique = Array.from(new Set(items.map((item) => tsTypeOf(item, itemName, builder))));
      return `export type ${rootName} = (${unique.join(' | ')})[];`;
    }
    return `export type ${rootName} = unknown[];`;
  }
  if (type === 'object') {
    const object = value as Record<string, unknown>;
    if (builder.kind === 'interface') {
      const className = uniqueName(pascalCase(rootName, 'Root'), builder.usedNames);
      buildTsInterface(object, className, builder);
      return '';
    }
    const lines = Object.entries(object).map(
      ([key, item]) => `  ${propertyLiteral(key)}: ${tsTypeOf(item, key, builder, 2)};`
    );
    if (lines.length === 0) return `export type ${rootName} = Record<string, unknown>;`;
    return [`export type ${rootName} = {`, ...lines, '};'].join('\n');
  }
  return `export type ${rootName} = ${tsTypeOf(value, rootName, builder)};`;
}

export function jsonToTypeScript(jsonStr: string, options: JsonToTypeScriptOptions = {}): string {
  const value = parseJsonValue(jsonStr);
  const rootName = options.rootName ?? 'Root';
  const builder: TsBuilder = {
    kind: options.kind ?? 'interface',
    interfaces: [],
    usedNames: new Set<string>(),
  };
  const root = rootTsShape(value, rootName, builder);
  const parts = root ? [...builder.interfaces, root] : builder.interfaces;
  return `${parts.join('\n\n')}\n`;
}

interface PythonBuilder {
  classes: string[];
  usedNames: Set<string>;
  imports: Set<string>;
}

function pyTypeOf(value: unknown, name: string, builder: PythonBuilder): string {
  const type = jsonTypeName(value);
  if (type === 'null') {
    builder.imports.add('Optional');
    return 'Optional[Any]';
  }
  if (type === 'boolean') return 'bool';
  if (type === 'number') return Number.isInteger(value) ? 'int' : 'float';
  if (type === 'string') return 'str';

  if (type === 'array') {
    builder.imports.add('List');
    const items = value as unknown[];
    if (items.length === 0) return 'List[Any]';
    const typeNames = Array.from(new Set(items.map(jsonTypeName)));
    const elementName = arrayItemName(name);
    if (typeNames.length === 1) {
      return `List[${pyTypeOf(items[0], elementName, builder)}]`;
    }
    const primitiveOnly = items.every(
      (item) =>
        item === null ||
        typeof item === 'boolean' ||
        typeof item === 'number' ||
        typeof item === 'string'
    );
    if (primitiveOnly) {
      const types = Array.from(new Set(items.map((item) => pyTypeOf(item, elementName, builder))));
      if (types.length === 1) return `List[${types[0]}]`;
      builder.imports.add('Union');
      return `List[Union[${types.join(', ')}]]`;
    }
    return 'List[Any]';
  }

  const object = value as Record<string, unknown>;
  if (Object.keys(object).length === 0) {
    builder.imports.add('Dict');
    return 'Dict[str, Any]';
  }
  const className = uniqueName(pascalCase(name, 'Root'), builder.usedNames);
  buildPyClass(object, className, builder);
  return className;
}

function buildPyClass(
  object: Record<string, unknown>,
  className: string,
  builder: PythonBuilder
): void {
  const lines = Object.entries(object).map(
    ([key, item]) => `    ${propertyLiteral(key)}: ${pyTypeOf(item, key, builder)}`
  );
  const block = [`@dataclass`, `class ${className}:`, ...lines].join('\n');
  builder.classes.push(block);
}

export function jsonToPython(jsonStr: string, options: JsonToCodeOptions = {}): string {
  const value = parseJsonValue(jsonStr);
  const rootName = options.rootName ?? 'Root';
  const builder: PythonBuilder = {
    classes: [],
    usedNames: new Set<string>(),
    imports: new Set<string>(),
  };

  if (Array.isArray(value)) {
    if (value.length === 0 || value.some((item) => !isRecord(item))) {
      throw new Error('Top-level JSON must be an object or an array of objects.');
    }
    const itemName = uniqueName(arrayItemName(rootName), builder.usedNames);
    buildPyClass(value[0] as Record<string, unknown>, itemName, builder);
    builder.classes.push(`Root = List[${itemName}]`);
    builder.imports.add('List');
  } else if (isRecord(value)) {
    const className = uniqueName(pascalCase(rootName, 'Root'), builder.usedNames);
    buildPyClass(value, className, builder);
  } else {
    throw new Error('Top-level JSON must be an object or an array of objects.');
  }

  builder.imports.add('Any');
  const typing = Array.from(builder.imports).sort().join(', ');
  const header = ['from dataclasses import dataclass', `from typing import ${typing}`, ''].join(
    '\n'
  );
  return `${header}${builder.classes.join('\n\n')}\n`;
}

interface JavaBuilder {
  classes: string[];
  usedNames: Set<string>;
  imports: Set<string>;
}

function javaTypeOf(value: unknown, name: string, builder: JavaBuilder): string {
  const type = jsonTypeName(value);
  if (type === 'null') return 'Object';
  if (type === 'boolean') return 'boolean';
  if (type === 'number') return Number.isInteger(value) ? 'int' : 'double';
  if (type === 'string') return 'String';

  if (type === 'array') {
    builder.imports.add('List');
    const items = value as unknown[];
    if (items.length === 0) return 'List<Object>';
    const typeNames = Array.from(new Set(items.map(jsonTypeName)));
    const elementName = arrayItemName(name);
    if (typeNames.length === 1) {
      return `List<${javaTypeOf(items[0], elementName, builder)}>`;
    }
    const primitiveOnly = items.every(
      (item) =>
        item === null ||
        typeof item === 'boolean' ||
        typeof item === 'number' ||
        typeof item === 'string'
    );
    if (primitiveOnly) {
      const types = Array.from(
        new Set(items.map((item) => javaTypeOf(item, elementName, builder)))
      );
      return types.length === 1 ? `List<${types[0]}>` : 'List<Object>';
    }
    return 'List<Object>';
  }

  const object = value as Record<string, unknown>;
  if (Object.keys(object).length === 0) {
    builder.imports.add('Map');
    return 'Map<String, Object>';
  }
  const className = uniqueName(pascalCase(name, 'Root'), builder.usedNames);
  buildJavaClass(object, className, builder);
  return className;
}

function javaName(key: string): string {
  const name = splitWords(key).join('');
  const safe = name.length > 0 ? name : 'value';
  return /^[0-9]/.test(safe) ? `N${safe}` : safe;
}

function buildJavaClass(
  object: Record<string, unknown>,
  className: string,
  builder: JavaBuilder
): void {
  const fields = Object.entries(object).map(([key, item]) => ({
    name: javaName(key),
    type: javaTypeOf(item, key, builder),
  }));
  const lines: string[] = [`public class ${className} {`];
  for (const field of fields) {
    lines.push(`    private ${field.type} ${field.name};`);
  }
  for (const field of fields) {
    lines.push('');
    lines.push(`    public ${field.type} get${pascalCase(field.name, 'Value')}() {`);
    lines.push(`        return ${field.name};`);
    lines.push(`    }`);
    lines.push('');
    lines.push(
      `    public void set${pascalCase(field.name, 'Value')}(${field.type} ${field.name}) {`
    );
    lines.push(`        this.${field.name} = ${field.name};`);
    lines.push(`    }`);
  }
  lines.push('}');
  builder.classes.push(lines.join('\n'));
}

export function jsonToJava(jsonStr: string, options: JsonToCodeOptions = {}): string {
  const value = parseJsonValue(jsonStr);
  const rootName = options.rootName ?? 'Root';
  const builder: JavaBuilder = {
    classes: [],
    usedNames: new Set<string>(),
    imports: new Set<string>(),
  };

  if (Array.isArray(value)) {
    if (value.length === 0 || value.some((item) => !isRecord(item))) {
      throw new Error('Top-level JSON must be an object or an array of objects.');
    }
    const itemName = uniqueName(arrayItemName(rootName), builder.usedNames);
    buildJavaClass(value[0] as Record<string, unknown>, itemName, builder);
  } else if (isRecord(value)) {
    const className = uniqueName(pascalCase(rootName, 'Root'), builder.usedNames);
    buildJavaClass(value, className, builder);
  } else {
    throw new Error('Top-level JSON must be an object or an array of objects.');
  }

  const imports = Array.from(builder.imports)
    .sort()
    .map((name) => `import java.util.${name};`);
  const header = imports.length > 0 ? `${imports.join('\n')}\n\n` : '';
  return `${header}${builder.classes.join('\n\n')}\n`;
}

interface GoBuilder {
  structs: string[];
  usedNames: Set<string>;
}

function goTypeOf(value: unknown, name: string, builder: GoBuilder): string {
  const type = jsonTypeName(value);
  if (type === 'null') return 'interface{}';
  if (type === 'boolean') return 'bool';
  if (type === 'number') return Number.isInteger(value) ? 'int' : 'float64';
  if (type === 'string') return 'string';

  if (type === 'array') {
    const items = value as unknown[];
    if (items.length === 0) return '[]interface{}';
    const typeNames = Array.from(new Set(items.map(jsonTypeName)));
    const elementName = arrayItemName(name);
    if (typeNames.length === 1) {
      return `[]${goTypeOf(items[0], elementName, builder)}`;
    }
    const primitiveOnly = items.every(
      (item) =>
        item === null ||
        typeof item === 'boolean' ||
        typeof item === 'number' ||
        typeof item === 'string'
    );
    if (primitiveOnly) {
      const types = Array.from(new Set(items.map((item) => goTypeOf(item, elementName, builder))));
      return types.length === 1 ? `[]${types[0]}` : '[]interface{}';
    }
    return '[]interface{}';
  }

  const object = value as Record<string, unknown>;
  if (Object.keys(object).length === 0) return 'map[string]interface{}';
  const structName = uniqueName(pascalCase(name, 'Root'), builder.usedNames);
  buildGoStruct(object, structName, builder);
  return structName;
}

function buildGoStruct(
  object: Record<string, unknown>,
  structName: string,
  builder: GoBuilder
): void {
  const lines = Object.entries(object).map(([key, item]) => {
    const fieldName = pascalCase(key, 'Value');
    return `    ${fieldName} ${goTypeOf(item, key, builder)} \`json:"${key}"\``;
  });
  const block = [`type ${structName} struct {`, ...lines, '}'].join('\n');
  builder.structs.push(block);
}

export function jsonToGo(jsonStr: string, options: JsonToCodeOptions = {}): string {
  const value = parseJsonValue(jsonStr);
  const rootName = options.rootName ?? 'Root';
  const builder: GoBuilder = {
    structs: [],
    usedNames: new Set<string>(),
  };

  if (Array.isArray(value)) {
    if (value.length === 0 || value.some((item) => !isRecord(item))) {
      throw new Error('Top-level JSON must be an object or an array of objects.');
    }
    const structName = uniqueName(arrayItemName(rootName), builder.usedNames);
    buildGoStruct(value[0] as Record<string, unknown>, structName, builder);
  } else if (isRecord(value)) {
    const structName = uniqueName(pascalCase(rootName, 'Root'), builder.usedNames);
    buildGoStruct(value, structName, builder);
  } else {
    throw new Error('Top-level JSON must be an object or an array of objects.');
  }

  return `${builder.structs.join('\n\n')}\n`;
}
