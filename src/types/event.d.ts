type RuntimeEvent = 'update' | 'start' | 'stop' | 'destroy' | 'error'

type ColliderEvent = 'collisionEnter' | 'collisionExit' | 'collisionStay'

type GameEvent = RuntimeEvent | ColliderEvent
