import type {
    DraftMediation,
    ActiveMediation,
    DeactivatedMediation,
    FilterStep,
    TransformStep,
    EnrichStep,
} from './types'

// ── MediationId ────────────────────────────────────────────────────────────

export const mediationId = {
    valid: {
        uuid: '550e8400-e29b-41d4-a716-446655440000',
        anotherUuid: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    },
    invalid: {
        number: 42,
        null: null,
        undefined: undefined,
        object: { id: 'abc' },
        empty: '',
        tooLong: 'a'.repeat(65),
        notUuid: 'not-a-uuid',
        partialUuid: '550e8400-e29b-41d4',
    },
    injection: {
        scriptTag: '<script>alert("xss")</script>',
        javascriptProtocol: 'javascript:alert(1)',
        eventHandler: 'onclick=alert(1)',
    },
}

// ── Topic ──────────────────────────────────────────────────────────────────

export const topic = {
    valid: {
        dotSeparated: 'patient.created',
        withHyphens: 'org.facility-registry.update',
    },
    invalid: {
        number: 123,
        null: null,
        undefined: undefined,
        object: { topic: 'test' },
        empty: '',
        tooShort: 'a',
        tooLong: 'a'.repeat(257),
    },
    invalidFormat: {
        trailingDot: 'patient.',
        leadingDot: '.patient',
        consecutiveDots: 'patient..created',
    },
    invalidChars: {
        spaces: 'patient created',
        underscores: 'patient_created',
        specialChars: 'patient@created',
    },
    injection: {
        scriptTag: '<script>alert("xss")</script>',
        javascriptProtocol: 'javascript:alert(1)',
    },
}

// ── Destination ────────────────────────────────────────────────────────────

export const destination = {
    valid: {
        https: 'https://example.com/api/webhook',
        httpLocalhost: 'http://localhost:3000/callback',
    },
    invalid: {
        number: 42,
        null: null,
        undefined: undefined,
        object: { url: 'https://example.com' },
        empty: '',
        tooLong: 'https://example.com/' + 'a'.repeat(2030),
    },
    invalidUrl: {
        plainText: 'not-a-url',
        missingProtocol: 'example.com/api',
        ftpProtocol: 'ftp://example.com/file',
    },
    injection: {
        scriptTag: '<script>alert("xss")</script>',
        javascriptProtocol: 'javascript:alert(1)',
    },
}

// ── Pipeline ───────────────────────────────────────────────────────────────

const filterStep: FilterStep = {
    type: 'filter',
    rules: {
        logic: 'and',
        conditions: [{ field: 'data.type', operator: 'equals', value: 'patient' }],
    },
}

const transformStep: TransformStep = {
    type: 'transform',
    rules: ['uppercase'],
}

const enrichStep: EnrichStep = {
    type: 'enrich',
    rules: { source: 'external-api' },
}

export const pipeline = {
    valid: {
        singleFilter: [filterStep],
        singleTransform: [transformStep],
        mixed: [filterStep, transformStep, enrichStep],
    },
    invalid: {
        string: 'not-an-array',
        number: 42,
        null: null,
        object: { steps: [] },
        empty: [] as unknown[],
        invalidStep: [{ rules: {} }],
        invalidStepType: [{ type: 'unknown', rules: {} }],
        nonObjectStep: ['not-a-step'],
    },
}

// ── Timestamps ─────────────────────────────────────────────────────────────

export const timestamps = {
    valid: {
        createdAt: new Date('2025-06-15T10:30:00Z'),
        activatedAt: new Date('2025-06-15T10:35:00Z'),
        deactivatedAt: new Date('2025-06-15T10:40:00Z'),
    },
    invalid: {
        string: '2025-01-01',
        number: 1704067200000,
        null: null,
        undefined: undefined,
        invalidDate: new Date('invalid'),
    },
}

// ── Valid aggregate fixtures ───────────────────────────────────────────────

const id = mediationId.valid.uuid
const { createdAt, activatedAt, deactivatedAt } = timestamps.valid

export const valid = {
    draft: {
        status: 'draft',
        id,
        topic: topic.valid.dotSeparated,
        destination: destination.valid.https,
        pipeline: pipeline.valid.singleFilter,
        createdAt,
    } satisfies DraftMediation,

    active: {
        status: 'active',
        id,
        topic: topic.valid.dotSeparated,
        destination: destination.valid.https,
        pipeline: pipeline.valid.mixed,
        createdAt,
        activatedAt,
    } satisfies ActiveMediation,

    deactivated: {
        status: 'deactivated',
        id,
        topic: topic.valid.dotSeparated,
        destination: destination.valid.https,
        pipeline: pipeline.valid.mixed,
        createdAt,
        activatedAt,
        deactivatedAt,
    } satisfies DeactivatedMediation,
}

// ── Invalid aggregate fixtures ─────────────────────────────────────────────

export const invalid = {
    null: null,
    string: 'not-an-object',
    emptyObject: {},
    missingStatus: { id, topic: topic.valid.dotSeparated, destination: destination.valid.https, pipeline: pipeline.valid.singleFilter, createdAt },
    unknownStatus: { status: 'unknown', id, topic: topic.valid.dotSeparated, destination: destination.valid.https, pipeline: pipeline.valid.singleFilter, createdAt },
    invalidId: { status: 'draft', id: 42, topic: topic.valid.dotSeparated, destination: destination.valid.https, pipeline: pipeline.valid.singleFilter, createdAt },
    emptyTopic: { status: 'draft', id, topic: '', destination: destination.valid.https, pipeline: pipeline.valid.singleFilter, createdAt },
    emptyPipeline: { status: 'draft', id, topic: topic.valid.dotSeparated, destination: destination.valid.https, pipeline: [], createdAt },
}
