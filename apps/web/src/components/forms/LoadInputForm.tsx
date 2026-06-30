import { useForm, useFieldArray } from 'react-hook-form'
import { useLoadStore } from '../../store/loadStore'
import type { Appliance } from '../../types'

interface FormValues {
  appliances: Appliance[]
}

export default function LoadInputForm() {
  const { appliances, addAppliance, removeAppliance, updateAppliance } = useLoadStore()

  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      appliances: appliances.length
        ? appliances
        : [{ id: crypto.randomUUID(), name: '', watts: 0, hoursPerDay: 0, quantity: 1 }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'appliances' })

  const onSubmit = (data: FormValues) => {
    data.appliances.forEach((a) => {
      const exists = appliances.find((x) => x.id === a.id)
      if (exists) updateAppliance(a.id, a)
      else addAppliance(a)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-4">
      {fields.map((field, i) => (
        <div key={field.id} className="grid grid-cols-5 gap-2 items-center">
          <input
            {...register(`appliances.${i}.name` as const)}
            placeholder="Appliance name"
            className="col-span-2 border rounded px-2 py-1 text-sm"
          />
          <input
            type="number"
            {...register(`appliances.${i}.watts` as const, { valueAsNumber: true })}
            placeholder="Watts"
            className="border rounded px-2 py-1 text-sm"
          />
          <input
            type="number"
            step="0.1"
            {...register(`appliances.${i}.hoursPerDay` as const, { valueAsNumber: true })}
            placeholder="Hrs/day"
            className="border rounded px-2 py-1 text-sm"
          />
          <div className="flex gap-1">
            <input
              type="number"
              {...register(`appliances.${i}.quantity` as const, { valueAsNumber: true })}
              placeholder="Qty"
              className="border rounded px-2 py-1 text-sm w-16"
            />
            <button
              type="button"
              onClick={() => { remove(i); removeAppliance(field.id) }}
              className="text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ id: crypto.randomUUID(), name: '', watts: 0, hoursPerDay: 0, quantity: 1 })}
        className="text-sm border rounded px-3 py-1"
      >
        Add appliance
      </button>
      <button type="submit" className="block bg-green-700 text-white rounded px-4 py-2 text-sm">
        Save loads
      </button>
    </form>
  )
}