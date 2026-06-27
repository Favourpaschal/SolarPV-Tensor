export type ComponentModelType =
  | 'panel'
  | 'inverter'
  | 'battery'
  | 'charge_controller'
  | 'combiner_box'

export type AppMode = 'select' | 'wire' | ComponentModelType