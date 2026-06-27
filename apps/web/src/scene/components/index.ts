import type { ComponentType } from 'react'
import SolarPanel from './SolarPanel'
import Inverter from './Inverter'
import Battery from './Battery'
import ChargeController from './ChargeController'
import CombinerBox from './CombinerBox'
import type { ComponentModelType } from '../../types'

type ModelProps = { selected: boolean }

export const ComponentRegistry: Record<ComponentModelType, ComponentType<ModelProps>> = {
  panel: SolarPanel,
  inverter: Inverter,
  battery: Battery,
  charge_controller: ChargeController,
  combiner_box: CombinerBox,
}