import { useUIStore } from '../store/uiStore'
import LoadInputForm from '../components/forms/LoadInputForm'
import ComponentSelector from '../components/library/ComponentSelector'
import SystemCanvas from '../scene/SystemCanvas'

const STEPS = ['Loads', 'Components', 'Preview']

export default function HobbyistWizard() {
  const { wizardStep, nextStep, prevStep } = useUIStore()

  return (
    <div className="h-full flex flex-col">
        <div className="flex flex-wrap gap-2 p-3 border-b text-sm">
        {STEPS.map((s, i) => (
          <div key={s} className={`px-3 py-1 rounded-full ${i === wizardStep ? 'bg-green-700 text-white' : 'bg-gray-100'}`}>
            {i + 1}. {s}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {wizardStep === 0 && <LoadInputForm />}
        {wizardStep === 1 && <ComponentSelector />}
        {wizardStep === 2 && <SystemCanvas mode="select" />}
      </div>

      <div className="flex justify-between p-3 border-t">
        <button onClick={prevStep} disabled={wizardStep === 0} className="text-sm border rounded px-3 py-1">
          Back
        </button>
        <button onClick={nextStep} disabled={wizardStep === STEPS.length - 1} className="text-sm border rounded px-3 py-1 bg-green-700 text-white">
          Next
        </button>
      </div>
    </div>
  )
}