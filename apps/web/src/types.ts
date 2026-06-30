export type ComponentModelType =
  | 'panel'
  | 'inverter'
  | 'battery'
  | 'charge_controller'
  | 'combiner_box'

export type AppMode = 'select' | 'wire' | ComponentModelType

export interface Appliance {
  id: string
  name: string
  watts: number
  hoursPerDay: number
  quantity: number
}

export interface ComponentSpec {
  id: string
  type: ComponentModelType
  brand: string
  model: string
  priceUsd: number
  specs: Record<string, number | string>
}

export type UIMode = 'hobbyist' | 'professional'