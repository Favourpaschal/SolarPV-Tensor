import { useEffect, useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { useUIStore } from '../../store/uiStore'
import type { ComponentModelType, ComponentSpec } from '../../types'

const TYPES: ComponentModelType[] = ['panel', 'inverter', 'battery', 'charge_controller', 'combiner_box']

export default function ComponentSelector() {
  const [type, setType] = useState<ComponentModelType>('panel')
  const [items, setItems] = useState<ComponentSpec[]>([])
  const { compareIds, toggleCompare } = useUIStore()

  useEffect(() => {
    fetch(`/api/routers/components?type=${type}`)
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]))
  }, [type])

  return (
    <div className="p-4">
      <Tabs.Root value={type} onValueChange={(v) => setType(v as ComponentModelType)}>
        <Tabs.List className="flex gap-2 mb-3">
          {TYPES.map((t) => (
            <Tabs.Trigger
              key={t}
              value={t}
              className="text-sm px-3 py-1 rounded border data-[state=active]:bg-green-700 data-[state=active]:text-white"
            >
              {t.replace('_', ' ')}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      <div className="grid grid-cols-2 gap-3">
        {items.map((c) => (
          <div key={c.id} className="border rounded p-3 text-sm">
            <div className="font-medium">{c.brand} {c.model}</div>
            <div className="text-gray-500">${c.priceUsd}</div>
            <label className="flex items-center gap-2 mt-2 text-xs">
              <input
                type="checkbox"
                checked={compareIds.includes(c.id)}
                onChange={() => toggleCompare(c.id)}
              />
              Compare
            </label>
          </div>
        ))}
      </div>

      {compareIds.length > 1 && (
        <div className="mt-4 border-t pt-3">
          <h4 className="text-sm font-medium mb-2">Compare ({compareIds.length})</h4>
          <table className="w-full text-xs">
            <tbody>
              {items.filter((c) => compareIds.includes(c.id)).map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="py-1">{c.brand} {c.model}</td>
                  <td className="py-1">${c.priceUsd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}