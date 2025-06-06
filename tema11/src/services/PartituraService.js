'use strict'
import { reactive } from 'vue'
import { Note } from '@/model/Note'
import { Partitura } from '@/model/Partitura'

let cerca = reactive([])

export const PartituraService = {
  async getPartituresNoLogin() {
    const url = 'https://theteacher.codiblau.com/piano/nologin/score/list'
    try {
      const fetchResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })

      if (!fetchResponse.ok) {
        throw new Error(`Error: ${fetchResponse.status} ${fetchResponse.statusText}`)
      }

      const jsonResponse = await fetchResponse.json()
      const data = jsonResponse.map((partitura) => {
        return new Partitura(
          partitura.idpartitura ?? null,
          partitura.titol,
          partitura.idiomaoriginal,
          partitura.idiomatraduccio,
          partitura.lletraoriginal,
          partitura.lletratraduccio,
          partitura.notes.map((nota) => new Note(null, nota.nom, nota.sostingut, null)),
        )
      })

      data.forEach((partitura) => {
        partitura.notes.sort((a, b) => a.ordre - b.ordre)
      })

      return data
    } catch (error) {
      console.error('Error obtenint les partitures del servidor:', error)
      return []
    }
  },

  async getPartitures() {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('El token no está disponible en localStorage.')
      return []
    }

    const url = 'https://theteacher.codiblau.com/piano/score/list'
    try {
      const fetchResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })

      if (!fetchResponse.ok) {
        throw new Error(`Error: ${fetchResponse.status} ${fetchResponse.statusText}`)
      }

      const jsonResponse = await fetchResponse.json()
      const data = jsonResponse.map((partitura) => {
        return new Partitura(
          partitura.idpartitura ?? null,
          partitura.titol,
          partitura.idiomaoriginal,
          partitura.idiomatraduccio,
          partitura.lletraoriginal,
          partitura.lletratraduccio,
          partitura.notes.map((nota) => new Note(null, nota.nom, nota.sostingut, null)),
        )
      })

      data.forEach((partitura) => {
        partitura.notes.sort((a, b) => a.ordre - b.ordre)
      })

      return data
    } catch (error) {
      console.error('Error obtenint les partitures del servidor:', error)
      return []
    }
  },

  async savePartitura(partitura) {
    const url = 'https://theteacher.codiblau.com/piano/score/save'
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify({ score: partitura }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw result
      }

      return result.message
    } catch (error) {
      throw error
    }
  },

  async deletePartitura(id) {
    const url = 'https://theteacher.codiblau.com/piano/score/delete'
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify({ id }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw result
      }
      return result.message
    } catch (error) {
      throw error
    }
  },

  async carregarPartitura(id) {
    try {
      const partitures = await this.getPartitures()
      return partitures.find((p) => p.idpartitura === Number(id))
    } catch (error) {
      console.error('Error carregant la partitura:', error)
      throw error
    }
  },

  addCerca(nom, sostingut) {
    cerca.push(new Note(nom, sostingut))
  },

  reproduirNotes(notes, onPlayNote) {
    let delay = 0

    notes.forEach((nota) => {
      setTimeout(() => {
        if (typeof onPlayNote === 'function') {
          onPlayNote(nota)
        }
      }, delay)
      delay += 1000
    })

    return notes.length * 1000
  },

  cercador(partitures, input) {
    const result = []
    const searchString = input.toUpperCase().replace(/\s+/g, '')

    partitures.forEach((partitura) => {
      const notesString = partitura.notes.map((nota) => nota.nom).join('')
      if (notesString.includes(searchString)) {
        result.push(partitura)
      }
    })

    return result
  },

  resetCerca() {
    cerca.splice(0, cerca.length)
  },

  getCerca() {
    return cerca
  },
}
