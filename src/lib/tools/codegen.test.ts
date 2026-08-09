import { describe, expect, it } from 'vitest';
import { jsonToGo, jsonToJava, jsonToPython, jsonToTypeScript } from '@/lib/tools/codegen';

const SAMPLE = JSON.stringify({
  id: 1,
  name: 'Ada',
  active: true,
  score: 9.5,
  roles: ['admin', 'editor'],
  address: { city: 'London', zip: 12345 },
  tags: [],
});

describe('jsonToTypeScript', () => {
  it('throws on invalid JSON', () => {
    expect(() => jsonToTypeScript('nope')).toThrow();
    expect(() => jsonToTypeScript('')).toThrow();
  });

  it('generates interfaces with nested child interfaces', () => {
    const output = jsonToTypeScript(SAMPLE, { kind: 'interface' });
    expect(output).toContain('export interface Root {');
    expect(output).toContain('id: number;');
    expect(output).toContain('name: string;');
    expect(output).toContain('active: boolean;');
    expect(output).toContain('roles: string[];');
    expect(output).toContain('address: Address;');
    expect(output).toContain('export interface Address {');
    expect(output).toContain('tags: unknown[];');
  });

  it('generates inline type aliases for the type kind', () => {
    const output = jsonToTypeScript(SAMPLE, { kind: 'type' });
    expect(output).toContain('export type Root = {');
    expect(output).not.toContain('interface');
    expect(output).toContain('address: {\n    city: string;');
  });

  it('handles array-of-objects roots', () => {
    const output = jsonToTypeScript('[{"a": 1}, {"a": 2}]', { kind: 'interface' });
    expect(output).toContain('export interface RootItem {');
    expect(output).toContain('export type Root = RootItem[];');
  });

  it('handles primitive roots', () => {
    expect(jsonToTypeScript('"hello"')).toBe('export type Root = string;\n');
    expect(jsonToTypeScript('[1, 2, 3]')).toBe('export type Root = number[];\n');
  });

  it('quotes invalid property names', () => {
    const output = jsonToTypeScript('{"my-key": 1, "123": "x"}', { kind: 'type' });
    expect(output).toContain('"my-key": number;');
    expect(output).toContain('"123": string;');
  });

  it('dedupes nested class names', () => {
    const output = jsonToTypeScript('{"a": {"x": 1}, "b": {"y": 2}}', { kind: 'interface' });
    expect(output).toContain('export interface A {');
    expect(output).toContain('export interface B {');
  });
});

describe('jsonToPython', () => {
  it('generates dataclasses with typing imports', () => {
    const output = jsonToPython(SAMPLE);
    expect(output).toContain('from dataclasses import dataclass');
    expect(output).toContain('from typing import Any, List');
    expect(output).toContain('@dataclass\nclass Root:');
    expect(output).toContain('    id: int');
    expect(output).toContain('    name: str');
    expect(output).toContain('    active: bool');
    expect(output).toContain('    score: float');
    expect(output).toContain('    roles: List[str]');
    expect(output).toContain('    address: Address');
    expect(output).toContain('    tags: List[Any]');
    expect(output).toContain('@dataclass\nclass Address:');
  });

  it('generates List for array-of-objects roots', () => {
    const output = jsonToPython('[{"a": 1}]');
    expect(output).toContain('class RootItem:');
    expect(output).toContain('Root = List[RootItem]');
  });

  it('rejects primitive roots', () => {
    expect(() => jsonToPython('42')).toThrow();
  });
});

describe('jsonToJava', () => {
  it('generates POJOs with getters and setters', () => {
    const output = jsonToJava(SAMPLE);
    expect(output).toContain('import java.util.List;');
    expect(output).toContain('public class Root {');
    expect(output).toContain('private String name;');
    expect(output).toContain('private int id;');
    expect(output).toContain('private double score;');
    expect(output).toContain('private List<String> roles;');
    expect(output).toContain('public class Address {');
    expect(output).toContain('public String getName() {');
    expect(output).toContain('public void setName(String name) {');
  });

  it('maps empty arrays to List<Object>', () => {
    expect(jsonToJava(SAMPLE)).toContain('private List<Object> tags;');
  });

  it('rejects array roots of primitives', () => {
    expect(() => jsonToJava('[1, 2]')).toThrow();
  });
});

describe('jsonToGo', () => {
  it('generates structs with json tags', () => {
    const output = jsonToGo(SAMPLE);
    expect(output).toContain('type Root struct {');
    expect(output).toContain('    Id int `json:"id"`');
    expect(output).toContain('    Name string `json:"name"`');
    expect(output).toContain('    Active bool `json:"active"`');
    expect(output).toContain('    Score float64 `json:"score"`');
    expect(output).toContain('    Roles []string `json:"roles"`');
    expect(output).toContain('    Address Address `json:"address"`');
    expect(output).toContain('    Tags []interface{} `json:"tags"`');
    expect(output).toContain('type Address struct {');
  });

  it('generates item structs for array roots', () => {
    const output = jsonToGo('[{"a": 1}]');
    expect(output).toContain('type RootItem struct {');
    expect(output).toContain('    A int `json:"a"`');
  });
});
