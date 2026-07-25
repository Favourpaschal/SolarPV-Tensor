type BOMItem = {
  item: string
  qty: number
  unit: string
  unit_price_usd: number
  total_usd: number
}

type Props = { items: BOMItem[]; total: number }

export default function BOMTable({ items, total }: Props) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            {['Item', 'Qty', 'Unit', 'Unit Price (USD)', 'Total (USD)'].map((h) => (
              <th key={h} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px 12px' }}>{row.item}</td>
              <td style={{ padding: '8px 12px' }}>{row.qty}</td>
              <td style={{ padding: '8px 12px' }}>{row.unit}</td>
              <td style={{ padding: '8px 12px' }}>${row.unit_price_usd}</td>
              <td style={{ padding: '8px 12px' }}>${row.total_usd}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: '#f9f9f9', fontWeight: 600 }}>
            <td colSpan={4} style={{ padding: '10px 12px', textAlign: 'right' }}>
              Total estimate
            </td>
            <td style={{ padding: '10px 12px' }}>${total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}