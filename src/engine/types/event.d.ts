type GameEvent = 'start' | 'update' | 'pause' | 'resume' | 'stop' | 'destroy'

type RenderEvent = 'render'

type ColliderEvent = 'collisionEnter' | 'collisionExit' | 'collisionStay'

type RuntimeEvent = 'error' | 'operational' | 'warning'

type EngineEvent = GameEvent | ColliderEvent | RuntimeEvent | RenderEvent

type EventLayer = RenderingLayer
