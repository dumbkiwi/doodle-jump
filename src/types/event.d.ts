type GameEvent = 'start' | 'update' | 'pause' | 'resume' | 'stop' | 'destroy'

type ColliderEvent = 'collisionEnter' | 'collisionExit' | 'collisionStay'

type RuntimeEvent = 'error'

type EngineEvent = GameEvent | ColliderEvent | RuntimeEvent
