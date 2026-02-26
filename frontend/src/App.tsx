import { useMemo, useState } from 'react'
import './App.css'

type PaymentResponse = {
  paymentId: string
  orderId: string
  status: 'SUCCEEDED' | 'FAILED'
  amount: number
  currency: string
  pspRef: string | null
}

function App() {
  const [orderId, setOrderId] = useState('ord_1001')
  const [amount, setAmount] = useState(125000)
  const [currency, setCurrency] = useState('VND')
  const [idempotencyKey, setIdempotencyKey] = useState(crypto.randomUUID())
  const [result, setResult] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)

  const payload = useMemo(
    () => ({
      orderId,
      amount,
      currency,
    }),
    [amount, currency, orderId],
  )

  const sendPayment = async (key: string) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3000/api/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': key,
        },
        body: JSON.stringify(payload),
      })

      const body = (await response.json()) as PaymentResponse | { error: { code: string; message: string } }
      setResult({ statusCode: response.status, body, usedKey: key })
    } catch (error) {
      setResult({ statusCode: 'NETWORK_ERROR', body: String(error), usedKey: key })
    } finally {
      setLoading(false)
    }
  }

  const listPayments = async () => {
    const response = await fetch('http://localhost:3000/api/v1/payments')
    const body = (await response.json()) as unknown
    setResult({ statusCode: response.status, body })
  }

  const sendParallel = async () => {
    setLoading(true)
    const key = idempotencyKey
    const requests = Array.from({ length: 5 }, () =>
      fetch('http://localhost:3000/api/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': key,
        },
        body: JSON.stringify(payload),
      }).then(async (res) => ({ statusCode: res.status, body: (await res.json()) as unknown })),
    )

    const all = await Promise.all(requests)
    setResult({ usedKey: key, parallelResponses: all })
    setLoading(false)
  }

  return (
    <main className="container">
      <h1>Payment</h1>
      <div className="form-grid">
        <label>Order ID<input value={orderId} onChange={(e) => setOrderId(e.target.value)} /></label>
        <label>Amount<input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></label>
        <label>Currency<input value={currency} onChange={(e) => setCurrency(e.target.value)} /></label>
      </div>

      <div className="key-row">
        <span>Idempotency-Key: {idempotencyKey}</span>
        <button onClick={() => setIdempotencyKey(crypto.randomUUID())}>Generate New Key</button>
      </div>

      <div className="actions">
        <button disabled={loading} onClick={() => sendPayment(idempotencyKey)}>Pay</button>
        <button disabled={loading} onClick={() => sendPayment(idempotencyKey)}>Retry Same Key</button>
        <button
          disabled={loading}
          onClick={() => {
            const next = crypto.randomUUID()
            setIdempotencyKey(next)
            void sendPayment(next)
          }}
        >
          Retry New Key
        </button>
        <button disabled={loading} onClick={sendParallel}>Send 5 Parallel Same-Key Requests</button>
        <button disabled={loading} onClick={listPayments}>List Payments</button>
      </div>

      <pre className="result">{JSON.stringify(result, null, 2)}</pre>
    </main>
  )
}

export default App
