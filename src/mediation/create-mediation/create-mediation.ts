// create-mediation.ts
import type { DraftMediation, MediationId, Topic, Destination, Pipeline, CreatedAt } from '../types'


type ShellSteps = {
  parseTopic: (input: unknown) => Result<Topic>
  parseDestination: (input: unknown) => Result<Destination>
  parsePipeline: (input: unknown) => Result<Pipeline>
  assembleDraftMediation: (input: {
    cmd: { topic: Topic; destination: Destination; pipeline: Pipeline }
    ctx: { id: MediationId; createdAt: CreatedAt }
  }) => Result<DraftMediation>
}

export const shellSteps: ShellSteps = {
  parseTopic,
  parseDestination,
  parsePipeline,
  assembleDraftMediation,
}

export const createMediationShellFactory =
  (steps: ShellSteps) =>
  (deps: Deps) =>
  async (input: ShellInput): Promise<Result<ShellOutput, ShellFailure, ShellSuccess>> => {
    // 1. parse topic from command
    const topic = steps.parseTopic(input.cmd.topic)
    if (!topic.ok) return topic as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 2. parse destination from command
    const destination = steps.parseDestination(input.cmd.destination)
    if (!destination.ok) return destination as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 3. parse pipeline from command
    const pipeline = steps.parsePipeline(input.cmd.pipeline)
    if (!pipeline.ok) return pipeline as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 4. generate mediation ID (dep)
    const id = await deps.generateId()
    if (!id.ok) return id as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 5. generate timestamp (dep)
    const timestamp = await deps.generateTimestamp()
    if (!timestamp.ok) return timestamp as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 6. assemble draft mediation
    const draft = steps.assembleDraftMediation({
      cmd: { topic: topic.value, destination: destination.value, pipeline: pipeline.value },
      ctx: { id: id.value, createdAt: timestamp.value },
    })
    if (!draft.ok) return draft as Result<ShellOutput, ShellFailure, ShellSuccess>

    // 7. save mediation (dep)
    const saved = await deps.saveMediation(draft.value)
    if (!saved.ok) return saved as Result<ShellOutput, ShellFailure, ShellSuccess>

    return { ok: true, value: saved.value, successType: ['mediation-created'] }
  }
