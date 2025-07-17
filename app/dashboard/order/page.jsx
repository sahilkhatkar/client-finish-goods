'use client'

import { useState } from 'react'
import { saveOrder } from './actions'
import toast, { Toaster } from 'react-hot-toast'
import './page.module.css'

export default function Home() {
  const [form, setForm] = useState({ item: '', quantity: '', price: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await saveOrder(form)
    if (res.success) {
      toast.success('Order saved successfully!')
      setForm({ item: '', quantity: '', price: '' })
    }
  }

  return (
    <main>
      <Toaster />
      <h1>Purchase Order</h1>
      <form onSubmit={handleSubmit}>
        <table>
          <tbody>
            <tr>
              <td><label>Item:</label></td>
              <td><input name="item" value={form.item} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td><label>Quantity:</label></td>
              <td><input name="quantity" type="number" value={form.quantity} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td><label>Price:</label></td>
              <td><input name="price" type="number" value={form.price} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td colSpan="2"><button type="submit">Save Order</button></td>
            </tr>
          </tbody>
        </table>
      </form>
    </main>
  )
}
