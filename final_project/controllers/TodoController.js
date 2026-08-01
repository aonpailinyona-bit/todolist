const { PrismaClient } = require('../generated/prisma/index.js')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const TodoController = {
  create: async (req, res) => {
    try {
      const { name, remark } = req.body
      const token = req.headers['authorization'].replace('Bearer ', '')
      const secret_key = process.env.SECRET_KEY || "defaultSecretKey"
      const payload = jwt.verify(token, secret_key)
      const member_id = payload.id

      await prisma.todo.create({
        data: {
          name: name,
          remark: remark,
          member_id: member_id
        }
      })
      res.json({ message: 'success' })
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  list: async (req, res) => {
    try {
        const token = req.headers['authorization'].replace('Bearer ', '')
        const secret_key = process.env.SECRET_KEY || "defaultSecretKey"
        const payload = jwt.verify(token, secret_key)
        const member_id = payload.id

        const todos = await prisma.todo.findMany({
        where: {
            member_id: member_id
        },
        orderBy: {
            id: 'desc'
        }
        })

        res.json(todos)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const { name, remark } = req.body
      const id = parseInt(req.params.id)
      const token = req.headers['authorization'].replace('Bearer ', '')
      const secret_key = process.env.SECRET_KEY || "defaultSecretKey"
      const payload = jwt.verify(token, secret_key)
      const member_id = payload.id

      await prisma.todo.update({
        data: {
          name: name,
          remark: remark
        },
        where: {
          id: id,
          member_id: member_id
        }
      })

      res.json({ message: 'success' })
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  remove: async (req, res) => {
      try {
        const id = parseInt(req.params.id)
        const token = req.headers['authorization'].replace('Bearer ', '')
        const secret_key = process.env.SECRET_KEY || "defaultSecretKey"
        const payload = jwt.verify(token, secret_key)
        const member_id = payload.id

        await prisma.todo.delete({
          where: {
            id: id,
            member_id: member_id
          }
        })

        res.json({ message: 'success' })
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
  },

  updateStatus: async (req, res) => {
    try {
      const { status } = req.body
      const id = parseInt(req.params.id)
      const token = req.headers['authorization'].replace('Bearer ', '')
      const secret_key = process.env.SECRET_KEY || "defaultSecretKey"
      const payload = jwt.verify(token, secret_key)
      const member_id = payload.id

      const dbStatus = status === 'wait' ? 'use' : status

      await prisma.todo.update({
        data: {
          status: dbStatus
        },
        where: {
          id: id,
          member_id: member_id
        }
      })

      res.json({ message: 'success' })
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  filter: async (req, res) => {
    try {
      const status = req.params.status
      const token = req.headers['authorization'].replace('Bearer ', '')
      const secret_key = process.env.SECRET_KEY || "defaultSecretKey"
      const payload = jwt.verify(token, secret_key)
      const member_id = payload.id

      let condition = {
        member_id: member_id
      }

      if (status !== 'all') {
        if (status === 'wait' || status === 'use') {
          condition.OR = [
            { status: 'wait' },
            { status: 'use' }
          ]
        } else {
          condition.status = status
        }
      }

      const todos = await prisma.todo.findMany({
        where: condition,
        orderBy: {
          id: 'desc'
        }
      })

      res.json(todos)
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  dashboard: async (req, res) => {
    try {
      const token = req.headers['authorization'].replace('Bearer ', '')
      const secret_key = process.env.SECRET_KEY || "defaultSecretKey"
      const payload = jwt.verify(token, secret_key)
      const member_id = payload.id

      const countWait = await prisma.todo.aggregate({
        _count: {
          id: true
        },
        where: {
          status: { in: ['use', 'wait'] },
          member_id: member_id
        }
      })

      const countDoing = await prisma.todo.aggregate({
        _count: {
          id: true
        },
        where: {
          status: 'doing',
          member_id: member_id
        }
      })

      const countSuccess = await prisma.todo.aggregate({
        _count: {
          id: true
        },
        where: {
          status: 'success',
          member_id: member_id
        }
      })

      res.json({
        countWait: countWait._count.id,
        countDoing: countDoing._count.id,
        countSuccess: countSuccess._count.id
      })
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = TodoController