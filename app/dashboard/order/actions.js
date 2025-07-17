'use server'

import { google } from 'googleapis'
import { promises as fs } from 'fs'
import path from 'path'

export async function saveOrder(formData) {
  const credPath = path.join(process.cwd(), 'app/lib/credentials.json')
  console.log("Path : ",credPath);
  const raw = await fs.readFile(credPath, 'utf8')
  const credentials = JSON.parse(raw)

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  const spreadsheetId = '1Wfm6guWx1oCaEABqR8lMCJVlvKZepuXfbXLCSboXQw4'
  const sheetName = 'New Stock'

  const date = new Date().toLocaleDateString()
  const { item, quantity, price } = formData
  const total = Number(quantity) * Number(price)

  const values = [[date, item, quantity, price, total]]

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:E`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  })

  return { success: true }
}
