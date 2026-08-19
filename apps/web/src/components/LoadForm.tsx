import { useFieldArray, useForm } from 'react-hook-form'

type Appliance = {
  name: string
  watts: number
  hours_per_day: number
  quantity: number
}

type FormValues = {
  appliances: Appliance[]
}

type Props = {
  onSubmit: (data: Appliance[]) => void
}

export default function LoadForm({ onSubmit }: Props) {
  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      appliances: [{ name: '', watts: '' as any, hours_per_day: '' as any, quantity: '' as any }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'appliances',
  })

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d.appliances))}>
      {fields.map((field, i) => (
        <div key={field.id} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <div style={{ flex: 2 }}>
            <label htmlFor={`appliance-name-${i}`} style={{ display: 'none' }}>
              Appliance name
            </label>
            <input
              id={`appliance-name-${i}`}
              placeholder="e.g. Fridge"
              {...register(`appliances.${i}.name`)}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor={`appliance-watts-${i}`} style={{ display: 'none' }}>
              Watts
            </label>
            <input
              id={`appliance-watts-${i}`}
              type="number"
              placeholder="Watts e.g. 150"
              {...register(`appliances.${i}.watts`, { valueAsNumber: true })}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor={`appliance-hours-${i}`} style={{ display: 'none' }}>
              Hours per day
            </label>
            <input
              id={`appliance-hours-${i}`}
              type="number"
              placeholder="Hrs/day e.g. 8"
              {...register(`appliances.${i}.hours_per_day`, { valueAsNumber: true })}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor={`appliance-qty-${i}`} style={{ display: 'none' }}>
              Quantity
            </label>
            <input
              id={`appliance-qty-${i}`}
              type="number"
              placeholder="Qty e.g. 2"
              {...register(`appliances.${i}.quantity`, { valueAsNumber: true })}
              style={{ width: '100%' }}
            />
          </div>
          <button type="button" onClick={() => remove(i)}>
            Remove
          </button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button
          type="button"
          onClick={() => append({ name: '', watts: '' as any, hours_per_day: '' as any, quantity: '' as any })}
        >
          Add appliance
        </button>
        <button type="submit">
          Calculate load
        </button>
      </div>
    </form>
  )
}