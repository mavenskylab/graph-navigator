import { EditorView } from '@codemirror/view';
import * as _codemirror_state from '@codemirror/state';
import { Text, Extension, StateField, EditorState } from '@codemirror/state';
import { GraphQLSchema } from 'graphql';
import { CompletionContext, Completion } from '@codemirror/autocomplete';
import { ContextToken, CompletionItem, AutocompleteSuggestionOptions } from 'graphql-language-service';
import { LRLanguage, LanguageSupport } from '@codemirror/language';

declare const fillAllFieldsCommands: (view: EditorView) => boolean;
declare const showInDocsCommand: (view: EditorView) => boolean;

declare const completion: _codemirror_state.Extension;

declare function posToOffset(doc: Text, pos: IPosition): number;
declare function offsetToPos(doc: Text, offset: number): Position;
interface IPosition {
    line: number;
    character: number;
    setLine(line: number): void;
    setCharacter(character: number): void;
    lessThanOrEqualTo(position: IPosition): boolean;
}
declare class Position implements IPosition {
    line: number;
    character: number;
    constructor(line: number, character: number);
    setLine(line: number): void;
    setCharacter(character: number): void;
    lessThanOrEqualTo(position: IPosition): boolean;
}
declare const isMetaKeyPressed: (e: MouseEvent) => boolean;

interface GqlExtensionsOptions {
    showErrorOnInvalidSchema?: boolean;
    onShowInDocs?: (field?: string, type?: string, parentType?: string) => void;
    onFillAllFields?: (view: EditorView, schema: GraphQLSchema, query: string, cursor: Position, token: ContextToken) => void;
    onCompletionInfoRender?: (gqlCompletionItem: CompletionItem, ctx: CompletionContext, item: Completion) => Node | Promise<Node | null> | null;
    autocompleteOptions?: AutocompleteSuggestionOptions;
}

declare function graphql(schema?: GraphQLSchema, opts?: GqlExtensionsOptions): Extension[];

declare const jump: _codemirror_state.Extension;

declare const graphqlLanguage: LRLanguage;
declare function graphqlLanguageSupport(): LanguageSupport;

declare const lint: Extension;

declare const schemaStateField: StateField<void | GraphQLSchema>;
declare const optionsStateField: StateField<void | GqlExtensionsOptions>;
declare const updateSchema: (view: EditorView, schema?: GraphQLSchema) => void;
declare const updateOpts: (view: EditorView, opts?: GqlExtensionsOptions) => void;
declare const getSchema: (state: EditorState) => void | GraphQLSchema;
declare const getOpts: (state: EditorState) => void | GqlExtensionsOptions;
declare const stateExtensions: (schema?: GraphQLSchema, opts?: GqlExtensionsOptions) => _codemirror_state.Extension[];

export { type IPosition, Position, completion, fillAllFieldsCommands, getOpts, getSchema, graphql, graphqlLanguage, graphqlLanguageSupport, isMetaKeyPressed, jump, lint, offsetToPos, optionsStateField, posToOffset, schemaStateField, showInDocsCommand, stateExtensions, updateOpts, updateSchema };
