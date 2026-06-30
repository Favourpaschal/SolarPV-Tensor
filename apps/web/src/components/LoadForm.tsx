import { useFieldArray, useForm } from 'react-hook-form'

type Appliance = { name: string; watts: number; hours_per_day: number; quantity: number }
type FormValues = { appliances: Appliance[] }

type Props = { onSubmit: (data: Appliance[]) => void }

export default function LoadForm({ onSubmit }: Props) {
  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: { appliances: [{ name: '', watts: 0, hours_per_day: 0, quantity: 1 }] },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'appliances' })

  return (
    <form onSubmit={handleSubmit((d) => onSubmit(d.appliances))}>
      {fields.map((field, i) => (
        <div key={field.id} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input placeholder="Appliance name" {...register(`appliances.${i}.name`)} style={{ flex: 2 }} />
          <input type="number" placeholder="Watts" {...register(`appliances.${i}.watts`, { valueAsNumber: true })} style={{ flex: 1 }} />
          <input type="number" placeholder="Hours/day" {...register(`appliances.${i}.hours_per_day`, { valueAsNumber: true })} style={{ flex: 1 }} />
          <input type="number" placeholder="Qty" {...register(`appliances.${i}.quantity`, { valueAsNumber: true })} style={{ flex: 1 }} />
          <button type="button" onClick={() => remove(i)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ name: '', watts: 0, hours_per_day: 0, quantity: 1 })}>
        Add appliance
      </button>
      <button type="submit" style={{ marginLeft: 12 }}>Calculate load</button>
    </form>
  )
}